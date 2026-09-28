import React, { useState, useEffect } from 'react';
import { SEED_ADVISORIES } from './data/seedData';
import { DiagnosticAdvisory } from './types';
import { PublicLandingPage } from './views/PublicLandingPage';
import { AuthPortal } from './views/AuthPortal';
import { ExpertDashboard } from './views/ExpertDashboard';
import { ReviewDetailView } from './views/ReviewDetailView';
import { FarmerAdvisorySandbox } from './views/FarmerAdvisorySandbox';
import { OutbreakRadar } from './views/OutbreakRadar';
import {
  Sprout,
  Shield,
  Smartphone,
  Radio,
  FileCheck2,
  Globe,
  Sun,
  Moon,
  Cpu,
  LogOut,
  Home
} from 'lucide-react';

export function App() {
  // Navigation across the 3 Frames:
  // Frame 1: LANDING
  // Frame 2: AUTH
  // Frame 3: PLATFORM (The previously created workstation/dashboard)
  const [currentFrame, setCurrentFrame] = useState<'LANDING' | 'AUTH' | 'PLATFORM'>('LANDING');

  const [advisories, setAdvisories] = useState<DiagnosticAdvisory[]>(SEED_ADVISORIES);
  const [selectedAdvisory, setSelectedAdvisory] = useState<DiagnosticAdvisory | null>(null);
  const [activeTab, setActiveTab] = useState<'EXPERT' | 'FARMER' | 'RADAR'>('EXPERT');
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync theme with HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectAdvisory = (advisory: DiagnosticAdvisory) => {
    setSelectedAdvisory(advisory);
  };

  const handleBackToQueue = () => {
    setSelectedAdvisory(null);
  };

  const handleSaveVerdict = (
    advisoryId: string,
    verdict: 'AGREE' | 'DISAGREE' | 'PARTIAL',
    notes: string,
    safetyOk: boolean
  ) => {
    const updatedStatus = verdict === 'DISAGREE' ? 'OVERRIDDEN' : 'VERIFIED_APPROVED';
    const reviewData = {
      reviewerName: 'Dr. S. Nair (Senior Agronomist, KAU)',
      verdict,
      reviewedAt: new Date().toISOString(),
      safetyApproved: safetyOk,
      expertNotes: notes
    };

    setAdvisories((prev) =>
      prev.map((a) =>
        a.id === advisoryId
          ? {
              ...a,
              triageStatus: updatedStatus,
              expertReview: reviewData
            }
          : a
      )
    );

    setSelectedAdvisory((prev) =>
      prev && prev.id === advisoryId
        ? {
            ...prev,
            triageStatus: updatedStatus,
            expertReview: reviewData
          }
        : prev
    );
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ml' : 'en'));
  };

  // FRAME 1: Public Landing Page
  if (currentFrame === 'LANDING') {
    return (
      <PublicLandingPage
        onEnterAuth={() => setCurrentFrame('AUTH')}
        onDirectPlatformAccess={() => setCurrentFrame('PLATFORM')}
        lang={lang}
        onToggleLang={toggleLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // FRAME 2: Authentication & Onboarding
  if (currentFrame === 'AUTH') {
    return (
      <AuthPortal
        onLoginSuccess={(role) => {
          setCurrentFrame('PLATFORM');
          if (role === 'farmer') {
            setActiveTab('FARMER');
          } else {
            setActiveTab('EXPERT');
          }
        }}
        onBackToLanding={() => setCurrentFrame('LANDING')}
        lang={lang}
        onToggleLang={toggleLanguage}
      />
    );
  }

  // FRAME 3: Agri-SAGE Platform & Workstation (PRESERVED & UNTOUCHED)
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Glassmorphic Enterprise Command Bar */}
      <header className="h-16 glass-panel sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between border-b rounded-none border-[var(--color-surface-glass-border)] shadow-md">
        {/* Left: Brand Identity with Glowing Emerald Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
            <Sprout size={22} className="drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-[var(--color-on-surface)]">
                Agri-SAGE
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Frame 3: Platform
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-on-surface-secondary)] hidden sm:block">
              Decision Intelligence Engine · KAU & ICAR Certified
            </p>
          </div>
        </div>

        {/* Center: Surface Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('EXPERT');
              setSelectedAdvisory(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'EXPERT'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-on-surface-secondary)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <FileCheck2 size={15} />
            <span>Agronomist Triage</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('FARMER');
              setSelectedAdvisory(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'FARMER'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-on-surface-secondary)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <Smartphone size={15} />
            <span>Farmer Mobile Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('RADAR');
              setSelectedAdvisory(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'RADAR'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-on-surface-secondary)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <Radio size={15} />
            <span>Outbreak Radar</span>
          </button>
        </nav>

        {/* Right: Controls & Status */}
        <div className="flex items-center gap-2.5">
          {/* Multi-Agent Active Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Cpu size={13} />
            <span>14-Agent LangGraph Active</span>
          </div>

          {/* Theme Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--color-outline)] hover:border-[var(--color-primary)] text-[var(--color-on-surface)] bg-[var(--color-surface)] transition-all shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-amber-400" />
            ) : (
              <Moon size={15} className="text-slate-700" />
            )}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-outline)] hover:border-[var(--color-primary)] text-xs font-bold text-[var(--color-on-surface)] bg-[var(--color-surface)] transition-all shadow-xs"
            title="Toggle between English and Malayalam"
          >
            <Globe size={14} className="text-[var(--color-primary)]" />
            <span>{lang === 'ml' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Switch to Frame 1 (Landing) or Frame 2 (Auth) */}
          <button
            type="button"
            onClick={() => setCurrentFrame('LANDING')}
            className="btn btn-outline text-xs h-9 px-3 flex items-center gap-1 font-semibold text-[var(--color-on-surface-secondary)]"
            title="Exit to Frame 1 Public Landing Page"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Landing (F1)</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Content Area (Frame 3 - PRESERVED) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {activeTab === 'EXPERT' && (
          selectedAdvisory ? (
            <ReviewDetailView
              advisory={selectedAdvisory}
              onBack={handleBackToQueue}
              onSaveVerdict={handleSaveVerdict}
              lang={lang}
            />
          ) : (
            <ExpertDashboard
              advisories={advisories}
              onSelectAdvisory={handleSelectAdvisory}
              lang={lang}
            />
          )
        )}

        {activeTab === 'FARMER' && (
          <FarmerAdvisorySandbox lang={lang} onToggleLang={toggleLanguage} />
        )}

        {activeTab === 'RADAR' && <OutbreakRadar />}
      </main>

      {/* Footer & Compliance Strip */}
      <footer className="glass-panel rounded-none border-t border-b-0 border-x-0 border-[var(--color-outline-variant)] py-4 px-6 text-xs text-[var(--color-on-surface-secondary)] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-emerald-500" />
            <span>
              Agri-SAGE Engine v1.0.0 · CIB&RC Statutory Compliance Active · Frame 3 Workstation
            </span>
          </div>
          <div className="font-mono text-[11px] text-[var(--color-on-surface-tertiary)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>DSSAT v4.8 Physics Engine · ICAR-NRRI · KAU Package of Practices 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
