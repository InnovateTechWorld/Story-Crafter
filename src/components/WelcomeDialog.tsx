
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, KeyRound, BookText, Library } from 'lucide-react';

const walkthroughSteps = [
  {
    icon: <Sparkles className="h-12 w-12 text-primary" />,
    title: 'Welcome to StoryWeaver AI!',
    description: "Let's quickly show you how to create your first magical storybook.",
  },
  {
    icon: <KeyRound className="h-12 w-12 text-primary" />,
    title: 'Step 1: Your Magic Key',
    description: "First, you'll need a Gemini API key. The app will prompt you to enter it. This key is stored only in your browser and is needed to generate stories.",
  },
  {
    icon: <BookText className="h-12 w-12 text-primary" />,
    title: 'Step 2: Dream Up a Story',
    description: 'Use the form to describe your story idea. You can choose the art style, narration voice, and number of pages. Get creative!',
  },
    {
    icon: <Library className="h-12 w-12 text-primary" />,
    title: 'Step 3: Your Personal Library',
    description: 'All your created stories are saved in your Story Library. You can revisit your adventures anytime by clicking the "Story Library" button at the top right.',
  },
];

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < walkthroughSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    onOpenChange(false);
  };

  const currentStep = walkthroughSteps[step];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center items-center">
            <div className="mb-4">{currentStep.icon}</div>
          <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center px-4">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
            <div className="flex space-x-2">
                {walkthroughSteps.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        step === index ? 'w-6 bg-primary' : 'bg-muted'
                        }`}
                    />
                ))}
            </div>
        </div>

        <DialogFooter>
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {step < walkthroughSteps.length - 1 ? (
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Get Started!
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
