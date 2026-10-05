import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  GraduationCap,
  Award,
  FolderGit2,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  FileBadge,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Search
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    studentProfile,
    skills,
    projects,
    internships,
    certifications,
    achievements,
    setActiveTab,
    setPublicViewSlug,
    goToSearch
  } = useAuth();

  if (!studentProfile) {
    return <div className="p-8 text-center text-slate-500">Loading student profile...</div>;
  }

  const verifiedSkillsCount = skills.filter((s) => s.isVerified).length;
  const verifiedCertsCount = certifications.filter((c) => c.verifiedStatus === 'verified').length;
  const pendingCertsCount = certifications.filter((c) => c.verifiedStatus === 'pending').length;
  const verifiedProjectsCount = projects.filter((p) => p.verifiedStatus === 'verified').length;
  const pendingProjectsCount = projects.filter((p) => p.verifiedStatus === 'pending').length;
  const verifiedAchievementsCount = achievements.filter((a) => a.verifiedStatus === 'verified').length;

  const totalVerifiedItems = verifiedSkillsCount + verifiedCertsCount + verifiedProjectsCount + verifiedAchievementsCount;
  const totalPendingItems = pendingCertsCount + pendingProjectsCount + achievements.filter(a => a.verifiedStatus === 'pending').length;

  // Placement readiness score calculation
  const readinessScore = Math.min(100, Math.round(
    (studentProfile.cgpa * 4.5) +
    (projects.length * 6) +
    (verifiedCertsCount * 8) +
    (internships.length * 10) +
    (verifiedAchievementsCount * 5)
  ));

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Welcome back, {studentProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Profile Active
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                {studentProfile.degree} • Semester {studentProfile.currentSemester} ({studentProfile.department})
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Roll No: <strong className="text-slate-200 font-mono">{studentProfile.rollNo}</strong></span>
                <span>Batch: <strong className="text-slate-200">{studentProfile.batch}</strong></span>
                <span>CGPA: <strong className="text-emerald-400 font-bold text-sm">{studentProfile.cgpa} / 10.0</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => goToSearch()}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition cursor-pointer"
              title="Search and load another student by register number"
            >
              <Search className="w-3.5 h-3.5 text-indigo-300" />
              Change Student
            </button>
            <button
              onClick={() => setPublicViewSlug(studentProfile.portfolioSlug)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Portfolio
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
            >
              <FileBadge className="w-3.5 h-3.5 text-indigo-400" />
              Build Resume
            </button>
            <button
              onClick={() => setActiveTab('career-ai')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-medium text-xs border border-purple-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Career Scan
            </button>
          </div>
        </div>

        {/* Background glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Skills Card */}
        <div
          onClick={() => setActiveTab('skills')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{skills.length}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {verifiedSkillsCount} verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 5 technical domains</p>
        </div>

        {/* Projects Card */}
        <div
          onClick={() => setActiveTab('projects')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Projects Built</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{projects.length}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {verifiedProjectsCount} verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{projects.filter(p => p.featured).length} featured showcases</p>
        </div>

        {/* Certifications Card */}
        <div
          onClick={() => setActiveTab('certifications')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Certifications</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{certifications.length}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> {verifiedCertsCount} verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingCertsCount > 0 ? `${pendingCertsCount} pending audit` : 'All audited'}
          </p>
        </div>

        {/* Internships & Achievements */}
        <div
          onClick={() => setActiveTab('achievements')}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Achievements</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{achievements.length}</span>
            <span className="text-xs text-slate-500 font-medium">
              +{internships.length} internships
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Hackathons, papers & honors</p>
        </div>

      </div>

      {/* Two Column Layout: Verification & Readiness Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Campus Placement & Readiness Index */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Placement Readiness Index
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                Tier-1 Eligible
              </span>
            </div>

            <div className="my-4 text-center">
              <div className="inline-flex items-center justify-center relative w-32 h-32">
                {/* Circular ring indicator */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${readinessScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900">{readinessScore}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ready</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Academic Record (CGPA):</span>
                <strong className="text-slate-800">{studentProfile.cgpa} / 10</strong>
              </div>
              <div className="flex justify-between">
                <span>Verified Credentials:</span>
                <strong className="text-emerald-600">{totalVerifiedItems} items verified</strong>
              </div>
              <div className="flex justify-between">
                <span>Target Specialization:</span>
                <strong className="text-slate-800">{studentProfile.targetRole || 'Full Stack Engineer'}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('career-ai')}
            className="w-full mt-5 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            Run Detailed Skill Gap Analysis
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Faculty Verification Status Center */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Credential Audit & Faculty Approvals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official tracking for college semester accreditation and placement dossiers
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-700">
              {totalPendingItems} Pending Audit
            </span>
          </div>

          <div className="space-y-3">
            {/* Recent Items with Status */}
            {certifications.slice(0, 2).map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{cert.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {cert.issuingOrganization} • Credential ID: {cert.credentialId || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cert.verifiedStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Faculty Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-800 text-[11px]">
                      <Clock className="w-3 h-3" /> Under Review
                    </span>
                  )}
                </div>
              </div>
            ))}

            {projects.slice(0, 1).map((proj) => (
              <div
                key={proj.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{proj.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Tech Project • Mentor: {proj.mentorName || 'Department Faculty'}
                    </div>
                  </div>
                </div>
                <div>
                  {proj.verifiedStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Verified by {proj.verifiedBy?.split(' ')[1] || 'Faculty'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-amber-100 text-amber-800 text-[11px]">
                      <Clock className="w-3 h-3" /> Review Pending
                    </span>
                  )}
                </div>
              </div>
            ))}

            {achievements.slice(0, 1).map((ach) => (
              <div
                key={ach.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{ach.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {ach.eventName} • {ach.positionOrAward}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice Banner */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              Need to verify a new hackathon, certificate, or internship?
            </span>
            <button
              onClick={() => setActiveTab('certifications')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline"
            >
              Submit Proof →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
