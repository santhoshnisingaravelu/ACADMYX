import { Router, Request, Response } from 'express';
import { db } from './db.ts';
import { GoogleGenAI } from '@google/genai';
import { CareerAnalysisResult, StudentProfile } from '../src/types/index.ts';

const router = Router();

// ==========================================
// Authentication & User Switching Endpoints
// ==========================================

router.get('/auth/users', (req: Request, res: Response) => {
  const users = db.getUsers();
  res.json({ success: true, users });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // If user doesn't exist, check if demo quick login or return 404
    return res.status(404).json({ success: false, message: 'User not found. Try one of the demo accounts.' });
  }

  const profile = user.role === 'student' ? db.getProfileByUserId(user.id) : undefined;
  res.json({
    success: true,
    user,
    profile,
    token: `demo-token-${user.id}`
  });
});

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, department, collegeId, role = 'student', degree = 'B.Tech', currentSemester = 1, batch = '2023-2027', cgpa = 8.0 } = req.body;

  if (!name || !email || !collegeId) {
    return res.status(400).json({ success: false, message: 'Name, email, and college ID are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const userId = 'user_' + Date.now();
  const newUser = {
    id: userId,
    name,
    email,
    role: role as 'student' | 'faculty' | 'admin',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    department: department || 'Computer Science & Engineering',
    collegeId,
    phone: req.body.phone || ''
  };

  db.createUser(newUser);

  let profile: StudentProfile | undefined;
  if (newUser.role === 'student') {
    profile = db.upsertProfile(userId, {
      name,
      email,
      rollNo: collegeId,
      department: newUser.department,
      degree,
      currentSemester: Number(currentSemester) || 1,
      batch,
      cgpa: Number(cgpa) || 8.0,
      phone: req.body.phone || '',
      bio: 'Enthusiastic engineering student building impactful solutions.',
      avatar: newUser.avatar,
      portfolioSlug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(100 + Math.random() * 900)
    });
  }

  res.status(201).json({
    success: true,
    user: newUser,
    profile,
    token: `demo-token-${newUser.id}`
  });
});

// ==========================================
// Students & Full Profile Endpoints
// ==========================================

router.get('/students', (req: Request, res: Response) => {
  const { department, search, minCgpa } = req.query;
  let profiles = db.getAllProfiles();

  if (department && typeof department === 'string' && department !== 'All') {
    profiles = profiles.filter(p => p.department.toLowerCase() === department.toLowerCase());
  }

  if (minCgpa && !isNaN(Number(minCgpa))) {
    profiles = profiles.filter(p => p.cgpa >= Number(minCgpa));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    profiles = profiles.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.rollNo.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      (p.targetRole && p.targetRole.toLowerCase().includes(q))
    );
  }

  // Attach summaries (counts of skills, projects, certifications)
  const enriched = profiles.map(p => {
    const skills = db.getSkills(p.userId);
    const projects = db.getProjects(p.userId);
    const certs = db.getCertifications(p.userId);
    const interns = db.getInternships(p.userId);
    const achs = db.getAchievements(p.userId);

    return {
      ...p,
      metrics: {
        skillsCount: skills.length,
        verifiedSkillsCount: skills.filter(s => s.isVerified).length,
        projectsCount: projects.length,
        certsCount: certs.length,
        verifiedCertsCount: certs.filter(c => c.verifiedStatus === 'verified').length,
        internshipsCount: interns.length,
        achievementsCount: achs.length
      }
    };
  });

  res.json({ success: true, students: enriched });
});

