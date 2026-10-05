const fs = require('fs');
const path = require('path');

const names = [
  "Aditya Kulkarni", "Ananya Iyer", "Arjun Nair", "Bhavna Swaminathan", "Chetan Reddy",
  "Deepika Menon", "Devendra Joshi", "Divya Raghavan", "Eshwar Choudhury", "Farhan Akhtar",
  "Gautam Venkat", "Geetha Sundaram", "Harish Nambiar", "Hemalatha Pillai", "Ishaan Roy",
  "Janani Balasubramanian", "Jitendra Sengupta", "Kavya Subramaniam", "Kiran Varma", "Lakshmi Narayanan",
  "Madhavan Natesan", "Meera Namboodiri", "Mithun Deshmukh", "Nandini Krishnamurthy", "Nikhil Bhat",
  "Nithya Rajagopalan", "Pranav Hegde", "Pooja Srinivasan", "Pradeep Shenoy", "Preeti Mahadevan",
  "Rahul Bhattacharya", "Rajeshwari Ganesan", "Rakesh Pai", "Rashmi Chandran", "Rohan Bhatt",
  "Rohini Sridharan", "Sachin Prabhu", "Sandhya Parthasarathy", "Sanjay Rao", "Santhosh Singaravelu",
  "Saraswathi Natarajan", "Aarav Sharma", "Saravanan Murugan", "Shalini Raman", "Shankar Viswanathan",
  "Shilpa Ranganathan", "Shrikant Gokhale", "Shruti Devanathan", "Siddharth Kamath", "Sneha Venkatesh",
  "Sowmya Radhakrishnan", "Srikanth Iyengar", "Srinivas Ananth", "Subhashree Murali", "Sudhir Nayak",
  "Sujatha Vasudevan", "Sumanth Kulkarni", "Sunita Padmanabhan", "Suresh Kumar", "Swaminathan Seshadri",
  "Tarun Goswami", "Tejaswini Kashyap", "Uday Kiran", "Uma Maheshwari", "Varun Chawla",
  "Vasudha Seshagiri", "Venkatesh Prasad", "Vidya Jayaraman", "Vigneshwaran Thangavel", "Vijay Anand",
  "Vikramaditya Bose", "Vimalanathan Chettiar", "Vinayaka Bhat", "Vineetha Unnikrishnan", "Vishal Somany",
  "Vivek Rangachari", "Yashwanth Reddy", "Yogeshwar Dutt", "Abhiram Govindarajan", "Aditi Deshpande",
  "Ajith Kumar", "Akshaya Parthiban", "Amrita Sengupta", "Anand Swamy", "Anirudh Koushik",
  "Aravindhan Selvam", "Archana Murthy", "Ashwin Sundar", "Balamurugan Velu", "Chitra Lakshmanan",
  "Dharani Sethuraman", "Dinesh Karthik", "Gayathri Ramaswamy", "Gokul Prasad", "Hariharan Sitaraman",
  "Indira Soundararajan", "Jayashree Natarajan", "Karthik Raja", "Keerthana Vijay", "Lokesh Raghavendra"
];

const targetRoles = [
  "Full Stack Cloud Engineer",
  "Machine Learning & AI Specialist",
  "Backend & Distributed Systems Architect",
  "DevOps & Site Reliability Engineer",
  "Data Platform Engineer",
  "Cybersecurity Analyst",
  "Mobile & Cross-Platform Developer",
  "Embedded IoT Firmware Engineer",
  "Frontend & UI/UX Engineer",
  "Database & Cloud Solutions Architect"
];

const techPacks = [
  ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL"],
  ["Python", "PyTorch", "Hugging Face", "FastAPI", "MongoDB"],
  ["Java", "Spring Boot", "Kafka", "Redis", "MySQL"],
  ["Go", "Kubernetes", "AWS", "Terraform", "Prometheus"],
  ["React Native", "Flutter", "Firebase", "Redux", "GraphQL"],
  ["Rust", "C++", "Linux Kernel", "WebAssembly", "Git"],
  ["Python", "Pandas", "Apache Spark", "Airflow", "BigQuery"],
  ["TypeScript", "Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
  ["C", "FreeRTOS", "ESP32", "MQTT", "ARM Cortex"],
  ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "Hardhat"]
];

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
];

const all100Students = [];
const allSkills = [];
const allProjects = [];
const allCertifications = [];
const allAchievements = [];
const allInternships = [];
const allWorkshops = [];
const allHackathons = [];
const allPublications = [];
const allAwards = [];

