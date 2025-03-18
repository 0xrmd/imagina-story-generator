import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StoryDisplay from '@/components/StoryDisplay';
import AnimatedTransition from '@/components/AnimatedTransition';
import ReadTogether from '@/components/ReadTogether';
import { generateStory } from '@/utils/storyGenerator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Book, Eye, BrainCircuit, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

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

  const [isAutismFriendly, setIsAutismFriendly] = useState(() => {
    const state = location.state as StoryData;
    return state?.isAutismFriendly || false;
  });

  const [supportTools, setSupportTools] = useState<AutismSupportTools>({
    sequencing: false,
    visualization: false,
    inferencing: false
  });

  const [isReadTogetherActive, setIsReadTogetherActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState({ title: '', content: '' });

  const storyData = React.useMemo(() => {
    const state = location.state as StoryData;
    if (!state) return null;
    return {
      ...state,
      isAutismFriendly,
    };
  }, [location.state, isAutismFriendly]);

  const generateNewStory = async (data: StoryData) => {
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(data);
      setStory(generatedStory);
    } catch (error) {
      console.error('Failed to generate story:', error);
      toast.error('Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!storyData || !storyData.childName) {
      navigate('/');
      return;
    }

    // Generate story on initial load or when autism mode changes
    generateNewStory(storyData);
  }, [storyData, isAutismFriendly]);

  const handleAutismFriendlyToggle = (checked: boolean) => {
    setIsAutismFriendly(checked);

    // Reset support tools when disabled
    if (!checked) {
      setSupportTools({
        sequencing: false,
        visualization: false,
        inferencing: false
      });
      setIsReadTogetherActive(false);
    }
  };

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

  const handleSave = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Background with rounded corners
      doc.setFillColor('#ffffff');
      doc.roundedRect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin, 5, 5, 'F');

      // Title
      doc.setTextColor('#000000');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      const titleY = margin + 18;
      const titleWidth = doc.getTextWidth(story.title);

      // Title background
      doc.setFillColor('#f3f4f6');
      doc.roundedRect(pageWidth / 2 - titleWidth / 2 - 10, titleY - 15, titleWidth + 20, 25, 5, 5, 'F');
      doc.text(story.title, pageWidth / 2, titleY, { align: 'center' });

      // Content
      doc.setTextColor('#000000');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const paragraphs = story.content.split('\n\n');
      let yPosition = titleY + 35;
      const lineSpacing = 6;

      paragraphs.forEach((paragraph, index) => {
        const lines = doc.splitTextToSize(paragraph, pageWidth - (margin * 2) - 20);
        doc.text(lines, margin + 15, yPosition);
        yPosition += lineSpacing * (lines.length + (index < paragraphs.length - 1 ? 1 : 0));

        if (yPosition > pageHeight - margin * 2) {
          doc.addPage();
          yPosition = margin + 20;
        }
      });

      // Footer
      const footerY = pageHeight - margin / 2;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor('#6b7280');
      doc.text('Created with love by StoryLand', pageWidth / 2, footerY, { align: 'center' });

      doc.save(`${story.title}.pdf`);
      toast.success('Story saved successfully! ✨');
    });
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

  if (!storyData || !storyData.childName) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col p-2 sm:p-4 md:p-6 bg-background">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto py-4 sm:py-6 md:py-8">
        <AnimatedTransition>
          {/* Controls */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Button
                variant="ghost"
                className="group text-foreground"
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
                    onCheckedChange={handleAutismFriendlyToggle}
                  />
                  <Label htmlFor="autism-friendly" className="cursor-pointer whitespace-nowrap">
                    Autism-Friendly Mode
                  </Label>
                </div>

                {isAutismFriendly && (
                  <div className="flex flex-wrap items-center gap-2 bg-muted p-2 rounded-lg w-full sm:w-auto">
                    <Button
                      variant={supportTools.sequencing ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-2 min-w-[120px]",
                        supportTools.sequencing && "bg-primary/10 hover:bg-primary/20"
                      )}
                      onClick={() => toggleSupportTool('sequencing')}
                    >
                      <List className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Order Events</span>
                    </Button>

                    <Button
                      variant={supportTools.visualization ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-2 min-w-[120px]",
                        supportTools.visualization && "bg-primary/10 hover:bg-primary/20"
                      )}
                      onClick={() => toggleSupportTool('visualization')}
                    >
                      <Eye className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Picture It</span>
                    </Button>

                    <Button
                      variant={supportTools.inferencing ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-2 min-w-[120px]",
                        supportTools.inferencing && "bg-primary/10 hover:bg-primary/20"
                      )}
                      onClick={() => toggleSupportTool('inferencing')}
                    >
                      <BrainCircuit className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Think Deeper</span>
                    </Button>

                    <Button
                      variant={isReadTogetherActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center gap-2 min-w-[120px]",
                        isReadTogetherActive && "bg-primary/10 hover:bg-primary/20"
                      )}
                      onClick={() => setIsReadTogetherActive(!isReadTogetherActive)}
                    >
                      <Book className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Read Together</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Story Content */}
          <StoryDisplay
            title={story.title}
            content={story.content}
            childName={storyData.childName}
            childAge={storyData.childAge}
            storyType={storyData.storyType}
            interests={storyData.interests}
            isLoading={isLoading}
            supportTools={supportTools}
            isAutismFriendly={isAutismFriendly}
            onNewStory={handleRegenerateStory}
            onSave={handleSave}
            onShare={handleShare}
          />
        </AnimatedTransition>
      </main>

      <footer className="w-full max-w-4xl mx-auto py-4 sm:py-6 text-center text-sm text-muted-foreground">
        <p className="mb-1">StoryLand • Crafting magical stories for children © {new Date().getFullYear()}</p>
        <p>Made with ❤️ by <a href="https://github.com/medrami-dev" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Mohamed Rami</a></p>
      </footer>

      {isReadTogetherActive && (
        <ReadTogether
          content={story.content}
          isVisible={isReadTogetherActive}
        />
      )}
    </div>
  );
};

export default Story;
