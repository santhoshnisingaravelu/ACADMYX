import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  StudentProfile,
  Skill,
  Project,
  Internship,
  Certification,
  AcademicAchievement,
  StudentDocument,
  PortfolioConfig
} from '../types/index.ts';
import { api } from '../services/api.ts';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  role: 'student' | 'faculty' | 'admin';
  allUsers: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchStudentByRegisterNumber: (regNo: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  goToSearch: () => void;
  switchUser: (userId: string) => Promise<void>;
  updateStudentProfile: (data: Partial<StudentProfile>) => Promise<void>;
  refreshStudentData: () => Promise<void>;
  skills: Skill[];
  projects: Project[];
  internships: Internship[];
  certifications: Certification[];
  achievements: AcademicAchievement[];
  documents: StudentDocument[];
  portfolioConfig: PortfolioConfig;
  setPortfolioConfig: (cfg: PortfolioConfig) => void;
  savePortfolioConfig: (cfg: PortfolioConfig) => Promise<void>;
  pendingVerificationsCount: number;
  refreshPendingCount: () => Promise<void>;
  publicViewSlug: string | null;
  setPublicViewSlug: (slug: string | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPortfolioConfig: PortfolioConfig = {
  theme: 'modern-tech',
  tagline: 'Designing Scalable Distributed Systems & Web Experiences',
  customIntro: 'Welcome to my academic credentials and engineering portfolio.',
  accentColor: '#4f46e5',
  visibleSections: {
    skills: true,
    projects: true,
    internships: true,
    certifications: true,
    achievements: true,
    contact: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<AcademicAchievement[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioConfig>(defaultPortfolioConfig);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState<number>(0);
  const [publicViewSlug, setPublicViewSlug] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to parse register number from pathname or hash
  const parseRegisterNumberFromUrl = useCallback((): string | null => {
    // Check pathname: e.g. /student/21CS042
    const pathMatch = window.location.pathname.match(/\/student\/([A-Za-z0-9]+)/i);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1].trim().toUpperCase();
    }
    // Check hash: e.g. #student/21CS042 or #/student/21CS042
    const hashMatch = window.location.hash.match(/#(?:\/)?student\/([A-Za-z0-9]+)/i);
    if (hashMatch && hashMatch[1]) {
      return hashMatch[1].trim().toUpperCase();
    }
    return null;
  }, []);

  const searchStudentByRegisterNumberInternal = async (
    rawRegNo: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const cleanRegNo = rawRegNo.trim().toUpperCase();
    if (!cleanRegNo) {
      return { success: false, message: 'Please enter a register number.' };
    }

    try {
      const res = await api.getStudentByRegisterNo(cleanRegNo);
      if (res.success && res.student) {
        setStudentProfile(res.student);
        if (res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser({
            id: res.student.userId,
            name: res.student.name,
            email: res.student.email,
            role: 'student',
            avatar: res.student.avatar,
            department: res.student.department,
            collegeId: res.student.rollNo,
            phone: res.student.phone
          });
        }

        setSkills(res.skills || []);
        setProjects(res.projects || []);
        setInternships(res.internships || []);
        setCertifications(res.certifications || []);
        setAchievements(res.achievements || []);
        setDocuments(res.documents || []);
        if (res.portfolioConfig) {
          setPortfolioConfig(res.portfolioConfig);
        }

        setActiveTab('dashboard');

        // Sync URL without hard reload
        if (window.location.pathname !== `/student/${cleanRegNo}`) {
          window.history.pushState(null, '', `/student/${cleanRegNo}`);
        }
        if (window.location.hash !== `#student/${cleanRegNo}`) {
          window.location.hash = `student/${cleanRegNo}`;
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: 'Student Not Found',
          error: 'No student record was found for this register number.'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.data?.message || err.message || 'Student Not Found',
        error: err.data?.error || 'No student record was found for this register number.'
      };
    }
  };

  const goToSearch = useCallback(() => {
    setActiveTab('search');
    if (window.location.pathname.startsWith('/student/')) {
      window.history.pushState(null, '', '/');
    }
    if (window.location.hash.startsWith('#student/')) {
      window.location.hash = '';
    }
  }, []);

  // Fetch all users list on mount and check direct profile navigation
  useEffect(() => {
    const initUsers = async () => {
      try {
        const res = await api.getUsers();
        if (res.success && res.users.length > 0) {
          setAllUsers(res.users);

          // Check if direct student register number in URL
          const directReg = parseRegisterNumberFromUrl();
          if (directReg) {
            const searchResult = await searchStudentByRegisterNumberInternal(directReg);
            if (!searchResult.success) {
              const fallbackStudent = res.users.find(u => u.collegeId === '21CS042') || res.users[0];
              setCurrentUser(fallbackStudent);
              setActiveTab('search');
            }
          } else {
            // Default initial state for student portal: Open Search Student Profile screen
            const fallbackStudent = res.users.find(u => u.collegeId === '21CS042') || res.users[0];
            setCurrentUser(fallbackStudent);
            setActiveTab('search');
          }
        }
      } catch (err) {
        console.error('Failed to load initial users:', err);
        showToast('Error loading application data', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    initUsers();
  }, [parseRegisterNumberFromUrl]);

  // Listen to popstate and hashchange for direct browser back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const reg = parseRegisterNumberFromUrl();
      if (reg) {
        searchStudentByRegisterNumberInternal(reg);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [parseRegisterNumberFromUrl]);

  const refreshPendingCount = useCallback(async () => {
    try {
      const res = await api.getPendingVerifications();
      if (res.success) {
        setPendingVerificationsCount(res.count);
      }
    } catch (err) {
      console.error('Failed to refresh pending count:', err);
    }
  }, []);

  const refreshStudentData = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (currentUser.role === 'student') {
        const fullData = await api.getStudentFull(currentUser.id);
        if (fullData.success) {
          setStudentProfile(fullData.student);
          setSkills(fullData.skills || []);
          setProjects(fullData.projects || []);
          setInternships(fullData.internships || []);
          setCertifications(fullData.certifications || []);
          setAchievements(fullData.achievements || []);
          setDocuments(fullData.documents || []);
          if (fullData.portfolioConfig) {
            setPortfolioConfig(fullData.portfolioConfig);
          }
        }
      }
      await refreshPendingCount();
    } catch (err) {
      console.error('Failed to refresh student details:', err);
    }
  }, [currentUser, refreshPendingCount]);

  const switchUserInternal = async (user: User) => {
    setCurrentUser(user);
    if (user.role === 'student') {
      setActiveTab('dashboard');
      try {
        const fullData = await api.getStudentFull(user.id);
        if (fullData.success) {
          setStudentProfile(fullData.student);
          setSkills(fullData.skills || []);
          setProjects(fullData.projects || []);
          setInternships(fullData.internships || []);
          setCertifications(fullData.certifications || []);
          setAchievements(fullData.achievements || []);
          setDocuments(fullData.documents || []);
          if (fullData.portfolioConfig) {
            setPortfolioConfig(fullData.portfolioConfig);
          }
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
      }
    } else if (user.role === 'faculty') {
      setActiveTab('verification-queue');
      setStudentProfile(null);
    } else if (user.role === 'admin') {
      setActiveTab('admin-dashboard');
      setStudentProfile(null);
    }
    await refreshPendingCount();
  };

  const switchUser = async (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setIsLoading(true);
      await switchUserInternal(user);
      setIsLoading(false);
      showToast(`Switched profile to ${user.name} (${user.role.toUpperCase()})`, 'info');
    }
  };

  const updateStudentProfile = async (data: Partial<StudentProfile>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    try {
      const res = await api.updateProfile(currentUser.id, data);
      if (res.success) {
        setStudentProfile(res.profile);
        showToast('Profile updated successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const savePortfolioConfig = async (cfg: PortfolioConfig) => {
    if (!currentUser) return;
    try {
      const res = await api.savePortfolioConfig(currentUser.id, cfg);
      if (res.success) {
        setPortfolioConfig(res.config);
        showToast('Portfolio configuration saved!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save portfolio config', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        role: currentUser?.role || 'student',
        allUsers,
        activeTab,
        setActiveTab,
        searchStudentByRegisterNumber: searchStudentByRegisterNumberInternal,
        goToSearch,
        switchUser,
        updateStudentProfile,
        refreshStudentData,
        skills,
        projects,
        internships,
        certifications,
        achievements,
        documents,
        portfolioConfig,
        setPortfolioConfig,
        savePortfolioConfig,
        pendingVerificationsCount,
        refreshPendingCount,
        publicViewSlug,
        setPublicViewSlug,
        toasts,
        showToast,
        removeToast,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
