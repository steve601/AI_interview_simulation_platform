import React from 'react';
import { RoundInterview } from '../components/Interview/RoundInterview';

export const SystemDesignInterview: React.FC = () => (
  <RoundInterview
    roundType="system-design"
    planKey="system_design"
    title="System Design & Scalability Round"
    subtitle="Real-time collaborative consoles, WebSockets, CRDTs & Micro-frontends"
    progressLabel="System Design Progress"
    roundNumber={3}
    nextPath="/interview/complete"
    nextLabel="Finish Interview & Generate Report"
  />
);