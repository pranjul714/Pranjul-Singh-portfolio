import React, { useEffect, useState } from 'react';
import { getHome, updateHome, getAbout, updateAbout } from '../services/api';
import { Settings as SettingsIcon, Save, Info, Home } from 'lucide-react';
import { toast } from 'react-toastify';
import './Settings.css';

// Update api.js first to include these
const Settings = () => {
  const [homeData, setHomeData] = useState({ hero_title: '', hero_subtitle: '', resume_url: '', profile_image: '' });
  const [aboutData, setAboutData] = useState({ bio: '', experience_years: 0, education: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, aboutRes] = await Promise.all([
          getHome().catch(() => ({ data: {} })),
          getAbout().catch(() => ({ data: {} }))
        ]);
        if (homeRes.data) setHomeData(homeRes.data);
        if (aboutRes.data) setAboutData(aboutRes.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateHome(homeData);
      toast.success('Hero settings updated');
    } catch (error) {
      toast.error('Failed to update hero settings');
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAbout(aboutData);
      toast.success('About settings updated');
    } catch (error) {
      toast.error('Failed to update about settings');
    }
  };

  return (
    <div className="settings-page fade-in">
      <div className="page-header">
        <div>
          <h1>Site Settings</h1>
          <p>Manage global content for your portfolio.</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-section glass-card">
          <div className="section-header">
            <Home size={20} />
            <h2>Hero Section</h2>
          </div>
          <form onSubmit={handleHomeSubmit}>
            <div className="form-group">
              <label>Hero Title</label>
              <input type="text" value={homeData.hero_title} onChange={e => setHomeData({...homeData, hero_title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <textarea rows="2" value={homeData.hero_subtitle} onChange={e => setHomeData({...homeData, hero_subtitle: e.target.value})}></textarea>
            </div>
            <div className="form-group">
              <label>Resume URL</label>
              <input type="text" value={homeData.resume_url} onChange={e => setHomeData({...homeData, resume_url: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Profile Image URL</label>
              <input type="text" value={homeData.profile_image} onChange={e => setHomeData({...homeData, profile_image: e.target.value})} />
            </div>
            <button type="submit" className="save-btn">
              <Save size={18} />
              <span>Save Hero Changes</span>
            </button>
          </form>
        </section>

        <section className="settings-section glass-card">
          <div className="section-header">
            <Info size={20} />
            <h2>About Me</h2>
          </div>
          <form onSubmit={handleAboutSubmit}>
            <div className="form-group">
              <label>Bio</label>
              <textarea rows="4" value={aboutData.bio} onChange={e => setAboutData({...aboutData, bio: e.target.value})} required></textarea>
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input type="number" value={aboutData.experience_years} onChange={e => setAboutData({...aboutData, experience_years: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input type="text" value={aboutData.education} onChange={e => setAboutData({...aboutData, education: e.target.value})} />
            </div>
            <button type="submit" className="save-btn">
              <Save size={18} />
              <span>Save About Changes</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
