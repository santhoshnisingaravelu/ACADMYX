import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Skill, SkillCategory, SkillProficiency } from '../../types/index.ts';
import {
  Cpu,
  Plus,
  Search,
  CheckCircle2,
  ThumbsUp,
  Star,
  Trash2,
  Edit2,
  X,
  Filter,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const CATEGORIES: SkillCategory[] = [
  'Technical',
  'Languages',
  'Tools & Frameworks',
  'Cloud & DevOps',
  'Soft'
];

export const SkillsView: React.FC = () => {
  const { currentUser, skills, refreshStudentData, showToast } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: SkillCategory;
    proficiency: SkillProficiency;
    rating: number;
    evidenceNote: string;
  }>({
    name: '',
    category: 'Technical',
    proficiency: 'Intermediate',
    rating: 3,
    evidenceNote: ''
  });

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Technical',
      proficiency: 'Intermediate',
      rating: 3,
      evidenceNote: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      rating: skill.rating,
      evidenceNote: skill.evidenceNote || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    try {
      const res = await api.deleteSkill(id);
      if (res.success) {
        showToast('Skill deleted successfully', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete skill', 'error');
    }
  };

  const handleEndorse = async (id: string) => {
    try {
      const res = await api.endorseSkill(id);
      if (res.success) {
        showToast('Endorsement added!', 'success');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Could not endorse', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (editingSkill) {
        await api.updateSkill(editingSkill.id, formData);
        showToast('Skill updated successfully', 'success');
      } else {
        await api.addSkill({
          studentId: currentUser.id,
          ...formData
        });
        showToast('Skill added to profile!', 'success');
      }
      setShowModal(false);
      await refreshStudentData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Skills & Competency Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain your verified technical proficiencies, frameworks, and faculty endorsements
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = skills.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Cpu className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No skills found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search criteria' : 'Click "Add Skill" above to start documenting your abilities.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className={`bg-white rounded-2xl p-5 border transition hover:shadow-md flex flex-col justify-between ${
                skill.isVerified ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/20 to-white' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {skill.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{skill.name}</h3>
                  </div>

                  {skill.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Self-Reported
                    </span>
                  )}
                </div>

                {/* Rating & Proficiency */}
                <div className="flex items-center gap-3 my-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${
                    skill.proficiency === 'Expert' ? 'bg-purple-100 text-purple-800' :
                    skill.proficiency === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                    skill.proficiency === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {skill.proficiency}
                  </span>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= skill.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {skill.evidenceNote && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                    "{skill.evidenceNote}"
                  </p>
                )}

                {skill.isVerified && skill.verifiedBy && (
                  <div className="mt-3 text-[11px] text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Audited by <strong>{skill.verifiedBy}</strong> on {skill.verifiedAt}</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Endorsements & Edit/Delete */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleEndorse(skill.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition font-medium"
                  title="Endorse this skill"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{skill.endorsementsCount || 0} Endorsements</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Edit skill"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkill ? 'Edit Skill Record' : 'Add New Skill'}
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
                <label className="text-xs font-semibold text-slate-700">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, Kubernetes, Distributed Systems"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as SkillCategory }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Self-Assessed Proficiency *</label>
                <select
                  value={formData.proficiency}
                  onChange={(e) => setFormData(prev => ({ ...prev, proficiency: e.target.value as SkillProficiency }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Basic familiarity)</option>
                  <option value="Intermediate">Intermediate (Used in college projects)</option>
                  <option value="Advanced">Advanced (Production / Internship usage)</option>
                  <option value="Expert">Expert (Architecture, optimization, mentoring)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Competency Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {formData.rating} of 5
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Evidence / Project Reference</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Demonstrated in CloudMesh project and coursework lab assignments."
                  value={formData.evidenceNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidenceNote: e.target.value }))}
                  className="w-full mt-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
