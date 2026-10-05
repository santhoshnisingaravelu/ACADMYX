import fs from 'fs';
import path from 'path';
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
  VerificationStatus
} from '../src/types/index.ts';
import {
  initialUsers,
  initialProfiles,
  initialSkills,
  initialProjects,
  initialInternships,
  initialCertifications,
  initialAchievements,
  initialDocuments,
  initialPortfolioConfigs,
  initialVerificationLogs
} from './seedData.ts';
import { generateAll100StudentsData } from './studentsData.ts';

interface DatabaseSchema {
  users: User[];
  profiles: Record<string, StudentProfile>;
  skills: Skill[];
  projects: Project[];
  internships: Internship[];
  certifications: Certification[];
  achievements: AcademicAchievement[];
  documents: StudentDocument[];
  portfolioConfigs: Record<string, PortfolioConfig>;
  verificationLogs: VerificationLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && parsed.users.length >= 100) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read db.json, initializing from seeds:', err);
    }

    const generated = generateAll100StudentsData();
    const initialData: DatabaseSchema = {
      users: generated.users,
      profiles: generated.profiles,
      skills: generated.skills,
      projects: generated.projects,
      internships: generated.internships,
      certifications: generated.certifications,
      achievements: generated.achievements,
      documents: generated.documents,
      portfolioConfigs: generated.portfolioConfigs,
      verificationLogs: generated.verificationLogs
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to disk:', err);
    }
  }

  // --- Users & Auth ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByCollegeId(collegeId: string): User | undefined {
    const cleanId = collegeId.trim().toUpperCase();
    return this.data.users.find(u => u.collegeId && u.collegeId.trim().toUpperCase() === cleanId);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  // --- Profiles ---
  getProfileByUserId(userId: string): StudentProfile | undefined {
    return this.data.profiles[userId];
  }

  getProfileByRollNo(rollNo: string): StudentProfile | undefined {
    const cleanRoll = rollNo.trim().toUpperCase();
    return Object.values(this.data.profiles).find(
      p => p.rollNo && p.rollNo.trim().toUpperCase() === cleanRoll
    );
  }

  getProfileBySlug(slug: string): StudentProfile | undefined {
    return Object.values(this.data.profiles).find(p => p.portfolioSlug === slug);
  }

  getAllProfiles(): StudentProfile[] {
    return Object.values(this.data.profiles);
  }

  upsertProfile(userId: string, profileData: Partial<StudentProfile>): StudentProfile {
    const existing = this.data.profiles[userId];
    if (existing) {
      this.data.profiles[userId] = { ...existing, ...profileData };
    } else {
      const user = this.getUserById(userId);
      this.data.profiles[userId] = {
        id: 'prof_' + Date.now(),
        userId,
        name: user?.name || 'Student',
        email: user?.email || '',
        rollNo: user?.collegeId || 'PENDING',
        department: user?.department || 'General',
        degree: 'Bachelor of Technology',
        currentSemester: 1,
        batch: '2022-2026',
        cgpa: 8.0,
        phone: '',
        bio: '',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        location: 'Campus',
        portfolioSlug: (user?.name || 'student').toLowerCase().replace(/\s+/g, '-'),
        ...profileData
      };
    }
    this.saveData();
    return this.data.profiles[userId];
  }

  // --- Skills ---
  getSkills(studentId?: string): Skill[] {
    if (studentId) {
      return this.data.skills.filter(s => s.studentId === studentId);
    }
    return this.data.skills;
  }

  addSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = {
      ...skill,
      id: 'skill_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.skills.push(newSkill);
    this.saveData();
    return newSkill;
  }

  updateSkill(id: string, updates: Partial<Skill>): Skill | null {
    const idx = this.data.skills.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.skills[idx] = { ...this.data.skills[idx], ...updates };
    this.saveData();
    return this.data.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  endorseSkill(id: string): Skill | null {
    const skill = this.data.skills.find(s => s.id === id);
    if (!skill) return null;
    skill.endorsementsCount = (skill.endorsementsCount || 0) + 1;
    this.saveData();
    return skill;
  }

  // --- Projects ---
  getProjects(studentId?: string): Project[] {
    if (studentId) {
      return this.data.projects.filter(p => p.studentId === studentId);
    }
    return this.data.projects;
  }

  addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.projects.push(newProject);
    this.saveData();
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
    this.saveData();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Internships ---
  getInternships(studentId?: string): Internship[] {
    if (studentId) {
      return this.data.internships.filter(i => i.studentId === studentId);
    }
    return this.data.internships;
  }

  addInternship(internship: Omit<Internship, 'id'>): Internship {
    const newInternship: Internship = {
      ...internship,
      id: 'intern_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.internships.push(newInternship);
    this.saveData();
    return newInternship;
  }

  updateInternship(id: string, updates: Partial<Internship>): Internship | null {
    const idx = this.data.internships.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.internships[idx] = { ...this.data.internships[idx], ...updates };
    this.saveData();
    return this.data.internships[idx];
  }

  deleteInternship(id: string): boolean {
    const initialLen = this.data.internships.length;
    this.data.internships = this.data.internships.filter(i => i.id !== id);
    if (this.data.internships.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Certifications ---
  getCertifications(studentId?: string): Certification[] {
    if (studentId) {
      return this.data.certifications.filter(c => c.studentId === studentId);
    }
    return this.data.certifications;
  }

  addCertification(cert: Omit<Certification, 'id'>): Certification {
    const newCert: Certification = {
      ...cert,
      id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.certifications.push(newCert);
    this.saveData();
    return newCert;
  }

  updateCertification(id: string, updates: Partial<Certification>): Certification | null {
    const idx = this.data.certifications.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.certifications[idx] = { ...this.data.certifications[idx], ...updates };
    this.saveData();
    return this.data.certifications[idx];
  }

  deleteCertification(id: string): boolean {
    const initialLen = this.data.certifications.length;
    this.data.certifications = this.data.certifications.filter(c => c.id !== id);
    if (this.data.certifications.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Academic Achievements ---
  getAchievements(studentId?: string): AcademicAchievement[] {
    if (studentId) {
      return this.data.achievements.filter(a => a.studentId === studentId);
    }
    return this.data.achievements;
  }

  addAchievement(achievement: Omit<AcademicAchievement, 'id'>): AcademicAchievement {
    const newAchievement: AcademicAchievement = {
      ...achievement,
      id: 'achieve_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.achievements.push(newAchievement);
    this.saveData();
    return newAchievement;
  }

  updateAchievement(id: string, updates: Partial<AcademicAchievement>): AcademicAchievement | null {
    const idx = this.data.achievements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.achievements[idx] = { ...this.data.achievements[idx], ...updates };
    this.saveData();
    return this.data.achievements[idx];
  }

  deleteAchievement(id: string): boolean {
    const initialLen = this.data.achievements.length;
    this.data.achievements = this.data.achievements.filter(a => a.id !== id);
    if (this.data.achievements.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Documents ---
  getDocuments(studentId?: string): StudentDocument[] {
    if (studentId) {
      return this.data.documents.filter(d => d.studentId === studentId);
    }
    return this.data.documents;
  }

  addDocument(doc: Omit<StudentDocument, 'id'>): StudentDocument {
    const newDoc: StudentDocument = {
      ...doc,
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    };
    this.data.documents.push(newDoc);
    this.saveData();
    return newDoc;
  }

  deleteDocument(id: string): boolean {
    const initialLen = this.data.documents.length;
    this.data.documents = this.data.documents.filter(d => d.id !== id);
    if (this.data.documents.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Portfolio Configs ---
  getPortfolioConfig(userId: string): PortfolioConfig {
    if (this.data.portfolioConfigs[userId]) {
      return this.data.portfolioConfigs[userId];
    }
    const defaultConfig: PortfolioConfig = {
      theme: 'modern-tech',
      tagline: 'Student Portfolio & Academic Showcase',
      customIntro: 'Welcome to my academic and technical portfolio.',
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
    this.data.portfolioConfigs[userId] = defaultConfig;
    this.saveData();
    return defaultConfig;
  }

  savePortfolioConfig(userId: string, config: PortfolioConfig): PortfolioConfig {
    this.data.portfolioConfigs[userId] = config;
    this.saveData();
    return config;
  }

  // --- Verification Workflow ---
  getPendingVerifications(): VerificationRequest[] {
    const requests: VerificationRequest[] = [];

    // Pending Certifications
    for (const cert of this.data.certifications.filter(c => c.verifiedStatus === 'pending')) {
      const student = this.data.profiles[cert.studentId] || this.getUserById(cert.studentId);
      requests.push({
        id: 'ver_req_' + cert.id,
        itemType: 'certification',
        itemId: cert.id,
        studentId: cert.studentId,
        studentName: student?.name || 'Unknown Student',
        studentRollNo: (student as StudentProfile)?.rollNo || 'N/A',
        department: (student as StudentProfile)?.department || 'Engineering',
        title: cert.title,
        subtitle: `Issued by ${cert.issuingOrganization} (${cert.issueDate})`,
        submissionDate: cert.issueDate,
        proofFileName: cert.certificateFileName,
        proofUrl: cert.certificateFile,
        details: {
          organization: cert.issuingOrganization,
          issueDate: cert.issueDate,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
          skillsAcquired: cert.skillsAcquired
        },
        status: cert.verifiedStatus,
        feedback: cert.facultyFeedback
      });
    }

    // Pending Internships
    for (const intern of this.data.internships.filter(i => i.verifiedStatus === 'pending')) {
      const student = this.data.profiles[intern.studentId] || this.getUserById(intern.studentId);
      requests.push({
        id: 'ver_req_' + intern.id,
        itemType: 'internship',
        itemId: intern.id,
        studentId: intern.studentId,
        studentName: student?.name || 'Unknown Student',
        studentRollNo: (student as StudentProfile)?.rollNo || 'N/A',
        department: (student as StudentProfile)?.department || 'Engineering',
        title: `${intern.role} at ${intern.company}`,
        subtitle: `${intern.startDate} to ${intern.endDate} (${intern.locationType})`,
        submissionDate: intern.startDate,
        proofFileName: intern.certificateFileName,
        proofUrl: intern.certificateDoc,
        details: {
          company: intern.company,
          role: intern.role,
          duration: `${intern.startDate} to ${intern.endDate}`,
          stipend: intern.stipend,
          technologies: intern.technologies,
          description: intern.description
        },
        status: intern.verifiedStatus,
        feedback: intern.facultyFeedback
      });
    }

    // Pending Achievements
    for (const ach of this.data.achievements.filter(a => a.verifiedStatus === 'pending')) {
      const student = this.data.profiles[ach.studentId] || this.getUserById(ach.studentId);
      requests.push({
        id: 'ver_req_' + ach.id,
        itemType: 'achievement',
        itemId: ach.id,
        studentId: ach.studentId,
        studentName: student?.name || 'Unknown Student',
        studentRollNo: (student as StudentProfile)?.rollNo || 'N/A',
        department: (student as StudentProfile)?.department || 'Engineering',
        title: ach.title,
        subtitle: `${ach.type} • ${ach.positionOrAward} (${ach.organizedBy})`,
        submissionDate: ach.date,
        proofFileName: ach.proofFileName,
        proofUrl: ach.proofDocument,
        details: {
          type: ach.type,
          position: ach.positionOrAward,
          eventName: ach.eventName,
          organizedBy: ach.organizedBy,
          description: ach.description,
          tags: ach.tags
        },
        status: ach.verifiedStatus,
        feedback: ach.facultyFeedback
      });
    }

    // Pending Projects
    for (const proj of this.data.projects.filter(p => p.verifiedStatus === 'pending')) {
      const student = this.data.profiles[proj.studentId] || this.getUserById(proj.studentId);
      requests.push({
        id: 'ver_req_' + proj.id,
        itemType: 'project',
        itemId: proj.id,
        studentId: proj.studentId,
        studentName: student?.name || 'Unknown Student',
        studentRollNo: (student as StudentProfile)?.rollNo || 'N/A',
        department: (student as StudentProfile)?.department || 'Engineering',
        title: proj.title,
        subtitle: `${proj.category} • Team size ${proj.teamSize}`,
        submissionDate: proj.startDate,
        proofFileName: proj.githubUrl,
        proofUrl: proj.githubUrl,
        details: {
          category: proj.category,
          role: proj.role,
          techStack: proj.techStack,
          githubUrl: proj.githubUrl,
          liveUrl: proj.liveUrl,
          description: proj.description
        },
        status: proj.verifiedStatus,
        feedback: proj.facultyFeedback
      });
    }

    return requests;
  }

  processVerification(
    itemType: 'certification' | 'internship' | 'achievement' | 'project',
    itemId: string,
    action: 'approved' | 'rejected' | 'requested_revision',
    reviewerId: string,
    reviewerName: string,
    comment: string
  ): boolean {
    const status: VerificationStatus = 
      action === 'approved' ? 'verified' : 
      action === 'rejected' ? 'rejected' : 'revision_requested';
    
    const now = new Date().toISOString().split('T')[0];
    let studentId = '';
    let studentName = '';

    if (itemType === 'certification') {
      const cert = this.data.certifications.find(c => c.id === itemId);
      if (!cert) return false;
      cert.verifiedStatus = status;
      cert.facultyFeedback = comment;
      cert.verifiedBy = reviewerName;
      cert.verifiedAt = now;
      studentId = cert.studentId;
      // Also mark skills as verified if approved
      if (status === 'verified' && cert.skillsAcquired) {
        for (const skillName of cert.skillsAcquired) {
          const matchSkill = this.data.skills.find(
            s => s.studentId === cert.studentId && s.name.toLowerCase().includes(skillName.toLowerCase())
          );
          if (matchSkill) {
            matchSkill.isVerified = true;
            matchSkill.verifiedBy = reviewerName;
            matchSkill.verifiedAt = now;
          }
        }
      }
    } else if (itemType === 'internship') {
      const intern = this.data.internships.find(i => i.id === itemId);
      if (!intern) return false;
      intern.verifiedStatus = status;
      intern.facultyFeedback = comment;
      intern.verifiedBy = reviewerName;
      intern.verifiedAt = now;
      studentId = intern.studentId;
    } else if (itemType === 'achievement') {
      const ach = this.data.achievements.find(a => a.id === itemId);
      if (!ach) return false;
      ach.verifiedStatus = status;
      ach.facultyFeedback = comment;
      ach.verifiedBy = reviewerName;
      ach.verifiedAt = now;
      studentId = ach.studentId;
    } else if (itemType === 'project') {
      const proj = this.data.projects.find(p => p.id === itemId);
      if (!proj) return false;
      proj.verifiedStatus = status;
      proj.facultyFeedback = comment;
      proj.verifiedBy = reviewerName;
      proj.verifiedAt = now;
      studentId = proj.studentId;
    }

    const student = this.data.profiles[studentId] || this.getUserById(studentId);
    studentName = student?.name || 'Student';

    // Log verification action
    this.data.verificationLogs.unshift({
      id: 'log_' + Date.now(),
      itemId,
      itemType,
      studentId,
      studentName,
      reviewerId,
      reviewerName,
      action,
      comment,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });

    this.saveData();
    return true;
  }

  getVerificationLogs(): VerificationLog[] {
    return this.data.verificationLogs;
  }

  // --- Institutional Analytics ---
  getInstitutionalAnalytics() {
    const students = Object.values(this.data.profiles);
    const totalStudents = students.length;
    const totalSkills = this.data.skills.length;
    const verifiedSkills = this.data.skills.filter(s => s.isVerified).length;
    const totalProjects = this.data.projects.length;
    const totalInternships = this.data.internships.length;
    const totalCertifications = this.data.certifications.length;
    const verifiedCertifications = this.data.certifications.filter(c => c.verifiedStatus === 'verified').length;
    const pendingVerifications = this.getPendingVerifications().length;

    // Average CGPA
    const avgCgpa = students.length 
      ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length).toFixed(2)
      : '0.00';

    // Skill counts distribution
    const skillCounts: Record<string, number> = {};
    for (const s of this.data.skills) {
      skillCounts[s.name] = (skillCounts[s.name] || 0) + 1;
    }
    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Department Distribution
    const departmentStats: Record<string, { count: number; avgCgpa: number; totalCgpa: number; projects: number; verifiedCerts: number }> = {};
    for (const s of students) {
      const dept = s.department || 'Other';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { count: 0, avgCgpa: 0, totalCgpa: 0, projects: 0, verifiedCerts: 0 };
      }
      departmentStats[dept].count += 1;
      departmentStats[dept].totalCgpa += s.cgpa || 0;
    }

    for (const [dept, data] of Object.entries(departmentStats)) {
      data.avgCgpa = parseFloat((data.totalCgpa / data.count).toFixed(2));
      data.projects = this.data.projects.filter(p => {
        const student = this.data.profiles[p.studentId];
        return student?.department === dept;
      }).length;
      data.verifiedCerts = this.data.certifications.filter(c => {
        const student = this.data.profiles[c.studentId];
        return student?.department === dept && c.verifiedStatus === 'verified';
      }).length;
    }

    // Top Achievers Leaderboard
    const studentScores = students.map(s => {
      const studentSkills = this.data.skills.filter(sk => sk.studentId === s.userId);
      const studentProjects = this.data.projects.filter(p => p.studentId === s.userId);
      const studentCerts = this.data.certifications.filter(c => c.studentId === s.userId && c.verifiedStatus === 'verified');
      const studentInterns = this.data.internships.filter(i => i.studentId === s.userId && i.verifiedStatus === 'verified');
      const studentAchs = this.data.achievements.filter(a => a.studentId === s.userId && a.verifiedStatus === 'verified');

      const readinessScore = Math.min(100, Math.round(
        (s.cgpa * 4.5) + // up to 45
        (studentProjects.length * 6) + // up to 18
        (studentCerts.length * 8) + // up to 24
        (studentInterns.length * 10) + // up to 20
        (studentAchs.length * 5) // up to 15
      ));

      return {
        id: s.id,
        userId: s.userId,
        name: s.name,
        rollNo: s.rollNo,
        department: s.department,
        avatar: s.avatar,
        cgpa: s.cgpa,
        skillsCount: studentSkills.length,
        projectsCount: studentProjects.length,
        certsCount: studentCerts.length,
        internshipsCount: studentInterns.length,
        achievementsCount: studentAchs.length,
        readinessScore,
        portfolioSlug: s.portfolioSlug
      };
    }).sort((a, b) => b.readinessScore - a.readinessScore);

    return {
      summary: {
        totalStudents,
        avgCgpa,
        totalSkills,
        verifiedSkills,
        totalProjects,
        totalInternships,
        totalCertifications,
        verifiedCertifications,
        pendingVerifications
      },
      topSkills,
      departmentStats,
      leaderboard: studentScores
    };
  }
}

export const db = new Database();
