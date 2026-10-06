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

// -------------------------------------------------------------
// Staff & Administrator Personas
// -------------------------------------------------------------
export const staffUsers: User[] = [
  {
    id: 'user_faculty_ramesh',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@college.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    collegeId: 'FAC_CS_104',
    designation: 'Professor & Head of Department',
    phone: '+91 94432 11223'
  },
  {
    id: 'user_faculty_anita',
    name: 'Dr. Anita Desai',
    email: 'anita.desai@college.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Information Technology',
    collegeId: 'FAC_IT_209',
    designation: 'Associate Professor & Placement Head',
    phone: '+91 94432 99887'
  },
  {
    id: 'user_admin_ramanathan',
    name: 'Prof. V. K. Ramanathan',
    email: 'dean.academics@college.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Academic Administration',
    collegeId: 'ADMIN_001',
    designation: 'Dean of Academic Affairs & Accreditation Lead',
    phone: '+91 98888 77777'
  }
];

// -------------------------------------------------------------
// Primary Rich Demo Student: Aarav Sharma (21CS042)
// -------------------------------------------------------------
export const aaravUser: User = {
  id: 'user_aarav',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Computer Science & Engineering',
  collegeId: '21CS042',
  phone: '+91 98765 43210'
};

export const aaravProfile: StudentProfile = {
  id: 'prof_aarav',
  userId: 'user_aarav',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  rollNo: '21CS042',
  registerNumber: '21CS042',
  department: 'Computer Science & Engineering',
  degree: 'B.Tech in Computer Science',
  currentSemester: 8,
  batch: '2021-2025',
  cgpa: 9.12,
  phone: '+91 98765 43210',
  bio: 'Aspiring Cloud & Full-Stack Architect with a focus on scalable distributed systems, microservices, and AI integrations. Smart India Hackathon Winner 2024.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  location: 'Bangalore, India',
  githubUrl: 'https://github.com/aarav-sharma-dev',
  linkedinUrl: 'https://linkedin.com/in/aarav-sharma-tech',
  websiteUrl: 'https://aaravsharma.dev',
  portfolioSlug: 'aarav-sharma',
  targetRole: 'Full Stack & Cloud Solutions Engineer',
  aboutMe: 'Final-year Computer Science undergraduate with hands-on experience building high-throughput systems, cloud-native deployments, and intuitive web interfaces. Experienced in modern TypeScript, React, Go, and AWS cloud architectures.'
};

export const aaravSkills: Skill[] = [
  {
    id: 'skill_aarav_1',
    studentId: 'user_aarav',
    name: 'TypeScript & JavaScript',
    category: 'Languages',
    proficiency: 'Advanced',
    rating: 5,
    isVerified: true,
    verifiedBy: 'Dr. Ramesh Kumar (HOD CSE)',
    verifiedAt: '2024-11-10',
    endorsementsCount: 14,
    evidenceNote: 'Demonstrated in Advanced Web Systems course project and lab viva'
  },
  {
    id: 'skill_aarav_2',
    studentId: 'user_aarav',
    name: 'React & Next.js',
    category: 'Tools & Frameworks',
    proficiency: 'Advanced',
    rating: 5,
    isVerified: true,
    verifiedBy: 'Dr. Anita Desai',
    verifiedAt: '2024-10-15',
    endorsementsCount: 19
  },
  {
    id: 'skill_aarav_3',
    studentId: 'user_aarav',
    name: 'Go & Distributed Systems',
    category: 'Languages',
    proficiency: 'Intermediate',
    rating: 4,
    isVerified: true,
    verifiedBy: 'Dr. Ramesh Kumar',
    verifiedAt: '2024-12-01',
    endorsementsCount: 8
  },
  {
    id: 'skill_aarav_4',
    studentId: 'user_aarav',
    name: 'AWS Cloud Architecture',
    category: 'Cloud & DevOps',
    proficiency: 'Advanced',
    rating: 4,
    isVerified: true,
    verifiedBy: 'Dr. Anita Desai',
    verifiedAt: '2024-09-20',
    endorsementsCount: 12,
    evidenceNote: 'Backed by AWS Solutions Architect Associate credential'
  },
  {
    id: 'skill_aarav_5',
    studentId: 'user_aarav',
    name: 'PostgreSQL & Database Design',
    category: 'Technical',
    proficiency: 'Advanced',
    rating: 4,
    isVerified: true,
    verifiedBy: 'Dr. Ramesh Kumar',
    verifiedAt: '2024-11-05',
    endorsementsCount: 11
  },
  {
    id: 'skill_aarav_6',
    studentId: 'user_aarav',
    name: 'Docker & Kubernetes',
    category: 'Cloud & DevOps',
    proficiency: 'Intermediate',
    rating: 4,
    isVerified: false,
    endorsementsCount: 6
  }
];

