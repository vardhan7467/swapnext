import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, ShieldCheck, Zap } from 'lucide-react';
import { productAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productAPI.getAllProducts();
        if (Array.isArray(data)) {
          // Take the last two products added
          setFeatured(data.slice(-2).reverse());
        }
      } catch (err) {
        console.error("Failed to load featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-container animate-fade-in">
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              The Smarter Way to <br />
              <span className="text-gradient">Buy, Sell & Swap</span>
            </h1>
            <p className="hero-subtitle">
              Join SwapNest to connect with your community. Turn your unused items into cash or swap them for things you need. Sustainable, secure, and simple.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Marketplace <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join Now for Free
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            {featured.length > 0 ? (
              featured.map((item, index) => (
                <Link 
                  key={item.id} 
                  to={`/product/${item.id}`} 
                  className={`glass-panel floating-card ${index === 1 ? 'card-delay' : ''}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="demo-item">
                    <img 
                      src={item.image?.startsWith('http') ? item.image : `http://localhost:8080${item.image}`} 
                      alt={item.title} 
                      className="demo-img" 
                    />
                    <div className="demo-info">
                      <h3>{item.title}</h3>
                      <p className="demo-price">Rs. {item.price} <span className="demo-condition">{item.condition}</span></p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback if no products in DB
              <div className="glass-panel floating-card">
                <div className="demo-item">
                  <div className="demo-info"><h3>Explore Marketplace to see items</h3></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="features-section container">
        <div className="section-header">
          <h2>Why Choose SwapNest?</h2>
          <p>We've built an intuitive, secure, and efficient platform for all your trading needs.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Recycle size={32} /></div>
            <h3>Sustainable Community</h3>
            <p>Reduce waste and promote sustainability. Exchange goods locally and efficiently within your neighborhood.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><ShieldCheck size={32} /></div>
            <h3>Secure Transactions</h3>
            <p>Your safety is our priority. We offer secure authentication, communication, and robust data protection.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Zap size={32} /></div>
            <h3>Modern & Fast</h3>
            <p>Built with cutting-edge tech (React, Spring Boot) for lightning-fast performance and seamless user experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
