import React, { useEffect, useState } from 'react';
import { getProjects, getSkills, getContacts, getVisitorStats } from '../services/api';
import { Briefcase, Trophy, Mail, Users, Globe, Eye } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
    totalVisits: 0,
    todayVisits: 0
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        
        <div className="recent-activity glass-card">
          <div className="section-header">
            <h3>Recent Visitors</h3>
            <Globe size={18} className="text-emerald-400" />
          </div>
          <div className="visitors-table-wrapper">
            <table className="visitors-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>IP Address</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentVisitors.length > 0 ? (
                  recentVisitors.map((visitor, index) => (
                    <tr key={index}>
                      <td>
                        <span className="location-text">
                          {visitor.city}, {visitor.country}
                        </span>
                      </td>
                      <td className="ip-text">{visitor.ip}</td>
                      <td className="time-text">
                        {new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No visitors tracked yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
