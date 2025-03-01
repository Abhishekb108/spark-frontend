import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { signup } from '../utils/api';
import '../styles/auth.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!form.firstName) tempErrors.firstName = 'First name required';
    if (!form.lastName) tempErrors.lastName = 'Last name required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) tempErrors.email = 'Invalid Email';
    if (!form.password) tempErrors.password = 'Password required';
    else if (form.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(form.password))
      tempErrors.password = 'Password must be at least 8 characters long, include lowercase, uppercase, number, and special character (@$!%*?&)';
    if (form.password !== form.confirmPassword) tempErrors.confirmPassword = 'Password did not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await signup({ username: form.firstName.toLowerCase() + '.' + form.lastName.toLowerCase(), email: form.email, password: form.password, name: `${form.firstName} ${form.lastName}` });
      toast.success(<div>Account created successfully <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      window.location.href = '/login';
    } catch (err) {
      toast.error(<div>{err.response?.data?.message || 'Signup failed'} <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  return (
    <div className="container">
      <div className="spark-logo"></div>
      <h2>Sign up to your Spark</h2>
      <p>Create an account <Link to="/login">Sign in instead</Link></p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <label>
          <input type="checkbox" required />
          By creating an account, I agree to our Terms of use and Privacy Policy
        </label>
        <button type="submit" className="btn-gray">Create an account</button>
        <p>OR</p>
        <button className="btn-green">Continue with Google</button>
        <p className="footer-text">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
      </form>
    </div>
  );
};

export default Signup;