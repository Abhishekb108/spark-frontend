import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateUser, deleteAccount } from '../utils/api';
import '../styles/settings.css';

const Settings = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        const nameParts = data.userId.name.split(' ') || ['', ''];
        setUser({
          firstName: nameParts[0] || '',
          lastName: nameParts[1] || '',
          email: data.userId.email || '',
          password: '',
          confirmPassword: ''
        });
      } catch (err) {
        toast.error(<div>Failed to load profile <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!user.firstName) tempErrors.firstName = 'First name required';
    if (!user.lastName) tempErrors.lastName = 'Last name required';
    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) tempErrors.email = 'Invalid Email';
    if (user.password && user.password.length < 8) tempErrors.password = 'Password must be at least 8 characters long';
    if (user.password !== user.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await updateUser({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        password: user.password
      });
      toast.success(<div>Settings updated successfully <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      toast.error(<div>{err.response?.data?.message || 'Update failed'} <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success(<div>Logged out <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    window.location.href = '/login';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteAccount();
        localStorage.removeItem('token');
        toast.success(<div>Account deleted successfully <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
        window.location.href = '/';
      } catch (err) {
        toast.error(<div>Failed to delete account <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      }
    }
  };

  return (
    <div className="container">
      <div className="spark-logo"></div>
      <h2>Settings</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First name"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last name"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password (leave blank to keep current)"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="btn-green">Save</button>
      </form>
      <button onClick={handleLogout} className="btn-green">Logout</button>
      <button onClick={handleDelete} className="btn-green delete-btn">Delete Account</button>
    </div>
  );
};

export default Settings;