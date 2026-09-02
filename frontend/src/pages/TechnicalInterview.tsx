import React from 'react';
import { RoundInterview } from '../components/Interview/RoundInterview';

export const TechnicalInterview: React.FC = () => (
  <RoundInterview
    roundType="technical"
    planKey="technical"
    title="Technical Depth & Architecture Round"
    subtitle="React 19, TypeScript, DOM Optimization & Web Security"
    progressLabel="Technical Progress"
    roundNumber={2}
    nextPath="/interview/system-design"
    nextLabel="Continue to System Design"
  />
);