import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play, Pause, AlertTriangle } from 'lucide-react';
import type { Page } from '@/types/story';

interface StoryPageProps {
  page: Page;
  isAutoplayOn?: boolean;
  onAudioEnd?: () => void;
}

const StoryPage = ({ page, isAutoplayOn = false, onAudioEnd = () => {} }: StoryPageProps) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Effect for setting up and cleaning up audio element
  useEffect(() => {
    let audioInstance: HTMLAudioElement | null = null;
    if (page.audioUrl) {
      audioInstance = new Audio(page.audioUrl);
      setAudio(audioInstance);

      const handleAudioEnd = () => onAudioEnd();
      audioInstance.addEventListener('ended', handleAudioEnd);

      if (isAutoplayOn) {
        audioInstance.play().catch(err => {
          console.error("Autoplay failed", err);
        });
      }
    } else if (isAutoplayOn) {
      // No audio, but autoplay is on. Go to next page after a delay for reading.
      const timer = setTimeout(onAudioEnd, 5000);
      return () => clearTimeout(timer);
    }
    
    // Reset image state when page changes
    setIsImageLoading(true);
    setImageError(false);

    return () => {
      audioInstance?.pause();
    };
  }, [page, isAutoplayOn, onAudioEnd]);

  // Effect to sync isPlaying state with the audio element
  useEffect(() => {
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    
    // Check initial state
    if (!audio.paused) setIsPlaying(true);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audio]);

  const handlePlayPause = () => {
    if (!audio) {
      toast.error("Narration is not available for this page.");
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error("Failed to play audio", err);
        toast.error("Could not play the narration.");
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center animate-fade-in p-4">
      <div className="aspect-square w-full max-w-2xl rounded-lg overflow-hidden shadow-lg mb-6 border-4 border-white bg-secondary">
        {isImageLoading && <Skeleton className="w-full h-full" />}
        {!page.imageUrl || imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4" style={{ display: isImageLoading ? 'none' : 'flex' }}>
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h3 className="text-xl font-bold">Image Failed to Load</h3>
            <p className="text-muted-foreground">We couldn't load the illustration.</p>
          </div>
        ) : (
          <img
            src={page.imageUrl}
            alt={page.imagePrompt}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              setImageError(true);
            }}
            style={{ display: isImageLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      <div className="w-full max-w-2xl text-center">
        <Button onClick={handlePlayPause} disabled={!page.audioUrl} className="mb-4" variant="secondary">
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? 'Pause Narration' : 'Play Narration'}
        </Button>
        <p className="font-serif text-xl md:text-2xl leading-relaxed text-gray-800">
          {page.text}
        </p>
      </div>
    </div>
  );
};

export default StoryPage;
