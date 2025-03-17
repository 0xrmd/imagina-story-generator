
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StoryDisplay from '@/components/StoryDisplay';
import StoryOptions from '@/components/StoryOptions';
import AnimatedTransition from '@/components/AnimatedTransition';
import { generateStory } from '@/utils/storyGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface StoryData {
  childName: string;
  childAge: number;
  interests: string;
  storyType: string;
  storyLength: string;
}

const Story = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storyData = location.state as StoryData;
  
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState({ title: '', content: '' });
  
  // Redirect if no story data
  useEffect(() => {
    if (!storyData || !storyData.childName) {
      navigate('/');
      return;
    }
    
    createStory();
  }, []);
  
  const createStory = async () => {
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(storyData);
      setStory(generatedStory);
    } catch (error) {
      console.error('Failed to generate story:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerateStory = () => {
    createStory();
  };
  
  if (!storyData || !storyData.childName) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-8">
        <AnimatedTransition className="mb-6">
          <Button
            variant="ghost"
            className="group mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-4/5">
              <StoryDisplay
                title={story.title}
                content={story.content}
                isLoading={isLoading}
                className="h-full"
              />
            </div>
            
            <div className="w-full md:w-1/5">
              <AnimatedTransition delay={300}>
                <div className="glass-card rounded-2xl p-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-1">Story for</h3>
                    <p>{storyData.childName}, {storyData.childAge} years</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Story type</h3>
                    <p className="capitalize">{storyData.storyType}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Interests</h3>
                    <p>{storyData.interests}</p>
                  </div>
                  
                  <StoryOptions
                    onRegenerateStory={handleRegenerateStory}
                  />
                </div>
              </AnimatedTransition>
            </div>
          </div>
        </AnimatedTransition>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>StoryWonder • Crafting magical stories for children</p>
      </footer>
    </div>
  );
};

export default Story;