// Query student full details by Register Number
router.get('/students/register/:rollNo', (req: Request, res: Response) => {
  const { rollNo } = req.params;
  if (!rollNo || !rollNo.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a register number.'
    });
  }

  const cleanRoll = rollNo.trim().toUpperCase();
  const profile = db.getProfileByRollNo(cleanRoll);
  const user = db.getUserByCollegeId(cleanRoll);

  if (!profile && !user) {
    return res.status(404).json({
      success: false,
      message: 'Student Not Found',
      error: 'No student record was found for this register number.'
    });
  }

  const userId = profile ? profile.userId : user!.id;
  const actualUser = user || db.getUserById(userId);
  const skills = db.getSkills(userId);
  const projects = db.getProjects(userId);
  const internships = db.getInternships(userId);
  const certifications = db.getCertifications(userId);
  const achievements = db.getAchievements(userId);
  const documents = db.getDocuments(userId);
  const portfolioConfig = db.getPortfolioConfig(userId);

  return res.json({
    success: true,
    user: actualUser,
    student: profile || {
      id: 'prof_' + userId,
      userId,
      name: actualUser?.name,
      email: actualUser?.email,
      rollNo: actualUser?.collegeId,
      department: actualUser?.department,
      degree: 'B.Tech in Computer Science & Engineering',
      currentSemester: 8,
      batch: '2021-2025',
      cgpa: 8.5,
      phone: '',
      bio: '',
      avatar: actualUser?.avatar,
      portfolioSlug: actualUser?.name.toLowerCase().replace(/\s+/g, '-')
    },
    skills,
    projects,
    internships,
    certifications,
    achievements,
    documents,
    portfolioConfig
  });
});

router.get('/students/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  let profile = db.getProfileByUserId(userId);
  let user = db.getUserById(userId);

  // If not found by user ID, attempt lookup by roll number
  if (!profile && !user) {
    const rollProfile = db.getProfileByRollNo(userId);
    const rollUser = db.getUserByCollegeId(userId);
    if (rollProfile || rollUser) {
      profile = rollProfile;
      user = rollUser;
    }
  }

  if (!profile && !user) {
    return res.status(404).json({
      success: false,
      message: 'Student Not Found',
      error: 'No student record was found for this register number.'
    });
  }

  const targetUserId = profile ? profile.userId : user!.id;
  const actualUser = user || db.getUserById(targetUserId);
  const skills = db.getSkills(targetUserId);
  const projects = db.getProjects(targetUserId);
  const internships = db.getInternships(targetUserId);
  const certifications = db.getCertifications(targetUserId);
  const achievements = db.getAchievements(targetUserId);
  const documents = db.getDocuments(targetUserId);
  const portfolioConfig = db.getPortfolioConfig(targetUserId);

  res.json({
    success: true,
    user: actualUser,
    student: profile || {
      id: 'prof_' + targetUserId,
      userId: targetUserId,
      name: actualUser?.name,
      email: actualUser?.email,
      rollNo: actualUser?.collegeId,
      department: actualUser?.department,
      degree: 'B.Tech',
      currentSemester: 8,
      batch: '2021-2025',
      cgpa: 8.5,
      phone: '',
      bio: '',
      avatar: actualUser?.avatar,
      portfolioSlug: actualUser?.name.toLowerCase().replace(/\s+/g, '-')
    },
    skills,
    projects,
    internships,
    certifications,
    achievements,
    documents,
    portfolioConfig
  });
});

router.put('/students/:userId/profile', (req: Request, res: Response) => {
  const { userId } = req.params;
  const updated = db.upsertProfile(userId, req.body);
  res.json({ success: true, profile: updated });
});

// Public Portfolio View by Slug
router.get('/students/slug/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const profile = db.getProfileBySlug(slug);

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Public portfolio not found for this URL' });
  }

  const userId = profile.userId;
  const skills = db.getSkills(userId);
  const projects = db.getProjects(userId);
  const internships = db.getInternships(userId);
  const certifications = db.getCertifications(userId);
  const achievements = db.getAchievements(userId);
  const portfolioConfig = db.getPortfolioConfig(userId);

  res.json({
    success: true,
    student: profile,
    skills,
    projects,
    internships,
    certifications,
    achievements,
    portfolioConfig
  });
});

// ==========================================
// Skills CRUD & Endorsement
// ==========================================

router.get('/skills', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const skills = db.getSkills(studentId as string | undefined);
  res.json({ success: true, skills });
});

