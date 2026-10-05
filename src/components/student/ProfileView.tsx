import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { studentProfile, updateStudentProfile, setPublicViewSlug } = useAuth();

  const [formData, setFormData] = useState({
    name: studentProfile?.name || '',
    email: studentProfile?.email || '',
    rollNo: studentProfile?.rollNo || '',
    department: studentProfile?.department || 'Computer Science & Engineering',
    degree: studentProfile?.degree || 'B.Tech in Computer Science',
    currentSemester: studentProfile?.currentSemester || 8,
    batch: studentProfile?.batch || '2021-2025',
    cgpa: studentProfile?.cgpa || 9.0,
    phone: studentProfile?.phone || '',
    location: studentProfile?.location || 'Bangalore, India',
    targetRole: studentProfile?.targetRole || 'Full Stack & Cloud Solutions Engineer',
    bio: studentProfile?.bio || '',
    aboutMe: studentProfile?.aboutMe || '',
    githubUrl: studentProfile?.githubUrl || '',
    linkedinUrl: studentProfile?.linkedinUrl || '',
    websiteUrl: studentProfile?.websiteUrl || '',
    portfolioSlug: studentProfile?.portfolioSlug || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentSemester' || name === 'cgpa' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateStudentProfile(formData);
    setIsSaving(false);
  };

  if (!studentProfile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Academic Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain your institutional credentials, academic milestones, and public web profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPublicViewSlug(formData.portfolioSlug)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
            View Public Link
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic & Academic Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Academic & Institutional Identification
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50 border border-slate-200 shadow-sm"
            />
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-semibold text-slate-700">Profile Avatar URL</label>
              <input
                type="url"
                name="avatar"
                defaultValue={studentProfile.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-[11px] text-slate-400">
                Provide an image link or leave standard gravatar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="text-xs font-semibold text-slate-700">Full Legal Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">University Roll / Registration No *</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">College Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Department / Branch *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Degree Program *</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech in Computer Science"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Current Semester</label>
              <select
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Cumulative GPA (CGPA) / 10 *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                required
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Graduation Batch *</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="2021-2025"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>
        </div>

        {/* Career & Bio Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Career Focus & Personal Headline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Target Role / Specialization</label>
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="e.g. Cloud Solutions Architect / Full Stack Engineer"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bangalore, India"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Short Headline / Bio</label>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="e.g. Aspiring Cloud & Full-Stack Architect with a focus on scalable distributed systems."
              className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Detailed About Me / Executive Summary</label>
            <textarea
              name="aboutMe"
              rows={4}
              value={formData.aboutMe}
              onChange={handleChange}
              placeholder="Write a concise overview of your technical interests, projects, leadership experience, and aspirations..."
              className="w-full mt-1 text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Social Links & Web Slug */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-emerald-600" />
            Social Profiles & Public Portfolio URL
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-700" /> GitHub Profile URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" /> Personal Website / Blog
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://mywebsite.dev"
                className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" /> Public Portfolio Slug
              </label>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200">
                  /portfolio/
                </span>
                <input
                  type="text"
                  name="portfolioSlug"
                  value={formData.portfolioSlug}
                  onChange={handleChange}
                  placeholder="aarav-sharma"
                  className="w-full text-xs px-3 py-2.5 rounded-r-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Profile...' : 'Save Academic Profile'}
          </button>
        </div>

      </form>
    </div>
  );
};
