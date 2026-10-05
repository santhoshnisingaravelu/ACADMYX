import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { PublicPortfolioView } from '../public/PublicPortfolioView.tsx';
import {
  Globe,
  Palette,
  Eye,
  Copy,
  ExternalLink,
  Check,
  QrCode,
  Layout,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const THEMES = [
  { id: 'modern-tech', name: 'Modern Tech', desc: 'Dark sleek styling with electric indigo & glassmorphism', bg: 'bg-slate-950', ring: 'ring-indigo-500' },
  { id: 'minimalist-scholar', name: 'Minimalist Scholar', desc: 'Clean editorial ivory background with emerald accents', bg: 'bg-white', ring: 'ring-emerald-500' },
  { id: 'executive-indigo', name: 'Executive Indigo', desc: 'Corporate deep navy standard for enterprise placements', bg: 'bg-slate-900', ring: 'ring-blue-500' },
  { id: 'cyber-dark', name: 'Cyber Terminal', desc: 'Monochrome hacker monospace with emerald matrix glow', bg: 'bg-black', ring: 'ring-emerald-400' }
];

export const PortfolioGeneratorView: React.FC = () => {
  const { studentProfile, portfolioConfig, savePortfolioConfig, setPublicViewSlug, showToast } = useAuth();

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activePreview, setActivePreview] = useState(false);

  const [config, setConfig] = useState(portfolioConfig);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#portfolio/${studentProfile?.portfolioSlug || 'student'}`
    : `https://academix.edu/portfolio/${studentProfile?.portfolioSlug || 'student'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Public portfolio link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    await savePortfolioConfig(config);
  };

  const handleSectionToggle = (section: keyof typeof config.visibleSections) => {
    setConfig(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section]
      }
    }));
  };

  if (!studentProfile) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Live Web Portfolio Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build and publish your shareable personal website showcasing your verified achievements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            {copied ? 'Copied Link!' : 'Copy Shareable Link'}
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            QR Code
          </button>

          <button
            onClick={() => setPublicViewSlug(studentProfile.portfolioSlug)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Open Fullsite
          </button>
        </div>
      </div>

      {/* QR Code Card if open */}
      {showQr && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center max-w-sm mx-auto shadow-md">
          <h3 className="text-sm font-bold text-indigo-950 mb-1">Recruitment Scan QR</h3>
          <p className="text-xs text-indigo-700 mb-4">
            Scan with any phone camera to instantly view {studentProfile.name}'s verified portfolio
          </p>
          <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border border-indigo-100">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
              alt="QR Code"
              className="w-44 h-44 mx-auto"
            />
          </div>
          <p className="text-[11px] font-mono text-indigo-600 mt-3 truncate">{publicUrl}</p>
        </div>
      )}

      {/* Customizer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Theme Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" />
              Theme Aesthetic
            </h3>

            <div className="space-y-2">
              {THEMES.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setConfig(prev => ({ ...prev, theme: th.id as any }))}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    config.theme === th.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{th.name}</span>
                    {config.theme === th.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{th.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-emerald-600" />
              Section Visibility
            </h3>

            <div className="space-y-2 text-xs">
              {(Object.keys(config.visibleSections) as Array<keyof typeof config.visibleSections>).map(section => (
                <label
                  key={section}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span className="capitalize font-medium text-slate-700">{section}</span>
                  <input
                    type="checkbox"
                    checked={config.visibleSections[section]}
                    onChange={() => handleSectionToggle(section)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Custom Copy editor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Headline & Tagline
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700">Hero Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full mt-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Custom Greeting / Intro</label>
              <textarea
                rows={3}
                value={config.customIntro}
                onChange={(e) => setConfig(prev => ({ ...prev, customIntro: e.target.value }))}
                className="w-full mt-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition"
            >
              <Save className="w-4 h-4" />
              Save Portfolio Settings
            </button>
          </div>

        </div>

        {/* Right: Embedded Live Preview Frame */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              Interactive Live Preview
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-500">Live Sync</span>
            </div>
          </div>

          <div className="border border-slate-300 rounded-3xl overflow-hidden shadow-xl max-h-[780px] overflow-y-auto">
            <PublicPortfolioView slug={studentProfile.portfolioSlug} isEmbedded={true} />
          </div>
        </div>

      </div>

    </div>
  );
};
