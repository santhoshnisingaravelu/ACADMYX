import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Search,
  Sparkles,
  UserCheck,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Award,
  Loader2
} from 'lucide-react';

const popularChips = [
  '21CS001',
  '21CS010',
  '21CS020',
  '21CS030',
  '21CS040',
  '21CS042',
  '21CS050',
  '21CS060',
  '21CS070',
  '21CS080',
  '21CS090',
  '21CS100'
];

export const SearchStudentProfileView: React.FC = () => {
  const { searchStudentByRegisterNumber } = useAuth();
  const [registerInput, setRegisterInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSearch = async (regToSearch?: string) => {
    const rawVal = regToSearch !== undefined ? regToSearch : registerInput;
    const cleanRegNo = rawVal.trim().toUpperCase();

    // Reset error states
    setErrorMessage(null);
    setErrorDetails(null);

    // Empty validation
    if (!cleanRegNo) {
      setErrorMessage('Please enter a register number.');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchStudentByRegisterNumber(cleanRegNo);
      if (!result.success) {
        setErrorMessage(result.message || 'Student Not Found');
        setErrorDetails(result.error || 'No student record was found for this register number.');
      }
    } catch (err: any) {
      setErrorMessage('Student Not Found');
      setErrorDetails('No student record was found for this register number.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleChipClick = (chip: string) => {
    setRegisterInput(chip);
    handleSearch(chip);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      
      {/* Top Banner Tag */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3 shadow-2xs">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Academic Credential & Profile Verification Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Search Student Profile
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Enter a collegiate register number to view verified academic achievements, skill matrices, project portfolios, and faculty verification dossiers.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
        
        {/* Input & Search Button Form */}
        <div className="space-y-4">
          <label htmlFor="regInput" className="block text-sm font-semibold text-slate-800">
            Student Register / Roll Number
          </label>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="regInput"
                type="text"
                autoFocus
                disabled={isSearching}
                value={registerInput}
                onChange={(e) => {
                  setRegisterInput(e.target.value);
                  if (errorMessage) {
                    setErrorMessage(null);
                    setErrorDetails(null);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter Register Number (e.g. 21CS042)"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-base sm:text-lg transition uppercase tracking-wide disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base shadow-md shadow-indigo-200 transition disabled:opacity-60 cursor-pointer min-w-[170px]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search Student</span>
                </>
              )}
            </button>
          </div>

          {/* Loading Indicator State */}
          {isSearching && (
            <div className="flex items-center gap-2.5 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-sm font-medium animate-in fade-in">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Fetching student profile...</span>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">{errorMessage}</h4>
                  {errorDetails && (
                    <p className="text-xs text-rose-700 mt-0.5">{errorDetails}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Popular Demo Profiles Chips */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Popular Demo Profiles
            </h3>
            <span className="text-xs text-slate-400">Click any chip to search</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularChips.map((chip) => {
              const isAarav = chip === '21CS042';
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  disabled={isSearching}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    isAarav
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="font-mono">{chip}</span>
                  {isAarav && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-indigo-200 text-indigo-900 font-bold">
                      Aarav
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Information Highlights Footer */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Deterministic Records</h4>
            <p className="text-[11px] text-slate-500">100 CS profiles from 21CS001 to 21CS100</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct URL Routing</h4>
            <p className="text-[11px] text-slate-500">Navigate anytime via /student/21CSxxx</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Faculty Verified</h4>
            <p className="text-[11px] text-slate-500">Endorsed skills, projects & internships</p>
          </div>
        </div>
      </div>

    </div>
  );
};
