import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import {
  Home,
  UploadCloud,
  ListOrdered,
  MessageSquare,
  Code,
  Layers,
  FileCheck2,
  CheckCircle2,
  CircleDot,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activePath,
    navigate,
    sidebarOpen,
    setSidebarOpen,
    roundProgress,
    interviewPlan,
    currentRound,
  } = useInterview();

  const getRoundStatus = (round: 'behavioral' | 'technical' | 'system-design') => {
    const progress = roundProgress[round];
    if (progress.completed) return 'Done';
    if (currentRound === round) return 'Current';
    if (progress.answeredCount > 0) return `${progress.answeredCount}/${progress.totalCount}`;
    return 'Not started';
  };

  const navItems = [
    {
      label: 'Overview & Home',
      path: '/',
      icon: <Home className="w-4 h-4" />,
      badge: null
    },
    {
      label: 'Upload CV & JD',
      path: '/upload',
      icon: <UploadCloud className="w-4 h-4" />,
      badge: null
    },
    {
      label: 'Interview Plan',
      path: '/plan',
      icon: <ListOrdered className="w-4 h-4" />,
      badge: interviewPlan ? 'Ready' : null
    },
    {
      label: 'Behavioral Round',
      path: '/interview/behavioral',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: getRoundStatus('behavioral')
    },
    {
      label: 'Technical Round',
      path: '/interview/technical',
      icon: <Code className="w-4 h-4" />,
      badge: getRoundStatus('technical')
    },
    {
      label: 'System Design',
      path: '/interview/system-design',
      icon: <Layers className="w-4 h-4" />,
      badge: getRoundStatus('system-design')
    },
    {
      label: 'Final Evaluation Report',
      path: '/report',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: null
    }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden no-print"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        } flex flex-col justify-between no-print`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Navigation Group */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activePath === item.path;
                const isCompleted =
                  item.badge === 'Done' || (item.path === '/plan' && interviewPlan !== null);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-2xs'
                        : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={isActive ? 'text-white' : 'text-[#64748B]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[11px] font-mono px-1.5 py-0.5 rounded-xs ${
                          isActive
                            ? 'bg-blue-800 text-blue-100'
                            : isCompleted
                            ? 'bg-green-100 text-green-800 font-semibold'
                            : item.badge === 'Current'
                            ? 'bg-blue-100 text-blue-800 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Interview Stages Tracker */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <div className="px-2 mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
              <span>Interview Status</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>

            <div className="space-y-2 bg-[#FAFAFA] p-3 rounded-sm border border-[#E2E8F0]">
              {([
                ['behavioral', '1. Behavioral'],
                ['technical', '2. Technical'],
                ['system-design', '3. System Design'],
              ] as const).map(([round, label]) => {
                const progress = roundProgress[round];
                const isCurrent = currentRound === round && !progress.completed;

                return (
                  <div key={round} className="flex items-center justify-between text-xs">
                    <div className="flex min-w-0 items-center gap-2">
                      {progress.completed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <CircleDot className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                      )}
                      <span className="truncate font-medium text-[#334155]">{label}</span>
                    </div>
                    <span className={`ml-2 shrink-0 text-[10px] font-mono ${isCurrent ? 'font-semibold text-blue-700' : 'text-slate-500'}`}>
                      {progress.completed ? 'Complete' : `${progress.answeredCount}/${progress.totalCount}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#FAFAFA] text-xs text-[#64748B]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#0F172A]">PromptHire Engine</span>
            <span className="font-mono text-[10px] text-slate-500">v2.4.0</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-500">
            Enterprise Compliance & Audit Enabled
          </p>
        </div>
      </aside>
    </>
  );
};
