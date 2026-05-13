import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgetPassword } from '../services/api';
import { toast } from 'react-toastify';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgetPassword(email);
      if (data.success) {
        toast.success(data.message);
        setSubmitted(true);
      } else {
        toast.error(data.message || 'Request failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card fade-in">
        <div className="login-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
            <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem' }}>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="success-state" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📧</div>
            <p>Check your email! We've sent a password reset link to <strong>{email}</strong>.</p>
            <Link to="/login" className="login-btn" style={{ display: 'block', marginTop: '20px', textDecoration: 'none', textAlign: 'center' }}>
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
