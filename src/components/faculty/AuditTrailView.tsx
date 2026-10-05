import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { VerificationLog } from '../../types/index.ts';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Clock,
  RefreshCw
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getVerificationLogs();
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to fetch verification audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Institutional Verification Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable compliance log of faculty audits, credential approvals, and revisions (NAAC / NBA compliance)
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Trail
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Credential Type</th>
                <th className="px-6 py-4">Audited By</th>
                <th className="px-6 py-4">Audit Commentary</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    {log.action === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Approved
                      </span>
                    ) : log.action === 'requested_revision' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Revision Req
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {log.studentName}
                  </td>
                  <td className="px-6 py-4 uppercase font-bold text-[10px] text-slate-500">
                    {log.itemType}
                  </td>
                  <td className="px-6 py-4 text-slate-800">
                    {log.reviewerName}
                  </td>
                  <td className="px-6 py-4 italic text-slate-600 max-w-xs truncate">
                    "{log.comment}"
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
