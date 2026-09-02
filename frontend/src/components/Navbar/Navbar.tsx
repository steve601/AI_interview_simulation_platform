import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import {
  Menu,
  X,
  Bot,
  RotateCcw,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    candidate,
    jobDescription,
    sidebarOpen,
    setSidebarOpen,
    navigate,
    resetSession,
    loadSampleSession
  } = useInterview();

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-[#1E293B] shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-sm hover:bg-[#1E293B] text-slate-300 hover:text-white focus:outline-none md:hidden"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#2563EB] text-white flex items-center justify-center font-bold text-base rounded-xs shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base tracking-tight text-white">PromptHire</span>
                <span className="text-[10px] uppercase tracking-wider bg-[#1E293B] text-blue-400 border border-blue-900/50 px-1.5 py-0.5 rounded-xs font-mono">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                AI Interview Simulator & Evaluation Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active Context Info */}
        <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-300 bg-[#1E293B]/70 border border-slate-800 px-3 py-1 rounded-sm">
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-slate-200">
              {candidate.candidateName || 'No Candidate'}
            </span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5 max-w-[220px] truncate">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate text-slate-300">
              {jobDescription.jobTitle || 'No JD Loaded'}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={loadSampleSession}
            className="hidden sm:inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/60 px-2.5 py-1 rounded-sm transition-colors"
            title="Load Microsoft Azure Architect sample data"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Azure Sample</span>
          </button>

          <button
            onClick={resetSession}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1E293B] rounded-sm transition-colors text-xs flex items-center space-x-1"
            title="Reset active interview session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-400/30">
              MS
            </div>
            <span className="hidden xl:inline text-slate-300 text-xs font-medium">
              Enterprise Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
