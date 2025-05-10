
import React from 'react';
import TutorialSteps from './TutorialSteps';

interface EmptyStateProps {
  onStartSearch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onStartSearch }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-5xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to AIDY</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Follow these simple steps to start mapping crowd density at tourist attractions.
      </p>
      
      <TutorialSteps onStartMapping={onStartSearch} />
      
      <div className="bg-muted/30 p-6 rounded-lg border border-border mt-8 max-w-2xl w-full">
        <h3 className="text-lg font-medium mb-2">How it works</h3>
        <p className="text-sm text-muted-foreground">
          Our AI-powered system uses location data to analyze and predict crowd density at popular tourist attractions.
          Simply paste a link to a tourism website or location listing, name your list, and we'll generate real-time density information.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
