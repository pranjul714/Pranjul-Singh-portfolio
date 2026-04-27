import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Plus, Trash2, Edit3, Save, X, Layout, 
  Zap, Mail, Settings, LogOut, ExternalLink, 
  Github, Rocket, Globe, Code2, ShieldCheck, 
  Terminal, Database, Cpu 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [newProject, setNewProject] = useState({ 
    title: "", desc: "", tech: "", github: "", live: "", icon: "Rocket" 
  });
  const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend", proficiency: 80 });

  const token = localStorage.getItem("adminToken");
  const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const API_URL = rawUrl.replace(/\/$/, "");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    if (activeTab === "projects") fetchProjects();
    if (activeTab === "skills") fetchSkills();
    if (activeTab === "messages") fetchMessages();
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/projects`);
      setProjects(data);
    } catch (e) { toast.error("Failed to fetch projects"); }
  };

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/skills`);
      setSkills(data);
    } catch (e) { toast.error("Failed to fetch skills"); }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data);
    } catch (e) { toast.error("Failed to fetch messages"); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const techArray = newProject.tech.split(",").map(t => t.trim());
      await axios.post(`${API_URL}/admin/projects`, 
        { ...newProject, tech: techArray }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Project added!");
      setNewProject({ title: "", desc: "", tech: "", github: "", live: "", icon: "Rocket" });
      fetchProjects();
    } catch (e) { toast.error("Failed to add project"); }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/skills`, newSkill, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Skill added!");
      setNewSkill({ name: "", category: "Frontend", proficiency: 80 });
      fetchSkills();
    } catch (e) { toast.error("Failed to add skill"); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await axios.delete(`${API_URL}/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${type} deleted`);
      fetchData();
    } catch (e) { toast.error(`Failed to delete ${type}`); }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#020f0a] text-white font-sans flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-3xl border-r border-white/10 flex flex-col p-6 fixed h-full">
        <h1 className="text-2xl font-black text-emerald-400 mb-12">Admin Panel</h1>
        
        <nav className="flex-1 space-y-2">
          <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")} icon={<Layout size={20}/>} label="Projects" />
          <TabButton active={activeTab === "skills"} onClick={() => setActiveTab("skills")} icon={<Zap size={20}/>} label="Skills" />
          <TabButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")} icon={<Mail size={20}/>} label="Messages" />
          <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<Settings size={20}/>} label="Page Content" />
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 lg:p-16">
        <div className="max-w-5xl mx-auto">
          {activeTab === "projects" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <section className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                  <Plus className="text-emerald-400" /> New Project
                </h2>
                <form onSubmit={handleAddProject} className="grid grid-cols-2 gap-6">
                  <FormInput label="Title" value={newProject.title} onChange={v => setNewProject({...newProject, title: v})} placeholder="Project Title" />
                  <FormInput label="Tech Stack" value={newProject.tech} onChange={v => setNewProject({...newProject, tech: v})} placeholder="React, Node, etc." />
                  <FormInput label="GitHub" value={newProject.github} onChange={v => setNewProject({...newProject, github: v})} placeholder="GitHub URL" />
                  <FormInput label="Live Link" value={newProject.live} onChange={v => setNewProject({...newProject, live: v})} placeholder="Live URL" />
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-emerald-400/50 mb-2 uppercase tracking-widest">Description</label>
                    <textarea value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-32 focus:border-emerald-500 outline-none" placeholder="Explain the project..." />
                  </div>
                  <button className="col-span-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-5 rounded-2xl transition-all shadow-xl">
                    Publish to Portfolio
                  </button>
                </form>
              </section>

              <div className="grid gap-4">
                {projects.map(p => (
                  <div key={p._id} className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-6 rounded-3xl group hover:border-emerald-500/40 transition-all">
                    <div>
                      <h3 className="text-xl font-bold">{p.title}</h3>
                      <p className="text-emerald-400/60 text-sm font-medium">{p.tech.join(" • ")}</p>
                    </div>
                    <button onClick={() => handleDelete("projects", p._id)} className="p-4 bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <section className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-4">Add Skill</h2>
                <form onSubmit={handleAddSkill} className="grid grid-cols-3 gap-6">
                  <FormInput label="Skill Name" value={newSkill.name} onChange={v => setNewSkill({...newSkill, name: v})} placeholder="e.g. React" />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-emerald-400/50 uppercase">Category</label>
                    <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white">
                      <option className="bg-slate-900" value="Frontend">Frontend</option>
                      <option className="bg-slate-900" value="Backend">Backend</option>
                      <option className="bg-slate-900" value="Tools">Tools</option>
                    </select>
                  </div>
                  <FormInput label="Proficiency %" type="number" value={newSkill.proficiency} onChange={v => setNewSkill({...newSkill, proficiency: v})} placeholder="80" />
                  <button className="col-span-3 bg-emerald-500 text-emerald-950 font-black py-5 rounded-2xl">Add Skill</button>
                </form>
              </section>

              <div className="grid grid-cols-2 gap-4">
                {skills.map(s => (
                  <div key={s._id} className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <span>{s.name} <span className="text-emerald-400/40 ml-2">({s.category})</span></span>
                    <button onClick={() => handleDelete("skills", s._id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-black">Inbound Messages</h2>
              <div className="grid gap-6">
                {messages.map(m => (
                  <div key={m._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-400">{m.sender_name || m.name}</h3>
                        <p className="text-emerald-100/40 text-sm font-medium">{m.sender_email || m.email}</p>
                      </div>
                      <span className="text-xs text-emerald-500/30 uppercase tracking-widest font-black">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-lg">{m.subject}</p>
                    <p className="text-emerald-100/70 leading-relaxed bg-white/[0.02] p-6 rounded-2xl">{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${
        active ? "bg-emerald-500 text-emerald-950 shadow-xl" : "text-emerald-100/50 hover:bg-white/5"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-emerald-400/50 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-emerald-500 outline-none transition-all"
      />
    </div>
  );
}
