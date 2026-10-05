import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { StudentDocument } from '../../types/index.ts';
import {
  FileText,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Calendar,
  FileCheck,
  X,
  Plus
} from 'lucide-react';

const CATEGORIES = [
  'Marksheet',
  'Certificate',
  'ID Proof',
  'Recommendation Letter',
  'Project Report',
  'Resume',
  'Other'
];

export const DocumentLockerView: React.FC = () => {
  const { currentUser, documents, refreshStudentData, showToast } = useAuth();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: any;
    fileName: string;
    fileSize: string;
    fileData: string;
    mimeType: string;
  }>({
    title: '',
    category: 'Marksheet',
    fileName: '',
    fileSize: '',
    fileData: '',
    mimeType: 'application/pdf'
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: sizeMB,
          mimeType: file.type || 'application/pdf',
          fileData: reader.result as string,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.fileData) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    try {
      await api.uploadDocument({
        studentId: currentUser.id,
        title: formData.title,
        category: formData.category,
        fileName: formData.fileName,
        fileSize: formData.fileSize,
        fileData: formData.fileData,
        mimeType: formData.mimeType
      });
      showToast('Document securely uploaded to vault!', 'success');
      setShowUploadModal(false);
      setFormData({
        title: '',
        category: 'Marksheet',
        fileName: '',
        fileSize: '',
        fileData: '',
        mimeType: 'application/pdf'
      });
      await refreshStudentData();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document?')) return;
    try {
      const res = await api.deleteDocument(id);
      if (res.success) {
        showToast('Document deleted', 'info');
        await refreshStudentData();
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleDownload = (doc: StudentDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileData;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Encrypted Document Locker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Secure vault for official semester marksheets, recommendation letters, IDs, and thesis reports
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/20"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {doc.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {doc.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                {doc.fileName}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <span>Size: <strong className="text-slate-700">{doc.fileSize}</strong></span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {doc.uploadedAt}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload to Document Vault</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7th Semester Grade Marksheet"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full mt-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Select File (PDF, Image, DOCX) *</label>
                <div className="mt-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50 transition cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*,.docx,.txt"
                    onChange={handleFileSelect}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {formData.fileName && (
                    <p className="text-xs text-emerald-700 font-semibold mt-2">
                      Selected: {formData.fileName} ({formData.fileSize})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  Upload & Encrypt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document In-Browser Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
                <span className="text-[11px] text-slate-500">{previewDoc.fileName} • {previewDoc.category}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 my-4 overflow-auto rounded-xl bg-slate-100 flex items-center justify-center min-h-[300px] p-4">
              {previewDoc.mimeType.startsWith('image/') || previewDoc.fileData.startsWith('data:image/') || previewDoc.fileData.startsWith('http') ? (
                <img
                  src={previewDoc.fileData}
                  alt={previewDoc.title}
                  className="max-h-[500px] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200 max-w-md">
                  <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">{previewDoc.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF Document ({previewDoc.fileSize})
                  </p>
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File to View
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Uploaded {previewDoc.uploadedAt}</span>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                Download Original
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
