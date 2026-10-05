import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  FolderGit2,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building,
  BarChart3,
  ExternalLink,
  Sparkles,
  Trophy
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setPublicViewSlug, showToast } = useAuth();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setAnalytics(res);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch institutional analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!analytics || !analytics.leaderboard) return;

    const headers = [
      'Roll No',
      'Student Name',
      'Department',
      'CGPA',
      'Skills Count',
      'Projects Count',
      'Verified Certs',
      'Internships Count',
      'Achievements Count',
      'Placement Readiness Score'
    ];

    const rows = analytics.leaderboard.map((s: any) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.department}"`,
      s.cgpa,
      s.skillsCount,
      s.projectsCount,
      s.certsCount,
      s.internshipsCount,
      s.achievementsCount,
      `${s.readinessScore}%`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Institutional_Placement_Readiness_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Accreditation CSV report downloaded!', 'success');
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-600">Aggregating institutional credentials & placement readiness...</p>
      </div>
    );
  }

  const { summary, topSkills, departmentStats, leaderboard } = analytics;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Institutional Academic & Placement Analytics
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              NAAC / NBA Audit Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time credential auditing, department performance index, and campus placement eligibility
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
        >
          <Download className="w-4 h-4" />
          Export Accreditation Report (CSV)
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary?.totalStudents}</div>
          <p className="text-xs text-slate-500 mt-1">Active portfolios across 4 departments</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Institutional Avg CGPA</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{summary?.avgCgpa} / 10</div>
          <p className="text-xs text-slate-500 mt-1">Undergraduate academic performance</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Audited Credentials</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {summary?.verifiedCertifications} / {summary?.totalCertifications}
          </div>
          <p className="text-xs text-slate-500 mt-1">Faculty stamped certificates</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verification Backlog</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary?.pendingVerifications}</div>
          <p className="text-xs text-slate-500 mt-1">Submissions in faculty review queue</p>
        </div>

      </div>

      {/* Two Column Layout: Department Stats & In-Demand Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Stats */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-indigo-600" />
            Departmental Academic & Project Standing
          </h2>

          <div className="space-y-4">
            {Object.entries(departmentStats || {}).map(([dept, data]: [string, any]) => (
              <div key={dept} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{dept}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {data.avgCgpa} Avg CGPA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">{data.count}</span>
                    <span className="text-[10px] text-slate-400 block">Students</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">{data.projects}</span>
                    <span className="text-[10px] text-slate-400 block">Projects</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">{data.verifiedCerts}</span>
                    <span className="text-[10px] text-slate-400 block">Verified Certs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top In-Demand Skills */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            Most Endorsed Technologies
          </h2>

          <div className="space-y-2.5">
            {topSkills?.map((skill: any, idx: number) => (
              <div key={skill.name} className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{skill.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {skill.count} students
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Placement Readiness Leaderboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Campus Placement Readiness Leaderboard
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked automatically via weighted index (CGPA + Verified Projects + Verified Certifications + Internships)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">CGPA</th>
                <th className="px-6 py-3.5">Verified Credentials</th>
                <th className="px-6 py-3.5">Readiness Index</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaderboard?.map((st: any, idx: number) => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-slate-200 text-slate-800' :
                      idx === 2 ? 'bg-amber-50 text-amber-700' :
                      'text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {st.department}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-800">
                    {st.cgpa}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {st.certsCount} Certs • {st.projectsCount} Projs • {st.internshipsCount} Interns
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${st.readinessScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">{st.readinessScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setPublicViewSlug(st.portfolioSlug)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                    >
                      <ExternalLink className="w-3 h-3 text-indigo-600" />
                      Portfolio
                    </button>
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
