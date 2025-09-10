
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { generateStory } from "@/services/aiService";
import { saveStoryFull } from "@/services/storyService";
import type { ArtStyle, Voice } from "@/types/story";
import { voices } from "@/types/story";
import LoadingSpinner from "./LoadingSpinner";

const artStyles: ArtStyle[] = ["Cartoon", "Watercolor", "Comic Book", "Fantasy Art"];

const StoryCreatorForm = () => {
  const [prompt, setPrompt] = useState("");
  const [numPages, setNumPages] = useState([5]);
  const [artStyle, setArtStyle] = useState<ArtStyle>("Cartoon");
  const [voice, setVoice] = useState<Voice>("Puck");
  const [educationalTheme, setEducationalTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      setError("Please enter a story idea!");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const storyAI = await generateStory(prompt, numPages[0], artStyle, voice, educationalTheme);
      const storyId = await saveStoryFull(storyAI);
      navigate(`/story/${storyId}`);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
      if (err instanceof Error) {
          errorMessage = err.message;
        if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("net::err_name_not_resolved")) {
          setError("Could not connect to the database. Please verify your Supabase Project ID and that the project is active.");
        } else {
          setError(errorMessage);
        }
      }
      console.error("Error during story creation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 text-center">
        <LoadingSpinner text="Weaving and saving your tale..." />
        <p className="mt-4 text-muted-foreground animate-pulse">
          This can take a minute. Please don't close this page.
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center gap-2">
          <Wand2 className="text-primary" />
          Create Your Story
        </CardTitle>
        <CardDescription>Tell us your idea and we'll bring it to life!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">What is your story about?</Label>
            <Input
              id="prompt"
              placeholder="e.g., A brave squirrel who wants to fly"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="art-style">Art Style</Label>
              <Select onValueChange={(value: ArtStyle) => setArtStyle(value)} defaultValue={artStyle}>
                <SelectTrigger id="art-style">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="voice">Narration Voice</Label>
              <Select onValueChange={(value: Voice) => setVoice(value)} defaultValue={voice}>
                <SelectTrigger id="voice">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="educational-theme">Educational Theme (Optional)</Label>
            <Input
              id="educational-theme"
              placeholder="e.g., The importance of teamwork"
              value={educationalTheme}
              onChange={(e) => setEducationalTheme(e.target.value)}
            />
          </div>


          <div className="space-y-2">
            <Label>Number of Pages: {numPages[0]}</Label>
            <Slider
              min={3}
              max={10}
              step={1}
              value={numPages}
              onValueChange={setNumPages}
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button type="submit" className="w-full font-bold text-lg" size="lg" disabled={isLoading}>
            {isLoading ? "Generating..." : "Start Weaving Magic"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoryCreatorForm;
