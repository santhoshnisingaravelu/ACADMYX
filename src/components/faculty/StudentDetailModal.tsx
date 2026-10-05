import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import {
  StudentProfile,
  Skill,
  Project,
  Internship,
  Certification,
  AcademicAchievement,
  StudentDocument
} from '../../types/index.ts';
import {
  User,
  GraduationCap,
  Award,
  FolderGit2,
  Briefcase,
  Trophy,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface StudentDetailModalProps {
  userId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ userId, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<AcademicAchievement[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);

  useEffect(() => {
    const fetchDossier = async () => {
      setLoading(true);
      try {
        const res = await api.getStudentFull(userId);
        if (res.success) {
          setStudent(res.student);
          setSkills(res.skills || []);
          setProjects(res.projects || []);
          setInternships(res.internships || []);
          setCertifications(res.certifications || []);
          setAchievements(res.achievements || []);
          setDocuments(res.documents || []);
        }
      } catch (err) {
        console.error('Failed to load student dossier:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-700">Loading academic audit dossier...</p>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.degree} • Semester {student.currentSemester} ({student.department})
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                <span>CGPA: <strong className="text-emerald-700">{student.cgpa} / 10</strong></span>
                <span>• Batch {student.batch}</span>
                <span>• {student.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Body */}
        <div className="space-y-6 mt-6">
          
          {/* Skills Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Verified Competencies ({skills.filter(s => s.isVerified).length} of {skills.length} verified)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{s.name}</span>
                    {s.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{s.category}</span>
                    <span className="font-medium text-indigo-600">{s.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
              Capstone & Technical Projects ({projects.length})
            </h3>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900">{p.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.verifiedStatus}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{p.description}</p>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Stack: {p.techStack.join(', ')} {p.mentorName ? `• Mentor: ${p.mentorName}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internships */}
          {internships.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Internships & Work History ({internships.length})
              </h3>
              <div className="space-y-2">
                {internships.map((i) => (
                  <div key={i.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{i.role} at {i.company}</div>
                      <div className="text-[11px] text-slate-500">{i.startDate} to {i.endDate} ({i.locationType})</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {i.verifiedStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Certifications ({certifications.length})
              </h3>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.issuingOrganization} • Issued {c.issueDate}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.verifiedStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.verifiedStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
