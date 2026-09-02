import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { activePath, navigate } = useInterview();

  const getBreadcrumbs = () => {
    switch (activePath) {
      case '/':
        return [{ label: 'Overview', path: '/' }];
      case '/upload':
        return [
          { label: 'Home', path: '/' },
          { label: 'Upload CV & Job Description', path: '/upload' }
        ];
      case '/plan':
        return [
          { label: 'Home', path: '/' },
          { label: 'Upload', path: '/upload' },
          { label: 'Interview Plan & Skill Gap', path: '/plan' }
        ];
      case '/interview/behavioral':
        return [
          { label: 'Plan', path: '/plan' },
          { label: 'Behavioral Round', path: '/interview/behavioral' }
        ];
      case '/interview/technical':
        return [
          { label: 'Plan', path: '/plan' },
          { label: 'Technical Round', path: '/interview/technical' }
        ];
      case '/interview/system-design':
        return [
          { label: 'Plan', path: '/plan' },
          { label: 'System Design Round', path: '/interview/system-design' }
        ];
      case '/report':
        return [
          { label: 'Overview', path: '/' },
          { label: 'Final Evaluation Report', path: '/report' }
        ];
      default:
        return [{ label: 'Home', path: '/' }];
    }
  };

  const items = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-xs text-[#64748B] mb-4 no-print" aria-label="Breadcrumb">
      <button
        onClick={() => navigate('/')}
        className="hover:text-[#0F172A] p-0.5 rounded-xs focus:outline-none"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={item.path + idx}>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => navigate(item.path)}
            className={`hover:underline font-medium ${
              idx === items.length - 1
                ? 'text-[#0F172A] font-semibold cursor-default hover:no-underline'
                : 'text-[#64748B] hover:text-[#2563EB]'
            }`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
