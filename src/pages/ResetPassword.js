import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { resetPassword } from '../utils/api';
import '../styles/auth.css';

const ResetPassword = ({ match }) => {
  const [password, setPassword] = useState('');
  const token = match.params.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await resetPassword(token, { password });
      toast.success('Password reset successful');
      window.location.href = '/login';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;