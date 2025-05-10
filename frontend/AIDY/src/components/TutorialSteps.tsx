
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  imageUrl: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Step 1: Select all the places in your list",
    description: "Open Google Maps and sign in. \n In the map pane below, click the Select all button to tick every place in that list.",
    imageUrl: "/images/step1.png"
  },
  {
    title: "Step 2: Click the Share icon",
    description: "Click the Share icon next to the Save button",
    imageUrl: "/images/step2.png"
  },
  {
    title: "Step 3: Click Share individual places instead",
    description: "Click, then copy and paste the contents above into the text box to start analyzing tourism density",
    imageUrl: "/images/step3.png"
  }
];

interface TutorialStepsProps {
  onStartMapping?: () => void;
}

const TutorialSteps: React.FC<TutorialStepsProps> = ({ onStartMapping }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const isLastStep = currentStep === tutorialSteps.length - 1;
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{tutorialSteps[currentStep].title}</CardTitle>
          <CardDescription>{tutorialSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="aspect-video rounded-md overflow-hidden bg-muted">
            <img 
              src={tutorialSteps[currentStep].imageUrl} 
              alt={`Tutorial step ${currentStep + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 p-4">
  <div className="flex items-center w-full">
    <Button
      variant="outline"
      size="icon"
      onClick={handlePrevStep}
      disabled={currentStep === 0}
      className="rounded-full"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous step</span>
    </Button>
    <div className="flex-1 flex justify-center">
      <div className="flex gap-1">
        {tutorialSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentStep === index ? "bg-blue-600" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
    { !isLastStep ? (
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextStep}
        className="rounded-full"
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next step</span>
      </Button>
    ) : (
      // This keeps the layout balanced when the right arrow is hidden
      <div style={{ width: 40, height: 40 }} />
    )}
  </div>
</CardFooter>
      </Card>
    </div>
  );
};

export default TutorialSteps;
