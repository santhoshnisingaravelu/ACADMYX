import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { StudentDashboard } from './components/student/StudentDashboard.tsx';
import { ProfileView } from './components/student/ProfileView.tsx';
import { SkillsView } from './components/student/SkillsView.tsx';
import { ProjectsView } from './components/student/ProjectsView.tsx';
import { InternshipsView } from './components/student/InternshipsView.tsx';
import { CertificationsView } from './components/student/CertificationsView.tsx';
import { AchievementsView } from './components/student/AchievementsView.tsx';
import { DocumentLockerView } from './components/student/DocumentLockerView.tsx';
import { PortfolioGeneratorView } from './components/student/PortfolioGeneratorView.tsx';
import { ResumeBuilderView } from './components/student/ResumeBuilderView.tsx';
import { CareerAnalyzerView } from './components/student/CareerAnalyzerView.tsx';
import { SearchStudentProfileView } from './components/student/SearchStudentProfileView.tsx';
import { VerificationQueueView } from './components/faculty/VerificationQueueView.tsx';
import { StudentDirectoryView } from './components/faculty/StudentDirectoryView.tsx';
import { AuditTrailView } from './components/faculty/AuditTrailView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { PublicPortfolioView } from './components/public/PublicPortfolioView.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    role,
    activeTab,
    publicViewSlug,
    setPublicViewSlug,
    toasts,
    removeToast,
    isLoading
  } = useAuth();

  // Listen for browser hash changes like /#portfolio/aarav-sharma
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#portfolio/')) {
        const slug = hash.replace('#portfolio/', '');
        if (slug) setPublicViewSlug(slug);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setPublicViewSlug]);

  // If in public portfolio view mode
  if (publicViewSlug) {
    return (
      <PublicPortfolioView
        slug={publicViewSlug}
        onClose={() => {
          setPublicViewSlug(null);
          if (window.location.hash.startsWith('#portfolio/')) {
            window.location.hash = '';
          }
        }}
      />
    );
  }

  // Render view based on role & active tab
  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading student workspace...</p>
          </div>
        </div>
      );
    }

    if (role === 'student') {
      switch (activeTab) {
        case 'search':
          return <SearchStudentProfileView />;
        case 'dashboard':
          return <StudentDashboard />;
        case 'profile':
          return <ProfileView />;
        case 'skills':
          return <SkillsView />;
        case 'projects':
          return <ProjectsView />;
        case 'internships':
          return <InternshipsView />;
        case 'certifications':
          return <CertificationsView />;
        case 'achievements':
          return <AchievementsView />;
        case 'documents':
          return <DocumentLockerView />;
        case 'portfolio':
          return <PortfolioGeneratorView />;
        case 'resume':
          return <ResumeBuilderView />;
        case 'career-ai':
          return <CareerAnalyzerView />;
        default:
          return <StudentDashboard />;
      }
    } else if (role === 'faculty') {
      switch (activeTab) {
        case 'verification-queue':
          return <VerificationQueueView />;
        case 'student-directory':
          return <StudentDirectoryView />;
        case 'audit-trail':
          return <AuditTrailView />;
        case 'dept-analytics':
          return <AdminDashboard />;
        default:
          return <VerificationQueueView />;
      }
    } else {
      // Admin
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminDashboard />;
        case 'student-directory':
          return <StudentDirectoryView />;
        case 'placement-index':
          return <AdminDashboard />;
        case 'audit-trail':
          return <AuditTrailView />;
        case 'dept-analytics':
          return <AdminDashboard />;
        default:
          return <AdminDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
