export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  collegeId: string; // registerNumber
  designation?: string; // For faculty/admin
  phone?: string;
  status?: 'active' | 'inactive';
}

export interface EducationEntry {
  level: string; // 'Secondary School (10th)' | 'Higher Secondary (12th)' | 'Undergraduate'
  institution: string;
  boardOrUniversity: string;
  yearOfPassing: string;
  scoreOrGrade: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNo: string; // e.g. 21CS042
  registerNumber?: string; // normalized e.g. 21CS042
  department: string;
  course?: string; // e.g. "B.Tech Computer Science"
  degree: string;
  specialization?: string;
  year?: string; // e.g. "Final Year" or "4th Year"
  currentSemester: number;
  batch: string; // e.g. "2021-2025"
  graduationYear?: string; // "2025"
  cgpa: number;
  attendance?: number; // e.g. 92%
  creditsCompleted?: number; // e.g. 148
  creditsTotal?: number; // e.g. 160
  phone: string;
  bio: string;
  careerObjective?: string;
  avatar: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  portfolioSlug: string;
  targetRole?: string;
  aboutMe?: string;
  status?: 'Active' | 'Alumni' | 'Probation';
  portfolioScore?: number; // 0-100
  careerReadinessScore?: number; // 0-100
  educationHistory?: EducationEntry[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    leetcode?: string;
  };
}

export type SkillCategory = 
  | 'Programming' 
  | 'Web Development' 
  | 'Database' 
  | 'Cloud' 
  | 'AI/ML' 
  | 'Data Science' 
  | 'Mobile Development' 
  | 'Soft'
  | 'Soft Skills' 
  | 'Communication' 
  | 'Leadership'
  | 'Technical' 
  | 'Tools & Frameworks' 
  | 'Languages' 
  | 'Cloud & DevOps';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: string;
  studentId: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  rating: number; // 1 to 5
  yearsOfExperience?: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  endorsementsCount: number;
  evidenceNote?: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'revision_requested';

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: string;
  projectType?: 'Academic' | 'Personal' | 'Mini Project' | 'Major Project' | 'Open Source' | 'Hackathon' | 'Capstone Project';
  role: string;
  teamSize: number;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  featured: boolean;
  outcome?: string;
  mentorName?: string;
  verifiedStatus: VerificationStatus;
  facultyFeedback?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  attachments?: string[];
}

export interface Internship {
  id: string;
  studentId: string;
  company: string;
  role: string;
  location: string;
  locationType: 'On-site' | 'Remote' | 'Hybrid';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  stipend?: string;
  description: string;
  technologies: string[];
  website?: string;
  certificateDoc?: string;
  certificateFileName?: string;
  offerLetterDoc?: string;
  verifiedStatus: VerificationStatus;
  facultyFeedback?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Certification {
  id: string;
  studentId: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFile?: string; // base64 or url
  certificateFileName?: string;
  description?: string;
  skillsAcquired: string[];
  verifiedStatus: VerificationStatus;
  facultyFeedback?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type AchievementType = 
  | 'Academic'
  | 'Technical'
  | 'Sports'
  | 'Cultural'
  | 'Hackathon' 
  | 'Publication' 
  | 'Workshop' 
  | 'Honor & Award' 
  | 'Competition' 
  | 'Extracurricular' 
  | 'Research'
  | 'Leadership'
  | 'Other';

export interface AcademicAchievement {
  id: string;
  studentId: string;
  title: string;
  type: AchievementType;
  date: string;
  positionOrAward: string; // e.g. "1st Prize", "Finalist", "Published Author", "Participant"
  eventName: string;
  organizedBy: string;
  description: string;
  proofDocument?: string;
  proofFileName?: string;
  tags: string[];
  verifiedStatus: VerificationStatus;
  facultyFeedback?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Workshop {
  id: string;
  studentId: string;
  workshopName: string;
  organizer: string;
  date: string;
  duration: string; // e.g. "3 Days", "16 Hours"
  location: string;
  description: string;
  certificateUrl?: string;
  verifiedStatus: VerificationStatus;
}

export interface Hackathon {
  id: string;
  studentId: string;
  hackathonName: string;
  organizer: string;
  date: string;
  teamName: string;
  projectName: string;
  position: string; // "Winner", "1st Runner Up", "Finalist"
  description: string;
  certificateUrl?: string;
  projectUrl?: string;
  verifiedStatus: VerificationStatus;
}

export interface Publication {
  id: string;
  studentId: string;
  paperTitle: string;
  authors: string[];
  journalOrConference: string;
  publicationDate: string;
  doi?: string;
  publicationUrl?: string;
  abstract: string;
  pdfUrl?: string;
  verifiedStatus: VerificationStatus;
}

export interface Award {
  id: string;
  studentId: string;
  awardTitle: string;
  organization: string;
  date: string;
  position: string;
  description: string;
  supportingDocUrl?: string;
  verifiedStatus: VerificationStatus;
}

export interface ExtracurricularActivity {
  id: string;
  studentId: string;
  activity: string;
  organization: string;
  role: string;
  date: string;
  description: string;
  supportingDocUrl?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  title: string;
  category: 'Certificate' | 'Resume' | 'Marksheet' | 'ID Proof' | 'Project Report' | 'Recommendation Letter' | 'Research Paper' | 'Other';
  fileName: string;
  fileSize: string;
  fileData: string; // base64 data URL or preview URL
  mimeType: string;
  uploadedAt: string;
  isVerified?: boolean;
}

export interface PortfolioConfig {
  theme: 'modern-tech' | 'minimalist-scholar' | 'executive-indigo' | 'cyber-dark';
  tagline: string;
  customIntro: string;
  accentColor: string;
  visibleSections: {
    skills: boolean;
    projects: boolean;
    internships: boolean;
    certifications: boolean;
    achievements: boolean;
    contact: boolean;
  };
}

export interface VerificationRequest {
  id: string;
  itemType: 'certification' | 'internship' | 'achievement' | 'project';
  itemId: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  department: string;
  title: string;
  subtitle: string;
  submissionDate: string;
  proofUrl?: string;
  proofFileName?: string;
  details: Record<string, any>;
  status: VerificationStatus;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface VerificationLog {
  id: string;
  itemId: string;
  itemType: 'certification' | 'internship' | 'achievement' | 'project';
  studentId: string;
  studentName: string;
  reviewerId: string;
  reviewerName: string;
  action: 'approved' | 'rejected' | 'requested_revision';
  comment: string;
  timestamp: string;
}

export interface CareerAnalysisResult {
  targetRole: string;
  overallScore: number; // 0-100
  summary: string;
  strengths: string[];
  missingSkills: { skill: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[];
  recommendedProjects: { title: string; description: string; technologies: string[] }[];
  recommendedCertifications: string[];
  resumeTips: string[];
  placementReadiness: 'High' | 'Moderate' | 'Needs Improvement';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}
