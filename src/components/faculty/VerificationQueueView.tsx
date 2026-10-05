import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { VerificationRequest } from '../../types/index.ts';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  ExternalLink,
  Eye,
  Filter,
  RefreshCw,
  Search,
  Building,
  User,
  X,
  MessageSquare
} from 'lucide-react';

export const VerificationQueueView: React.FC = () => {
  const { currentUser, refreshPendingCount, showToast } = useAuth();

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Review modal
  const [reviewingItem, setReviewingItem] = useState<VerificationRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'requested_revision'>('approved');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Proof preview
  const [inspectingProof, setInspectingProof] = useState<string | null>(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await api.getPendingVerifications();
      if (res.success) {
        setRequests(res.requests);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch verification queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const openReviewModal = (req: VerificationRequest, action: 'approved' | 'rejected' | 'requested_revision') => {
    setReviewingItem(req);
    setReviewAction(action);
    setReviewComment(
      action === 'approved'
        ? 'Verified against official department guidelines and accredited criteria.'
        : action === 'requested_revision'
        ? 'Please provide a clear scan of the certificate with verifiable serial number.'
        : 'Submission does not meet accredited academic criteria.'
    );
  };

  const handleProcessReview = async () => {
    if (!reviewingItem || !currentUser) return;
    setSubmittingReview(true);
    try {
      const res = await api.reviewVerification({
        itemType: reviewingItem.itemType,
        itemId: reviewingItem.itemId,
        action: reviewAction,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        comment: reviewComment
      });

      if (res.success) {
        showToast(`Submission ${reviewAction} successfully!`, 'success');
        setReviewingItem(null);
        await loadPending();
        await refreshPendingCount();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to process verification', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesType = selectedType === 'All' || req.itemType === selectedType;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentRollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Faculty Credential Verification Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {requests.length} Pending
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review student submissions, inspect citations and documents, and issue cryptographically verifiable approvals
          </p>
        </div>

        <button
          onClick={loadPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedType('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'All' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Submissions ({requests.length})
          </button>
          <button
            onClick={() => setSelectedType('certification')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'certification' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Certifications ({requests.filter(r => r.itemType === 'certification').length})
          </button>
          <button
            onClick={() => setSelectedType('internship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'internship' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Internships ({requests.filter(r => r.itemType === 'internship').length})
          </button>
          <button
            onClick={() => setSelectedType('achievement')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'achievement' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Achievements ({requests.filter(r => r.itemType === 'achievement').length})
          </button>
          <button
            onClick={() => setSelectedType('project')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === 'project' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Projects ({requests.filter(r => r.itemType === 'project').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
          <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Verification Queue Clear</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All submitted credentials, hackathon honors, and certificates have been audited.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Item Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {req.itemType}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Submitted: {req.submissionDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {req.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium">
                  {req.subtitle}
                </p>

                {/* Student details pill */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    {req.studentName}
                  </span>
                  <span>Roll: <strong className="font-mono text-slate-700">{req.studentRollNo}</strong></span>
                  <span>Dept: <strong className="text-slate-700">{req.department}</strong></span>
                </div>

                {/* Evidence / Document link if available */}
                {(req.proofFileName || req.proofUrl) && (
                  <div className="flex items-center gap-2 pt-2 text-xs">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-slate-600">Attached Proof: <strong>{req.proofFileName || 'Documentation File'}</strong></span>
                    {req.proofUrl && (
                      <button
                        onClick={() => setInspectingProof(req.proofUrl!)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline ml-1"
                      >
                        Inspect Proof
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons for Faculty */}
              <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                <button
                  onClick={() => openReviewModal(req, 'approved')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve & Stamp
                </button>

                <button
                  onClick={() => openReviewModal(req, 'requested_revision')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Request Revision
                </button>

                <button
                  onClick={() => openReviewModal(req, 'rejected')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold text-xs transition"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {reviewAction === 'approved' ? 'Confirm Credential Approval' :
                   reviewAction === 'requested_revision' ? 'Request Revision from Student' :
                   'Reject Credential Submission'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {reviewingItem.title} ({reviewingItem.studentName})
                </p>
              </div>
              <button
                onClick={() => setReviewingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div><strong>Student:</strong> {reviewingItem.studentName} ({reviewingItem.studentRollNo})</div>
                <div><strong>Category:</strong> {reviewingItem.itemType}</div>
                <div><strong>Submitting Date:</strong> {reviewingItem.submissionDate}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Faculty Feedback & Audit Commentary
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full mt-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add notes explaining your audit decision..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessReview}
                disabled={submittingReview}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition ${
                  reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  reviewAction === 'requested_revision' ? 'bg-amber-600 hover:bg-amber-500' :
                  'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {submittingReview ? 'Recording...' : `Confirm ${reviewAction.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Inspection Modal */}
      {inspectingProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Proof Document Inspection</h3>
              <button
                onClick={() => setInspectingProof(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 max-h-[500px] overflow-auto rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-center">
              {inspectingProof.startsWith('http') || inspectingProof.startsWith('data:image/') ? (
                <img
                  src={inspectingProof}
                  alt="Proof document"
                  className="max-h-[450px] object-contain rounded-lg"
                />
              ) : (
                <div className="text-center p-6">
                  <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">Encrypted PDF / External Credential File</p>
                  <a
                    href={inspectingProof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Document
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setInspectingProof(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
