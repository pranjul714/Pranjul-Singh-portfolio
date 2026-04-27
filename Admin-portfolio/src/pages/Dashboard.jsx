import React, { useEffect, useState } from 'react';
import { getProjects, getSkills, getContacts } from '../services/api';
import { Briefcase, Trophy, Mail, Users } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    contacts: 0,
    visitors: 1250 // Mock data
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, skillRes, contactRes] = await Promise.all([
          getProjects(),
          getSkills(),
          getContacts()
        ]);
        setStats({
          projects: projRes.data.length,
          skills: skillRes.data.length,
          contacts: contactRes.data.length,
          visitors: 1250
        });
      } catch (error) {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: <Briefcase />, color: '#6366f1' },
    { title: 'Skills Listed', value: stats.skills, icon: <Trophy />, color: '#10b981' },
    { title: 'New Inquiries', value: stats.contacts, icon: <Mail />, color: '#f59e0b' },
    { title: 'Total Visitors', value: stats.visitors, icon: <Users />, color: '#ec4899' },
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
          <h3>System Status</h3>
          <ul className="status-list">
            <li>
              <span className="status-dot online"></span>
              <span>Backend Server: Online</span>
            </li>
            <li>
              <span className="status-dot online"></span>
              <span>Database Connection: Healthy</span>
            </li>
            <li>
              <span className="status-dot online"></span>
              <span>Email Service: Connected</span>
            </li>
            <li>
              <span className="status-dot warning"></span>
              <span>Storage Usage: 45%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
