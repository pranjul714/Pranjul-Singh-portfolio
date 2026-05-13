import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { toast } from 'react-toastify';
import './Login.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await resetPassword(token, passwords.password);
      if (data.success) {
        toast.success('Password reset successfully! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Reset failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Token may be expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card fade-in">
        <div className="login-header">
          <h1>Reset Password</h1>
          <p>Set a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