for (let i = 1; i <= 100; i++) {
  const regNumber = "21CS" + String(i).padStart(3, '0');
  const userId = "user_" + regNumber.toLowerCase();
  const name = names[i - 1];
  const isAarav = regNumber === "21CS042";

  const cgpa = isAarav ? 9.12 : parseFloat((7.3 + ((i * 17) % 24) * 0.1).toFixed(2));
  const attendance = isAarav ? 92 : 78 + ((i * 11) % 20);
  const credits = isAarav ? 148 : 140 + ((i * 7) % 18);
  const avatar = isAarav ? avatars[0] : avatars[i % avatars.length];
  const role = isAarav ? "Full Stack & Cloud Solutions Engineer" : targetRoles[i % targetRoles.length];
  const email = isAarav ? "student@example.com" : `${name.toLowerCase().replace(/[^a-z]/g, '.')}.${regNumber.toLowerCase()}@college.edu`;
  const portfolioSlug = isAarav ? "aarav-sharma" : `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${regNumber.toLowerCase()}`;

  const studentObj = {
    id: `prof_${regNumber.toLowerCase()}`,
    userId,
    name,
    email,
    rollNo: regNumber,
    registerNumber: regNumber,
    department: "Computer Science & Engineering",
    course: "B.Tech Computer Science",
    degree: "B.Tech in Computer Science & Engineering",
    specialization: isAarav ? "Cloud Computing & Systems Architecture" : (i % 2 === 0 ? "Artificial Intelligence & Data Analytics" : "Software Systems & Cloud Architecture"),
    year: "Final Year",
    currentSemester: 8,
    batch: "2021-2025",
    graduationYear: "2025",
    cgpa,
    attendance,
    creditsCompleted: credits,
    creditsTotal: 160,
    phone: `+91 98${String(10000000 + i * 81711).slice(0, 8)}`,
    bio: isAarav
      ? "Aspiring Cloud & Full-Stack Architect with a focus on scalable distributed systems, microservices, and AI integrations. Smart India Hackathon Winner 2024."
      : `Final year Computer Science undergraduate passionate about ${role.toLowerCase()}, algorithms, and modern software architectures.`,
    careerObjective: isAarav
      ? "To leverage scalable cloud infrastructures, distributed systems design, and microservices architecture to develop enterprise-grade web applications in tier-1 product organizations."
      : `To excel as a professional ${role} contributing to impactful engineering teams and innovative software solutions.`,
    aboutMe: isAarav
      ? "Final-year Computer Science undergraduate with hands-on experience building high-throughput systems, cloud-native deployments, and intuitive web interfaces. Experienced in modern TypeScript, React, Go, and AWS cloud architectures."
      : `Undergraduate student with strong foundation in data structures, algorithms, and practical software development. Active participant in technical clubs, hackathons, and departmental initiatives.`,
    avatar,
    location: "Bangalore, India",
    githubUrl: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}-${regNumber.toLowerCase()}`,
    linkedinUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z]/g, '')}-${regNumber.toLowerCase()}`,
    websiteUrl: `https://${name.toLowerCase().replace(/[^a-z]/g, '')}.dev`,
    portfolioSlug,
    targetRole: role,
    status: "Active",
    portfolioScore: Math.min(100, Math.round(cgpa * 8 + 20)),
    careerReadinessScore: Math.min(100, Math.round(cgpa * 9 + 12)),
    educationHistory: [
      {
        level: "Undergraduate (B.Tech)",
        institution: "College of Engineering & Technology",
        boardOrUniversity: "Autonomous State Technological University",
        yearOfPassing: "2025",
        scoreOrGrade: `${cgpa} CGPA`
      },
      {
        level: "Higher Secondary (12th / PUC)",
        institution: "National Public Pre-University College",
        boardOrUniversity: "State Pre-University Examination Board",
        yearOfPassing: "2021",
        scoreOrGrade: isAarav ? "95.4%" : `${(85 + (i % 12))}.2%`
      },
      {
        level: "Secondary School (10th / CBSE)",
        institution: "Kendriya Vidyalaya Academy",
        boardOrUniversity: "Central Board of Secondary Education",
        yearOfPassing: "2019",
        scoreOrGrade: isAarav ? "96.8%" : `${(87 + (i % 11))}.0%`
      }
    ],
    socialLinks: {
      github: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}`,
      linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/[^a-z]/g, '')}`,
      leetcode: `https://leetcode.com/${name.toLowerCase().replace(/[^a-z]/g, '')}`
    }
  };

  all100Students.push(studentObj);

  if (isAarav) {
    const aaravSkillNames = ["React", "TypeScript", "Node.js", "Python", "Java", "SQL", "Machine Learning", "AWS", "Git", "Communication"];
    aaravSkillNames.forEach((sName, sIdx) => {
      allSkills.push({
        id: `skill_aarav_${sIdx}`,
        studentId: userId,
        name: sName,
        category: ["React", "TypeScript", "Node.js"].includes(sName) ? "Web Development" :
                  ["Python", "Java"].includes(sName) ? "Programming" :
                  sName === "SQL" ? "Database" :
                  sName === "AWS" ? "Cloud" :
                  sName === "Machine Learning" ? "AI/ML" :
                  sName === "Communication" ? "Soft Skills" : "Tools & Frameworks",
        proficiency: ["React", "TypeScript", "AWS"].includes(sName) ? "Expert" : "Advanced",
        rating: 5,
        isVerified: true,
        verifiedBy: "Dr. Ramesh Kumar (HOD CSE)",
        verifiedAt: "2026-02-15",
        endorsementsCount: 15 + sIdx,
        evidenceNote: "Verified via lab coursework, coursework projects, and faculty technical interview."
      });
    });

    allProjects.push(
      {
        id: "proj_aarav_1",
        studentId: userId,
        title: "AI-Based Student Performance Prediction",
        description: "Predicts student semester GPA and academic intervention risks using historical grade vectors and gradient boosting regression models with a FastAPI web dashboard.",
        category: "Machine Learning & Academic Tech",
        projectType: "Major Project",
        role: "Lead ML Architect & Backend Developer",
        teamSize: 3,
        techStack: ["Python", "Scikit-Learn", "FastAPI", "React", "PostgreSQL", "Docker"],
        githubUrl: "https://github.com/aarav-sharma-dev/student-performance-ai",
        liveUrl: "https://student-ai-predict.college.edu",
        startDate: "2025-08-01",
        endDate: "2025-12-15",
        isOngoing: false,
        featured: true,
        outcome: "Achieved 94.2% prediction precision; piloted across 3 departments.",
        mentorName: "Dr. Ramesh Kumar",
        verifiedStatus: "verified",
        facultyFeedback: "Excellent predictive validation. Methodology accepted in departmental conference.",
        verifiedBy: "Dr. Ramesh Kumar",
        verifiedAt: "2025-12-20"
      },
      {
        id: "proj_aarav_2",
        studentId: userId,
        title: "Smart Attendance Management System",
        description: "Automated student attendance tracking utilizing dynamic rotating QR encryption tokens, geo-fencing, and WebSocket real-time classroom lecture logs.",
        category: "Full-Stack Web & Security",
        projectType: "Academic",
        role: "Full Stack Engineer & Team Lead",
        teamSize: 4,
        techStack: ["React", "TypeScript", "Node.js", "Redis", "PostgreSQL", "Tailwind CSS"],
        githubUrl: "https://github.com/aarav-sharma-dev/smart-attendance-sys",
        liveUrl: "https://attendance.college.edu",
        startDate: "2025-01-10",
        endDate: "2025-05-20",
        isOngoing: false,
        featured: true,
        outcome: "Reduced daily classroom manual roll-call overhead by 85%.",
        mentorName: "Dr. Anita Desai",
        verifiedStatus: "verified",
        facultyFeedback: "Adopted campus-wide for intra-collegiate workshops.",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2025-06-02"
      },
      {
        id: "proj_aarav_3",
        studentId: userId,
        title: "Student Portfolio Management Platform",
        description: "Enterprise SaaS platform enabling undergraduates to record verified academic milestones, generate ATS-ready formatted resumes, and publish shareable verified web portfolios.",
        category: "Enterprise Web Systems",
        projectType: "Major Project",
        role: "Principal Architect",
        teamSize: 2,
        techStack: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Prisma", "Express"],
        githubUrl: "https://github.com/aarav-sharma-dev/acadmy-platform",
        liveUrl: "https://acadmy.college.edu",
        startDate: "2025-10-01",
        endDate: "2026-03-15",
        isOngoing: false,
        featured: true,
        outcome: "Showcased as Departmental Final Year Capstone Benchmark.",
        mentorName: "Dr. Ramesh Kumar",
        verifiedStatus: "verified",
        facultyFeedback: "Outstanding engineering rigor and practical utility for university NAAC auditing.",
        verifiedBy: "Dr. Ramesh Kumar",
        verifiedAt: "2026-03-20"
      }
    );

    allCertifications.push(
      {
        id: "cert_aarav_1",
        studentId: userId,
        title: "AWS Cloud Practitioner (CLF-C02)",
        issuingOrganization: "Amazon Web Services (AWS)",
        issueDate: "2024-05-18",
        expiryDate: "2027-05-18",
        credentialId: "AWS-CLF-89210492",
        credentialUrl: "https://aws.amazon.com/verification/AWS-CLF-89210492",
        skillsAcquired: ["AWS Cloud Architecture", "VPC", "EC2", "S3", "IAM Security"],
        verifiedStatus: "verified",
        facultyFeedback: "Credly verified and recorded in university placement registry.",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2024-06-01"
      },
      {
        id: "cert_aarav_2",
        studentId: userId,
        title: "Google Data Analytics Professional Certificate",
        issuingOrganization: "Google via Coursera",
        issueDate: "2024-09-12",
        credentialId: "COURSERA-GDA-77192",
        credentialUrl: "https://coursera.org/verify/COURSERA-GDA-77192",
        skillsAcquired: ["SQL", "R Programming", "Tableau", "Data Cleansing", "Statistical Analysis"],
        verifiedStatus: "verified",
        facultyFeedback: "Verified with official Coursera Certificate ID.",
        verifiedBy: "Dr. Ramesh Kumar",
        verifiedAt: "2024-09-20"
      },
      {
        id: "cert_aarav_3",
        studentId: userId,
        title: "Python Programming & Data Structures Specialization",
        issuingOrganization: "University of Michigan via Coursera",
        issueDate: "2023-11-20",
        credentialId: "MICH-PY-440192",
        credentialUrl: "https://coursera.org/verify/MICH-PY-440192",
        skillsAcquired: ["Python 3", "Data Structures", "Web Scraping", "Databases"],
        verifiedStatus: "verified",
        facultyFeedback: "Verified official certificate by Dr. Anita Desai.",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2023-12-05"
      }
    );

    allAchievements.push(
      {
        id: "ach_aarav_1",
        studentId: userId,
        title: "Department Topper & Gold Medalist (Sem 5 & 6)",
        type: "Academic",
        date: "2024-11-15",
        positionOrAward: "1st Rank (9.42 SGPA)",
        eventName: "Annual Academic Convocation & Honors Ceremony",
        organizedBy: "Department of Computer Science & Engineering",
        description: "Awarded top academic honors for exemplary coursework scoring across operating systems, compiler design, and software engineering.",
        proofFileName: "department_topper_citation_aarav.pdf",
        tags: ["Academic Excellence", "Top Rank", "Gold Medal"],
        verifiedStatus: "verified",
        facultyFeedback: "Official citation verified by Dean of Academics.",
        verifiedBy: "Dr. Ramesh Kumar",
        verifiedAt: "2024-11-20"
      },
      {
        id: "ach_aarav_2",
        studentId: userId,
        title: "Best Project Award – Annual Tech Innovators Expo 2025",
        type: "Technical",
        date: "2025-04-12",
        positionOrAward: "Best Capstone Project Trophy",
        eventName: "TechInnovate Annual Project Exhibition",
        organizedBy: "College Research & Development Cell",
        description: "Selected 1st out of 80 final-year teams for the AI-Based Student Performance Prediction architecture.",
        proofFileName: "best_project_award_aarav.pdf",
        tags: ["Best Project", "Innovation", "Trophy"],
        verifiedStatus: "verified",
        facultyFeedback: "Unanimous selection by industrial jury.",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2025-04-18"
      },
      {
        id: "ach_aarav_3",
        studentId: userId,
        title: "Smart India Hackathon Finalist & Regional Winner",
        type: "Hackathon",
        date: "2024-12-22",
        positionOrAward: "1st Prize (Regional) & National Grand Finalist",
        eventName: "Smart India Hackathon (SIH 2024)",
        organizedBy: "Ministry of Education & AICTE",
        description: "Developed automated water distribution telemetry network using edge sensors and cloud dashboards.",
        proofFileName: "sih_finalist_citation.pdf",
        tags: ["SIH 2024", "National Hackathon", "Winner"],
        verifiedStatus: "verified",
        facultyFeedback: "Institutional honor; cash prize and citation recorded.",
        verifiedBy: "Dr. Ramesh Kumar",
        verifiedAt: "2025-01-05"
      },
      {
        id: "ach_aarav_4",
        studentId: userId,
        title: "Academic Excellence Award & Merit Scholarship",
        type: "Honor & Award",
        date: "2023-10-05",
        positionOrAward: "Merit Scholar Award",
        eventName: "University Endowment Honors",
        organizedBy: "State Technological University",
        description: "Awarded full annual tuition merit scholarship for maintaining Top 1% aggregate percentile.",
        proofFileName: "merit_scholarship_certificate.pdf",
        tags: ["Merit Scholarship", "Endowment", "Honor"],
        verifiedStatus: "verified",
        facultyFeedback: "Scholarship disbursed and audited.",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2023-10-15"
      }
    );

    allInternships.push({
      id: "intern_aarav_1",
      studentId: userId,
      company: "TechNova Solutions",
      role: "Frontend Developer Intern",
      location: "Bangalore, India",
      locationType: "Hybrid",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      isCurrent: false,
      stipend: "₹35,000 / month",
      description: "Engineered responsive dashboard modules in React, TypeScript, and Tailwind CSS. Implemented virtualized lists and reduced page load times by 40%.",
      technologies: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS", "REST APIs"],
      website: "https://technovasolutions.io",
      certificateFileName: "technova_internship_completion_aarav.pdf",
      verifiedStatus: "verified",
      facultyFeedback: "Verified official internship completion certificate signed by Engineering Director.",
      verifiedBy: "Dr. Anita Desai",
      verifiedAt: "2024-09-05"
    });

    allWorkshops.push({
      id: "ws_aarav_1",
      studentId: userId,
      workshopName: "Hands-on Microservices with Docker and Kubernetes",
      organizer: "Google Developer Student Club (GDSC)",
      date: "2024-03-15",
      duration: "3 Days (24 Hours)",
      location: "College Main Auditorium",
      description: "Containerized 12-factor apps, configured ingress controllers, and automated Helm charts.",
      verifiedStatus: "verified"
    });

    allHackathons.push({
      id: "hack_aarav_1",
      studentId: userId,
      hackathonName: "Smart India Hackathon 2024",
      organizer: "AICTE & MoE, Govt. of India",
      date: "2024-12-22",
      teamName: "CodeCrafters",
      projectName: "AquaPulse Telemetry",
      position: "Winner (Regional Center)",
      description: "Built solar telemetry units and cloud telemetry pipeline for drinking water tracking.",
      verifiedStatus: "verified"
    });

    allPublications.push({
      id: "pub_aarav_1",
      studentId: userId,
      paperTitle: "Predictive Academic Modeling Using Ensemble Gradient Boosting on Engineering Cohorts",
      authors: ["Aarav Sharma", "Dr. Ramesh Kumar"],
      journalOrConference: "IEEE International Conference on Advanced Computing & Education Systems (ICACES 2025)",
      publicationDate: "2025-05-10",
      doi: "10.1109/ICACES.2025.109283",
      abstract: "This paper introduces a feature-engineered machine learning pipeline analyzing semester assignment vectors to forecast academic intervention needs.",
      verifiedStatus: "verified"
    });

    allAwards.push({
      id: "award_aarav_1",
      studentId: userId,
      awardTitle: "Departmental Student of the Year 2024",
      organization: "Computer Science Faculty Council",
      date: "2024-12-10",
      position: "Honoree",
      description: "Recognized for balanced excellence in academics, hackathons, open-source projects, and mentoring junior cohorts.",
      verifiedStatus: "verified"
    });

  } else {
    const pack = techPacks[i % techPacks.length];
    pack.forEach((tName, tIdx) => {
      allSkills.push({
        id: `skill_${regNumber.toLowerCase()}_${tIdx}`,
        studentId: userId,
        name: tName,
        category: tIdx % 2 === 0 ? "Programming" : "Web Development",
        proficiency: tIdx === 0 ? "Expert" : tIdx === 1 ? "Advanced" : "Intermediate",
        rating: 3 + ((i + tIdx) % 3),
        isVerified: (i + tIdx) % 3 !== 0,
        verifiedBy: (i + tIdx) % 3 !== 0 ? "Dr. Ramesh Kumar" : undefined,
        verifiedAt: (i + tIdx) % 3 !== 0 ? "2025-11-10" : undefined,
        endorsementsCount: 3 + ((i * 3 + tIdx) % 15)
      });
    });

    allProjects.push({
      id: `proj_${regNumber.toLowerCase()}_1`,
      studentId: userId,
      title: `${pack[0]} & ${pack[1]} Powered Portal for Campus Logistics`,
      description: `Modular web platform developed using ${pack.slice(0, 3).join(', ')} implementing role-based access control, analytics, and responsive interface.`,
      category: "Full-Stack Application",
      projectType: "Academic",
      role: "Lead Developer",
      teamSize: 2 + (i % 3),
      techStack: pack.slice(0, 4),
      githubUrl: `https://github.com/${name.toLowerCase().replace(/[^a-z]/g, '')}/project-one`,
      startDate: "2025-02-01",
      endDate: "2025-06-15",
      isOngoing: false,
      featured: i % 3 === 0,
      outcome: "Successfully deployed and tested in departmental laboratory.",
      mentorName: i % 2 === 0 ? "Dr. Ramesh Kumar" : "Dr. Anita Desai",
      verifiedStatus: i % 4 === 0 ? "pending" : "verified",
      verifiedBy: i % 4 !== 0 ? "Dr. Ramesh Kumar" : undefined,
      verifiedAt: i % 4 !== 0 ? "2025-07-01" : undefined
    });

    const certOrgs = ["Amazon Web Services", "Microsoft Azure", "Google Cloud", "Oracle", "Cisco", "IBM", "Coursera"];
    allCertifications.push({
      id: `cert_${regNumber.toLowerCase()}_1`,
      studentId: userId,
      title: `${pack[0]} Certified Associate Specialist`,
      issuingOrganization: certOrgs[i % certOrgs.length],
      issueDate: "2024-08-15",
      credentialId: `CERT-${regNumber}-${i * 921}`,
      credentialUrl: `https://verification.college.edu/cert/${regNumber}`,
      skillsAcquired: pack.slice(0, 3),
      verifiedStatus: i % 5 === 0 ? "pending" : "verified",
      verifiedBy: i % 5 !== 0 ? "Dr. Anita Desai" : undefined,
      verifiedAt: i % 5 !== 0 ? "2024-09-01" : undefined
    });

    const positions = ["1st Prize Winner", "Finalist", "Participant Award", "Runner Up", "Honorable Mention"];
    allAchievements.push({
      id: `ach_${regNumber.toLowerCase()}_1`,
      studentId: userId,
      title: `${pack[0]} Coding Challenge Excellence`,
      type: i % 2 === 0 ? "Technical" : "Hackathon",
      date: "2024-10-18",
      positionOrAward: positions[i % positions.length],
      eventName: `Inter-Collegiate Tech Symposium ${2024 + (i % 2)}`,
      organizedBy: "IEEE Student Branch",
      description: "Participated in competitive programming and system design rounds solving algorithmic problems.",
      tags: ["Coding", "Competition", "IEEE"],
      verifiedStatus: i % 3 === 0 ? "pending" : "verified",
      verifiedBy: i % 3 !== 0 ? "Dr. Ramesh Kumar" : undefined,
      verifiedAt: i % 3 !== 0 ? "2024-11-01" : undefined
    });

    if (i % 3 !== 0) {
      const companies = ["Infosys", "Wipro", "TCS Digital", "Zoho Corporation", "Cognizant", "Accenture", "L&T Infotech"];
      allInternships.push({
        id: `intern_${regNumber.toLowerCase()}_1`,
        studentId: userId,
        company: companies[i % companies.length],
        role: "Software Engineering Intern",
        location: "Chennai / Bangalore",
        locationType: i % 2 === 0 ? "On-site" : "Hybrid",
        startDate: "2024-05-15",
        endDate: "2024-07-31",
        isCurrent: false,
        stipend: `₹${25000 + (i % 5) * 5000} / month`,
        description: `Contributed to enterprise backend APIs and unit test suites utilizing ${pack.slice(0, 2).join(' and ')}.`,
        technologies: pack.slice(0, 3),
        certificateFileName: `${companies[i % companies.length].toLowerCase().replace(/\s+/g, '_')}_completion.pdf`,
        verifiedStatus: "verified",
        verifiedBy: "Dr. Anita Desai",
        verifiedAt: "2024-08-10"
      });
    }

    allWorkshops.push({
      id: `ws_${regNumber.toLowerCase()}_1`,
      studentId: userId,
      workshopName: `Masterclass on ${pack[0]} & Modern Application Scaling`,
      organizer: "Computer Society of India (CSI)",
      date: "2024-04-10",
      duration: "2 Days (16 Hours)",
      location: "Department Seminar Hall",
      description: "Comprehensive technical workshop on modern design patterns, containerization, and automated CI/CD.",
      verifiedStatus: "verified"
    });

    if (i % 2 === 0) {
      allHackathons.push({
        id: `hack_${regNumber.toLowerCase()}_1`,
        studentId: userId,
        hackathonName: `HackNova State Collegiate Contest ${2024 + (i % 2)}`,
        organizer: "Tech Council of Universities",
        date: "2024-09-28",
        teamName: `Team Alpha-${regNumber.slice(-2)}`,
        projectName: "EcoTrack IoT Hub",
        position: positions[i % positions.length],
        description: "Developed cloud analytics node transmitting environmental telemetry using microservices.",
        verifiedStatus: "verified"
      });
    }

    if (cgpa >= 8.8) {
      allPublications.push({
        id: `pub_${regNumber.toLowerCase()}_1`,
        studentId: userId,
        paperTitle: `Optimized Data Partitioning for ${pack[0]} Distributed Storage Nodes`,
        authors: [name, "Dr. Ramesh Kumar"],
        journalOrConference: "International Journal of Computer Sciences & Engineering (IJCSE)",
        publicationDate: "2025-02-15",
        doi: `10.1016/j.ijcse.2025.0${i}`,
        abstract: "Analyzes horizontal scaling bottlenecks and proposes adaptive round-robin balancing with sub-millisecond latencies.",
        verifiedStatus: "verified"
      });
    }

    allAwards.push({
      id: `award_${regNumber.toLowerCase()}_1`,
      studentId: userId,
      awardTitle: "Merit Certificate in Technical Academics",
      organization: "College Academic Senate",
      date: "2024-11-25",
      position: "Merit Award",
      description: "Recognized for sustained academic consistency and high coursework project quality.",
      verifiedStatus: "verified"
    });
  }
}

