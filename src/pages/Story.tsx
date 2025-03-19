import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StoryDisplay from '@/components/StoryDisplay';
import AnimatedTransition from '@/components/AnimatedTransition';
import { generateStory } from '@/utils/storyGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Loader2, BookmarkX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type StoryType = 'adventure' | 'fantasy' | 'animals' | 'educational';

interface StoryInsights {
  moral: string;
  vocabulary: string[];
  readingTime: string;
  sequence: {
    order: number;
    event: string;
    importance: 'high' | 'medium' | 'low';
    relatedEvents: string[];
  }[];
  visualElements: {
    scene: string;
    description: string;
    keyObjects: string[];
    emotions: string[];
  }[];
  suggestedQuestions: {
    type: 'prediction' | 'analysis' | 'empathy' | 'problem-solving';
    question: string;
    context: string;
    difficulty: 'easy' | 'medium' | 'hard';
    options: string[];
    hints: string[];
  }[];
}

interface StoryData {
  type: StoryType;
  age: number;
  theme: string;
  length: 'short' | 'medium' | 'long';
}

const Story = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedStoryId, setSavedStoryId] = useState<string | null>(null);
  const [story, setStory] = useState({
    title: '',
    content: '',
    childName: '',
    childAge: 0,
    storyType: 'adventure',
    interests: '',
    isAutismFriendly: false
  });
  const [storyInsights, setStoryInsights] = useState<StoryInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storyData = React.useMemo(() => {
    // Check if we have story data from location state (saved story)
    if (location.state?.story) {
      return location.state.story;
    }
    // Check if we have story data from direct navigation
    if (location.state) {
      return location.state;
    }
    return null;
  }, [location.state]);

  useEffect(() => {
    const checkIfStoryIsSaved = async () => {
      if (!user || !story.title) return;

      try {
        const { data, error } = await supabase
          .from('saved_stories')
          .select('id')
          .eq('user_id', user.id)
          .eq('title', story.title)
          .eq('content', story.content)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        setIsSaved(!!data);
        setSavedStoryId(data?.id || null);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfStoryIsSaved();
  }, [user, story.title, story.content]);

  useEffect(() => {
    const loadStory = async () => {
      if (!storyData) {
        toast.error('Please start from the home page to create a story');
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        // If we have a saved story, use it directly
        if (location.state?.story) {
          setStory({
            title: location.state.story.title,
            content: location.state.story.content,
            childName: location.state.story.childName || '',
            childAge: location.state.story.childAge || 0,
            storyType: location.state.story.storyType || 'adventure',
            interests: location.state.story.interests || '',
            isAutismFriendly: location.state.story.isAutismFriendly || false
          });
          setStoryInsights({
            moral: location.state.story.moral || 'The importance of kindness and friendship',
            vocabulary: location.state.story.vocabulary || ['adventure', 'friendship', 'discovery'],
            readingTime: location.state.story.readingTime || '5-7 minutes',
            sequence: location.state.story.sequence || [],
            visualElements: location.state.story.visualElements || [],
            suggestedQuestions: location.state.story.suggestedQuestions || []
          });
        } else {
          // Generate a new story if we have story parameters
          const generatedStory = await generateStory(storyData);
          setStory({
            title: generatedStory.title,
            content: generatedStory.content,
            childName: storyData.childName || '',
            childAge: storyData.childAge || 0,
            storyType: storyData.storyType || 'adventure',
            interests: storyData.interests || '',
            isAutismFriendly: storyData.isAutismFriendly || false
          });
          setStoryInsights({
            moral: generatedStory.moral || 'The importance of kindness and friendship',
            vocabulary: generatedStory.vocabulary || ['adventure', 'friendship', 'discovery'],
            readingTime: generatedStory.readingTime || '5-7 minutes',
            sequence: generatedStory.sequence || [],
            visualElements: generatedStory.visualElements || [],
            suggestedQuestions: generatedStory.suggestedQuestions || []
          });
        }
      } catch (error) {
        console.error('Error loading story:', error);
        toast.error('Failed to load story. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [storyData, navigate, location.state]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save stories');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_stories')
        .insert({
          user_id: user.id,
          title: story.title,
          content: story.content,
          child_name: story.childName,
          child_age: story.childAge,
          story_type: story.storyType,
          interests: story.interests,
          is_autism_friendly: story.isAutismFriendly,
          moral: storyInsights?.moral || 'The importance of kindness and friendship',
          vocabulary: storyInsights?.vocabulary || ['adventure', 'friendship', 'discovery'],
          reading_time: storyInsights?.readingTime || '5-7 minutes',
          sequence: storyInsights?.sequence || [],
          visual_elements: storyInsights?.visualElements || [],
          suggested_questions: storyInsights?.suggestedQuestions || []
        })
        .select();

      if (error) throw error;

      setIsSaved(true);
      setSavedStoryId(data[0].id);
      toast.success('Story saved successfully!');
    } catch (error: any) {
      console.error('Error saving story:', error);
      toast.error(error.message || 'Failed to save story');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsave = async () => {
    if (!user || !savedStoryId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_stories')
        .delete()
        .eq('id', savedStoryId);

      if (error) throw error;

      setIsSaved(false);
      setSavedStoryId(null);
      toast.success('Story removed from saved stories');
    } catch (error: any) {
      console.error('Error unsaving story:', error);
      toast.error(error.message || 'Failed to remove story from saved stories');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateStory = async () => {
    if (!storyData || isLoading) return;
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(storyData);
      setStory({
        title: generatedStory.title,
        content: generatedStory.content,
        childName: storyData.childName || '',
        childAge: storyData.childAge || 0,
        storyType: storyData.storyType || 'adventure',
        interests: storyData.interests || '',
        isAutismFriendly: storyData.isAutismFriendly || false
      });
      setStoryInsights({
        moral: generatedStory.moral || 'The importance of kindness and friendship',
        vocabulary: generatedStory.vocabulary || ['adventure', 'friendship', 'discovery'],
        readingTime: generatedStory.readingTime || '5-7 minutes',
        sequence: generatedStory.sequence || [],
        visualElements: generatedStory.visualElements || [],
        suggestedQuestions: generatedStory.suggestedQuestions || []
      });
    } catch (error) {
      console.error('Error regenerating story:', error);
      toast.error('Failed to regenerate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const textToShare = `${story.title}\n\n${story.content}`;

    try {
      await navigator.clipboard.writeText(textToShare);
      toast.success("Story copied to clipboard");
    } catch (error) {
      // Simple fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = textToShare;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        const success = document.execCommand('copy');
        if (!success) throw new Error('Copy failed');
        toast.success("Story copied to clipboard");
      } catch {
        toast.error("Failed to copy story to clipboard");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 md:p-6 bg-background">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto py-4 sm:py-6 md:py-8">
        <AnimatedTransition>
          <StoryDisplay
            title={story.title}
            content={story.content}
            childName={story.childName}
            childAge={story.childAge}
            storyType={story.storyType}
            interests={story.interests}
            isLoading={isLoading}
            supportTools={{
              sequencing: story.isAutismFriendly,
              visualization: story.isAutismFriendly,
              inferencing: story.isAutismFriendly
            }}
            isAutismFriendly={story.isAutismFriendly}
            onNewStory={handleRegenerateStory}
            onSave={isSaved ? handleUnsave : handleSave}
            onShare={handleShare}
            storyInsights={storyInsights}
            isSaved={isSaved}
            isSaving={isSaving}
          />
        </AnimatedTransition>
      </main>

      <footer className="w-full max-w-4xl mx-auto py-4 sm:py-6 text-center text-sm text-muted-foreground">
        <p className="mb-1">StoryLand • Crafting magical stories for children © {new Date().getFullYear()}</p>
        <p>Made with ❤️ by <a href="https://github.com/medrami-dev" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Mohamed Rami</a></p>
      </footer>
    </div>
  );
};

export default Story;
