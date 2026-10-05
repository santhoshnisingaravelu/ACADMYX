import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { StudentProfile } from '../../types/index.ts';
import { StudentDetailModal } from './StudentDetailModal.tsx';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  FolderGit2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  FileBadge
} from 'lucide-react';

export const StudentDirectoryView: React.FC = () => {
  const { setPublicViewSlug, showToast } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [minCgpa, setMinCgpa] = useState<number>(0);
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getAllStudents({
        department: selectedDept !== 'All' ? selectedDept : undefined,
        search: searchQuery || undefined,
        minCgpa: minCgpa > 0 ? minCgpa : undefined
      });
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load student directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDept, minCgpa]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Master Directory & Academic Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, inspect, and evaluate student academic profiles, skill verifications, and portfolios
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, roll no, specialization, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
            </select>
          </div>

          {/* Min CGPA Filter */}
          <div className="w-full md:w-48 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Min CGPA:</span>
            <select
              value={minCgpa}
              onChange={(e) => setMinCgpa(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-emerald-800"
            >
              <option value={0}>Any CGPA</option>
              <option value={7.5}>7.5+ CGPA</option>
              <option value={8.0}>8.0+ CGPA</option>
              <option value={8.5}>8.5+ CGPA</option>
              <option value={9.0}>9.0+ CGPA (Elite)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Directory Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-slate-600">Querying student records...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No students match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try lowering the minimum CGPA or clearing search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {students.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-50 border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {st.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        Roll: <strong className="text-slate-800">{st.rollNo}</strong>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        {st.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 inline-block">
                      {st.cgpa} CGPA
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Semester {st.currentSemester}</div>
                  </div>
                </div>

                {st.targetRole && (
                  <p className="text-xs text-indigo-700 font-semibold bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100 mb-4">
                    🎯 Specialization: {st.targetRole}
                  </p>
                )}

                {/* Metrics Pill Row */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs py-3 border-y border-slate-100">
                  <div className="p-1">
                    <span className="text-xs font-bold text-slate-900 block">{st.metrics?.skillsCount || 0}</span>
                    <span className="text-[10px] text-slate-500">Skills ({st.metrics?.verifiedSkillsCount || 0} ver)</span>
                  </div>
                  <div className="p-1">
                    <span className="text-xs font-bold text-slate-900 block">{st.metrics?.projectsCount || 0}</span>
                    <span className="text-[10px] text-slate-500">Projects</span>
                  </div>
                  <div className="p-1">
                    <span className="text-xs font-bold text-slate-900 block">{st.metrics?.internshipsCount || 0}</span>
                    <span className="text-[10px] text-slate-500">Internships</span>
                  </div>
                  <div className="p-1">
                    <span className="text-xs font-bold text-emerald-700 block">{st.metrics?.certsCount || 0}</span>
                    <span className="text-[10px] text-slate-500">Certs</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-2">
                <button
                  onClick={() => setPublicViewSlug(st.portfolioSlug)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Portfolio
                </button>

                <button
                  onClick={() => setInspectUserId(st.userId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Full Dossier
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Inspect Student Dossier Modal */}
      {inspectUserId && (
        <StudentDetailModal
          userId={inspectUserId}
          onClose={() => setInspectUserId(null)}
          onRefresh={loadStudents}
        />
      )}

    </div>
  );
};
