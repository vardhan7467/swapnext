import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { productAPI, API_BASE_URL } from '../services/api';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      // fallback mock data for visually verifying design 
      setProducts([
        { id: 1, title: 'Sony A7III Camera', price: 1500, condition: 'Excellent', category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' },
        { id: 2, title: 'Mountain Bike Trek', price: 450, condition: 'Good', category: 'Sports', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80' },
        { id: 3, title: 'Minimalist Desk Lamp', price: 35, condition: 'New', category: 'Furniture', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (e) => {
    const category = e.target.value;
    if (!category) return fetchProducts();
    try {
      setLoading(true);
      const data = await productAPI.searchByCategory(category);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return fetchProducts();
    try {
      setLoading(true);
      const data = await productAPI.searchByTitle(searchTerm);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page container animate-fade-in">
      <div className="marketplace-header">
        <div>
          <h1>Marketplace</h1>
          <p className="text-muted">Discover items from your community or list your own.</p>
        </div>
        <Link to="/add-product" className="btn btn-primary">
          <Plus size={18} /> List Item
        </Link>
      </div>

      <div className="marketplace-controls glass-panel">
        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search items by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} className="text-muted" />
          <select 
            className="form-input" 
            style={{ minWidth: '150px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem' }}
            onChange={handleCategoryFilter}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading items...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card glass-panel" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-image">
                <img src={product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`} alt={product.title} />
                <span className="product-category">{product.category}</span>
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <div className="product-price-row">
                  <span className="price">Rs. {product.price}</span>
                  <span className="condition">{product.condition}</span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="no-products">No products found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
