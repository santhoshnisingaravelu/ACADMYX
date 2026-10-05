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
  VerificationLog
} from '../src/types/index.ts';
import {
  initialUsers as baseUsers,
  initialProfiles as baseProfiles,
  initialSkills as baseSkills,
  initialProjects as baseProjects,
  initialInternships as baseInternships,
  initialCertifications as baseCertifications,
  initialAchievements as baseAchievements,
  initialDocuments as baseDocuments,
  initialPortfolioConfigs as basePortfolioConfigs,
  initialVerificationLogs as baseVerificationLogs
} from './seedData.ts';

const firstNames = [
  'Aditya', 'Ananya', 'Rohan', 'Sneha', 'Vikram',
  'Divya', 'Karan', 'Pooja', 'Siddharth', 'Meera',
  'Arjun', 'Isha', 'Rahul', 'Tanvi', 'Varun',
  'Kavya', 'Gautam', 'Rhea', 'Manish', 'Neha',
  'Naveen', 'Sanya', 'Akash', 'Shruti', 'Harsh',
  'Anjali', 'Deepak', 'Swati', 'Kunal', 'Preeti',
  'Pranav', 'Ritu', 'Abhishek', 'Pallavi', 'Suresh',
  'Bhavna', 'Vivek', 'Simran', 'Sachin', 'Nandini',
  'Rohit', 'Aarav', 'Tarun', 'Anushka', 'Chetan',
  'Shreya', 'Mayank', 'Geeta', 'Vishal', 'Komal'
];

const lastNames = [
  'Verma', 'Patel', 'Iyer', 'Reddy', 'Singh',
  'Nair', 'Gupta', 'Rao', 'Chopra', 'Menon',
  'Bose', 'Deshmukh', 'Kulkarni', 'Joshi', 'Bhat',
  'Pandey', 'Saxena', 'Mukherjee', 'Pillai', 'Mehta'
];

const avatarPhotos = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
];

const targetRoles = [
  'Full Stack Cloud Engineer',
  'AI & Machine Learning Specialist',
  'DevOps & Platform Engineer',
  'Data Engineering & Analytics Lead',
  'Cybersecurity & Network Analyst',
  'Distributed Systems Architect',
  'Frontend UI/UX Systems Engineer',
  'Mobile & Edge Computing Developer'
];

const projectTemplates = [
  {
    title: 'AI Smart Campus Attendance & Surveillance Portal',
    cat: 'Computer Vision & AI',
    role: 'Lead AI Engineer',
    tech: ['Python', 'OpenCV', 'PyTorch', 'FastAPI', 'React', 'Docker'],
    desc: 'Automated real-time attendance tracking with facial recognition, live anomaly detection, and automated report generation for campus security.'
  },
  {
    title: 'Microservices E-Commerce & Distributed Payment Gateway',
    cat: 'Full Stack & Cloud',
    role: 'Backend Architect',
    tech: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes'],
    desc: 'Event-driven multi-tenant e-commerce platform processing 10k transactions/sec with idempotency and distributed tracing.'
  },
  {
    title: 'Blockchain Academic Credential & Certificate Verifier',
    cat: 'Web3 & Security',
    role: 'Smart Contract Developer',
    tech: ['Solidity', 'Ethereum', 'Next.js', 'Ethers.js', 'IPFS', 'TypeScript'],
    desc: 'Tamper-proof academic diploma and achievement ledger enabling third-party employers to cryptographically verify transcripts.'
  },
  {
    title: 'Telemedicine Remote Patient Vitals Monitoring IoT Hub',
    cat: 'IoT & Healthcare',
    role: 'Full Stack IoT Developer',
    tech: ['C++', 'MQTT', 'Node-RED', 'React', 'InfluxDB', 'Grafana'],
    desc: 'Real-time telemetry aggregation of patient ECG, pulse oximetry, and temperature with automated emergency notification alerts.'
  },
  {
    title: 'Algorithmic Stock Trading & Risk Backtesting Engine',
    cat: 'FinTech & High Performance',
    role: 'Software Developer',
    tech: ['Python', 'Pandas', 'NumPy', 'FastAPI', 'React', 'TailwindCSS'],
    desc: 'Backtesting engine for technical trading strategies with Monte Carlo risk simulation and automated order execution.'
  }
];