router.post('/skills', (req: Request, res: Response) => {
  const { studentId, name, category, proficiency, rating = 3, evidenceNote } = req.body;
  if (!studentId || !name || !category) {
    return res.status(400).json({ success: false, message: 'Missing required skill fields' });
  }

  const newSkill = db.addSkill({
    studentId,
    name,
    category,
    proficiency: proficiency || 'Intermediate',
    rating: Number(rating) || 3,
    isVerified: false,
    endorsementsCount: 0,
    evidenceNote
  });

  res.status(201).json({ success: true, skill: newSkill });
});

router.put('/skills/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateSkill(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Skill not found' });
  }
  res.json({ success: true, skill: updated });
});

router.delete('/skills/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteSkill(id);
  res.json({ success: deleted });
});

router.post('/skills/:id/endorse', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.endorseSkill(id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Skill not found' });
  }
  res.json({ success: true, skill: updated });
});

// ==========================================
// Projects CRUD
// ==========================================

router.get('/projects', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const projects = db.getProjects(studentId as string | undefined);
  res.json({ success: true, projects });
});

router.post('/projects', (req: Request, res: Response) => {
  const { studentId, title, description, category, role, teamSize = 1, techStack, githubUrl, liveUrl, startDate, endDate, isOngoing, featured, mentorName } = req.body;

  if (!studentId || !title || !description) {
    return res.status(400).json({ success: false, message: 'StudentId, title, and description are required' });
  }

  const newProject = db.addProject({
    studentId,
    title,
    description,
    category: category || 'Software Engineering',
    role: role || 'Lead Developer',
    teamSize: Number(teamSize) || 1,
    techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : []),
    githubUrl,
    liveUrl,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate,
    isOngoing: Boolean(isOngoing),
    featured: Boolean(featured),
    mentorName,
    verifiedStatus: 'pending',
    attachments: req.body.attachments || []
  });

  res.status(201).json({ success: true, project: newProject });
});

router.put('/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateProject(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, project: updated });
});

router.delete('/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteProject(id);
  res.json({ success: deleted });
});

// ==========================================
// Internships CRUD
// ==========================================

router.get('/internships', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const internships = db.getInternships(studentId as string | undefined);
  res.json({ success: true, internships });
});

router.post('/internships', (req: Request, res: Response) => {
  const { studentId, company, role, location, locationType, startDate, endDate, isCurrent, stipend, description, technologies, certificateDoc, certificateFileName, offerLetterDoc } = req.body;

  if (!studentId || !company || !role || !startDate) {
    return res.status(400).json({ success: false, message: 'Missing required internship fields' });
  }

  const newInternship = db.addInternship({
    studentId,
    company,
    role,
    location: location || 'Bangalore, India',
    locationType: locationType || 'Hybrid',
    startDate,
    endDate: endDate || 'Present',
    isCurrent: Boolean(isCurrent),
    stipend,
    description: description || '',
    technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(s => s.trim()) : []),
    certificateDoc,
    certificateFileName,
    offerLetterDoc,
    verifiedStatus: 'pending'
  });

  res.status(201).json({ success: true, internship: newInternship });
});

router.put('/internships/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateInternship(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Internship not found' });
  }
  res.json({ success: true, internship: updated });
});

router.delete('/internships/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteInternship(id);
  res.json({ success: deleted });
});

// ==========================================
// Certifications CRUD
// ==========================================

router.get('/certifications', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const certifications = db.getCertifications(studentId as string | undefined);
  res.json({ success: true, certifications });
});

router.post('/certifications', (req: Request, res: Response) => {
  const { studentId, title, issuingOrganization, issueDate, expiryDate, credentialId, credentialUrl, certificateFile, certificateFileName, skillsAcquired } = req.body;

  if (!studentId || !title || !issuingOrganization || !issueDate) {
    return res.status(400).json({ success: false, message: 'Missing required certification fields' });
  }

  const newCert = db.addCertification({
    studentId,
    title,
    issuingOrganization,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl,
    certificateFile,
    certificateFileName,
    skillsAcquired: Array.isArray(skillsAcquired) ? skillsAcquired : (typeof skillsAcquired === 'string' ? skillsAcquired.split(',').map(s => s.trim()) : []),
    verifiedStatus: 'pending'
  });

  res.status(201).json({ success: true, certification: newCert });
});