// Ensure data folder exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Construct Database format directly
const initialUsers = [
  {
    id: 'user_aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'student',
    avatar: avatars[0],
    department: 'Computer Science & Engineering',
    collegeId: '21CS042',
    phone: '+91 98765 43210',
    status: 'active'
  },
  {
    id: 'user_faculty_ramesh',
    name: 'Dr. Ramesh Kumar',
    email: 'faculty@example.com',
    role: 'faculty',
    avatar: avatars[5],
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
    avatar: avatars[2],
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
    avatar: avatars[4],
    department: 'Academic Administration',
    collegeId: 'ADMIN_001',
    designation: 'Dean of Academic Affairs & Accreditation Lead',
    phone: '+91 98888 77777',
    status: 'active'
  },
  ...all100Students.map(s => ({
    id: s.userId,
    name: s.name,
    email: s.email,
    role: 'student',
    avatar: s.avatar,
    department: s.department,
    collegeId: s.registerNumber,
    phone: s.phone,
    status: 'active'
  }))
];

const initialProfiles = {};
all100Students.forEach(st => {
  initialProfiles[st.userId] = st;
  initialProfiles[st.registerNumber.toLowerCase()] = st;
  initialProfiles[st.registerNumber] = st;
});
// Alias for user_aarav
initialProfiles['user_aarav'] = all100Students.find(s => s.registerNumber === '21CS042');

const finalDatabase = {
  users: initialUsers,
  profiles: initialProfiles,
  skills: allSkills,
  projects: allProjects,
  internships: allInternships,
  certifications: allCertifications,
  achievements: allAchievements,
  workshops: allWorkshops,
  hackathons: allHackathons,
  publications: allPublications,
  awards: allAwards,
  documents: [
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
    }
  ],
  portfolioConfigs: {
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
    }
  },
  verificationLogs: [
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
    }
  ]
};

// Write directly to data/db.json
fs.writeFileSync(path.join(dataDir, 'db.json'), JSON.stringify(finalDatabase, null, 2), 'utf-8');
console.log(`Successfully generated database with exactly ${all100Students.length} students written to data/db.json!`);
