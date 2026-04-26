import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function seed() {
  const products = [
    { title: 'Nike Sport Shoes', category: 'Sports', price: 12000, condition: 'New', location: 'Jalandhar', img: '../shoes.jpg', description: 'Comfortable and durable running shoes.' },
    { title: 'MacBook Pro M1', category: 'Electronics', price: 85000, condition: 'Used', location: 'Hyderabad', img: '../laptop.jpg', description: 'Fast and reliable laptop for work.' },
    { title: 'Study Lamp', category: 'Furniture', price: 450, condition: 'Like New', location: 'Mumbai', img: '../lamp.jpg', description: 'Bright study lamp for your desk.' }
  ];

  for (const p of products) {
    try {
      if (!fs.existsSync(p.img)) {
        console.error(`Missing ${p.img}`);
        continue;
      }
      
      const form = new FormData();
      form.append('title', p.title);
      form.append('category', p.category);
      form.append('price', String(p.price));
      form.append('condition', p.condition);
      form.append('location', p.location);
      form.append('description', p.description);
      form.append('image', fs.createReadStream(p.img));

      await axios.post('http://localhost:8080/api/products/upload/user/1', form, {
        headers: form.getHeaders()
      });
      console.log(`Seeded ${p.title}`);
    } catch (err) {
      if (err.response) {
         console.error(`Failed to seed ${p.title}: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else {
         console.error(`Failed to seed ${p.title}:`, err.message);
      }
    }
  }
}

seed();
