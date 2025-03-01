import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Changed from Switch to Routes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import './styles/global.css';

const App = () => (
  <Router>
    <ToastContainer position="top-center" autoClose={3000} />
    <Routes> {/* Changed from Switch to Routes */}
      <Route exact path="/" element={<Login />} /> {/* Changed component to element */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/:username" element={<PublicProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  </Router>
);

export default App;