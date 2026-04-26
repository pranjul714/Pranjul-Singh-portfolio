import React, { useEffect, useState } from 'react';
import { getSkills, createSkill, deleteSkill } from '../services/api';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', proficiency: 0, category: '' });

  const fetchSkills = async () => {
    try {
      const { data } = await getSkills();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await deleteSkill(id);
        toast.success('Skill removed');
        fetchSkills();
      } catch (error) {
        toast.error('Failed to delete skill');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSkill(formData);
      toast.success('Skill added');
      setFormData({ name: '', proficiency: 0, category: '' });
      fetchSkills();
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="skills-page fade-in">
      <div className="page-header">
        <div>
          <h1>Skills & Expertise</h1>
          <p>Manage your technical skills and proficiency levels.</p>
        </div>
      </div>

      <div className="skills-content">
        <div className="add-skill-card glass-card">
          <h3>Add New Skill</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Skill Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. React.js" />
            </div>
            <div className="form-group">
              <label>Proficiency (%)</label>
              <input type="number" min="0" max="100" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Frontend" />
            </div>
            <button type="submit" className="add-skill-btn">
              <Plus size={20} />
              <span>Add Skill</span>
            </button>
          </form>
        </div>

        <div className="skills-list">
          {categories.length > 0 ? (
            categories.map(cat => (
              <div key={cat} className="skill-category-section">
                <h4>{cat || 'Uncategorized'}</h4>
                <div className="skills-subgrid">
                  {skills.filter(s => s.category === cat).map(skill => (
                    <div key={skill._id} className="skill-item-card glass-card">
                      <div className="skill-main">
                        <div className="skill-icon"><Trophy size={18} /></div>
                        <div className="skill-info">
                          <span>{skill.name}</span>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${skill.proficiency}%` }}></div>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(skill._id)} className="delete-skill-btn"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No skills found. Add some to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
