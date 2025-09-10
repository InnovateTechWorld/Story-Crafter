
import { useQuery } from '@tanstack/react-query';
import { getAllStories } from '@/services/storyService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const AllStories = () => {
  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['allStories'],
    queryFn: getAllStories,
  });

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><LoadingSpinner text="Loading all stories..." /></div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! Could not load stories.</h2>
        <p className="mb-8 text-muted-foreground">There was an issue retrieving the stories from the library.</p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl md:text-5xl font-black font-sans">Story Library</h1>
        <Button asChild variant="outline">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Create a New Story
          </Link>
        </Button>
      </header>
      {stories && stories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <Link to={`/story/${story.id}`} key={story.id} className="block hover:no-underline">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <CardHeader>
                  <CardTitle className="truncate group-hover:text-primary">{story.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <p className="text-sm text-muted-foreground">Click to read</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">The library is empty!</h2>
          <p className="mb-8 text-muted-foreground">Be the first to create a magical story.</p>
        </div>
      )}
    </div>
  );
};

export default AllStories;