const internshipTemplates = [
  {
    company: 'Razorpay Software',
    role: 'Software Engineering Intern',
    location: 'Bangalore, India (Hybrid)',
    type: 'Hybrid' as const,
    tech: ['TypeScript', 'Go', 'AWS Lambda', 'MySQL'],
    resp: 'Built payment reconciliation microservices reducing ledger discrepancies by 35% and improved API latency by 40ms.'
  },
  {
    company: 'Cisco Systems',
    role: 'Cloud Infrastructure Intern',
    location: 'Bangalore, India (On-site)',
    type: 'On-site' as const,
    tech: ['Kubernetes', 'Python', 'Terraform', 'Docker'],
    resp: 'Automated cluster scaling and implemented zero-downtime canary deployment pipelines across multi-region Kubernetes clusters.'
  },
  {
    company: 'Zoho Corporation',
    role: 'Frontend Systems Intern',
    location: 'Chennai, India (On-site)',
    type: 'On-site' as const,
    tech: ['React', 'TypeScript', 'WebSockets', 'TailwindCSS'],
    resp: 'Architected collaborative canvas editor with real-time cursor sync and offline-first IndexedDB caching.'
  },
  {
    company: 'Infosys Springboard Labs',
    role: 'Full Stack Development Intern',
    location: 'Mysore, India (Remote)',
    type: 'Remote' as const,
    tech: ['Node.js', 'Express', 'MongoDB', 'Angular'],
    resp: 'Engineered corporate learning tracking portal used by 15,000+ trainees with automated quiz evaluations.'
  }
];

const certTemplates = [
  {
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    code: 'AWS-SAA-C03'
  },
  {
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google Cloud & DeepLearning.AI',
    code: 'TF-DEV-980'
  },
  {
    title: 'Meta Professional Certified Front-End Developer',
    issuer: 'Meta (Coursera)',
    code: 'META-FE-772'
  },
  {
    title: 'Oracle Certified Professional: Java SE 17 Developer',
    issuer: 'Oracle University',
    code: '1Z0-819-OCP'
  },
  {
    title: 'HashiCorp Certified: Terraform Associate',
    issuer: 'HashiCorp',
    code: '002-TA-PRO'
  }
];

