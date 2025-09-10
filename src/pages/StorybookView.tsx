
import { useParams, Link } from 'react-router-dom';
import Storybook from '@/components/Storybook';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStory } from '@/services/storyService';
import LoadingSpinner from '@/components/LoadingSpinner';


const StorybookView = () => {
  const { storyId } = useParams<{ storyId: string }>();

  const { data: story, isLoading, isError } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => getStory(storyId!),
    enabled: !!storyId,
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <LoadingSpinner text="Summoning your story from the library..." />
        </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! No story found.</h2>
        <p className="mb-8 text-muted-foreground">We couldn't find this story. It might be lost in another dimension.</p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Create a new story
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="w-full max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary truncate pr-4">
          {story.title}
        </h1>
         <Button asChild variant="outline">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            New Story
          </Link>
        </Button>
      </header>
      <main className="flex-grow flex">
        <Storybook story={story} />
      </main>
    </div>
  );
};

export default StorybookView;
