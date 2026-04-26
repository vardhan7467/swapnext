import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, messageAPI, cartAPI, API_BASE_URL } from '../services/api';
import { ArrowLeft, MapPin, Tag, Box, Mail, Phone, MessageSquare, ShoppingCart, Zap } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddToCart = async (showToast = true) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await cartAPI.addToCart(user.id, product.id, 1);
      if (showToast) alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await handleAddToCart(false);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container animate-fade-in" style={{ padding: '4rem' }}>Loading details...</div>;
  if (error || !product) return <div className="container animate-fade-in" style={{ padding: '4rem' }}>{error || "Product not found"}</div>;

  return (
    <div className="product-details-page container animate-fade-in">
      <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back to Marketplace
      </button>

      <div className="details-grid">
        <div className="details-image glass-panel">
          <img src={product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`} alt={product.title} />
        </div>

        <div className="details-info">
          <div className="details-header">
            <span className="product-category-tag">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="price-tag">Rs. {product.price}</div>
          </div>

          <div className="info-section">
            <h3>Description</h3>
            <p className="description-text">{product.description || "No description provided."}</p>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <Box size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Condition</span>
                <span className="spec-value">{product.condition}</span>
              </div>
            </div>
            <div className="spec-item">
              <MapPin size={20} className="spec-icon" />
              <div>
                <span className="spec-label">Location</span>
                <span className="spec-value">{product.location}</span>
              </div>
            </div>
          </div>

          <div className="contact-card glass-panel">
            <h3>Contact Seller</h3>
            <div className="contact-info">
              {product.email && (
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{product.email}</span>
                </div>
              )}
              {product.number && (
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{product.number}</span>
                </div>
              )}
              {product.message && (
                <div className="contact-item">
                  <MessageSquare size={18} />
                  <span>{product.message}</span>
                </div>
              )}
            </div>
            <button 
              className="btn btn-primary btn-full" 
              style={{ marginTop: '1.5rem' }}
              onClick={() => navigate(`/chat/${product.owner?.id}/${product.id}`)}
              disabled={!product.owner?.id || product.owner?.id === user?.id}
            >
              <MessageSquare size={18} style={{ marginRight: '8px' }} />
              Chat with Seller
            </button>

            <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary btn-full"
                onClick={handleAddToCart}
                disabled={addingToCart || product.owner?.id === user?.id}
              >
                <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                Add to Cart
              </button>
              <button 
                className="btn btn-accent btn-full"
                onClick={handleBuyNow}
                disabled={addingToCart || product.owner?.id === user?.id}
                style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
              >
                <Zap size={18} style={{ marginRight: '8px' }} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
