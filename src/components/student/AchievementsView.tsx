import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { AcademicAchievement, AchievementType } from '../../types/index.ts';
import {
  Trophy,
  Plus,
  Calendar,
  Building,
  ShieldCheck,
  Clock,
  FileText,
  Trash2,
  Edit2,
  X,
  UploadCloud,
  CheckCircle2,
  Tag
} from 'lucide-react';

const ACHIEVEMENT_TYPES: AchievementType[] = [
  'Hackathon',
  'Publication',
  'Workshop',
  'Honor & Award',
  'Competition',
  'Extracurricular'
];

export const AchievementsView: React.FC = () => {
  const { currentUser, achievements, refreshStudentData, showToast } = useAuth();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AcademicAchievement | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    type: AchievementType;
    date: string;
    positionOrAward: string;
    eventName: string;
    organizedBy: string;
    description: string;
    proofFileName: string;
    proofDocument: string;
    tags: string;
  }>({
    title: '',
    type: 'Hackathon',
    date: '',
    positionOrAward: '1st Prize / Winner',
    eventName: '',
    organizedBy: '',
    description: '',
    proofFileName: '',
    proofDocument: '',
    tags: 'Hackathon, Winner, Innovation'
  });

  const handleOpenAdd = () => {
    setEditingAchievement(null);
    setFormData({
      title: '',
      type: 'Hackathon',
      date: new Date().toISOString().split('T')[0],
      positionOrAward: '1st Prize',
      eventName: '',
      organizedBy: '',
      description: '',
      proofFileName: '',
      proofDocument: '',
      tags: 'National Contest, Innovation'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ach: AcademicAchievement) => {
    setEditingAchievement(ach);
    setFormData({
      title: ach.title,
      type: ach.type,
      date: ach.date,
      positionOrAward: ach.positionOrAward,
      eventName: ach.eventName,
      organizedBy: ach.organizedBy,
      description: ach.description,
      proofFileName: ach.proofFileName || '',
      proofDocument: ach.proofDocument || '',
      tags: ach.tags.join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this achievement?')) return;
    try {
      const res = await api.deleteAchievement(id);
      if (res.success) {
        showToast('Achievement removed', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete achievement', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          proofFileName: file.name,
          proofDocument: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      studentId: currentUser.id,
      title: formData.title,
      type: formData.type,
      date: formData.date,
      positionOrAward: formData.positionOrAward,
      eventName: formData.eventName,
      organizedBy: formData.organizedBy,
      description: formData.description,
      proofFileName: formData.proofFileName,
      proofDocument: formData.proofDocument,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingAchievement) {
        await api.updateAchievement(editingAchievement.id, payload);
        showToast('Achievement updated', 'success');
      } else {
        await api.addAchievement(payload);
        showToast('Achievement recorded & queued for verification', 'success');
      }
      setShowModal(false);
      await refreshStudentData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filtered = achievements.filter(
    a => selectedType === 'All' || a.type === selectedType
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Academic Achievements, Hackathons & Honors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase competitive programming wins, peer-reviewed publications, workshops, and extracurricular merits
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setSelectedType('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedType === 'All'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({achievements.length})
        </button>
        {ACHIEVEMENT_TYPES.map(t => {
          const count = achievements.filter(a => a.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {/* Achievements Cards */}
      <div className="space-y-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`bg-white rounded-2xl p-6 border transition hover:shadow-md ${
              ach.verifiedStatus === 'verified'
                ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/20 to-white'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {ach.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ★ {ach.positionOrAward}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {ach.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span><strong>Event:</strong> {ach.eventName}</span>
                    <span><strong>Organized by:</strong> {ach.organizedBy}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {ach.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {ach.verifiedStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by {ach.verifiedBy || 'Faculty'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Under Faculty Audit
                  </span>
                )}

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleOpenEdit(ach)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Edit achievement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ach.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              {ach.description}
            </p>

            {/* Tags */}
            {ach.tags && ach.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {ach.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    <Tag className="w-2.5 h-2.5" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Proof document footer */}
            {ach.proofFileName && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Proof Upload: <strong className="text-slate-700">{ach.proofFileName}</strong></span>
                </div>
                {ach.facultyFeedback && (
                  <span className="text-[11px] text-emerald-800 font-medium italic">
                    Faculty Remarks: "{ach.facultyFeedback}"
                  </span>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add / Edit Achievement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingAchievement ? 'Edit Achievement' : 'Record Achievement'}
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
                <label className="text-xs font-semibold text-slate-700">Achievement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place - Smart India Hackathon (SIH 2024)"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AchievementType }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ACHIEVEMENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Position / Award *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1st Prize, Published First Author, Finalist"
                    value={formData.positionOrAward}
                    onChange={(e) => setFormData(prev => ({ ...prev, positionOrAward: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Event / Contest / Journal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart India Hackathon 2024 / IEEE Access"
                    value={formData.eventName}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Organizing Body / Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. AICTE / IEEE / Google Cloud"
                    value={formData.organizedBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizedBy: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Hackathon, Team Lead, IoT, IEEE"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Summary & Project Deliverable</label>
                <textarea
                  rows={3}
                  placeholder="Describe team size, problem statement solved, and judging feedback..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Upload Proof Document */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Upload Citation Certificate or Proof (PDF / Image)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    Select Proof File
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.proofFileName && (
                    <span className="text-xs text-emerald-700 font-medium truncate max-w-xs">
                      ✓ {formData.proofFileName}
                    </span>
                  )}
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
                  {editingAchievement ? 'Save Changes' : 'Submit Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
