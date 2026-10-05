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
  VerificationLog,
  Workshop,
  Hackathon,
  Publication,
  Award
} from '../src/types/index.ts';

import {
  students100List,
  skills100List,
  projects100List,
  certifications100List,
  achievements100List,
  internships100List,
  workshops100List,
  hackathons100List,
  publications100List,
  awards100List
} from './seed100Data.ts';

// Core Faculty & Admin users
const staffUsers: User[] = [
  {
    id: 'user_faculty_ramesh',
    name: 'Dr. Ramesh Kumar',
    email: 'faculty@example.com',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    collegeId: 'FAC_CS_104',
    designation: 'Professor & Head of Review Board',
    phone: '+91 94432 11223',
    status: 'active'
  },
  {
    id: 'user_faculty_anita',
    name: 'Dr. Anita Desai',
    email: 'anita.desai@college.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Information Technology',
    collegeId: 'FAC_IT_209',
    designation: 'Associate Professor & Head of Campus Placements',
    phone: '+91 94432 99887',
    status: 'active'
  },
  {
    id: 'user_admin_ramanathan',
    name: 'Prof. V. K. Ramanathan',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Academic Administration',
    collegeId: 'ADMIN_001',
    designation: 'Dean of Academic Affairs & Accreditation Lead',
    phone: '+91 98888 77777',
    status: 'active'
  }
];

// Student users generated from 100 students list
const studentUsers: User[] = students100List.map((st) => {
  const isAarav = st.registerNumber === '21CS042';
  return {
    id: st.userId,
    name: st.name,
    email: isAarav ? 'student@example.com' : st.email,
    role: 'student' as const,
    avatar: st.avatar,
    department: st.department,
    collegeId: st.registerNumber,
    phone: st.phone,
    status: 'active' as const
  };
});

// Also create user_aarav alias so existing auth tokens continue working seamlessly
const aaravStudent = students100List.find(s => s.registerNumber === '21CS042')!;
const aaravAliasUser: User = {
  id: 'user_aarav',
  name: aaravStudent.name,
  email: 'aarav.sharma@college.edu',
  role: 'student',
  avatar: aaravStudent.avatar,
  department: aaravStudent.department,
  collegeId: '21CS042',
  phone: aaravStudent.phone,
  status: 'active'
};

export const initialUsers: User[] = [
  aaravAliasUser,
  ...staffUsers,
  ...studentUsers
];

export const initialProfiles: Record<string, StudentProfile> = {};

// Populate profiles mapped by userId and registerNumber
for (const st of students100List) {
  initialProfiles[st.userId] = st;
  // Also map to registerNumber lowercase for quick lookup
  initialProfiles[st.registerNumber.toLowerCase()] = st;
}
// Alias for user_aarav
initialProfiles['user_aarav'] = aaravStudent;

export const initialSkills: Skill[] = [
  ...skills100List
];

