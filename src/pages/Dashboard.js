import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, trackView, trackClick, searchProfiles } from '../utils/api';
import Modal from '../components/Modal';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [shops, setShops] = useState([]);
  const [newLink, setNewLink] = useState({ url: '', visible: true });
  const [newShop, setNewShop] = useState({ url: '', visible: true });
  const [profile, setProfile] = useState({
    profileImage: '',
    bannerImage: '',
    profileTitle: '',
    bio: '',
    social: { instagram: '', youtube: '' },
    appearance: { theme: 'light', buttonColor: '#000000', layout: 'vertical' },
    category: 'Business'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Links'); // Track active tab

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        const { data } = await getProfile();
        console.log('Profile data received:', data);
        setLinks(data.links || []);
        setShops(data.shops || []);
        setProfile({
          profileImage: data.profileImage || '',
          bannerImage: data.bannerImage || '',
          profileTitle: data.profileTitle || '',
          bio: data.bio || '',
          social: data.social || { instagram: '', youtube: '' },
          appearance: data.appearance || { theme: 'light', buttonColor: '#000000', layout: 'vertical' },
          category: data.category || 'Business'
        });
      } catch (err) {
        console.error('Profile fetch error:', err.message, err.response?.data);
        toast.error(<div>Failed to load profile <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
        // Fallback to show a minimal UI if profile data fails
        setLinks([]);
        setShops([]);
        setProfile({
          profileImage: '',
          bannerImage: '',
          profileTitle: '',
          bio: '',
          social: { instagram: '', youtube: '' },
          appearance: { theme: 'light', buttonColor: '#000000', layout: 'vertical' },
          category: 'Business'
        });
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log('Searching profiles with query:', searchQuery, 'page:', page);
        const { data } = await searchProfiles({ q: searchQuery, page, limit: 10 });
        setProfiles(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Profiles search error:', err.message, err.response?.data);
        toast.error(<div>Failed to search profiles <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      }
    };
    fetchProfiles();
  }, [searchQuery, page]);

  const addLink = async () => {
    if (!newLink.url || !isValidUrl(newLink.url)) {
      return toast.error(<div>Invalid or empty URL <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
    if (links.some(link => link.url === newLink.url)) {
      return toast.error(<div>Link already exists <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
    const updatedLinks = [...links, { ...newLink }];
    try {
      console.log('Adding link:', newLink);
      await updateProfile({ ...profile, links: updatedLinks });
      setLinks(updatedLinks);
      setNewLink({ url: '', visible: true });
      setIsLinkModalOpen(false);
      toast.success(<div>Successfully added link <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      console.error('Add link error:', err.message, err.response?.data);
      toast.error(<div>Failed to add link <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const addShop = async () => {
    if (!newShop.url || !isValidUrl(newShop.url)) {
      return toast.error(<div>Invalid or empty URL <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
    if (shops.some(shop => shop.url === newShop.url)) {
      return toast.error(<div>Shop already exists <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
    const updatedShops = [...shops, { ...newShop }];
    try {
      console.log('Adding shop:', newShop);
      await updateProfile({ ...profile, shops: updatedShops });
      setShops(updatedShops);
      setNewShop({ url: '', visible: true });
      setIsShopModalOpen(false);
      toast.success(<div>Successfully added shop <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      console.error('Add shop error:', err.message, err.response?.data);
      toast.error(<div>Failed to add shop <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const deleteLink = async (idx) => {
    const updatedLinks = links.filter((_, i) => i !== idx);
    try {
      console.log('Deleting link at index:', idx);
      await updateProfile({ ...profile, links: updatedLinks });
      setLinks(updatedLinks);
      toast.success(<div>Link deleted <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      console.error('Delete link error:', err.message, err.response?.data);
      toast.error(<div>Failed to delete link <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const deleteShop = async (idx) => {
    const updatedShops = shops.filter((_, i) => i !== idx);
    try {
      console.log('Deleting shop at index:', idx);
      await updateProfile({ ...profile, shops: updatedShops });
      setShops(updatedShops);
      toast.success(<div>Shop deleted <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      console.error('Delete shop error:', err.message, err.response?.data);
      toast.error(<div>Failed to delete shop <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const saveProfile = async (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    try {
      console.log('Saving profile field:', field, 'value:', value);
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success(<div>Profile updated <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    } catch (err) {
      console.error('Profile update error:', err.message, err.response?.data);
      toast.error(<div>Failed to update profile <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const handleLinkClick = async (link) => {
    try {
      console.log('Tracking click for link:', link.url);
      await trackClick(link.url);
      window.open(link.url, '_blank');
    } catch (err) {
      console.error('Track click error:', err.message, err.response?.data);
      toast.error(<div>Failed to track click <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const handleLinkView = async (link) => {
    try {
      console.log('Tracking view for link:', link.url);
      await trackView(link.url);
    } catch (err) {
      console.error('Track view error:', err.message, err.response?.data);
      toast.error(<div>Failed to track view <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!profile) {
    return <div>Loading...</div>; // Fallback while profile data loads
  }

  return (
    <div className="container">
      <div className="spark-brand">SPARK</div>
      <h2>Profile</h2>
      <div className="dashboard-grid">
        <div className="editor">
          <div className="profile-section">
            <button
              onClick={() => {
                console.log('Picking image...');
                saveProfile('profileImage', 'https://via.placeholder.com/100')
                  .then(() => console.log('Image picked successfully'))
                  .catch(err => console.error('Image pick error:', err.message));
              }}
              className="btn-green"
            >
              Pick an image
            </button>
            {profile.profileImage && (
              <button
                onClick={() => {
                  console.log('Removing image...');
                  saveProfile('profileImage', '')
                    .then(() => console.log('Image removed successfully'))
                    .catch(err => console.error('Image remove error:', err.message));
                }}
                className="btn-gray"
              >
                Remove
              </button>
            )}
            <input
              type="text"
              placeholder="Profile Title"
              value={profile.profileTitle}
              onBlur={(e) => saveProfile('profileTitle', e.target.value)}
              onChange={(e) => setProfile({ ...profile, profileTitle: e.target.value })}
            />
            <textarea
              placeholder="Bio"
              value={profile.bio}
              onBlur={(e) => saveProfile('bio', e.target.value)}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <div className="social-links">
              <input
                type="text"
                placeholder="Instagram URL"
                value={profile.social.instagram}
                onBlur={(e) => saveProfile('social', { ...profile.social, instagram: e.target.value })}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, instagram: e.target.value } })}
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={profile.social.youtube}
                onBlur={(e) => saveProfile('social', { ...profile.social, youtube: e.target.value })}
                onChange={(e) => setProfile({ ...profile, social: { ...profile.social, youtube: e.target.value } })}
              />
            </div>
          </div>
          <div className="links-section">
            <button onClick={() => setIsLinkModalOpen(true)} className="btn-green">Add Link</button>
            <button onClick={() => setIsShopModalOpen(true)} className="btn-green">Add Shop</button>
            <div>
              {links.map((link, idx) => (
                <div key={idx} className="link-item" onMouseEnter={() => handleLinkView(link)}>
                  <input value={link.url} readOnly />
                  <label>
                    <input type="checkbox" checked={link.visible} onChange={(e) => {
                      const updatedLinks = links.map((l, i) => i === idx ? { ...l, visible: e.target.checked } : l);
                      saveProfile('links', updatedLinks);
                    }} />
                    Visible
                  </label>
                  <button onClick={() => deleteLink(idx)}>Delete</button>
                </div>
              ))}
              {shops.map((shop, idx) => (
                <div key={idx} className="link-item" onMouseEnter={() => handleLinkView(shop)}>
                  <input value={shop.url} readOnly />
                  <label>
                    <input type="checkbox" checked={shop.visible} onChange={(e) => {
                      const updatedShops = shops.map((s, i) => i === idx ? { ...s, visible: e.target.checked } : s);
                      saveProfile('shops', updatedShops);
                    }} />
                    Visible
                  </label>
                  <button onClick={() => deleteShop(idx)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search profiles..."
            />
            <h3>Search Results</h3>
            {profiles.map((p, idx) => (
              <div key={idx} className="profile-item">
                <p>Username: {p.userId.username}, Link: {p.links[0]?.url || 'No links'}</p>
              </div>
            ))}
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
              <span>Page {page} of {pagination.totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}>Next</button>
            </div>
          </div>
          <select value={profile.category} onChange={(e) => saveProfile('category', e.target.value)}>
            <option value="Business">Business</option>
            <option value="Creative">Creative</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Fashion & Beauty">Fashion & Beauty</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Government & Politics">Government & Politics</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Non-profit">Non-profit</option>
            <option value="Tech">Tech</option>
            <option value="Travel & Tourism">Travel & Tourism</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={() => saveProfile('category', profile.category)} className="btn-green">Save</button>
        </div>
        <div className="preview">
          <h3>Banner</h3>
          {profile.bannerImage ? (
            <img src={profile.bannerImage} alt="Banner" className="banner" />
          ) : (
            <div className="banner" style={{ backgroundColor: '#333' }}></div>
          )}
          {profile.profileImage && <img src={profile.profileImage} alt="Profile" className="profile-pic" />}
          <p>{profile.profileTitle || '@' + (profile.social.instagram.split('/').pop() || profile.social.youtube.split('/').pop() || '')}</p>
          <div className="social-links">
            {profile.social.instagram && <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {profile.social.youtube && <a href={profile.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
          </div>
          {links.filter(l => l.visible).map((link, idx) => (
            <button key={idx} onClick={() => handleLinkClick(link)} className="btn-green">{link.url.split('/').pop()}</button>
          ))}
          {shops.filter(s => s.visible).map((shop, idx) => (
            <button key={idx} onClick={() => handleLinkClick(shop)} className="btn-gray">Buy Now</button>
          ))}
          <input
            type="color"
            value={profile.appearance.buttonColor}
            onChange={(e) => saveProfile('appearance', { ...profile.appearance, buttonColor: e.target.value })}
          />
          <button onClick={() => saveProfile('bannerImage', 'https://via.placeholder.com/390x200')} className="btn-green">Preview</button>
          <div className="nav-tabs">
            <button className={activeTab === 'Links' ? 'active' : ''} onClick={() => setActiveTab('Links')}>Links</button>
            <button className={activeTab === 'Appearance' ? 'active' : ''} onClick={() => setActiveTab('Appearance')}>Appearance</button>
            <button className={activeTab === 'Analytics' ? 'active' : ''} onClick={() => setActiveTab('Analytics')}>Analytics</button>
            <button className={activeTab === 'Settings' ? 'active' : ''} onClick={() => setActiveTab('Settings')}>Settings</button>
          </div>
          {activeTab === 'Links' && (
            <div className="links-preview">
              {/* Links content already above */}
            </div>
          )}
          {activeTab === 'Appearance' && (
            <div className="appearance-preview">
              <p>Customize appearance here (e.g., theme, layout options).</p>
            </div>
          )}
          {activeTab === 'Analytics' && (
            <div className="analytics-preview">
              <p>Analytics content (to be tested separately).</p>
            </div>
          )}
          {activeTab === 'Settings' && (
            <div className="settings-preview">
              <p>Settings content (to be tested separately).</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)}>
        <h3>Add Link</h3>
        <input
          type="text"
          placeholder="Enter URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        />
        <label>
          <input type="checkbox" checked={newLink.visible} onChange={(e) => setNewLink({ ...newLink, visible: e.target.checked })} />
          Visible
        </label>
        <button onClick={addLink} className="btn-green">Add</button>
      </Modal>
      <Modal isOpen={isShopModalOpen} onClose={() => setIsShopModalOpen(false)}>
        <h3>Add Shop</h3>
        <input
          type="text"
          placeholder="Enter Shop URL"
          value={newShop.url}
          onChange={(e) => setNewShop({ ...newShop, url: e.target.value })}
        />
        <label>
          <input type="checkbox" checked={newShop.visible} onChange={(e) => setNewShop({ ...newShop, visible: e.target.checked })} />
          Visible
        </label>
        <button onClick={addShop} className="btn-green">Add</button>
      </Modal>
    </div>
  );
};

export default Dashboard;