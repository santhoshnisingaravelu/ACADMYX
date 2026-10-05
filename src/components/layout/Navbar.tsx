import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  GraduationCap,
  Users,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Award,
  Bell,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Search
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    studentProfile,
    role,
    allUsers,
    switchUser,
    setPublicViewSlug,
    pendingVerificationsCount,
    setActiveTab,
    goToSearch
  } = useAuth();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Portal
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Faculty Reviewer
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Award className="w-3.5 h-3.5" />
            Institutional Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">ACADEMIX</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-600">v2.5</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Student Skills, Portfolio & Achievement Management
              </p>
            </div>
          </div>

          {/* Quick Demo Profile Switcher & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search Student Quick Button for Student Portal */}
            {role === 'student' && (
              <button
                onClick={() => goToSearch()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition text-xs font-semibold shadow-2xs cursor-pointer"
                title="Search student profile by register number"
              >
                <Search className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Search Student</span>
                {studentProfile?.rollNo && (
                  <span className="px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-950 font-mono text-[10px] font-bold">
                    {studentProfile.rollNo}
                  </span>
                )}
              </button>
            )}

            {/* Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition text-sm font-medium text-slate-700 shadow-2xs"
                title="Switch between student, faculty reviewer, and admin personas"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline text-xs text-slate-500">Switch Demo Role:</span>
                <span className="font-semibold text-slate-800">{currentUser?.name.split(' ')[0]}</span>
                {getRoleBadge(role)}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      College Project Demo Personas
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Click any persona to test their specific dashboard & permissions
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {allUsers.map((user) => {
                      const isCurrent = user.id === currentUser?.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                            isCurrent
                              ? 'bg-indigo-50/80 text-indigo-950 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                                {user.name}
                                {isCurrent && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 inline" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                                {user.designation || user.department}
                              </div>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                user.role === 'student'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : user.role === 'faculty'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {user.role.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Public Portfolio Quick Link for Students */}
            {role === 'student' && studentProfile && (
              <button
                onClick={() => setPublicViewSlug(studentProfile.portfolioSlug)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-xs border border-indigo-200 transition shadow-2xs"
                title="View your public portfolio link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Portfolio
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="System Notifications"
              >
                <Bell className="w-5 h-5" />
                {pendingVerificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">System Notifications</span>
                    <span className="text-[10px] text-slate-400">Live feed</span>
                  </div>
                  <div className="px-4 py-3 space-y-2.5 text-xs">
                    {role === 'faculty' && pendingVerificationsCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('verification-queue');
                          setShowNotifications(false);
                        }}
                        className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 cursor-pointer hover:bg-amber-100 transition"
                      >
                        <div className="font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          {pendingVerificationsCount} Submissions Awaiting Audit
                        </div>
                        <p className="text-[11px] text-amber-700 mt-1">
                          Certificates and achievements need your faculty sign-off.
                        </p>
                      </div>
                    )}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                      <div className="font-medium flex items-center gap-1.5 text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        AI Career Assistant Online
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Generate comprehensive ATS resume scans and target role readiness scores.
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <div className="font-medium flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verification Blockchain Engine
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        College cryptographic credential stamping enabled.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentUser?.collegeId}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
