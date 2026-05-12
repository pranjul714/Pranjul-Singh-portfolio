import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api';
import { Plus, Edit2, Trash2, ExternalLink, Code, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    tech: '',
    github: '',
    live: '',
    category: ''
  });
  const [files, setFiles] = useState({
    image: null,
    icon: null
  });

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      desc: project.desc || '',
      tech: project.tech ? project.tech.join(', ') : '',
      github: project.github || '',
      live: project.live || '',
      category: project.category || ''
    });
    setFiles({
      image: null,
      icon: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('desc', formData.desc);
    formPayload.append('github', formData.github);
    formPayload.append('live', formData.live);
    formPayload.append('category', formData.category);
    
    // Tech arrays
    const techArray = formData.tech.split(',').map(item => item.trim()).filter(item => item !== '');
    techArray.forEach(t => formPayload.append('tech', t));
    
    if (files.image) formPayload.append('image', files.image);
    if (files.icon) formPayload.append('icon', files.icon);

    try {
      if (currentProject) {
        await updateProject(currentProject._id, formPayload);
        toast.success('Project updated successfully');
      } else {
        await createProject(formPayload);
        toast.success('Project created successfully');
      }
      setShowModal(false);
      fetchProjects();
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setCurrentProject(null);
    setFormData({ title: '', desc: '', tech: '', github: '', live: '', category: '' });
    setFiles({ image: null, icon: null });
  };

  return (
    <div className="projects-page fade-in">
      <div className="page-header">
        <div>
          <h1>Projects Management</h1>
          <p>Create, update and manage your portfolio projects.</p>
        </div>
        <button className="add-btn" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card glass-card">
            <div className="project-image">
              {project.image ? (
                <img src={project.image} alt={project.title} />
              ) : (
                <div className="image-placeholder"><ImageIcon size={40} /></div>
              )}
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p className="project-category">{project.category}</p>
              <div className="project-tech">
                {project.tech?.map((t, i) => <span key={i} className="tech-tag">{t}</span>)}
              </div>
              <div className="project-actions">
                <div className="links">
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Code size={18} /></a>}
                  {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={18} /></a>}
                </div>
                <div className="admin-btns">
                  <button onClick={() => handleEdit(project)} className="edit-btn"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(project._id)} className="delete-btn"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowModal(false)}>
          <div className="modal-content glass-card fade-in">
            <div className="modal-header">
              <h2>{currentProject ? 'Update Project' : 'Create New Project'}</h2>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      placeholder="My Awesome App"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      placeholder="e.g. Fullstack Web" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    rows="3" 
                    value={formData.desc} 
                    onChange={e => setFormData({...formData, desc: e.target.value})}
                    placeholder="Briefly describe what this project does..."
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h3>Technical Details</h3>
                <div className="form-group">
                  <label>Technologies (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.tech} 
                    onChange={e => setFormData({...formData, tech: e.target.value})} 
                    placeholder="React, Node.js, MongoDB, Tailwind" 
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input 
                      type="url" 
                      value={formData.github} 
                      onChange={e => setFormData({...formData, github: e.target.value})} 
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input 
                      type="url" 
                      value={formData.live} 
                      onChange={e => setFormData({...formData, live: e.target.value})} 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Visual Assets</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Thumbnail (JPG/PNG)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setFiles({...files, image: e.target.files[0]})} 
                    />
                    {currentProject?.image && <small><a href={currentProject.image} target="_blank" rel="noreferrer" style={{color: '#34d399'}}>View Current Image</a></small>}
                  </div>
                  <div className="form-group">
                    <label>Tech Icon (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setFiles({...files, icon: e.target.files[0]})} 
                    />
                    {currentProject?.icon && <small><a href={currentProject.icon} target="_blank" rel="noreferrer" style={{color: '#34d399'}}>View Current Icon</a></small>}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Discard</button>
                <button type="submit" className="submit-btn">
                  {currentProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
