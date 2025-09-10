import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StoryPage from './StoryPage';
import type { Story } from '@/types/story';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StorybookProps {
  story: Story;
}

const Storybook = ({ story }: StorybookProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isAutoplayOn, setIsAutoplayOn] = useState(false);

  // Add this check to prevent errors if pages are missing
  if (!story.pages || story.pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! This story has no pages.</h2>
        <p className="text-muted-foreground">It might not have been generated properly. Try creating a new story.</p>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex];

  const goToNextPage = () => {
    if (currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      setIsAutoplayOn(false); // Turn off autoplay at the end
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-grow w-full flex items-center justify-center">
        <StoryPage
          key={currentPage.pageNumber}
          page={currentPage}
          isAutoplayOn={isAutoplayOn}
          onAudioEnd={goToNextPage}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-3xl p-4 mt-4">
        <Button onClick={goToPrevPage} disabled={currentPageIndex === 0} size="lg" variant="outline">
          <ArrowLeft className="mr-2 h-5 w-5" /> Previous
        </Button>
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-bold">
            Page {currentPage.pageNumber} / {story.pages.length}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoplay-switch"
              checked={isAutoplayOn}
              onCheckedChange={setIsAutoplayOn}
              disabled={currentPageIndex === story.pages.length - 1 && !isAutoplayOn}
            />
            <Label htmlFor="autoplay-switch">Autoplay</Label>
          </div>
        </div>
        <Button onClick={goToNextPage} disabled={currentPageIndex === story.pages.length - 1} size="lg">
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Storybook;