import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import StoryDisplay from '@/components/StoryDisplay';
import AnimatedTransition from '@/components/AnimatedTransition';
import { generateStory } from '@/utils/storyGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

type StoryType = 'adventure' | 'fantasy' | 'animals' | 'educational';

interface StoryData {
  childName: string;
  childAge: number;
  interests: string;
  storyType: StoryType;
  storyLength: string;
  isAutismFriendly?: boolean;
}

interface StoryInsights {
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

const Story = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState({ title: '', content: '' });
  const [storyInsights, setStoryInsights] = useState<StoryInsights | null>(null);

  const storyData = React.useMemo(() => {
    const state = location.state as StoryData;
    if (!state) return null;
    return state;
  }, [location.state]);

  const generateNewStory = async (data: StoryData) => {
    setIsLoading(true);
    try {
      const generatedStory = await generateStory(data);
      setStory(generatedStory);

      // Generate story insights if autism-friendly mode is enabled
      if (data.isAutismFriendly) {
        const insights: StoryInsights = {
          sequence: [
            {
              order: 1,
              event: "Meeting the main character",
              importance: "high",
              relatedEvents: ["Character introduction"]
            },
            {
              order: 2,
              event: "Starting the adventure",
              importance: "high",
              relatedEvents: ["Story setup"]
            },
            {
              order: 3,
              event: "Facing challenges",
              importance: "medium",
              relatedEvents: ["Problem solving"]
            },
            {
              order: 4,
              event: "Finding solutions",
              importance: "high",
              relatedEvents: ["Resolution"]
            }
          ],
          visualElements: [
            {
              scene: "The Beginning",
              description: "A bright and welcoming scene introducing the main character",
              keyObjects: ["Main character", "Background setting", "Important items"],
              emotions: ["Excited", "Curious", "Happy"]
            },
            {
              scene: "The Adventure",
              description: "An exciting scene showing the main action",
              keyObjects: ["Action elements", "Supporting characters", "Tools or items"],
              emotions: ["Determined", "Focused", "Brave"]
            }
          ],
          suggestedQuestions: [
            {
              type: "prediction",
              question: "What do you think will happen next?",
              context: "After the character discovers something new",
              difficulty: "easy",
              options: ["Something good", "A challenge", "A surprise"],
              hints: ["Think about what the character wants", "Remember what they've learned"]
            },
            {
              type: "empathy",
              question: "How do you think the character feels?",
              context: "When facing a difficult situation",
              difficulty: "medium",
              options: ["Scared", "Brave", "Unsure"],
              hints: ["Look at their actions", "Think about what you would feel"]
            }
          ]
        };
        setStoryInsights(insights);
      } else {
        setStoryInsights(null);
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
      toast.error('Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!storyData || !storyData.childName) {
      toast.error('Please start from the home page to create a story');
      navigate('/');
      return;
    }

    generateNewStory(storyData);
  }, [storyData, navigate]);

  const handleRegenerateStory = () => {
    if (!storyData || isLoading) return;
    generateNewStory(storyData);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">No Story Data</h1>
          <p className="text-muted-foreground">Please start from the home page to create a story.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
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
            childName={storyData.childName}
            childAge={storyData.childAge}
            storyType={storyData.storyType}
            interests={storyData.interests}
            isLoading={isLoading}
            onNewStory={handleRegenerateStory}
            onSave={handleSave}
            onShare={handleShare}
            isAutismFriendly={storyData.isAutismFriendly || false}
            supportTools={{
              sequencing: storyData.isAutismFriendly || false,
              visualization: storyData.isAutismFriendly || false,
              inferencing: storyData.isAutismFriendly || false
            }}
            storyInsights={storyInsights}
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
