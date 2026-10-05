import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  FileText,
  Globe,
  FileBadge,
  Sparkles,
  ShieldCheck,
  Users,
  History,
  BarChart3,
  TrendingUp,
  ClipboardCheck,
  Building2,
  CheckCircle2,
  Search
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  count?: number;
  countColor?: string;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, pendingVerificationsCount, studentProfile } = useAuth();

  const studentNavItems: NavItem[] = [
    { id: 'search', label: 'Search Student', icon: Search, badge: 'Lookup' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Academic Profile', icon: User },
    { id: 'skills', label: 'Skills Inventory', icon: Cpu },
    { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 },
    { id: 'internships', label: 'Internships & Work', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'achievements', label: 'Achievements & Awards', icon: Trophy },
    { id: 'documents', label: 'Document Locker', icon: FileText },
    { id: 'portfolio', label: 'Live Portfolio Builder', icon: Globe, highlight: true },
    { id: 'resume', label: 'ATS Resume Builder', icon: FileBadge, highlight: true },
    { id: 'career-ai', label: 'AI Skill Gap Analyzer', icon: Sparkles, badge: 'AI' }
  ];

  const facultyNavItems: NavItem[] = [
    {
      id: 'verification-queue',
      label: 'Verification Queue',
      icon: ShieldCheck,
      count: pendingVerificationsCount,
      countColor: 'bg-amber-500 text-white'
    },
    { id: 'student-directory', label: 'Student Directory', icon: Users },
    { id: 'audit-trail', label: 'Verification Audit Logs', icon: History },
    { id: 'dept-analytics', label: 'Department Analytics', icon: BarChart3 }
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Institution Overview', icon: LayoutDashboard },
    { id: 'student-directory', label: 'Student Master Roster', icon: Users },
    { id: 'placement-index', label: 'Placement Readiness Index', icon: TrendingUp },
    { id: 'audit-trail', label: 'Compliance Audit Logs', icon: ClipboardCheck },
    { id: 'dept-analytics', label: 'Department Analytics', icon: Building2 }
  ];

  const navItems = role === 'student' ? studentNavItems : role === 'faculty' ? facultyNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 no-print overflow-y-auto border-r border-slate-800">
      
      {/* Current Role Banner in Sidebar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Active Workspace
        </div>
        <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
          <span className="capitalize">{role} Portal</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        {role === 'student' && studentProfile && (
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between bg-slate-800/50 p-2 rounded-lg">
            <span>Roll: <span className="text-white font-mono">{studentProfile.rollNo}</span></span>
            <span className="text-emerald-400 font-bold">{studentProfile.cgpa} CGPA</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.countColor || 'bg-indigo-500 text-white'}`}
                >
                  {item.count}
                </span>
              )}

              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Verified System
        </div>
        <p className="leading-relaxed">
          Accreditation compliant (NAAC / NBA Criteria 2 & 5 verified).
        </p>
      </div>

    </aside>
  );
};
