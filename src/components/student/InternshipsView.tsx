import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Internship } from '../../types/index.ts';
import {
  Briefcase,
  Plus,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  Trash2,
  Edit2,
  X,
  UploadCloud
} from 'lucide-react';

export const InternshipsView: React.FC = () => {
  const { currentUser, internships, refreshStudentData, showToast } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);

  const [formData, setFormData] = useState<{
    company: string;
    role: string;
    location: string;
    locationType: 'On-site' | 'Remote' | 'Hybrid';
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    stipend: string;
    description: string;
    technologies: string;
    certificateFileName: string;
    certificateDoc: string;
  }>({
    company: '',
    role: '',
    location: 'Bangalore, India',
    locationType: 'Hybrid',
    startDate: '',
    endDate: '',
    isCurrent: false,
    stipend: '₹40,000 / month',
    description: '',
    technologies: 'Go, Docker, Redis, Kubernetes',
    certificateFileName: '',
    certificateDoc: ''
  });

  const handleOpenAdd = () => {
    setEditingInternship(null);
    setFormData({
      company: '',
      role: '',
      location: 'Bangalore, India',
      locationType: 'Hybrid',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: false,
      stipend: '₹50,000 / month',
      description: '',
      technologies: 'Go, PostgreSQL, Redis, Docker',
      certificateFileName: '',
      certificateDoc: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      company: internship.company,
      role: internship.role,
      location: internship.location,
      locationType: internship.locationType,
      startDate: internship.startDate,
      endDate: internship.endDate,
      isCurrent: internship.isCurrent,
      stipend: internship.stipend || '',
      description: internship.description,
      technologies: internship.technologies.join(', '),
      certificateFileName: internship.certificateFileName || '',
      certificateDoc: internship.certificateDoc || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this internship record?')) return;
    try {
      const res = await api.deleteInternship(id);
      if (res.success) {
        showToast('Internship record removed', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete internship', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          certificateFileName: file.name,
          certificateDoc: reader.result as string
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
      company: formData.company,
      role: formData.role,
      location: formData.location,
      locationType: formData.locationType,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? 'Present' : formData.endDate,
      isCurrent: formData.isCurrent,
      stipend: formData.stipend,
      description: formData.description,
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
      certificateFileName: formData.certificateFileName,
      certificateDoc: formData.certificateDoc
    };

    try {
      if (editingInternship) {
        await api.updateInternship(editingInternship.id, payload);
        showToast('Internship record updated', 'success');
      } else {
        await api.addInternship(payload);
        showToast('Internship added & submitted for faculty audit', 'success');
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
            Internships & Industrial Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official records of corporate internships, research appointments, and placement offers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Internship
        </button>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {internships.map((internship) => (
          <div
            key={internship.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {internship.role}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      @ {internship.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {internship.startDate} — {internship.isCurrent ? 'Present' : internship.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {internship.location} ({internship.locationType})
                    </span>
                    {internship.stipend && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <DollarSign className="w-3.5 h-3.5" />
                        {internship.stipend}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="flex items-center gap-2">
                {internship.verifiedStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by {internship.verifiedBy || 'Faculty'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Pending Verification
                  </span>
                )}

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleOpenEdit(internship)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Edit internship"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete internship"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              {internship.description}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {internship.technologies.map(t => (
                <span
                  key={t}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Attached Proof Document */}
            {internship.certificateFileName && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Proof Document: <strong className="text-slate-700">{internship.certificateFileName}</strong></span>
                </div>
                {internship.facultyFeedback && (
                  <span className="text-[11px] text-slate-600 italic">
                    Note: "{internship.facultyFeedback}"
                  </span>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add / Edit Internship Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingInternship ? 'Edit Internship Record' : 'Add New Internship'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Razorpay, Microsoft, Siemens"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineering Intern"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Location (City / Country)</label>
                  <input
                    type="text"
                    placeholder="Bangalore, India"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Work Mode</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value as any }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    disabled={formData.isCurrent}
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Stipend / Compensation</label>
                  <input
                    type="text"
                    placeholder="₹50,000 / month"
                    value={formData.stipend}
                    onChange={(e) => setFormData(prev => ({ ...prev, stipend: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Key Responsibilities & Deliverables *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your contributions, systems developed, and business impact..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  placeholder="Go, Docker, Kafka, Redis, AWS"
                  value={formData.technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Document upload */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Upload Internship Certificate or Offer Letter (PDF / Image)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    Choose Document
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.certificateFileName && (
                    <span className="text-xs text-emerald-700 font-medium truncate max-w-xs">
                      ✓ {formData.certificateFileName}
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
                  {editingInternship ? 'Save Changes' : 'Submit Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
