import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messageAPI, productAPI } from '../services/api';
import { Send, User as UserIcon, Package, Search, MessageSquare } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const { receiverId: initialReceiverId, productId: initialProductId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  
  const [contacts, setContacts] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef();

  useEffect(() => {
    if (!currentUser.id) {
      navigate('/login');
      return;
    }
    fetchContacts();
    
    if (initialReceiverId) {
      // If we came from a product page
      loadChat(initialReceiverId, initialProductId);
    }
  }, [initialReceiverId, initialProductId]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const data = await messageAPI.getContacts(currentUser.id);
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const loadChat = async (receiverId, productId) => {
    try {
      const history = await messageAPI.getHistory(currentUser.id, receiverId);
      setMessages(Array.isArray(history) ? history : []);
      
      // Fetch receiver info if not in contacts or just to be sure
      // (Normally you'd have a userAPI for this)
      const contactMatches = contacts.find(c => c.id == receiverId);
      if (contactMatches) setSelectedReceiver(contactMatches);
      else setSelectedReceiver({ id: receiverId, username: 'Seller' });

      if (productId) {
        const prod = await productAPI.getProductById(productId);
        setActiveProduct(prod);
      } else {
        setActiveProduct(null);
      }
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedReceiver) return;

    try {
      const sent = await messageAPI.sendMessage(
        currentUser.id, 
        selectedReceiver.id, 
        activeProduct?.id || null, 
        newMessage
      );
      setMessages([...messages, sent]);
      setNewMessage('');
      fetchContacts(); // Update contacts list
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="chat-page container animate-fade-in">
      <div className="chat-layout glass-panel">
        {/* Sidebar: Contacts */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <div className="sidebar-search">
              <Search size={16} />
              <input type="text" placeholder="Search chats..." />
            </div>
          </div>
          <div className="contacts-list">
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedReceiver?.id === contact.id ? 'active' : ''}`}
                onClick={() => loadChat(contact.id)}
              >
                <div className="avatar">
                  <UserIcon size={20} />
                </div>
                <div className="contact-info">
                  <span className="username">{contact.username}</span>
                  <span className="last-msg">Click to view chat</span>
                </div>
              </div>
            ))}
            {contacts.length === 0 && !loading && (
              <div className="no-contacts">No active chats yet.</div>
            )}
          </div>
        </div>

        {/* Main: Chat Window */}
        <div className="chat-window">
          {selectedReceiver ? (
            <>
              <div className="chat-header">
                <div className="header-user">
                  <div className="avatar">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h3>{selectedReceiver.username}</h3>
                    <span className="status">Online</span>
                  </div>
                </div>
                {activeProduct && (
                  <div className="header-product glass-panel">
                    <Package size={16} />
                    <span>Inquiring about: <b>{activeProduct.title}</b></span>
                  </div>
                )}
              </div>

              <div className="messages-container" ref={scrollRef}>
                {messages.map(msg => (
                  <div key={msg.id} className={`message-wrapper ${msg.sender.id === currentUser.id ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{msg.content}</p>
                      <span className="time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="chat-empty">
                    <MessageSquare size={40} className="text-muted" />
                    <p>Start a conversation with {selectedReceiver.username}!</p>
                  </div>
                )}
              </div>

              <form className="chat-input" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary send-btn">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <MessageSquare size={60} className="text-muted" />
              <h3>Select a contact to start chatting</h3>
              <p>Connect with sellers and buyers directly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
