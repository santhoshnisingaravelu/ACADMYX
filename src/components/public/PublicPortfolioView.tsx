import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import {
  StudentProfile,
  Skill,
  Project,
  Internship,
  Certification,
  AcademicAchievement,
  PortfolioConfig
} from '../../types/index.ts';
import {
  GraduationCap,
  Award,
  FolderGit2,
  Briefcase,
  Trophy,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Star,
  FileBadge,
  ArrowLeft,
  Share2
} from 'lucide-react';

interface PublicPortfolioViewProps {
  slug: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({ slug, onClose, isEmbedded = false }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    student: StudentProfile;
    skills: Skill[];
    projects: Project[];
    internships: Internship[];
    certifications: Certification[];
    achievements: AcademicAchievement[];
    portfolioConfig: PortfolioConfig;
  } | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const res = await api.getPublicPortfolio(slug);
        if (res.success) {
          setData(res);
        } else {
          setError('Portfolio not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-300">Generating live student portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 text-white">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md text-center border border-slate-700">
          <h2 className="text-lg font-bold text-rose-400">Portfolio Not Found</h2>
          <p className="text-xs text-slate-400 mt-2">{error || 'No published profile matching this slug.'}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const { student, skills, projects, internships, certifications, achievements, portfolioConfig } = data;
  const theme = portfolioConfig?.theme || 'modern-tech';
  const visible = portfolioConfig?.visibleSections || {
    skills: true,
    projects: true,
    internships: true,
    certifications: true,
    achievements: true,
    contact: true
  };

  // Theme-specific styling classes
  const isDark = theme === 'modern-tech' || theme === 'cyber-dark';
  const bgColor = theme === 'modern-tech' ? 'bg-slate-950 text-slate-100' :
                  theme === 'cyber-dark' ? 'bg-[#0b0f19] text-emerald-400 font-mono' :
                  theme === 'executive-indigo' ? 'bg-slate-50 text-slate-900' :
                  'bg-white text-slate-900'; // minimalist-scholar

  const cardBg = theme === 'modern-tech' ? 'bg-slate-900/90 border-slate-800' :
                 theme === 'cyber-dark' ? 'bg-[#111827] border-emerald-900/50' :
                 theme === 'executive-indigo' ? 'bg-white border-indigo-100 shadow-sm' :
                 'bg-white border-slate-200 shadow-xs';

  const accentColor = portfolioConfig?.accentColor || '#4f46e5';

  return (
    <div className={`min-h-screen ${bgColor} ${isEmbedded ? '' : 'p-4 sm:p-8 md:p-12'}`}>
      
      {/* Top Banner with Back button when in app preview */}
      {!isEmbedded && onClose && (
        <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              /portfolio/{student.portfolioSlug}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <section className={`rounded-3xl p-8 sm:p-12 border ${cardBg} relative overflow-hidden backdrop-blur-md`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-2xl"
            />

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Student Portfolio
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {student.name}
              </h1>

              <p className="text-sm sm:text-base font-medium text-indigo-400">
                {portfolioConfig?.tagline || student.targetRole || student.degree}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs opacity-75">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {student.degree} (Sem {student.currentSemester})
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {student.location}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  CGPA: {student.cgpa} / 10.0
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed opacity-85 max-w-2xl pt-2">
                {portfolioConfig?.customIntro || student.bio || student.aboutMe}
              </p>

              {/* Social and Contact Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
                {student.githubUrl && (
                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {student.linkedinUrl && (
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {student.websiteUrl && (
                  <a
                    href={student.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                  >
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                <a
                  href={`mailto:${student.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition"
                >
                  <Mail className="w-4 h-4" /> Contact
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        {visible.skills && skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Verified Technical Skills & Competencies
              </h2>
              <span className="text-xs opacity-60 font-mono">{skills.length} skills listed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className={`p-4 rounded-2xl border ${cardBg}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                        {skill.category}
                      </span>
                      <h4 className="text-sm font-bold mt-0.5">{skill.name}</h4>
                    </div>
                    {skill.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs opacity-80">
                    <span className="font-medium">{skill.proficiency}</span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star
                          key={st}
                          className={`w-3 h-3 ${st <= skill.rating ? 'fill-amber-400' : 'opacity-20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {visible.projects && projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-400" />
                Featured Projects & Engineering Artifacts
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {proj.category}
                      </span>
                      {proj.verifiedStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold leading-snug">{proj.title}</h3>
                    <p className="text-xs opacity-75 mt-2 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="text-[11px] px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
                    <span className="text-[11px] opacity-60">Role: {proj.role}</span>
                    <div className="flex items-center gap-3">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1">
                          <Github className="w-3.5 h-3.5" /> Code
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE & INTERNSHIPS */}
        {visible.internships && internships.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Work Experience & Internships
              </h2>
            </div>

            <div className="space-y-4">
              {internships.map((intern) => (
                <div key={intern.id} className={`p-6 rounded-2xl border ${cardBg}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold">{intern.role}</h3>
                      <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                        {intern.company} • {intern.location} ({intern.locationType})
                      </p>
                    </div>
                    <div className="text-xs opacity-75 sm:text-right">
                      <span>{intern.startDate} — {intern.endDate}</span>
                      {intern.verifiedStatus === 'verified' && (
                        <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1 sm:justify-end mt-1">
                          <ShieldCheck className="w-3 h-3" /> Industry Credential Verified
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-80 mt-3 leading-relaxed">{intern.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {intern.technologies.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS & ACHIEVEMENTS */}
        {visible.certifications && certifications.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Official Certifications & Academic Honors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((c) => (
                <div key={c.id} className={`p-5 rounded-2xl border ${cardBg}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold">{c.title}</h4>
                    {c.verifiedStatus === 'verified' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-400 font-medium mt-1">{c.issuingOrganization}</p>
                  <div className="text-[11px] opacity-60 mt-2">Issued {c.issueDate} {c.credentialId ? `• ID: ${c.credentialId}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER ACCREDITATION SEAL */}
        <footer className="pt-8 border-t border-slate-800/60 text-center text-xs opacity-60 space-y-1">
          <p>© {new Date().getFullYear()} {student.name}. All verified credentials managed via ACADEMIX.</p>
          <p className="text-[11px]">Academic Audit & Digital Credential Verification System.</p>
        </footer>

      </div>
    </div>
  );
};
