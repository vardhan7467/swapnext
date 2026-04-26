import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartAPI, API_BASE_URL } from '../services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const data = await cartAPI.getCart(user.id);
      setCartItems(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateQuantity(user.id, productId, newQuantity);
      setCartItems(cartItems.map(item => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.removeFromCart(user.id, productId);
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      await cartAPI.clearCart(user.id);
      alert('Order placed successfully! (Simulated)');
      setCartItems([]);
      navigate('/');
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please try again.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading cart...</div>;

  return (
    <div className="cart-page container animate-fade-in">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <Link to="/products" className="back-link">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart glass-panel">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Browse our marketplace to find amazing deals!</p>
          <Link to="/products" className="btn btn-primary">Go to Marketplace</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item glass-panel">
                <div className="item-image">
                  <img 
                    src={item.product.imageUrl?.startsWith('http') ? item.product.imageUrl : `${API_BASE_URL}${item.product.imageUrl}`} 
                    alt={item.product.title} 
                  />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.product.title}</h3>
                    <p className="item-category">{item.product.category}</p>
                    <p className="item-price">Rs. {item.product.price}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="qty-btn">
                        <Minus size={16} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="qty-btn">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="remove-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>
            <button className="btn btn-primary btn-full checkout-btn" onClick={handleCheckout}>
              <CreditCard size={18} style={{ marginRight: '8px' }} />
              Checkout Now
            </button>
            <p className="secure-text">Secure Checkout Powered by SwapNest</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
