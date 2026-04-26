import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Upload } from 'lucide-react';
import './Auth.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'New',
    location: '',
    message: '',
    email: '',
    number: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error("Please login to upload a product.");
      
      const userId = user.id || 1;

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await productAPI.uploadProduct(userId, data);
      navigate('/products');
    } catch (err) {
      console.error(err);
      const message = err.response?.data || err.message || "Failed to upload product.";
      setError(typeof message === 'string' ? message : "Failed to upload product. Check file size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in" style={{ padding: '2rem 1rem', alignItems: 'flex-start' }}>
      <div className="auth-container glass-panel" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="auth-header">
          <h2>List an Item</h2>
          <p>Fill out the details below to add your product to the marketplace.</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Title</label>
            <input type="text" name="title" className="form-input" required onChange={handleChange} value={formData.title} />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" style={{ minHeight: '100px' }} required onChange={handleChange} value={formData.description}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Price (Rs.)</label>
            <input type="number" name="price" className="form-input" required onChange={handleChange} value={formData.price} />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-input" required onChange={handleChange} value={formData.category}>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>
            <select name="condition" className="form-input" required onChange={handleChange} value={formData.condition}>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-input" required onChange={handleChange} value={formData.location} />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input type="email" name="email" className="form-input" required onChange={handleChange} value={formData.email} />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input type="text" name="number" className="form-input" onChange={handleChange} value={formData.number} />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Image</label>
            <label className="form-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', justifyContent: 'center', border: '1px dashed var(--border-color)', background: 'transparent' }}>
              <Upload size={18} /> {formData.image ? formData.image.name : 'Upload Image'}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} required />
            </label>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Uploading...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
