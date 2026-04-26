import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, PackageSearch, Trash2 } from 'lucide-react';
import { productAPI, API_BASE_URL } from '../services/api';
import './Auth.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest', id: 0 };
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.id) {
      fetchMyProducts();
    }
  }, [user.id]);

  const fetchMyProducts = async () => {
    try {
      const data = await productAPI.getProductsByUser(user.id);
      setUserProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Refresh to update navbar
  };

  return (
    <div className="auth-page animate-fade-in" style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        
        {/* Profile Sidebar */}
        <div className="auth-container glass-panel" style={{ height: 'fit-content', padding: '2rem' }}>
          <div className="auth-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={40} />
              </div>
            </div>
            <h2>{user.username}</h2>
            <p className="text-muted">Personal Account</p>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/add-product')} style={{ justifyContent: 'flex-start' }}>
              <PackageSearch size={18} /> List New Item
            </button>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ justifyContent: 'flex-start', color: '#ef4444' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* User Products Area */}
        <div className="my-products-section">
          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem' }}>
            <h2 style={{ fontSize: '1.75rem' }}>My Listed Items</h2>
            <p className="text-muted">You have listed {userProducts.length} items for swap/sale.</p>
          </div>

          {loading ? (
            <p>Loading your items...</p>
          ) : (
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {userProducts.map(p => (
                <div key={p.id} className="product-card glass-panel">
                  <div className="product-image" style={{ height: '140px' }}>
                    <img src={p.image?.startsWith('http') ? p.image : `${API_BASE_URL}${p.image}`} alt={p.title} />
                  </div>
                  <div className="product-details" style={{ padding: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{p.title}</h4>
                    <p style={{ color: 'var(--accent)', fontWeight: 700 }}>Rs. {p.price}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <Link to={`/product/${p.id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>View</Link>
                    </div>
                  </div>
                </div>
              ))}
              {userProducts.length === 0 && (
                <div className="glass-panel" style={{ padding: '3rem', gridColumn: 'span 3', textAlign: 'center' }}>
                  <p className="text-muted">You haven't listed any items yet.</p>
                  <Link to="/add-product" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Selling</Link>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
