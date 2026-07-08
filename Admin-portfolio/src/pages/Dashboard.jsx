import React, { useEffect, useState } from 'react';
import { getProjects, getSkills, getContacts, getVisitorStats } from '../services/api';
import { Briefcase, Trophy, Mail, Users, Globe, Eye, RotateCcw, Rocket } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import VisitorMap from '../components/VisitorMap';
import './Dashboard.css';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
    totalVisits: 0,
    todayVisits: 0
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusedVisitor, setFocusedVisitor] = useState(null);

  const fetchStats = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [projRes, skillRes, contactRes, visitorRes] = await Promise.all([
        getProjects(),
        getSkills(),
        getContacts(),
        getVisitorStats()
      ]);
      
      setStats({
        projects: projRes.data.length,
        skills: skillRes.data.length,
        contacts: contactRes.data.length,
        totalVisits: visitorRes.data.totalVisits,
        todayVisits: visitorRes.data.todayVisits
      });
      
      setRecentVisitors(visitorRes.data.latestVisitors || []);
      setRecentActions(visitorRes.data.recentActions || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Setup Socket Connection
    const socket = io(SOCKET_URL);

    socket.on('new_visitor', (data) => {
      // Show professional toast notification for NEW visitor
      toast.info(`🚀 New Visitor from ${data.city || 'Unknown City'}, ${data.country || 'Unknown'}! (${data.device})`, {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      fetchStats(false);
    });

    socket.on('visitor_action', (data) => {
      // Show professional toast for SPECIFIC ACTIONS
      const actionEmoji = data.type === 'view' ? '👀' : '🎯';
      toast.success(`${actionEmoji} Activity from ${data.city || 'Visitor'}: ${data.name}`, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      fetchStats(false);
    });

    socket.on('data_updated', (data) => {
      fetchStats(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const calculateDuration = (v) => {
    if (!v.lastActive || !v.createdAt) return '0s';
    const durationMs = Math.max(0, new Date(v.lastActive) - new Date(v.createdAt));
    const mins = Math.floor(durationMs / 60000);
    const secs = Math.floor((durationMs % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const statCards = [
    { title: 'Total Visits', value: stats.totalVisits, icon: <Eye />, color: '#8b5cf6' },
    { title: 'Visits Today', value: stats.todayVisits, icon: <Users />, color: '#ec4899' },
    { title: 'Projects', value: stats.projects, icon: <Briefcase />, color: '#6366f1' },
    { title: 'New Messages', value: stats.contacts, icon: <Mail />, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card glass-card">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-details">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <VisitorMap visitors={recentVisitors} focusedVisitor={focusedVisitor} />

      <div className="dashboard-content-grid">
        <div className="chart-placeholder glass-card">
          <h3>Traffic Analytics</h3>
          <div className="mock-chart">
            {/* Simple visual representation */}
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
        
        <div className="bottom-grid">
          <div className="recent-activity glass-card">
            <div className="section-header">
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={24} className="text-emerald-400" /> Recent Visitors
              </h1>
              <div className="header-actions gap-4">
                <button 
                  className={`refresh-btn ${loading ? 'spinning' : ''}`} 
                  onClick={() => fetchStats()}
                  title="Refresh Data"
                >
                  <RotateCcw size={30} />
                </button> 
                <Globe size={24} className="p-4 ml-2 mr-4 text-emerald-400" />
              </div>
            </div>
            <div className="visitors-table-wrapper">
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Device / OS</th>
                    <th>IP Address</th>
                    <th>Duration</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisitors.length > 0 ? (
                    recentVisitors.map((visitor, index) => (
                      <tr 
                        key={index} 
                        onClick={() => setFocusedVisitor(visitor)}
                        style={{ cursor: 'pointer' }}
                        title="Click to view on map"
                      >
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="location-text">
                              {visitor.city}, {visitor.country}
                            </span>
                            {(visitor.lat && visitor.lon) && (
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', fontFamily: 'monospace' }}>
                                Lat: {visitor.lat}, Lon: {visitor.lon}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="device-tag">
                            {visitor.deviceType} / {visitor.os}
                          </span>
                        </td>
                        <td className="ip-text">{visitor.ip}</td>
                        <td className="duration-text" style={{ color: '#10b981', fontWeight: '600' }}>
                          {calculateDuration(visitor)}
                        </td>
                        <td className="time-text">
                          {new Date(visitor.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No visitors tracked yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="activity-feed-section glass-card">
            <div className="section-header">
              <h3>Live Activity Feed</h3>
            </div>
            <div className="feed-container">
              {recentActions.length > 0 ? (
                recentActions.map((action, idx) => (
                  <div key={idx} className="feed-item">
                    <div className={`feed-icon ${action.type}`}>
                      {action.type === 'view' ? <Eye size={14} /> : <Rocket size={14} />}
                    </div>
                    <div className="feed-content">
                      <p className="feed-text">
                        <span className="feed-city">{action.city} <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '0.8rem' }}>({action.ip})</span></span>
                        {action.type === 'view' ? ' viewed ' : ' clicked '}
                        <span className="feed-target">{action.name}</span>
                      </p>
                      <span className="feed-time">
                        {new Date(action.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-feed">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
