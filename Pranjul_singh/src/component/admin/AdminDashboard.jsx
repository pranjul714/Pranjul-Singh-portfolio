import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", desc: "", tech: "", github: "", live: "" });
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await axios.get("http://localhost:5000/api/admin/projects");
    setProjects(data);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const techArray = newProject.tech.split(",").map(t => t.trim());
      await axios.post("http://localhost:5000/api/admin/projects", { ...newProject, tech: techArray }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Project added!");
      setNewProject({ title: "", desc: "", tech: "", github: "", live: "" });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`http://localhost:5000/api/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] p-8 lg:p-16 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-black text-emerald-400">Admin Dashboard</h1>

        {/* Add Project Form */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Plus className="text-emerald-400" /> Add New Project
          </h2>
          <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Project Title"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tech Stack (comma separated)"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none"
              value={newProject.tech}
              onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none h-32"
              value={newProject.desc}
              onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
            />
            <input
              type="text"
              placeholder="GitHub Link"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none"
              value={newProject.github}
              onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
            />
            <input
              type="text"
              placeholder="Live Demo Link"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none"
              value={newProject.live}
              onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
            />
            <button className="md:col-span-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
              Publish Project
            </button>
          </form>
        </section>

        {/* Projects List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Manage Projects</h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project._id} className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-all">
                <div>
                  <h3 className="text-xl font-bold text-emerald-400">{project.title}</h3>
                  <p className="text-emerald-100/50 text-sm">{project.tech.join(" • ")}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDelete(project._id)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