router.put('/certifications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCertification(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Certification not found' });
  }
  res.json({ success: true, certification: updated });
});

router.delete('/certifications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteCertification(id);
  res.json({ success: deleted });
});

// ==========================================
// Academic Achievements CRUD
// ==========================================

router.get('/achievements', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const achievements = db.getAchievements(studentId as string | undefined);
  res.json({ success: true, achievements });
});

router.post('/achievements', (req: Request, res: Response) => {
  const { studentId, title, type, date, positionOrAward, eventName, organizedBy, description, proofDocument, proofFileName, tags } = req.body;

  if (!studentId || !title || !type || !eventName) {
    return res.status(400).json({ success: false, message: 'Missing required achievement fields' });
  }

  const newAchievement = db.addAchievement({
    studentId,
    title,
    type,
    date: date || new Date().toISOString().split('T')[0],
    positionOrAward: positionOrAward || 'Participant',
    eventName,
    organizedBy: organizedBy || 'College / Organization',
    description: description || '',
    proofDocument,
    proofFileName,
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : []),
    verifiedStatus: 'pending'
  });

  res.status(201).json({ success: true, achievement: newAchievement });
});

router.put('/achievements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateAchievement(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Achievement not found' });
  }
  res.json({ success: true, achievement: updated });
});

router.delete('/achievements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteAchievement(id);
  res.json({ success: deleted });
});

// ==========================================
// Documents Locker CRUD
// ==========================================

router.get('/documents', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const documents = db.getDocuments(studentId as string | undefined);
  res.json({ success: true, documents });
});

router.post('/documents', (req: Request, res: Response) => {
  const { studentId, title, category, fileName, fileSize, fileData, mimeType } = req.body;

  if (!studentId || !title || !fileName || !fileData) {
    return res.status(400).json({ success: false, message: 'Missing required document fields' });
  }

  const newDoc = db.addDocument({
    studentId,
    title,
    category: category || 'Other',
    fileName,
    fileSize: fileSize || '1.0 MB',
    fileData,
    mimeType: mimeType || 'application/pdf',
    uploadedAt: new Date().toISOString().split('T')[0],
    isVerified: false
  });

  res.status(201).json({ success: true, document: newDoc });
});

router.delete('/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteDocument(id);
  res.json({ success: deleted });
});

// ==========================================
// Portfolio Configuration
// ==========================================

router.get('/portfolio/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const config = db.getPortfolioConfig(userId);
  res.json({ success: true, config });
});

router.put('/portfolio/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const saved = db.savePortfolioConfig(userId, req.body);
  res.json({ success: true, config: saved });
});

// ==========================================
// Faculty Verification System
// ==========================================

router.get('/verifications/pending', (req: Request, res: Response) => {
  const requests = db.getPendingVerifications();
  res.json({ success: true, requests, count: requests.length });
});

router.get('/verifications/logs', (req: Request, res: Response) => {
  const logs = db.getVerificationLogs();
  res.json({ success: true, logs });
});

router.post('/verifications/review', (req: Request, res: Response) => {
  const { itemType, itemId, action, reviewerId, reviewerName, comment } = req.body;

  if (!itemType || !itemId || !action) {
    return res.status(400).json({ success: false, message: 'Missing verification review parameters' });
  }

  const success = db.processVerification(
    itemType,
    itemId,
    action,
    reviewerId || 'FAC_REVIEWER',
    reviewerName || 'Faculty Reviewer',
    comment || (action === 'approved' ? 'Verified against university guidelines.' : 'Requested revision.')
  );

  if (!success) {
    return res.status(404).json({ success: false, message: 'Item to verify was not found' });
  }

  res.json({ success: true, message: `Successfully ${action} the submission.` });
});

// ==========================================
// Institutional Analytics & Reports
// ==========================================

router.get('/analytics', (req: Request, res: Response) => {
  const analytics = db.getInstitutionalAnalytics();
  res.json({ success: true, ...analytics });
});

