import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Certification } from '../../types/index.ts';
import {
  Award,
  Plus,
  ExternalLink,
  ShieldCheck,
  Clock,
  Calendar,
  Building2,
  FileText,
  Trash2,
  Edit2,
  X,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

export const CertificationsView: React.FC = () => {
  const { currentUser, certifications, refreshStudentData, showToast } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    skillsAcquired: string;
    certificateFileName: string;
    certificateFile: string;
  }>({
    title: '',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    skillsAcquired: 'Cloud Architecture, VPC, IAM, DynamoDB',
    certificateFileName: '',
    certificateFile: ''
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuingOrganization: 'Amazon Web Services',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      skillsAcquired: '',
      certificateFileName: '',
      certificateFile: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      skillsAcquired: cert.skillsAcquired.join(', '),
      certificateFileName: cert.certificateFileName || '',
      certificateFile: cert.certificateFile || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      const res = await api.deleteCertification(id);
      if (res.success) {
        showToast('Certification removed', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete certification', 'error');
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
          certificateFile: reader.result as string
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
      issuingOrganization: formData.issuingOrganization,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate || undefined,
      credentialId: formData.credentialId,
      credentialUrl: formData.credentialUrl,
      skillsAcquired: formData.skillsAcquired.split(',').map(s => s.trim()).filter(Boolean),
      certificateFileName: formData.certificateFileName,
      certificateFile: formData.certificateFile
    };

    try {
      if (editingCert) {
        await api.updateCertification(editingCert.id, payload);
        showToast('Certification updated', 'success');
      } else {
        await api.addCertification(payload);
        showToast('Certification submitted to Faculty Verification Queue', 'success');
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
            Professional Certifications & Licenses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Industry recognized credentials verified by departmental academic audit
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className={`bg-white rounded-2xl p-5 border transition hover:shadow-lg flex flex-col justify-between ${
              cert.verifiedStatus === 'verified'
                ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/20 to-white'
                : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>

                <div>
                  {cert.verifiedStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {cert.title}
              </h3>
              <p className="text-xs font-semibold text-indigo-700 mt-1">
                {cert.issuingOrganization}
              </p>

              <div className="space-y-1.5 my-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Issued:</span>
                  <strong className="text-slate-700">{cert.issueDate}</strong>
                </div>
                {cert.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span>Expires:</span>
                    <strong className="text-slate-700">{cert.expiryDate}</strong>
                  </div>
                )}
                {cert.credentialId && (
                  <div className="flex items-center justify-between">
                    <span>ID:</span>
                    <strong className="text-slate-700 font-mono text-[10px] truncate max-w-[130px]">
                      {cert.credentialId}
                    </strong>
                  </div>
                )}
              </div>

              {/* Skills acquired */}
              {cert.skillsAcquired && cert.skillsAcquired.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {cert.skillsAcquired.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Verified By Note */}
              {cert.verifiedStatus === 'verified' && cert.verifiedBy && (
                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span>Audited by {cert.verifiedBy}</span>
                </div>
              )}
            </div>

            {/* Footer with proof & links */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify
                  </a>
                )}
                {cert.certificateFileName && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={cert.certificateFileName}>
                    📄 {cert.certificateFileName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Certification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCert ? 'Edit Certification' : 'Submit Certificate for Verification'}
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
                <label className="text-xs font-semibold text-slate-700">Certification Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect Associate"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services, Google Cloud, Meta, Coursera"
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuingOrganization: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Credential ID</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS-SAA-904128"
                    value={formData.credentialId}
                    onChange={(e) => setFormData(prev => ({ ...prev, credentialId: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Verification URL (Credly / Coursera)</label>
                  <input
                    type="url"
                    placeholder="https://credly.com/badges/..."
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
                    className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Competencies / Skills Acquired</label>
                <input
                  type="text"
                  placeholder="Cloud Architecture, Microservices, VPC, DynamoDB"
                  value={formData.skillsAcquired}
                  onChange={(e) => setFormData(prev => ({ ...prev, skillsAcquired: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Upload Certificate File */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Upload Certificate File (PDF / Image)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    Select PDF / Image
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
                  {editingCert ? 'Save Changes' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