export const aaravProjects: Project[] = [
  {
    id: 'proj_aarav_1',
    studentId: 'user_aarav',
    title: 'CloudScale: Distributed Telemetry & Anomaly Platform',
    description: 'High-throughput time-series telemetry platform processing 45,000 metrics/sec with automated isolation trees for real-time anomaly detection.',
    category: 'Distributed Systems & Cloud',
    role: 'Lead Architect & Backend Engineer',
    teamSize: 3,
    techStack: ['Go', 'TypeScript', 'React', 'TimescaleDB', 'Docker', 'Kubernetes'],
    liveUrl: 'https://cloudscale.telemetry-demo.internal',
    githubUrl: 'https://github.com/aarav-sharma-dev/cloudscale-telemetry',
    startDate: '2024-06-01',
    endDate: '2024-11-15',
    isOngoing: false,
    featured: true,
    mentorName: 'Dr. Ramesh Kumar',
    verifiedStatus: 'verified',
    facultyFeedback: 'Excellent scalable architecture with clean benchmarks demonstrated in departmental viva.',
    verifiedBy: 'Dr. Ramesh Kumar',
    verifiedAt: '2024-12-05'
  },
  {
    id: 'proj_aarav_2',
    studentId: 'user_aarav',
    title: 'AI Smart Campus Attendance & Surveillance Portal',
    description: 'Computer vision assisted touchless attendance scanner using edge tensor pipelines with anti-spoofing liveness verification.',
    category: 'Computer Vision & AI',
    role: 'Full Stack Engineer',
    teamSize: 4,
    techStack: ['Python', 'OpenCV', 'PyTorch', 'FastAPI', 'React', 'TailwindCSS'],
    liveUrl: 'https://campus-vision.internal-lab.net',
    githubUrl: 'https://github.com/aarav-sharma-dev/campus-vision-portal',
    startDate: '2024-01-10',
    endDate: '2024-05-20',
    isOngoing: false,
    featured: true,
    verifiedStatus: 'verified',
    facultyFeedback: 'Deployed across 4 campus lecture halls for beta evaluation.',
    verifiedBy: 'Dr. Anita Desai',
    verifiedAt: '2024-06-02'
  }
];

export const aaravInternships: Internship[] = [
  {
    id: 'intern_aarav_1',
    studentId: 'user_aarav',
    company: 'Razorpay Software',
    role: 'Backend Platform Engineer Intern',
    location: 'Bangalore, India',
    locationType: 'Hybrid',
    startDate: '2024-05-15',
    endDate: '2024-08-15',
    isCurrent: false,
    stipend: '₹45,000 / month',
    description: 'Designed webhook idempotency layer and asynchronous payment status retry queue handling 2.4M daily transactions with 99.99% reliability.',
    technologies: ['Go', 'Kafka', 'Redis', 'AWS Lambda', 'MySQL'],
    verifiedStatus: 'verified',
    facultyFeedback: 'Verified with official completion certificate and corporate HR letter.',
    verifiedBy: 'Dr. Anita Desai',
    verifiedAt: '2024-09-02'
  }
];

