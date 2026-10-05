import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { CareerAnalysisResult } from '../../types/index.ts';
import {
  Sparkles,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';

const TARGET_ROLES = [
  'Full Stack Cloud & Distributed Systems Engineer',
  'AI / Machine Learning & NLP Specialist',
  'Cloud Infrastructure & DevOps Engineer',
  'Cybersecurity & Application Security Analyst',
  'Embedded Firmware & IoT Systems Engineer',
  'Data Platform & Analytics Engineer'
];

export const CareerAnalyzerView: React.FC = () => {
  const { currentUser, studentProfile, showToast } = useAuth();

  const [selectedRole, setSelectedRole] = useState(
    studentProfile?.targetRole || TARGET_ROLES[0]
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CareerAnalysisResult | null>(null);

  const runAnalysis = async (roleToAnalyze: string) => {
    if (!currentUser) return;
    setAnalyzing(true);
    try {
      const res = await api.analyzeSkills(currentUser.id, roleToAnalyze);
      if (res.success) {
        setAnalysis(res.analysis);
        showToast(`Career audit completed for ${roleToAnalyze}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      runAnalysis(selectedRole);
    }
  }, [currentUser]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-800/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Skill Gap Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Placement Readiness & Career Gap Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              Benchmarks your verified skills, projects, and certifications against top recruitment rubrics.
            </p>
          </div>

          {/* Role selector dropdown & trigger */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                runAnalysis(e.target.value);
              }}
              className="text-xs font-medium px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r} className="text-slate-900">
                  {r}
                </option>
              ))}
            </select>

            <button
              onClick={() => runAnalysis(selectedRole)}
              disabled={analyzing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Scanning...' : 'Re-Analyze'}
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {analyzing ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Evaluating Profile Against Industry Standards...</h3>
            <p className="text-xs text-slate-500 mt-1">Cross-referencing projects, coursework, and target role qualifications.</p>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Top Score & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score Ring Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overall Match Score
              </span>
              <div className="relative w-36 h-36 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${analysis.overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900">{analysis.overallScore}%</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 ${
                    analysis.placementReadiness === 'High' ? 'bg-emerald-100 text-emerald-800' :
                    analysis.placementReadiness === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {analysis.placementReadiness} Readiness
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Target: <strong>{analysis.targetRole}</strong>
              </p>
            </div>

            {/* Executive Assessment */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Executive Placement Assessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {analysis.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-800">Key Strengths Identified:</span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  {analysis.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Missing Critical Skills & Gaps */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Identified Skill Gaps & Recommended Prioritization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.missingSkills.map((gap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{gap.skill}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        gap.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                        gap.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {gap.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{gap.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Project & Certification Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recommended Projects */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Recommended Capstone Projects to Build
              </h3>

              <div className="space-y-3">
                {analysis.recommendedProjects.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.technologies.map(t => (
                        <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-indigo-700 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Certifications & ATS Tips */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-indigo-600" />
                High-Glance Certifications & ATS Tips
              </h3>

              <div>
                <span className="text-xs font-semibold text-slate-700">Target Industry Credentials:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.recommendedCertifications.map((c, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700">ATS Resume Advice:</span>
                <ul className="mt-2 space-y-2 text-xs text-slate-600">
                  {analysis.resumeTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
