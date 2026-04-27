import React, { useEffect, useState } from 'react';
import { getContacts } from '../services/api';
import { Mail, Calendar, User, MessageSquare, Search } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import './Contacts.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await getContacts();
        setContacts(data);
      } catch (error) {
        toast.error('Failed to fetch contact inquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();

    const socketUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/admin$/, "");
    const socket = io(socketUrl);
    
    socket.on("data_updated", (data) => {
      if (data.type === "contacts") fetchContacts();
    });

    return () => socket.disconnect();
  }, []);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="contacts-page fade-in">
      <div className="page-header">
        <div>
          <h1>Inquiries</h1>
          <p>Messages received from your portfolio contact form.</p>
        </div>
        <div className="search-bar glass-card">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search inquiries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="contacts-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <div key={contact._id} className="contact-card glass-card">
              <div className="contact-header">
                <div className="contact-user">
                  <div className="avatar">{contact.name.charAt(0)}</div>
                  <div>
                    <h3>{contact.name}</h3>
                    <p>{contact.email}</p>
                  </div>
                </div>
                <div className="contact-date">
                  <Calendar size={14} />
                  <span>{formatDate(contact.createdAt)}</span>
                </div>
              </div>
              <div className="contact-body">
                <div className="contact-subject">
                  <MessageSquare size={16} />
                  <span>{contact.subject}</span>
                </div>
                <p className="contact-message">{contact.message}</p>
              </div>
              <div className="contact-footer">
                <a href={`mailto:${contact.email}`} className="reply-btn">
                  <Mail size={16} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-contacts glass-card">
            <Mail size={48} />
            <p>{searchTerm ? 'No results matching your search.' : 'No inquiries yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