export function generateAll100StudentsData() {
  const users: User[] = [];
  const profiles: Record<string, StudentProfile> = {};
  const skills: Skill[] = [];
  const projects: Project[] = [];
  const internships: Internship[] = [];
  const certifications: Certification[] = [];
  const achievements: AcademicAchievement[] = [];
  const documents: StudentDocument[] = [];
  const portfolioConfigs: Record<string, PortfolioConfig> = {};
  const verificationLogs: VerificationLog[] = [...baseVerificationLogs];

  // First copy faculty and admin from baseUsers
  for (const user of baseUsers) {
    if (user.role === 'faculty' || user.role === 'admin') {
      users.push(user);
    }
  }

  // Generate 100 students for 21CS001 through 21CS100
  for (let i = 1; i <= 100; i++) {
    const regNum = `21CS${i.toString().padStart(3, '0')}`;

    if (i === 42) {
      // 21CS042 is Aarav Sharma (rich demo student)
      const aaravUser = baseUsers.find(u => u.collegeId === '21CS042') || baseUsers[0];
      users.push(aaravUser);
      profiles[aaravUser.id] = baseProfiles[aaravUser.id];
      portfolioConfigs[aaravUser.id] = basePortfolioConfigs[aaravUser.id];

      // Add Aarav's skills, projects, etc.
      skills.push(...baseSkills.filter(s => s.studentId === aaravUser.id));
      projects.push(...baseProjects.filter(p => p.studentId === aaravUser.id));
      internships.push(...baseInternships.filter(intern => intern.studentId === aaravUser.id));
      certifications.push(...baseCertifications.filter(c => c.studentId === aaravUser.id));
      achievements.push(...baseAchievements.filter(a => a.studentId === aaravUser.id));
      documents.push(...baseDocuments.filter(d => d.studentId === aaravUser.id));
      continue;
    }

    // Deterministic student generation based on i
    const fn = firstNames[(i * 3 + 7) % firstNames.length];
    const ln = lastNames[(i * 5 + 11) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const userId = `user_${regNum.toLowerCase()}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@college.edu`;
    const avatar = avatarPhotos[i % avatarPhotos.length];
    const roleChoice = targetRoles[i % targetRoles.length];
    // Deterministic CGPA between 7.40 and 9.75
    const cgpa = Number((7.40 + ((i * 13) % 235) / 100).toFixed(2));
    const semester = (i % 2 === 0) ? 8 : 7;
    const phone = `+91 ${98000 + i} ${10000 + (i * 87) % 90000}`;
    const slug = `${fn.toLowerCase()}-${ln.toLowerCase()}-${regNum.toLowerCase()}`;

    const studentUser: User = {
      id: userId,
      name: fullName,
      email,
      role: 'student',
      avatar,
      department: 'Computer Science & Engineering',
      collegeId: regNum,
      phone
    };
    users.push(studentUser);

    const studentProfile: StudentProfile = {
      id: `prof_${userId}`,
      userId,
      name: fullName,
      email,
      rollNo: regNum,
      department: 'Computer Science & Engineering',
      degree: 'B.Tech in Computer Science & Engineering',
      currentSemester: semester,
      batch: '2021-2025',
      cgpa,
      phone,
      bio: `Final-year CSE undergraduate passionate about ${roleChoice}. Strong fundamentals in algorithms, cloud infrastructure, and software engineering principles.`,
      avatar,
      location: 'Bangalore, India',
      githubUrl: `https://github.com/${fn.toLowerCase()}-${regNum.toLowerCase()}`,
      linkedinUrl: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}`,
      portfolioSlug: slug,
      targetRole: roleChoice,
      aboutMe: `I am an ambitious computer science student at ACADMYX Institute of Technology specializing in ${roleChoice}. With a track record of rigorous coursework (CGPA ${cgpa}) and practical engineering projects, I enjoy tackling complex distributed architecture and building reliable digital solutions.`
    };
    profiles[userId] = studentProfile;

    // Deterministic Skills (5 skills per student)
    const skillList = [
      { name: 'Data Structures & Algorithms', cat: 'Technical' as const, prof: 'Advanced' as const, rating: 5, ver: true },
      { name: 'TypeScript & JavaScript', cat: 'Languages' as const, prof: 'Advanced' as const, rating: 4, ver: true },
      { name: 'Python & FastApi', cat: 'Languages' as const, prof: 'Intermediate' as const, rating: 4, ver: i % 2 === 0 },
      { name: 'React & TailwindCSS', cat: 'Tools & Frameworks' as const, prof: 'Advanced' as const, rating: 4, ver: true },
      { name: 'PostgreSQL & Database Design', cat: 'Technical' as const, prof: 'Intermediate' as const, rating: 4, ver: i % 3 === 0 },
      { name: 'Docker & Containerization', cat: 'Cloud & DevOps' as const, prof: 'Intermediate' as const, rating: 3, ver: i % 2 === 1 }
    ];

    skillList.forEach((sk, sIdx) => {
      skills.push({
        id: `skill_${userId}_${sIdx}`,
        studentId: userId,
        name: sk.name,
        category: sk.cat,
        proficiency: sk.prof,
        rating: sk.rating,
        isVerified: sk.ver,
        verifiedBy: sk.ver ? 'Dr. Ramesh Kumar (HOD CSE)' : undefined,
        verifiedAt: sk.ver ? '2025-01-15' : undefined,
        endorsementsCount: 3 + ((i + sIdx) % 15),
        evidenceNote: sk.ver ? 'Validated via lab coursework assessment and viva examination' : undefined
      });
    });

    // Deterministic Projects (2 projects per student)
    const p1 = projectTemplates[i % projectTemplates.length];
    const p2 = projectTemplates[(i + 2) % projectTemplates.length];

    projects.push(
      {
        id: `proj_${userId}_1`,
        studentId: userId,
        title: p1.title,
        description: p1.desc,
        category: p1.cat,
        role: p1.role,
        teamSize: 3,
        techStack: p1.tech,
        githubUrl: `https://github.com/${fn.toLowerCase()}/${p1.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        liveUrl: `https://${p1.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.acadmyx-demo.app`,
        startDate: '2024-07-01',
        endDate: '2024-11-30',
        isOngoing: false,
        featured: true,
        verifiedStatus: 'verified',
        verifiedBy: 'Dr. Ramesh Kumar'
      },
      {
        id: `proj_${userId}_2`,
        studentId: userId,
        title: p2.title,
        description: p2.desc,
        category: p2.cat,
        role: p2.role,
        teamSize: 2,
        techStack: p2.tech,
        githubUrl: `https://github.com/${fn.toLowerCase()}/${p2.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        startDate: '2024-12-01',
        isOngoing: true,
        featured: false,
        verifiedStatus: i % 2 === 0 ? 'verified' : 'pending'
      }
    );

    // Deterministic Internship (1 internship per student)
    const internTpl = internshipTemplates[i % internshipTemplates.length];
    internships.push({
      id: `intern_${userId}_1`,
      studentId: userId,
      company: internTpl.company,
      role: internTpl.role,
      location: internTpl.location,
      locationType: internTpl.type,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isCurrent: false,
      stipend: `₹${25000 + (i % 5) * 5000} / month`,
      description: internTpl.resp,
      technologies: internTpl.tech,
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Anita Desai'
    });

    // Deterministic Certification (1 certification per student)
    const certTpl = certTemplates[i % certTemplates.length];
    certifications.push({
      id: `cert_${userId}_1`,
      studentId: userId,
      title: certTpl.title,
      issuingOrganization: certTpl.issuer,
      issueDate: '2024-09-10',
      credentialId: `${certTpl.code}-${regNum}`,
      credentialUrl: `https://www.credly.com/badges/${regNum.toLowerCase()}`,
      skillsAcquired: [p1.tech[0] || 'Cloud', p1.tech[1] || 'TypeScript', 'Software Engineering'],
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Anita Desai',
      verifiedAt: '2024-09-20'
    });

    // Deterministic Achievement
    achievements.push({
      id: `ach_${userId}_1`,
      studentId: userId,
      title: `${i % 2 === 0 ? 'Smart India Hackathon Finalist' : 'National Coding Olympiad Top 50'}`,
      type: i % 2 === 0 ? 'Hackathon' : 'Honor & Award',
      description: `Represented institutional team at national collegiate finals solving computational challenges.`,
      date: '2024-10-18',
      positionOrAward: i % 2 === 0 ? 'State Finalist' : 'Rank 24',
      eventName: i % 2 === 0 ? 'Smart India Hackathon 2024' : 'National Collegiate Coding Challenge',
      organizedBy: 'Ministry of Education & AICTE',
      tags: ['National', 'Innovation', 'Engineering'],
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Ramesh Kumar'
    });

    // Deterministic Document
    documents.push({
      id: `doc_${userId}_1`,
      studentId: userId,
      title: 'Consolidated Semester Marksheet (Sem 1-6)',
      category: 'Marksheet',
      fileName: 'Consolidated_Marksheet_Official.pdf',
      fileSize: '1.4 MB',
      fileData: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      mimeType: 'application/pdf',
      uploadedAt: '2025-01-10',
      isVerified: true
    });

    // Portfolio Config
    const themes: ('modern-tech' | 'minimalist-scholar' | 'executive-indigo' | 'cyber-dark')[] = [
      'modern-tech', 'minimalist-scholar', 'executive-indigo', 'cyber-dark'
    ];
    portfolioConfigs[userId] = {
      theme: themes[i % themes.length],
      tagline: `Passionate about ${roleChoice} & Scalable Systems`,
      customIntro: `Welcome to my academic credentials and engineering portfolio at ACADMYX.`,
      accentColor: i % 2 === 0 ? '#4f46e5' : '#0ea5e9',
      visibleSections: {
        skills: true,
        projects: true,
        internships: true,
        certifications: true,
        achievements: true,
        contact: true
      }
    };
  }

  // Also include the other demo students (Priya, Rohan, Sneha)
  for (const user of baseUsers) {
    if (user.role === 'student' && user.collegeId !== '21CS042') {
      if (!users.some(u => u.id === user.id)) {
        users.push(user);
        if (baseProfiles[user.id]) profiles[user.id] = baseProfiles[user.id];
        if (basePortfolioConfigs[user.id]) portfolioConfigs[user.id] = basePortfolioConfigs[user.id];
        skills.push(...baseSkills.filter(s => s.studentId === user.id));
        projects.push(...baseProjects.filter(p => p.studentId === user.id));
        internships.push(...baseInternships.filter(intern => intern.studentId === user.id));
        certifications.push(...baseCertifications.filter(c => c.studentId === user.id));
        achievements.push(...baseAchievements.filter(a => a.studentId === user.id));
        documents.push(...baseDocuments.filter(d => d.studentId === user.id));
      }
    }
  }

  return {
    users,
    profiles,
    skills,
    projects,
    internships,
    certifications,
    achievements,
    documents,
    portfolioConfigs,
    verificationLogs
  };
}
