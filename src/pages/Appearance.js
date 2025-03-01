import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../utils/api';
import '../styles/appearance.css';

const Appearance = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    buttonColor: '#007bff',
    layout: 'vertical'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setSettings(data.appearance || settings);
      } catch (err) {
        toast.error('Failed to load appearance');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ appearance: settings });
      toast.success('Appearance settings saved');
    } catch (err) {
      toast.error('Failed to save appearance');
    }
  };

  return (
    <div className="appearance-container">
      <h2>Appearance</h2>
      <label>Theme:</label>
      <select value={settings.theme} onChange={(e) => setSettings({ ...settings, theme: e.target.value })}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <label>Button Color:</label>
      <input
        type="color"
        value={settings.buttonColor}
        onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
      />
      <label>Layout:</label>
      <select value={settings.layout} onChange={(e) => setSettings({ ...settings, layout: e.target.value })}>
        <option value="vertical">Vertical</option>
        <option value="grid">Grid</option>
      </select>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Appearance;