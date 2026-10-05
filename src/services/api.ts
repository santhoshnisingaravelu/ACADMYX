import {
  User,
  StudentProfile,
  Skill,
  Project,
  Internship,
  Certification,
  AcademicAchievement,
  StudentDocument,
  PortfolioConfig,
  VerificationRequest,
  VerificationLog,
  CareerAnalysisResult
} from '../types/index.ts';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth & User Switching
  getUsers: () => request<{ success: boolean; users: User[] }>('/auth/users'),
  login: (email: string, role?: string) =>
    request<{ success: boolean; user: User; profile?: StudentProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    }),
  register: (userData: any) =>
    request<{ success: boolean; user: User; profile?: StudentProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  // Student Profile
  getAllStudents: (filters?: { department?: string; search?: string; minCgpa?: number }) => {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minCgpa) params.append('minCgpa', filters.minCgpa.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ success: boolean; students: (StudentProfile & { metrics: any })[] }>(`/students${query}`);
  },

  getStudentFull: (userId: string) =>
    request<{
      success: boolean;
      user?: User;
      student: StudentProfile;
      skills: Skill[];
      projects: Project[];
      internships: Internship[];
      certifications: Certification[];
      achievements: AcademicAchievement[];
      documents: StudentDocument[];
      portfolioConfig: PortfolioConfig;
    }>(`/students/${userId}`),

  getStudentByRegisterNo: (rollNo: string) =>
    request<{
      success: boolean;
      user?: User;
      student: StudentProfile;
      skills: Skill[];
      projects: Project[];
      internships: Internship[];
      certifications: Certification[];
      achievements: AcademicAchievement[];
      documents: StudentDocument[];
      portfolioConfig: PortfolioConfig;
    }>(`/students/register/${encodeURIComponent(rollNo.trim())}`),

  getPublicPortfolio: (slug: string) =>
    request<{
      success: boolean;
      student: StudentProfile;
      skills: Skill[];
      projects: Project[];
      internships: Internship[];
      certifications: Certification[];
      achievements: AcademicAchievement[];
      portfolioConfig: PortfolioConfig;
    }>(`/students/slug/${slug}`),

  updateProfile: (userId: string, data: Partial<StudentProfile>) =>
    request<{ success: boolean; profile: StudentProfile }>(`/students/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Skills
  getSkills: (studentId?: string) =>
    request<{ success: boolean; skills: Skill[] }>(`/skills${studentId ? `?studentId=${studentId}` : ''}`),
  addSkill: (skill: Partial<Skill>) =>
    request<{ success: boolean; skill: Skill }>('/skills', {
      method: 'POST',
      body: JSON.stringify(skill)
    }),
  updateSkill: (id: string, skill: Partial<Skill>) =>
    request<{ success: boolean; skill: Skill }>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skill)
    }),
  deleteSkill: (id: string) =>
    request<{ success: boolean }>(`/skills/${id}`, {
      method: 'DELETE'
    }),
  endorseSkill: (id: string) =>
    request<{ success: boolean; skill: Skill }>(`/skills/${id}/endorse`, {
      method: 'POST'
    }),

  // Projects
  getProjects: (studentId?: string) =>
    request<{ success: boolean; projects: Project[] }>(`/projects${studentId ? `?studentId=${studentId}` : ''}`),
  addProject: (project: Partial<Project>) =>
    request<{ success: boolean; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    }),
  updateProject: (id: string, project: Partial<Project>) =>
    request<{ success: boolean; project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project)
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE'
    }),

  // Internships
  getInternships: (studentId?: string) =>
    request<{ success: boolean; internships: Internship[] }>(`/internships${studentId ? `?studentId=${studentId}` : ''}`),
  addInternship: (internship: Partial<Internship>) =>
    request<{ success: boolean; internship: Internship }>('/internships', {
      method: 'POST',
      body: JSON.stringify(internship)
    }),
  updateInternship: (id: string, internship: Partial<Internship>) =>
    request<{ success: boolean; internship: Internship }>(`/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(internship)
    }),
  deleteInternship: (id: string) =>
    request<{ success: boolean }>(`/internships/${id}`, {
      method: 'DELETE'
    }),

  // Certifications
  getCertifications: (studentId?: string) =>
    request<{ success: boolean; certifications: Certification[] }>(`/certifications${studentId ? `?studentId=${studentId}` : ''}`),
  addCertification: (cert: Partial<Certification>) =>
    request<{ success: boolean; certification: Certification }>('/certifications', {
      method: 'POST',
      body: JSON.stringify(cert)
    }),
  updateCertification: (id: string, cert: Partial<Certification>) =>
    request<{ success: boolean; certification: Certification }>(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cert)
    }),
  deleteCertification: (id: string) =>
    request<{ success: boolean }>(`/certifications/${id}`, {
      method: 'DELETE'
    }),

  // Achievements
  getAchievements: (studentId?: string) =>
    request<{ success: boolean; achievements: AcademicAchievement[] }>(`/achievements${studentId ? `?studentId=${studentId}` : ''}`),
  addAchievement: (achievement: Partial<AcademicAchievement>) =>
    request<{ success: boolean; achievement: AcademicAchievement }>('/achievements', {
      method: 'POST',
      body: JSON.stringify(achievement)
    }),
  updateAchievement: (id: string, achievement: Partial<AcademicAchievement>) =>
    request<{ success: boolean; achievement: AcademicAchievement }>(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(achievement)
    }),
  deleteAchievement: (id: string) =>
    request<{ success: boolean }>(`/achievements/${id}`, {
      method: 'DELETE'
    }),

  // Documents
  getDocuments: (studentId?: string) =>
    request<{ success: boolean; documents: StudentDocument[] }>(`/documents${studentId ? `?studentId=${studentId}` : ''}`),
  uploadDocument: (doc: Partial<StudentDocument>) =>
    request<{ success: boolean; document: StudentDocument }>('/documents', {
      method: 'POST',
      body: JSON.stringify(doc)
    }),
  deleteDocument: (id: string) =>
    request<{ success: boolean }>(`/documents/${id}`, {
      method: 'DELETE'
    }),

  // Portfolio Config
  getPortfolioConfig: (userId: string) =>
    request<{ success: boolean; config: PortfolioConfig }>(`/portfolio/${userId}`),
  savePortfolioConfig: (userId: string, config: PortfolioConfig) =>
    request<{ success: boolean; config: PortfolioConfig }>(`/portfolio/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(config)
    }),

  // Verifications
  getPendingVerifications: () =>
    request<{ success: boolean; requests: VerificationRequest[]; count: number }>('/verifications/pending'),
  getVerificationLogs: () =>
    request<{ success: boolean; logs: VerificationLog[] }>('/verifications/logs'),
  reviewVerification: (data: {
    itemType: 'certification' | 'internship' | 'achievement' | 'project';
    itemId: string;
    action: 'approved' | 'rejected' | 'requested_revision';
    reviewerId?: string;
    reviewerName?: string;
    comment: string;
  }) =>
    request<{ success: boolean; message: string }>('/verifications/review', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Analytics
  getAnalytics: () =>
    request<{
      success: boolean;
      summary: any;
      topSkills: { name: string; count: number }[];
      departmentStats: Record<string, any>;
      leaderboard: any[];
    }>('/analytics'),

  // AI Skill Gap & Career Analyzer
  analyzeSkills: (studentId: string, targetRole: string) =>
    request<{ success: boolean; source: string; analysis: CareerAnalysisResult }>('/ai/analyze-skills', {
      method: 'POST',
      body: JSON.stringify({ studentId, targetRole })
    })
};
