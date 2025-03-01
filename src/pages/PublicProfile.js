import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPublicProfile, trackClick } from '../utils/api';
import '../styles/public-profile.css';

const PublicProfile = ({ match }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getPublicProfile(match.params.username);
        setProfile(data);
      } catch (err) {
        toast.error(<div>Failed to load profile <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
      }
    };
    fetchProfile();
  }, [match.params.username]);

  const handleLinkClick = async (url) => {
    try {
      await trackClick(url);
      window.open(url, '_blank');
    } catch (err) {
      toast.error(<div>Failed to track click <span className="close" onClick={() => toast.dismiss()}>X</span></div>);
    }
  };

  const handleClose = () => {
    window.close();
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="spark-logo"></div>
      <div className="banner">
        {profile.bannerImage && <img src={profile.bannerImage} alt="Banner" />}
        {profile.profileImage && <img src={profile.profileImage} alt="Profile" className="profile-pic" />}
        <p>{profile.profileTitle || '@' + profile.username}</p>
      </div>
      <div className="links">
        <button onClick={() => handleLinkClick(profile.links?.[0]?.url || '')} className="btn-green">link</button>
        <button onClick={() => handleLinkClick(profile.shops?.[0]?.url || '')} className="btn-gray">Shop</button>
        {profile.links?.filter(l => l.visible).map((link, idx) => (
          <button key={idx} onClick={() => handleLinkClick(link.url)} className="link-btn">{link.url.split('/').pop()}</button>
        ))}
        {profile.shops?.filter(s => s.visible).map((shop, idx) => (
          <button key={idx} onClick={() => handleLinkClick(shop.url)} className="shop-btn">Buy Now</button>
        ))}
      </div>
      <button onClick={handleClose} className="btn-green">Get Connected</button>
      <button onClick={handleClose} className="close-btn">X</button>
    </div>
  );
};

export default PublicProfile;