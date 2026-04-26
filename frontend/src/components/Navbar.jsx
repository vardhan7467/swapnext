import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, PackageSearch, MessageSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  // Using a mock auth state for now
  const isAuthenticated = localStorage.getItem('user') !== null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🔁</span>
          <span className="logo-text">SwapNest</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/products" className="nav-item">
            <PackageSearch size={18} />
            <span>Marketplace</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/chat" className="nav-item">
                <MessageSquare size={18} />
                <span>Messages</span>
              </Link>
              <Link to="/profile" className="nav-item">
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="nav-item btn-logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
