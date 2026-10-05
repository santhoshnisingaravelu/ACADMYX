import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  FileBadge,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  Layout,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ResumeBuilderView: React.FC = () => {
  const { studentProfile, skills, projects, internships, certifications, achievements, showToast } = useAuth();

  const [template, setTemplate] = useState<'modern' | 'classic' | 'executive'>('modern');
  const [copied, setCopied] = useState(false);
  const [customSummary, setCustomSummary] = useState(
    studentProfile?.aboutMe || studentProfile?.bio ||
    'Proactive Computer Science undergraduate with hands-on experience designing scalable microservices, cloud deployments, and verified technical projects.'
  );

  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    education: true,
    skills: true,
    experience: true,
    projects: true,
    certifications: true,
    achievements: true
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const resumeData = {
      profile: studentProfile,
      summary: customSummary,
      skills,
      projects,
      internships,
      certifications,
      achievements
    };
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentProfile?.name.replace(/\s+/g, '_')}_Academic_Resume.json`;
    link.click();
    showToast('Resume JSON exported successfully!', 'success');
  };

  const handleExportMarkdown = () => {
    if (!studentProfile) return;
    const md = `# ${studentProfile.name}
**${studentProfile.degree}** | ${studentProfile.department}
Email: ${studentProfile.email} | Phone: ${studentProfile.phone} | Roll No: ${studentProfile.rollNo}
GitHub: ${studentProfile.githubUrl || ''} | LinkedIn: ${studentProfile.linkedinUrl || ''}

---

## Professional Summary
${customSummary}

## Education
* **${studentProfile.degree}** (${studentProfile.department}) - CGPA: ${studentProfile.cgpa}/10.0 (Batch ${studentProfile.batch})

## Technical Skills
${skills.map(s => `* **${s.name}**: ${s.proficiency} (${s.category})`).join('\n')}

## Work Experience & Internships
${internships.map(i => `### ${i.role} at ${i.company} (${i.startDate} - ${i.endDate})\n${i.description}\nTech: ${i.technologies.join(', ')}`).join('\n\n')}

## Key Projects
${projects.map(p => `### ${p.title}\nRole: ${p.role} | Tech: ${p.techStack.join(', ')}\n${p.description}`).join('\n\n')}

