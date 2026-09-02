import React from 'react';
import { RoundInterview } from '../components/Interview/RoundInterview';

export const BehavioralInterview: React.FC = () => (
  <RoundInterview
    roundType="behavioral"
    planKey="behavioral"
    title="Behavioral & Leadership Round"
    subtitle="STAR methodology evaluation • Conflict resolution & engineering leadership"
    progressLabel="Behavioral Progress"
    roundNumber={1}
    nextPath="/interview/technical"
    nextLabel="Continue to Technical Interview"
  />
);