export const aaravCertifications: Certification[] = [
  {
    id: 'cert_aarav_1',
    studentId: 'user_aarav',
    title: 'AWS Certified Solutions Architect – Associate',
    issuingOrganization: 'Amazon Web Services',
    issueDate: '2024-05-20',
    credentialId: 'AWS-SAA-8849201',
    credentialUrl: 'https://www.credly.com/badges/aws-solutions-architect-aarav',
    skillsAcquired: ['Cloud Architecture', 'AWS IAM', 'VPC Peering', 'High Availability Design', 'S3 & DynamoDB'],
    verifiedStatus: 'verified',
    facultyFeedback: 'Credential verified directly via Credly public API verification link.',
    verifiedBy: 'Dr. Anita Desai',
    verifiedAt: '2024-06-01'
  },
  {
    id: 'cert_aarav_2',
    studentId: 'user_aarav',
    title: 'Meta Professional Certified Front-End Developer',
    issuingOrganization: 'Meta & Coursera',
    issueDate: '2023-11-15',
    credentialId: 'META-FE-9938210',
    credentialUrl: 'https://www.coursera.org/verify/professional-cert/meta-aarav',
    skillsAcquired: ['React', 'JavaScript', 'CSS UI Architecture', 'Web Accessibility'],
    verifiedStatus: 'verified',
    verifiedBy: 'Dr. Ramesh Kumar',
    verifiedAt: '2023-12-02'
  }
];

export const aaravAchievements: AcademicAchievement[] = [
  {
    id: 'ach_aarav_1',
    studentId: 'user_aarav',
    title: 'Smart India Hackathon 2024 – 1st Place National Winner',
    type: 'Hackathon',
    date: '2024-11-18',
    positionOrAward: '1st Place & ₹1,00,000 Cash Prize',
    eventName: 'Smart India Hackathon Grand Finale 2024',
    organizedBy: 'Ministry of Education & AICTE, Govt. of India',
    description: 'Developed automated flood alert telemetry mesh for remote rural watersheds. Chosen as national winner out of 1,200+ collegiate submissions.',
    tags: ['National Winner', 'AICTE', 'IoT Mesh', 'Disaster Relief'],
    verifiedStatus: 'verified',
    facultyFeedback: 'Official AICTE winner certificate presented to institutional Dean.',
    verifiedBy: 'Dr. Ramesh Kumar',
    verifiedAt: '2024-11-20'
  }
];

export const aaravDocuments: StudentDocument[] = [
  {
    id: 'doc_aarav_1',
    studentId: 'user_aarav',
    title: 'Consolidated Semester Marksheet (Sem 1-7)',
    category: 'Marksheet',
    fileName: 'aarav_sharma_consolidated_grade_card.pdf',
    fileSize: '1.8 MB',
    fileData: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2025-01-12',
    isVerified: true
  },
  {
    id: 'doc_aarav_2',
    studentId: 'user_aarav',
    title: 'AWS Certified Solutions Architect Official Badge & Certificate',
    category: 'Certificate',
    fileName: 'aws_solutions_architect_certificate.pdf',
    fileSize: '740 KB',
    fileData: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2024-05-22',
    isVerified: true
  }
];

