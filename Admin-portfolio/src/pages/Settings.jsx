import React, { useEffect, useState } from 'react';
import { getHome, updateHome, getAbout, updateAbout } from '../services/api';
import { Settings as SettingsIcon, Save, Info, Home, FileText } from 'lucide-react';
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
        if (homeRes.data) setHomeData(prev => ({ ...prev, ...homeRes.data }));
        if (aboutRes.data) setAboutData(prev => ({ ...prev, ...aboutRes.data }));
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [files, setFiles] = useState({ profile_image: null, resume: null });

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('hero_title', homeData.hero_title);
      formData.append('hero_subtitle', homeData.hero_subtitle);
      
      if (files.profile_image) formData.append('profile_image', files.profile_image);

      await updateHome(formData);
      toast.success('Hero settings updated successfully');

      
      // Refresh to show updated URLs
      const { data } = await getHome();
      if (data) setHomeData(data);
      setFiles({ profile_image: null, resume: null });
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

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!files.resume) {
      toast.warning('Please select a resume file to upload');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('resume', files.resume);

      await updateHome(formData);
      toast.success('Resume updated successfully');
      
      const { data } = await getHome();
      if (data) setHomeData(data);
      setFiles({ ...files, resume: null });
    } catch (error) {
      toast.error('Failed to update resume');
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
              <label>Profile Image (JPG/PNG)</label>
              <input type="file" accept="image/*" onChange={e => setFiles({...files, profile_image: e.target.files[0]})} />
              {homeData.profile_image && <small><a href={homeData.profile_image} target="_blank" rel="noreferrer" style={{color: '#34d399'}}>View Current Profile Image</a></small>}
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
        <section className="settings-section glass-card">
          <div className="section-header">
            <FileText size={20} />
            <h2>Resume Settings</h2>
          </div>
          <form onSubmit={handleResumeSubmit}>
            <div className="form-group">
              <label>Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={e => setFiles({...files, resume: e.target.files[0]})} />
              {homeData.resume_url && <small><a href={homeData.resume_url} target="_blank" rel="noreferrer" style={{color: '#34d399'}}>View Current Resume</a></small>}
            </div>
            <button type="submit" className="save-btn">
              <Save size={18} />
              <span>Upload Resume</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;
