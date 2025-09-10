
import StoryCreatorForm from "@/components/StoryCreatorForm";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { WelcomeDialog } from "@/components/WelcomeDialog";

const Index = () => {
  const [isApiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isWelcomeDialogOpen, setWelcomeDialogOpen] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("gemini_api_key");
    setApiKey(key);
    if (!key) {
      setApiKeyDialogOpen(true);
    }

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
        setWelcomeDialogOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKey(key);
    setApiKeyDialogOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-grid-purple-200/[0.2] relative">
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setWelcomeDialogOpen} />
      <ApiKeyDialog open={isApiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen} onSave={handleSaveApiKey} />
      <div className="absolute top-4 right-4 z-20">
        <Button asChild variant="outline">
            <Link to="/stories">
                <BookOpen className="mr-2 h-4 w-4" />
                Story Library
            </Link>
        </Button>
      </div>
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="text-center mb-12 z-10 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-black font-sans bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
          StoryWeaver AI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Turn your wildest ideas into beautifully illustrated and narrated storybooks.
          What adventure will you dream up today?
        </p>
      </div>
      <div className="z-10 w-full flex justify-center">
        {apiKey ? (
          <StoryCreatorForm />
        ) : (
          <Button onClick={() => setApiKeyDialogOpen(true)} size="lg">Enter API Key to Start</Button>
        )}
      </div>
    </div>
  );
};

export default Index;