export const aaravPortfolioConfig: PortfolioConfig = {
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

// -------------------------------------------------------------
// Deterministic 100 Students Generator (21CS001 through 21CS100)
// -------------------------------------------------------------
const firstNames = [
  'Aditya', 'Ananya', 'Rohan', 'Sneha', 'Vikram',
  'Divya', 'Karan', 'Pooja', 'Siddharth', 'Meera',
  'Arjun', 'Isha', 'Rahul', 'Tanvi', 'Varun',
  'Kavya', 'Gautam', 'Rhea', 'Manish', 'Neha',
  'Naveen', 'Sanya', 'Akash', 'Shruti', 'Harsh',
  'Anjali', 'Deepak', 'Swati', 'Kunal', 'Preeti',
  'Pranav', 'Ritu', 'Abhishek', 'Pallavi', 'Suresh',
  'Bhavna', 'Vivek', 'Simran', 'Sachin', 'Nandini',
  'Rohit', 'Tarun', 'Anushka', 'Chetan', 'Shreya',
  'Mayank', 'Geeta', 'Vishal', 'Komal', 'Deepika'
];

const lastNames = [
  'Verma', 'Patel', 'Iyer', 'Reddy', 'Singh',
  'Nair', 'Gupta', 'Rao', 'Chopra', 'Menon',
  'Bose', 'Deshmukh', 'Kulkarni', 'Joshi', 'Bhat',
  'Pandey', 'Saxena', 'Mukherjee', 'Pillai', 'Mehta'
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

export function generateAll100StudentsData() {
  const users: User[] = [...staffUsers];
  const profiles: Record<string, StudentProfile> = {};
  const skills: Skill[] = [];
  const projects: Project[] = [];
  const internships: Internship[] = [];
  const certifications: Certification[] = [];
  const achievements: AcademicAchievement[] = [];
  const documents: StudentDocument[] = [];
  const portfolioConfigs: Record<string, PortfolioConfig> = {};
  const verificationLogs: VerificationLog[] = [
    {
      id: 'log_1',
      itemId: 'ach_aarav_1',
      itemType: 'achievement',
      studentId: 'user_aarav',
      studentName: 'Aarav Sharma',
      reviewerId: 'user_faculty_ramesh',
      reviewerName: 'Dr. Ramesh Kumar',
      action: 'approved',
      comment: 'Verified with official AICTE winner list.',
      timestamp: '2024-11-20 14:30'
    },
    {
      id: 'log_2',
      itemId: 'cert_aarav_1',
      itemType: 'certification',
      studentId: 'user_aarav',
      studentName: 'Aarav Sharma',
      reviewerId: 'user_faculty_anita',
      reviewerName: 'Dr. Anita Desai',
      action: 'approved',
      comment: 'Valid AWS Solutions Architect credential verified via Credly.',
      timestamp: '2024-06-01 11:15'
    }
  ];

  for (let i = 1; i <= 100; i++) {
    const regNum = `21CS${i.toString().padStart(3, '0')}`;

    if (i === 42) {
      // 21CS042 is Aarav Sharma (rich demo student)
      users.push(aaravUser);
      profiles[aaravUser.id] = aaravProfile;
      profiles['user_21cs042'] = aaravProfile;
      profiles['21cs042'] = aaravProfile;
      portfolioConfigs[aaravUser.id] = aaravPortfolioConfig;
      portfolioConfigs['user_21cs042'] = aaravPortfolioConfig;

      skills.push(...aaravSkills);
      projects.push(...aaravProjects);
      internships.push(...aaravInternships);
      certifications.push(...aaravCertifications);
      achievements.push(...aaravAchievements);
      documents.push(...aaravDocuments);
      continue;
    }

    const fn = firstNames[(i * 3 + 7) % firstNames.length];
    const ln = lastNames[(i * 5 + 11) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const userId = `user_${regNum.toLowerCase()}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@college.edu`;
    const avatar = avatarPhotos[i % avatarPhotos.length];
    const roleChoice = targetRoles[i % targetRoles.length];
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
      registerNumber: regNum,
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
    profiles[regNum.toLowerCase()] = studentProfile;

    // 5 Skills per student
    const skillDefs = [
      { name: 'Data Structures & Algorithms', cat: 'Technical' as const, prof: 'Advanced' as const, rating: 5, ver: true },
      { name: 'TypeScript & JavaScript', cat: 'Languages' as const, prof: 'Advanced' as const, rating: 4, ver: true },
      { name: 'Python & FastAPI', cat: 'Languages' as const, prof: 'Intermediate' as const, rating: 4, ver: i % 2 === 0 },
      { name: 'React & TailwindCSS', cat: 'Tools & Frameworks' as const, prof: 'Advanced' as const, rating: 4, ver: true },
      { name: 'PostgreSQL & Database Design', cat: 'Technical' as const, prof: 'Intermediate' as const, rating: 4, ver: i % 3 === 0 }
    ];

    skillDefs.forEach((sk, sIdx) => {
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
        endorsementsCount: 3 + ((i + sIdx) % 15)
      });
    });

    // 2 Projects per student
    projects.push(
      {
        id: `proj_${userId}_1`,
        studentId: userId,
        title: `${fn}'s Smart Campus AI Gateway`,
        description: 'Automated telemetry tracking with facial verification, live anomaly alerts, and automated report generation.',
        category: 'Computer Vision & AI',
        role: 'Lead Architect',
        teamSize: 3,
        techStack: ['Python', 'FastAPI', 'React', 'Docker'],
        githubUrl: `https://github.com/${fn.toLowerCase()}/campus-gateway`,
        liveUrl: `https://gateway-${regNum.toLowerCase()}.acadmyx-demo.app`,
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
        title: `Distributed High-Throughput Message Broker`,
        description: 'Event-driven multi-tenant message pipeline processing transactions with idempotency and distributed tracing.',
        category: 'Full Stack & Cloud',
        role: 'Backend Developer',
        teamSize: 2,
        techStack: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
        githubUrl: `https://github.com/${fn.toLowerCase()}/message-broker`,
        startDate: '2024-12-01',
        isOngoing: true,
        featured: false,
        verifiedStatus: i % 2 === 0 ? 'verified' : 'pending'
      }
    );

    // 1 Internship per student
    internships.push({
      id: `intern_${userId}_1`,
      studentId: userId,
      company: i % 2 === 0 ? 'Cisco Systems' : 'Razorpay Software',
      role: 'Software Engineering Intern',
      location: 'Bangalore, India',
      locationType: 'Hybrid',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isCurrent: false,
      stipend: `₹${30000 + (i % 4) * 5000} / month`,
      description: 'Built high-throughput services and automated deployment pipelines across cloud infrastructure.',
      technologies: ['TypeScript', 'Go', 'Docker', 'PostgreSQL'],
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Anita Desai'
    });

    // 1 Certification per student
    certifications.push({
      id: `cert_${userId}_1`,
      studentId: userId,
      title: i % 2 === 0 ? 'AWS Certified Solutions Architect – Associate' : 'Meta Professional Front-End Developer',
      issuingOrganization: i % 2 === 0 ? 'Amazon Web Services' : 'Meta',
      issueDate: '2024-09-10',
      credentialId: `CERT-${regNum}-PRO`,
      credentialUrl: `https://www.credly.com/badges/${regNum.toLowerCase()}`,
      skillsAcquired: ['Cloud Computing', 'TypeScript', 'Software Engineering'],
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Anita Desai',
      verifiedAt: '2024-09-20'
    });

    // 1 Achievement per student
    achievements.push({
      id: `ach_${userId}_1`,
      studentId: userId,
      title: i % 2 === 0 ? 'Smart India Hackathon Finalist' : 'National Collegiate Coding Challenge Top 50',
      type: i % 2 === 0 ? 'Hackathon' : 'Honor & Award',
      description: 'Represented institutional team at national collegiate finals solving computational challenges.',
      date: '2024-10-18',
      positionOrAward: i % 2 === 0 ? 'State Finalist' : 'Rank 24',
      eventName: i % 2 === 0 ? 'Smart India Hackathon 2024' : 'National Collegiate Coding Challenge',
      organizedBy: 'Ministry of Education & AICTE',
      tags: ['National', 'Innovation', 'Engineering'],
      verifiedStatus: 'verified',
      verifiedBy: 'Dr. Ramesh Kumar'
    });

    // 1 Document per student
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

const seedAll = generateAll100StudentsData();
export const initialUsers = seedAll.users;
export const initialProfiles = seedAll.profiles;
export const initialSkills = seedAll.skills;
export const initialProjects = seedAll.projects;
export const initialInternships = seedAll.internships;
export const initialCertifications = seedAll.certifications;
export const initialAchievements = seedAll.achievements;
export const initialDocuments = seedAll.documents;
export const initialPortfolioConfigs = seedAll.portfolioConfigs;
export const initialVerificationLogs = seedAll.verificationLogs;
