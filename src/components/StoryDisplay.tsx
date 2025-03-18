import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Image, Lightbulb, CheckCircle2, Volume2, VolumeX, ArrowLeft, Bookmark, Share2, RefreshCw } from 'lucide-react';
import ReadTogether from './ReadTogether';

interface AutismSupportTools {
  sequencing: boolean;
  visualization: boolean;
  inferencing: boolean;
}

interface StoryDisplayProps {
  title: string;
  content: string;
  childName: string;
  childAge: number;
  storyType: string;
  interests: string;
  isLoading?: boolean;
  className?: string;
  supportTools?: AutismSupportTools;
  isAutismFriendly?: boolean;
  onNewStory: () => void;
  onSave: () => void;
  onShare: () => void;
}

const StoryDetailsSidebar: React.FC<{
  childName: string;
  age: number;
  storyType: string;
  interests: string;
  onNewStory: () => void;
  onSave: () => void;
  onShare: () => void;
  className?: string;
  isLoading?: boolean;
}> = ({ childName, age, storyType, interests, onNewStory, onSave, onShare, className, isLoading }) => {
  return (
    <div className={cn(
      "rounded-3xl bg-card p-6 space-y-6 border shadow-sm",
      className
    )}>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Story for</h3>
          <p className="text-muted-foreground">{childName}, {age} years</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-medium">Story type</h3>
          <p className="text-muted-foreground">{storyType}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-medium">Interests</h3>
          <p className="text-muted-foreground">{interests}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onNewStory}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          {isLoading ? "Generating..." : "New Story"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onSave}
          disabled={isLoading}
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onShare}
          disabled={isLoading}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  title,
  content,
  childName,
  childAge,
  storyType,
  interests,
  isLoading = false,
  className,
  supportTools = {
    sequencing: false,
    visualization: false,
    inferencing: false
  },
  isAutismFriendly = false,
  onNewStory,
  onSave,
  onShare,
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
      setActiveReadingIndex(activeReadingIndex + 1);
    } else {
      setActiveReadingIndex(null);
    }
  };

  const generateThinkingPrompt = (paragraph: string) => {
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
    const visualElements = paragraph.match(/\b(saw|looked|appeared|seemed|bright|dark|color|big|small|tall|short)\b/gi);
    if (visualElements?.length) {
      return `Can you picture: ${visualElements.join(', ')}?`;
    }
    return "What does this scene look like in your mind?";
  };

  const renderParagraphWithSupport = (paragraph: string, index: number) => {
    const isReading = activeReadingIndex === index;
    const isCompleted = completedEvents.includes(index);
    const isShowingImage = showingImage === index;
    const isShowingThought = showingThought === index;

    return (
      <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
        <div className="flex items-start gap-2">
          <span className="font-medium min-w-[24px]">{index + 1}.</span>
          <p className="text-foreground">{paragraph}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={isReading ? "secondary" : "outline"}
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
              Think About
            </Button>
          )}
        </div>

        {isReading && (
          <ReadTogether
            content={paragraph}
            isVisible={true}
            onFinish={handleParagraphFinish}
          />
        )}

        {isShowingImage && (
          <AnimatedTransition>
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <p className="font-medium text-sm">👀 Picture Helper:</p>
              <p className="text-sm text-muted-foreground">{generateVisualizationPrompt(paragraph)}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  I can see it!
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  Need help
                </Button>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {isShowingThought && (
          <AnimatedTransition>
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <p className="font-medium text-sm">💭 Thinking Helper:</p>
              <p className="text-sm text-muted-foreground">{generateThinkingPrompt(paragraph)}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  I have an idea!
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-3xl bg-card border shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="p-4 lg:p-8 space-y-8" ref={contentRef}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-lg font-medium text-muted-foreground">Creating your magical story...</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Our story wizard is crafting a unique adventure just for you. This might take a moment.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{title}</h1>
                <div className="space-y-6">
                  {paragraphs.map((paragraph, index) => (
                    <div key={index}>
                      {renderParagraphWithSupport(paragraph, index)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-64 order-1 lg:order-2">
        <StoryDetailsSidebar
          childName={childName}
          age={childAge}
          storyType={storyType}
          interests={interests}
          onNewStory={onNewStory}
          onSave={onSave}
          onShare={onShare}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default StoryDisplay;
