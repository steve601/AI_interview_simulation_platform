import React from 'react';
import { InterviewProvider } from './context/InterviewContext';
import { Navbar } from './components/Navbar/Navbar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ToastContainer } from './components/Common/Toast';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <InterviewProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-serif selection:bg-blue-100 selection:text-blue-900">
        <Navbar />

        <div className="flex-1 flex relative">
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 md:pl-64 transition-all duration-200">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              <AppRoutes />
            </div>
          </main>
        </div>

        <ToastContainer />
      </div>
    </InterviewProvider>
  );
}
