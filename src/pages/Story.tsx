import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StoryDisplay from '@/components/StoryDisplay';
import StoryOptions from '@/components/StoryOptions';
import AnimatedTransition from '@/components/AnimatedTransition';
import ReadTogether from '@/components/ReadTogether';
import { generateStory } from '@/utils/storyGenerator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Book, Eye, BrainCircuit, List } from 'lucide-react';

type StoryType = 'adventure' | 'fantasy' | 'animals' | 'educational';

interface StoryData {
  childName: string;
  childAge: number;
  interests: string;
  storyType: StoryType;
  storyLength: string;
  isAutismFriendly: boolean;
}

interface AutismSupportTools {
  sequencing: boolean;
  visualization: boolean;
  inferencing: boolean;
}

const Story = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize isAutismFriendly from location state
  const [isAutismFriendly, setIsAutismFriendly] = useState(() => {
    const state = location.state as StoryData;
    return state?.isAutismFriendly || false;
  });

  // Add state for autism support tools
  const [supportTools, setSupportTools] = useState<AutismSupportTools>({
    sequencing: false,
    visualization: false,
    inferencing: false
  });

  const [isReadTogetherActive, setIsReadTogetherActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState({ title: '', content: '' });

  // Create storyData object that updates when isAutismFriendly changes
  const storyData = React.useMemo(() => {
    const state = location.state as StoryData;
    if (!state) return null;

    return {
      ...state,
      isAutismFriendly,
    };
  }, [location.state, isAutismFriendly]);

  // Handle story generation
  const generateNewStory = async (data: StoryData) => {
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(data);
      setStory(generatedStory);
    } catch (error) {
      console.error('Failed to generate story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial story generation and autism mode changes
  useEffect(() => {
    if (!storyData || !storyData.childName) {
      navigate('/');
      return;
    }

    // Reset support tools when autism mode is disabled
    if (!isAutismFriendly) {
      setSupportTools({
        sequencing: false,
        visualization: false,
        inferencing: false
      });
      setIsReadTogetherActive(false);
    }

    // Generate story when mode changes or on initial load
    generateNewStory(storyData);
  }, [storyData, isAutismFriendly]);

  const handleRegenerateStory = () => {
    if (!storyData || isLoading) return;
    generateNewStory(storyData);
  };

  const toggleSupportTool = (tool: keyof AutismSupportTools) => {
    setSupportTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  if (!storyData || !storyData.childName) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 md:p-6">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto py-4 sm:py-6 md:py-8">
        <AnimatedTransition className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="group"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autism-friendly"
                  checked={isAutismFriendly}
                  onCheckedChange={setIsAutismFriendly}
                />
                <Label htmlFor="autism-friendly" className="cursor-pointer whitespace-nowrap">
                  Autism-Friendly Mode
                </Label>
              </div>

              {isAutismFriendly && (
                <div className="flex flex-wrap items-center gap-2 bg-secondary/10 p-2 rounded-lg w-full sm:w-auto">
                  <Button
                    variant={supportTools.sequencing ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => toggleSupportTool('sequencing')}
                    title="Sequencing Support"
                  >
                    <List className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Order Events</span>
                  </Button>

                  <Button
                    variant={supportTools.visualization ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => toggleSupportTool('visualization')}
                    title="Visualization Support"
                  >
                    <Eye className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Picture It</span>
                  </Button>

                  <Button
                    variant={supportTools.inferencing ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => toggleSupportTool('inferencing')}
                    title="Inferencing Support"
                  >
                    <BrainCircuit className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Think Deeper</span>
                  </Button>

                  <Button
                    variant={isReadTogetherActive ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => setIsReadTogetherActive(!isReadTogetherActive)}
                  >
                    <Book className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Read Together</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-4/5 order-2 lg:order-1">
              <StoryDisplay
                title={story.title}
                content={story.content}
                isLoading={isLoading}
                className="h-full glass-card rounded-2xl p-4 sm:p-6"
                supportTools={supportTools}
                isAutismFriendly={isAutismFriendly}
              />
            </div>

            <div className="w-full lg:w-1/5 order-1 lg:order-2">
              <AnimatedTransition delay={300}>
                <div className="glass-card rounded-2xl p-4 space-y-4 sm:space-y-6 sticky top-4">
                  <div>
                    <h3 className="font-medium mb-1 text-lg">Story for</h3>
                    <p className="text-base">{storyData.childName}, {storyData.childAge} years</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1 text-lg">Story type</h3>
                    <p className="capitalize text-base">{storyData.storyType}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1 text-lg">Interests</h3>
                    <p className="text-base">{storyData.interests}</p>
                  </div>

                  <StoryOptions
                    onRegenerateStory={handleRegenerateStory}
                    title={story.title}
                    content={story.content}
                    storyType={storyData.storyType}
                  />
                </div>
              </AnimatedTransition>
            </div>
          </div>
        </AnimatedTransition>
      </main>

      <footer className="w-full max-w-4xl mx-auto py-4 sm:py-6 text-center text-sm text-muted-foreground">
        <p className="mb-1"> StoryLand • Crafting magical stories for children © {new Date().getFullYear()} </p>
        <p> Made with ❤️ by <a href="https://github.com/medrami-dev" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Mohamed Rami</a> </p>
      </footer>

      <ReadTogether
        content={story.content}
        isVisible={isReadTogetherActive}
      />
    </div>
  );
};

export default Story;