// Also duplicate Aarav's skills for user_aarav alias
for (const sk of skills100List.filter(s => s.studentId === 'user_21cs042')) {
  initialSkills.push({
    ...sk,
    id: sk.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialProjects: Project[] = [
  ...projects100List
];
for (const pr of projects100List.filter(p => p.studentId === 'user_21cs042')) {
  initialProjects.push({
    ...pr,
    id: pr.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialCertifications: Certification[] = [
  ...certifications100List
];
for (const ct of certifications100List.filter(c => c.studentId === 'user_21cs042')) {
  initialCertifications.push({
    ...ct,
    id: ct.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialAchievements: AcademicAchievement[] = [
  ...achievements100List
];
for (const ac of achievements100List.filter(a => a.studentId === 'user_21cs042')) {
  initialAchievements.push({
    ...ac,
    id: ac.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialInternships: Internship[] = [
  ...internships100List
];
for (const it of internships100List.filter(i => i.studentId === 'user_21cs042')) {
  initialInternships.push({
    ...it,
    id: it.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialWorkshops: Workshop[] = [
  ...workshops100List
];
for (const ws of workshops100List.filter(w => w.studentId === 'user_21cs042')) {
  initialWorkshops.push({
    ...ws,
    id: ws.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialHackathons: Hackathon[] = [
  ...hackathons100List
];
for (const hk of hackathons100List.filter(h => h.studentId === 'user_21cs042')) {
  initialHackathons.push({
    ...hk,
    id: hk.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialPublications: Publication[] = [
  ...publications100List
];
for (const pb of publications100List.filter(p => p.studentId === 'user_21cs042')) {
  initialPublications.push({
    ...pb,
    id: pb.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialAwards: Award[] = [
  ...awards100List
];
for (const aw of awards100List.filter(a => a.studentId === 'user_21cs042')) {
  initialAwards.push({
    ...aw,
    id: aw.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialDocuments: StudentDocument[] = [
  {
    id: 'doc_1',
    studentId: 'user_21cs042',
    title: 'Consolidated Semester Marksheet (Sem 1-7)',
    category: 'Marksheet',
    fileName: 'aarav_sharma_consolidated_grade_card.pdf',
    fileSize: '1.8 MB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
    mimeType: 'application/pdf',
    uploadedAt: '2026-01-12',
    isVerified: true
  },
  {
    id: 'doc_2',
    studentId: 'user_21cs042',
    title: 'AWS Certified Cloud Practitioner Certificate',
    category: 'Certificate',
    fileName: 'aws_cloud_practitioner_cert.pdf',
    fileSize: '740 KB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
    mimeType: 'application/pdf',
    uploadedAt: '2025-05-20',
    isVerified: true
  },
  {
    id: 'doc_3',
    studentId: 'user_21cs042',
    title: 'TechNova Solutions Internship Completion Letter',
    category: 'Certificate',
    fileName: 'technova_internship_completion_letter.pdf',
    fileSize: '1.2 MB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
    mimeType: 'application/pdf',
    uploadedAt: '2024-09-02',
    isVerified: true
  },
  {
    id: 'doc_4',
    studentId: 'user_21cs042',
    title: 'Smart India Hackathon 2024 Winner Certificate & Citation',
    category: 'Certificate',
    fileName: 'sih2024_winner_citation.pdf',
    fileSize: '2.1 MB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
    mimeType: 'application/pdf',
    uploadedAt: '2025-01-02',
    isVerified: true
  },
  {
    id: 'doc_5',
    studentId: 'user_21cs042',
    title: 'College ID Card',
    category: 'ID Proof',
    fileName: 'college_id_card_21cs042.jpg',
    fileSize: '450 KB',
    fileData: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    uploadedAt: '2024-08-01',
    isVerified: true
  },
  {
    id: 'doc_6',
    studentId: 'user_21cs042',
    title: 'Recommendation Letter - Dr. Ramesh Kumar (HOD CSE)',
    category: 'Recommendation Letter',
    fileName: 'lor_dr_ramesh_kumar_aarav.pdf',
    fileSize: '512 KB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg==',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-10',
    isVerified: true
  }
];

// Duplicate docs for user_aarav alias
for (const d of initialDocuments) {
  initialDocuments.push({
    ...d,
    id: d.id + '_alias',
    studentId: 'user_aarav'
  });
}

export const initialPortfolioConfigs: Record<string, PortfolioConfig> = {
  user_21cs042: {
    theme: 'modern-tech',
    tagline: 'Designing Resilient Distributed Cloud Systems & Modern Web Experiences',
    customIntro: 'Hi, I am Aarav Sharma! I am a final-year CS undergrad with a deep passion for cloud-native backends, microservices architecture, and high-performance frontend interfaces. Winner of Smart India Hackathon 2024 and AWS Certified.',
    accentColor: '#4f46e5',
    visibleSections: {
      skills: true,
      projects: true,
      internships: true,
      certifications: true,
      achievements: true,
      contact: true
    }
  },
  user_aarav: {
    theme: 'modern-tech',
    tagline: 'Designing Resilient Distributed Cloud Systems & Modern Web Experiences',
    customIntro: 'Hi, I am Aarav Sharma! I am a final-year CS undergrad with a deep passion for cloud-native backends, microservices architecture, and high-performance frontend interfaces. Winner of Smart India Hackathon 2024 and AWS Certified.',
    accentColor: '#4f46e5',
    visibleSections: {
      skills: true,
      projects: true,
      internships: true,
      certifications: true,
      achievements: true,
      contact: true
    }
  }
};

export const initialVerificationLogs: VerificationLog[] = [
  {
    id: 'log_1',
    itemId: 'ach_aarav_1',
    itemType: 'achievement',
    studentId: 'user_21cs042',
    studentName: 'Aarav Sharma',
    reviewerId: 'user_faculty_ramesh',
    reviewerName: 'Dr. Ramesh Kumar',
    action: 'approved',
    comment: 'Verified with official departmental convocation award list.',
    timestamp: '2024-11-20 14:30'
  },
  {
    id: 'log_2',
    itemId: 'cert_aarav_1',
    itemType: 'certification',
    studentId: 'user_21cs042',
    studentName: 'Aarav Sharma',
    reviewerId: 'user_faculty_anita',
    reviewerName: 'Dr. Anita Desai',
    action: 'approved',
    comment: 'Valid AWS Cloud Practitioner credential verified via Amazon verification portal.',
    timestamp: '2024-06-01 11:15'
  },
  {
    id: 'log_3',
    itemId: 'proj_aarav_1',
    itemType: 'project',
    studentId: 'user_21cs042',
    studentName: 'Aarav Sharma',
    reviewerId: 'user_faculty_ramesh',
    reviewerName: 'Dr. Ramesh Kumar',
    action: 'approved',
    comment: 'Demonstrated live in CSE departmental lab. Outstanding test coverage and predictive accuracy.',
    timestamp: '2025-12-20 16:45'
  }
];
