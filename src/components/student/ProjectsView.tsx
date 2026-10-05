import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Project } from '../../types/index.ts';
import {
  FolderGit2,
  Plus,
  Github,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  Trash2,
  Edit3,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { currentUser, projects, refreshStudentData, showToast } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Full-Stack Web App',
    role: 'Lead Architect & Developer',
    teamSize: 1,
    techStack: 'React, TypeScript, Node.js, TailwindCSS',
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    featured: true,
    mentorName: ''
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Full-Stack Web App',
      role: 'Lead Developer',
      teamSize: 1,
      techStack: 'TypeScript, React, TailwindCSS',
      githubUrl: '',
      liveUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isOngoing: false,
      featured: true,
      mentorName: 'Dr. Ramesh Kumar'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      role: project.role,
      teamSize: project.teamSize,
      techStack: project.techStack.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      startDate: project.startDate,
      endDate: project.endDate || '',
      isOngoing: project.isOngoing,
      featured: project.featured,
      mentorName: project.mentorName || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    try {
      const res = await api.deleteProject(id);
      if (res.success) {
        showToast('Project removed', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      studentId: currentUser.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      role: formData.role,
      teamSize: Number(formData.teamSize) || 1,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      startDate: formData.startDate,
      endDate: formData.isOngoing ? undefined : formData.endDate,
      isOngoing: formData.isOngoing,
      featured: formData.featured,
      mentorName: formData.mentorName
    };

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        showToast('Project updated successfully', 'success');
      } else {
        await api.addProject(payload);
        showToast('Project submitted! Under faculty review queue.', 'success');
      }
      setShowModal(false);
      await refreshStudentData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Projects & Technical Artifacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase your capstone systems, production code repositories, and faculty reviews
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-white rounded-2xl p-6 border transition hover:shadow-lg flex flex-col justify-between ${
              project.featured ? 'ring-2 ring-indigo-500/10 border-indigo-200' : 'border-slate-200'
            }`}
          >
            <div>
              {/* Header tags */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                    {project.title}
                  </h3>
                </div>

                {/* Verification badge */}
                <div>
                  {project.verifiedStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  ) : project.verifiedStatus === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Action Required
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Role:</strong> {project.role} (Team of {project.teamSize})
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {project.startDate} — {project.isOngoing ? 'Present' : project.endDate}
                </span>
                {project.mentorName && (
                  <span>
                    <strong>Mentor:</strong> {project.mentorName}
                  </span>
                )}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50/80 text-indigo-700 border border-indigo-100"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Faculty Feedback Note */}
              {project.facultyFeedback && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-4">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Faculty Review Note:
                  </div>
                  <p className="italic text-slate-600">"{project.facultyFeedback}"</p>
                </div>
              )}
            </div>

            {/* Links & Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  title="Edit project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Submit Project for Verification'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed In-Memory Cache with Raft Consensus"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full-Stack Web App">Full-Stack Web App</option>
                    <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                    <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                    <option value="Mobile App (Flutter/React Native)">Mobile App</option>
                    <option value="Embedded Systems">Embedded Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Your Role in Project *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Architect & Full Stack Dev"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Detailed Description & Impact *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the problem, architectural choices, throughput/benchmarks, and features..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Tech Stack (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, TypeScript, Go, Docker, AWS"
                  value={formData.techStack}
                  onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Live Demo / Deployment URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.app"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    disabled={formData.isOngoing}
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Faculty Guide / Mentor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Kumar"
                    value={formData.mentorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, mentorName: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isOngoing}
                      onChange={(e) => setFormData(prev => ({ ...prev, isOngoing: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    Currently Ongoing
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    Featured on Portfolio
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  {editingProject ? 'Save Changes' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