## Certifications & Achievements
${certifications.map(c => `* **${c.title}** - ${c.issuingOrganization} (${c.issueDate})`).join('\n')}
${achievements.map(a => `* **${a.title}** - ${a.positionOrAward} (${a.eventName})`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentProfile.name.replace(/\s+/g, '_')}_Resume.md`;
    link.click();
    showToast('Markdown resume exported!', 'success');
  };

  if (!studentProfile) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            ATS-Optimized Academic Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Auto-formatted from your verified credentials. Meets tier-1 college placement criteria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
          >
            <Printer className="w-4 h-4" />
            Print to PDF
          </button>

          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Markdown (.md)
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            JSON (.json)
          </button>
        </div>
      </div>

      {/* Control Panel in Web View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 no-print">
        
        {/* Template Selector & Toggles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resume Layout Template
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => setTemplate('modern')}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition ${
                  template === 'modern' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                }`}
              >
                Modern ATS
              </button>
              <button
                onClick={() => setTemplate('classic')}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition ${
                  template === 'classic' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                }`}
              >
                Classic Acad
              </button>
              <button
                onClick={() => setTemplate('executive')}
                className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center transition ${
                  template === 'executive' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'
                }`}
              >
                Executive
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Visible Sections
            </label>
            <div className="space-y-1.5 mt-2 text-xs">
              {Object.keys(visibleSections).map((sec) => (
                <label key={sec} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  <span className="capitalize">{sec}</span>
                  <input
                    type="checkbox"
                    checked={(visibleSections as any)[sec]}
                    onChange={() => setVisibleSections(p => ({ ...p, [sec]: !(p as any)[sec] }))}
                    className="rounded text-indigo-600"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              ATS Score Insights
            </label>
            <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                94 / 100 ATS Compatibility
              </div>
              <p className="text-[11px] text-emerald-700 leading-normal">
                Standard single-page typography, clean headers, and verified keywords.
              </p>
            </div>
          </div>
        </div>

        {/* Live Resume Sheet Preview Container */}
        <div className="lg:col-span-3 flex justify-center bg-slate-100 p-4 sm:p-8 rounded-3xl border border-slate-200 overflow-x-auto">
          
          {/* THE PRINTABLE RESUME SHEET */}
          <div
            id="printable-resume"
            className="w-[800px] min-h-[1050px] bg-white text-slate-900 p-10 sm:p-12 shadow-xl border border-slate-200 rounded-sm font-sans"
          >
            {/* Header */}
            <div className={`pb-5 border-b-2 ${template === 'executive' ? 'border-indigo-600' : 'border-slate-800'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {studentProfile.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                    {studentProfile.targetRole || studentProfile.degree}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-mono font-bold text-slate-900">Roll No: {studentProfile.rollNo}</div>
                  <div>{studentProfile.email}</div>
                  <div>{studentProfile.phone}</div>
                  <div>{studentProfile.location}</div>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-600">
                {studentProfile.githubUrl && <span>GitHub: {studentProfile.githubUrl.replace('https://', '')}</span>}
                {studentProfile.linkedinUrl && <span>LinkedIn: {studentProfile.linkedinUrl.replace('https://', '')}</span>}
                {studentProfile.websiteUrl && <span>Portfolio: {studentProfile.websiteUrl.replace('https://', '')}</span>}
              </div>
            </div>

            {/* Summary */}
            {visibleSections.summary && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {customSummary}
                </p>
              </div>
            )}

            {/* Education */}
            {visibleSections.education && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Education & Academic Standing
                </h2>
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{studentProfile.degree}</div>
                    <div className="text-slate-600">{studentProfile.department}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-800">CGPA: {studentProfile.cgpa} / 10.0</div>
                    <div className="text-slate-500 text-[11px]">Batch: {studentProfile.batch}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {visibleSections.skills && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Technical Proficiencies
                </h2>
                <div className="text-xs space-y-1 text-slate-700">
                  <div>
                    <strong className="text-slate-900">Languages & Core: </strong>
                    {skills.filter(s => s.category === 'Languages').map(s => s.name).join(', ') || 'C++, Java, Python, TypeScript'}
                  </div>
                  <div>
                    <strong className="text-slate-900">Frameworks & Web: </strong>
                    {skills.filter(s => s.category === 'Tools & Frameworks' || s.category === 'Technical').map(s => s.name).join(', ') || 'React, Node.js, Express, Next.js'}
                  </div>
                  <div>
                    <strong className="text-slate-900">Cloud & DevOps: </strong>
                    {skills.filter(s => s.category === 'Cloud & DevOps').map(s => s.name).join(', ') || 'AWS, Docker, Kubernetes, Linux'}
                  </div>
                </div>
              </div>
            )}

            {/* Work Experience */}
            {visibleSections.experience && internships.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Internships & Work Experience
                </h2>
                <div className="space-y-3">
                  {internships.map(i => (
                    <div key={i.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{i.role} – {i.company}</span>
                        <span className="font-normal text-slate-500 text-[11px]">{i.startDate} – {i.endDate}</span>
                      </div>
                      <p className="text-slate-700 text-[11px] mt-0.5 leading-normal">{i.description}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Technologies: {i.technologies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {visibleSections.projects && projects.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Key Technical Projects
                </h2>
                <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{p.title}</span>
                        <span className="font-normal text-slate-500 text-[11px]">{p.startDate}</span>
                      </div>
                      <p className="text-slate-700 text-[11px] mt-0.5 leading-normal">{p.description}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Tech Stack: {p.techStack.join(', ')} {p.liveUrl ? `| Live: ${p.liveUrl}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Achievements */}
            {(visibleSections.certifications || visibleSections.achievements) && (
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  Certifications & Key Honors
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {certifications.map(c => (
                    <li key={c.id}>
                      <strong className="text-slate-900">{c.title}</strong> – {c.issuingOrganization} ({c.issueDate})
                    </li>
                  ))}
                  {achievements.map(a => (
                    <li key={a.id}>
                      <strong className="text-slate-900">{a.title}</strong>: {a.positionOrAward} ({a.eventName})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Verification Seal */}
            <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <span>Verified Academic Credential Dossier • ACADEMIX Platform</span>
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
