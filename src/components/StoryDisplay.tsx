import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Image, Lightbulb, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import ReadTogether from './ReadTogether';

interface AutismSupportTools {
  sequencing: boolean;
  visualization: boolean;
  inferencing: boolean;
}

interface StoryDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
  className?: string;
  supportTools?: AutismSupportTools;
  isAutismFriendly?: boolean;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  title,
  content,
  isLoading = false,
  className,
  supportTools = {
    sequencing: false,
    visualization: false,
    inferencing: false
  },
  isAutismFriendly = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [completedEvents, setCompletedEvents] = useState<number[]>([]);
  const [showingImage, setShowingImage] = useState<number | null>(null);
  const [showingThought, setShowingThought] = useState<number | null>(null);
  const [activeReadingIndex, setActiveReadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [content]);

  const paragraphs = content.split('\n\n').filter(p => p.trim());

  const handleParagraphFinish = () => {
    if (activeReadingIndex !== null && activeReadingIndex < paragraphs.length - 1) {
      // Move to the next paragraph
      setActiveReadingIndex(activeReadingIndex + 1);
    } else {
      // Stop reading when we reach the end
      setActiveReadingIndex(null);
    }
  };

  const generateThinkingPrompt = (paragraph: string) => {
    // Generate relevant thinking prompts based on content
    if (paragraph.match(/feel|emotion|happy|sad|angry/i)) {
      return "How do you think the character is feeling? Why?";
    }
    if (paragraph.match(/decide|choice|choose/i)) {
      return "What would you do in this situation?";
    }
    if (paragraph.match(/problem|challenge|difficult/i)) {
      return "How else could they solve this problem?";
    }
    if (paragraph.match(/learn|realize|understand/i)) {
      return "What's the important lesson here?";
    }
    return "What do you think will happen next?";
  };

  const generateVisualizationPrompt = (paragraph: string) => {
    // Extract key visual elements from the paragraph
    const visualElements = paragraph.match(/\b(saw|looked|appeared|seemed|bright|dark|color|big|small|tall|short)\b/gi);
    if (visualElements?.length) {
      return `Can you picture: ${visualElements.join(', ')}?`;
    }
    return "What does this scene look like in your mind?";
  };

  const renderParagraphWithSupport = (paragraph: string, index: number) => {
    if (!isAutismFriendly) {
      const isReading = activeReadingIndex === index;
      return (
        <div key={index} className="space-y-3">
          <p>{paragraph}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (isReading) {
                  setActiveReadingIndex(null);
                } else {
                  setActiveReadingIndex(index);
                }
              }}
            >
              {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isReading ? "Stop Reading" : "Read Aloud"}
            </Button>
          </div>
          {isReading && (
            <ReadTogether
              content={paragraph}
              isVisible={true}
              onFinish={handleParagraphFinish}
            />
          )}
        </div>
      );
    }

    const isCompleted = completedEvents.includes(index);
    const isShowingImage = showingImage === index;
    const isShowingThought = showingThought === index;

    return (
      <div key={index} className="space-y-3 p-4 rounded-lg border border-secondary/20 bg-background/50">
        <div className="flex items-start gap-2">
          <span className="font-medium text-primary min-w-[24px]">{index + 1}.</span>
          <p>{paragraph}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {supportTools.sequencing && (
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => {
                if (isCompleted) {
                  setCompletedEvents(prev => prev.filter(i => i !== index));
                } else {
                  setCompletedEvents(prev => [...prev, index]);
                }
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? "Completed!" : "Mark as Read"}
            </Button>
          )}

          {supportTools.visualization && (
            <Button
              variant={isShowingImage ? "secondary" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowingImage(isShowingImage ? null : index)}
            >
              <Image className="w-4 h-4" />
              Picture This
            </Button>
          )}

          {supportTools.inferencing && (
            <Button
              variant={isShowingThought ? "secondary" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowingThought(isShowingThought ? null : index)}
            >
              <Lightbulb className="w-4 h-4" />
              Think About It
            </Button>
          )}
        </div>

        {isShowingImage && (
          <AnimatedTransition>
            <div className="mt-2 p-3 rounded-lg bg-secondary/10 space-y-2">
              <p className="font-medium text-sm">🎨 Visualization Helper:</p>
              <p className="text-sm text-muted-foreground">{generateVisualizationPrompt(paragraph)}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  I can see it!
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  Need help
                </Button>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {isShowingThought && (
          <AnimatedTransition>
            <div className="mt-2 p-3 rounded-lg bg-secondary/10 space-y-2">
              <p className="font-medium text-sm">💭 Thinking Helper:</p>
              <p className="text-sm text-muted-foreground">{generateThinkingPrompt(paragraph)}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  I have an idea!
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  Need help
                </Button>
              </div>
            </div>
          </AnimatedTransition>
        )}
      </div>
    );
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6 overflow-hidden", className)}>
      {isLoading ? (
        <div className="space-y-6">
          <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ) : (
        <AnimatedTransition>
          <div
            ref={contentRef}
            className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
          >
            <h2 className="text-2xl font-medium tracking-tight text-center">{title}</h2>

            <div className="story-text space-y-6">
              {paragraphs.map((paragraph, index) => (
                <AnimatedTransition key={index} delay={index * 100}>
                  {renderParagraphWithSupport(paragraph, index)}
                </AnimatedTransition>
              ))}
            </div>
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default StoryDisplay;