// ==========================================
// AI Skill Gap & Career Readiness Analyzer
// ==========================================

router.post('/ai/analyze-skills', async (req: Request, res: Response) => {
  const { studentId, targetRole = 'Full Stack Cloud Engineer' } = req.body;

  if (!studentId) {
    return res.status(400).json({ success: false, message: 'studentId is required' });
  }

  const profile = db.getProfileByUserId(studentId);
  const skills = db.getSkills(studentId);
  const projects = db.getProjects(studentId);
  const certs = db.getCertifications(studentId);
  const interns = db.getInternships(studentId);
  const achs = db.getAchievements(studentId);

  const studentContext = {
    name: profile?.name || 'Student',
    department: profile?.department,
    cgpa: profile?.cgpa,
    targetRole,
    skills: skills.map(s => `${s.name} (${s.proficiency}, verified: ${s.isVerified})`),
    projects: projects.map(p => `${p.title}: ${p.description.substring(0, 100)}... [Tech: ${p.techStack.join(', ')}]`),
    certifications: certs.map(c => `${c.title} by ${c.issuingOrganization}`),
    internships: interns.map(i => `${i.role} at ${i.company}`),
    achievements: achs.map(a => `${a.positionOrAward} in ${a.eventName}`)
  };

  // Try Gemini if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `You are a Senior College Career Placement Director & Tech Lead.
Analyze the following student credentials against their target role "${targetRole}".

Student Information:
${JSON.stringify(studentContext, null, 2)}

Provide an evaluation strictly in valid JSON matching this schema:
{
  "targetRole": "${targetRole}",
  "overallScore": number (0 to 100),
  "summary": string (concise 2-3 sentence executive assessment),
  "strengths": string[] (3-5 top strengths),
  "missingSkills": [
    { "skill": string, "priority": "High" | "Medium" | "Low", "reason": string }
  ],
  "recommendedProjects": [
    { "title": string, "description": string, "technologies": string[] }
  ],
  "recommendedCertifications": string[] (2-3 recognized industry certifications),
  "resumeTips": string[] (3 actionable bullet points to improve ATS resume score),
  "placementReadiness": "High" | "Moderate" | "Needs Improvement"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, source: 'gemini', analysis: parsed });
      }
    } catch (geminiError) {
      console.warn('Gemini API call failed, falling back to local heuristic analyzer:', geminiError);
    }
  }

  // Robust Heuristic Engine Fallback
  const roleLower = targetRole.toLowerCase();
  let baseScore = 65;
  const strengths: string[] = [];
  const missingSkills: CareerAnalysisResult['missingSkills'] = [];
  const recommendedProjects: CareerAnalysisResult['recommendedProjects'] = [];
  const recommendedCerts: string[] = [];

  const existingSkillNames = skills.map(s => s.name.toLowerCase());

  if (profile?.cgpa && profile.cgpa >= 8.5) {
    strengths.push(`Strong academic foundation with a ${profile.cgpa} CGPA in ${profile.department}.`);
    baseScore += 8;
  }

  if (interns.length > 0) {
    strengths.push(`Proven real-world industry experience with ${interns.length} completed internship(s).`);
    baseScore += 10;
  }

  if (certs.filter(c => c.verifiedStatus === 'verified').length > 0) {
    strengths.push(`Verified industry certifications boost recruiter credibility.`);
    baseScore += 8;
  }

  if (projects.length >= 2) {
    strengths.push(`Demonstrated hands-on technical execution across ${projects.length} multi-tier projects.`);
    baseScore += 7;
  }

  // Target role specific curriculum analysis
  if (roleLower.includes('cloud') || roleLower.includes('devops')) {
    if (!existingSkillNames.some(s => s.includes('docker') || s.includes('kubernetes'))) {
      missingSkills.push({ skill: 'Kubernetes & Container Orchestration', priority: 'High', reason: 'Essential for modern microservice operations and automated canary rollouts.' });
    }
    if (!existingSkillNames.some(s => s.includes('terraform') || s.includes('ansible'))) {
      missingSkills.push({ skill: 'Terraform (Infrastructure as Code)', priority: 'High', reason: 'Standard requirement for automating multi-cloud provisioning in DevOps teams.' });
    }
    recommendedProjects.push({
      title: 'GitOps Continuous Deployment Pipeline on AWS EKS',
      description: 'Build an automated deployment system using ArgoCD, Helm, and GitHub Actions to deploy a polyglot microservices app.',
      technologies: ['Kubernetes', 'Helm', 'ArgoCD', 'Terraform', 'AWS']
    });
    recommendedCerts.push('AWS Certified Solutions Architect Associate', 'CKA: Certified Kubernetes Administrator');
  } else if (roleLower.includes('ai') || roleLower.includes('data') || roleLower.includes('machine learning')) {
    if (!existingSkillNames.some(s => s.includes('pytorch') || s.includes('tensorflow'))) {
      missingSkills.push({ skill: 'PyTorch Deep Learning Framework', priority: 'High', reason: 'Industry standard for neural network design and modern transformer inference.' });
    }
    if (!existingSkillNames.some(s => s.includes('vector') || s.includes('rag') || s.includes('langchain'))) {
      missingSkills.push({ skill: 'Vector Databases & RAG Pipelines (Pinecone/Milvus)', priority: 'Medium', reason: 'Crucial for enterprise LLM and generative AI integrations.' });
    }
    recommendedProjects.push({
      title: 'Semantic Document Search & Synthesizer using RAG',
      description: 'Implement a low-latency context-aware research assistant with LangChain, FAISS, and local quantized LLMs.',
      technologies: ['Python', 'FastAPI', 'FAISS', 'Hugging Face', 'Docker']
    });
    recommendedCerts.push('TensorFlow Developer Certificate', 'AWS Certified Machine Learning – Specialty');
  } else {
    // Full-Stack / Software Engineering
    if (!existingSkillNames.some(s => s.includes('system design') || s.includes('distributed'))) {
      missingSkills.push({ skill: 'System Design & Distributed Caching', priority: 'High', reason: 'Primary evaluation criterion in technical rounds at tier-1 product companies.' });
    }
    if (!existingSkillNames.some(s => s.includes('testing') || s.includes('jest') || s.includes('cypress'))) {
      missingSkills.push({ skill: 'Automated Testing (Unit & Integration)', priority: 'Medium', reason: 'Production teams demand test-driven development experience.' });
    }
    recommendedProjects.push({
      title: 'High-Concurrency Real-Time Collaboration Canvas',
      description: 'Architect a web app with WebSocket conflict resolution (CRDTs), Redis Pub/Sub, and distributed session storage.',
      technologies: ['TypeScript', 'Node.js', 'React', 'Redis', 'WebSockets']
    });
    recommendedCerts.push('AWS Certified Developer Associate', 'MongoDB Certified Developer Associate');
  }

  const finalScore = Math.min(96, Math.max(50, baseScore));
  const readiness = finalScore >= 85 ? 'High' : finalScore >= 70 ? 'Moderate' : 'Needs Improvement';

  const analysis: CareerAnalysisResult = {
    targetRole,
    overallScore: finalScore,
    summary: `${profile?.name || 'Student'} shows a strong profile aligned with ${targetRole}. With a readiness score of ${finalScore}%, their hands-on project portfolio is solid; addressing key cloud and system architecture gaps will guarantee top-tier campus placement.`,
    strengths: strengths.length ? strengths : ['Strong foundational coursework in computer science principles', 'Clear enthusiasm for hands-on software development'],
    missingSkills,
    recommendedProjects,
    recommendedCertifications: recommendedCerts,
    resumeTips: [
      'Quantify project outcomes: replace "built web app" with "optimized latency by 35% across 4,000 active campus users".',
      'Move verified credentials and GitHub live links to the top third of your resume for maximum recruiter glance value.',
      'Ensure all key technologies from your target job description are explicitly mentioned in your skills matrix.'
    ],
    placementReadiness: readiness
  };

  res.json({ success: true, source: 'local-analyzer', analysis });
});

export default router;
