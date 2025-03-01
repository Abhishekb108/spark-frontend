import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { login } from '../utils/api';
import '../styles/auth.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error(<div>Username and password are required <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    try {
      console.log('Login attempt - Form data:', form); // Debug log
      const response = await login(form);
      console.log('Login response:', response.data); // Debug log
      localStorage.setItem('token', response.data.token);
      toast.success(<div>Login successful <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error - Full response:', err.response ? err.response.data : err.message); // Debug log
      toast.error(<div>{err.response?.data?.message || 'Login failed'} <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  return (
    <div className="container">
      <div className="spark-brand">SPARK</div>
      <h2>Sign in to your Spark</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username or Email"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-green">Sign in</button>
        <p>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
        <p className="footer-text">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
      </form>
    </div>
  );
};

export default Login;