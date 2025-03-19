import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Bookmark, Share2, RefreshCw, ArrowRight, List, Eye, BrainCircuit, Book, CheckCircle2, Sparkles, Brain, Heart, Lightbulb, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AutismSupportTools {
  sequencing: boolean;
  visualization: boolean;
  inferencing: boolean;
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
  storyInsights?: StoryInsights | null;
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
  storyInsights,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeReadingIndex, setActiveReadingIndex] = useState<number | null>(null);
  const [completedEvents, setCompletedEvents] = useState<number[]>([]);
  const [sequenceProgress, setSequenceProgress] = useState<number[]>([]);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [questionStates, setQuestionStates] = useState<Record<number, {
    hasIdea: boolean;
    needsHelp: boolean;
    notWorking: boolean;
    feedback: string;
  }>>({});
  const [activeTab, setActiveTab] = useState<'sequence' | 'visual' | 'thinking' | null>(null);
  const navigate = useNavigate();

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

  const handleQuestionFeedback = (index: number, feedback: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        feedback,
        hasIdea: feedback === 'idea',
        needsHelp: feedback === 'help',
        notWorking: feedback === 'notWorking'
      }
    }));
  };

  const renderParagraph = (paragraph: string, index: number) => {
    const isActive = activeReadingIndex === index;
    const isCompleted = completedEvents.includes(index);

    return (
      <div
        key={index}
        className={cn(
          "relative p-4 rounded-lg transition-all duration-300",
          isActive ? "bg-primary/5 border border-primary/20" : "bg-muted/50",
          isCompleted && "bg-green-50 border border-green-200"
        )}
      >
        <div className="prose prose-sm max-w-none">
          {paragraph}
        </div>

        {isActive && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleParagraphFinish}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderStorySequence = () => {
    if (!isAutismFriendly || !supportTools.sequencing || !storyInsights) return null;

    return (
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-blue-500">📖 Story Sequence</h3>
        </div>

        <div className="space-y-3">
          {storyInsights.sequence.map((event, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200",
                sequenceProgress.includes(index)
                  ? "bg-primary/10 border-primary/20"
                  : "bg-background/50 border-border/30 hover:border-blue-200"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {event.order}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.event}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      event.importance === 'high' ? "bg-red-100 text-red-700" :
                        event.importance === 'medium' ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                    )}>
                      {event.importance} importance
                    </span>
                    {event.relatedEvents[0] && (
                      <span className="text-xs text-muted-foreground">
                        Related to: {event.relatedEvents[0]}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-shrink-0",
                    sequenceProgress.includes(index) && "text-green-500"
                  )}
                  onClick={() => {
                    setSequenceProgress(prev =>
                      prev.includes(index)
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                    );
                  }}
                >
                  {sequenceProgress.includes(index) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Progress: {sequenceProgress.length} / {storyInsights.sequence.length} events
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSequenceProgress([])}
          >
            Reset Progress
          </Button>
        </div>
      </div>
    );
  };

  const renderVisualGuide = () => {
    if (!isAutismFriendly || !supportTools.visualization || !storyInsights) return null;

    return (
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-green-500">👀 Visual Guide</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storyInsights.visualElements.map((scene, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                selectedScene === index
                  ? "bg-primary/10 border-primary/20"
                  : "bg-background/50 border-border/30 hover:border-green-200"
              )}
              onClick={() => setSelectedScene(selectedScene === index ? null : index)}
            >
              <h4 className="font-medium mb-2">{scene.scene}</h4>
              <p className="text-sm text-muted-foreground mb-3">{scene.description}</p>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Key Objects:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {scene.keyObjects.map((obj, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">Emotions:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {scene.emotions.map((emotion, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCriticalThinking = () => {
    if (!isAutismFriendly || !supportTools.inferencing || !storyInsights) return null;

    return (
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-purple-500">💭 Thinking Helper</h3>
        </div>

        <div className="space-y-4">
          {storyInsights.suggestedQuestions.map((q, index) => {
            const questionState = questionStates[index] || {
              hasIdea: false,
              needsHelp: false,
              notWorking: false,
              feedback: ''
            };

            return (
              <div
                key={index}
                className={cn(
                  "p-3 bg-background/50 rounded-lg border transition-all duration-200",
                  questionState.hasIdea && "border-green-200 bg-green-50/50",
                  questionState.needsHelp && "border-blue-200 bg-blue-50/50",
                  questionState.notWorking && "border-red-200 bg-red-50/50",
                  !questionState.hasIdea && !questionState.needsHelp && !questionState.notWorking && "hover:border-purple-200"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {q.type === 'prediction' && <Sparkles className="w-4 h-4 text-yellow-500" />}
                    {q.type === 'analysis' && <Brain className="w-4 h-4 text-blue-500" />}
                    {q.type === 'empathy' && <Heart className="w-4 h-4 text-red-500" />}
                    {q.type === 'problem-solving' && <Lightbulb className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-muted-foreground">{q.context}</p>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        q.difficulty === 'easy' ? "bg-green-100 text-green-700" :
                          q.difficulty === 'medium' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                      )}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="font-medium">{q.question}</p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant={questionState.hasIdea ? "secondary" : "outline"}
                        size="sm"
                        className={cn(
                          "gap-1 transition-colors",
                          questionState.hasIdea && "bg-green-100 hover:bg-green-200 text-green-700"
                        )}
                        onClick={() => handleQuestionFeedback(index, 'idea')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        I have an idea!
                      </Button>
                      <Button
                        variant={questionState.needsHelp ? "secondary" : "outline"}
                        size="sm"
                        className={cn(
                          "gap-1 transition-colors",
                          questionState.needsHelp && "bg-blue-100 hover:bg-blue-200 text-blue-700"
                        )}
                        onClick={() => handleQuestionFeedback(index, 'help')}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Need help
                      </Button>
                      <Button
                        variant={questionState.notWorking ? "secondary" : "outline"}
                        size="sm"
                        className={cn(
                          "gap-1 transition-colors",
                          questionState.notWorking && "bg-red-100 hover:bg-red-200 text-red-700"
                        )}
                        onClick={() => handleQuestionFeedback(index, 'notWorking')}
                      >
                        <AlertCircle className="w-4 h-4" />
                        Not working
                      </Button>
                    </div>
                    {questionState.hasIdea && (
                      <div className="mt-2 p-2 bg-green-50 rounded-md">
                        <p className="text-sm text-green-700">Great thinking! Take a moment to share your idea.</p>
                      </div>
                    )}
                    {questionState.needsHelp && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">Let's think about this together. What part is tricky?</p>
                      </div>
                    )}
                    {questionState.notWorking && (
                      <div className="mt-2 p-2 bg-red-50 rounded-md">
                        <p className="text-sm text-red-700">Let's try a different approach. Would you like to skip this question or try something else?</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>These questions help develop:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Predictive thinking</li>
            <li>Character analysis</li>
            <li>Emotional intelligence</li>
            <li>Problem-solving skills</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between">
        <Button
          variant="ghost"
          className="group text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        {isAutismFriendly && (
          <div className="bg-[#1E293B] rounded-[20px] px-4 py-2 flex items-center gap-4">
            <Button
              variant="ghost"
              className={cn(
                "gap-2 text-white hover:bg-[#233B60] hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'sequence' && "bg-[#233B60]"
              )}
              onClick={() => setActiveTab(activeTab === 'sequence' ? null : 'sequence')}
            >
              <List className="w-4 h-4" />
              Order Events
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "gap-2 text-white hover:bg-[#233B60] hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'visual' && "bg-[#233B60]"
              )}
              onClick={() => setActiveTab(activeTab === 'visual' ? null : 'visual')}
            >
              <Eye className="w-4 h-4" />
              Picture It
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "gap-2 text-white hover:bg-[#233B60] hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'thinking' && "bg-[#233B60]"
              )}
              onClick={() => setActiveTab(activeTab === 'thinking' ? null : 'thinking')}
            >
              <BrainCircuit className="w-4 h-4" />
              Think Deeper
            </Button>
          </div>
        )}
      </div>

      {/* Support Tools Content */}
      {isAutismFriendly && activeTab && (
        <div className="w-full bg-muted/30 rounded-[20px] p-4">
          {activeTab === 'sequence' && renderStorySequence()}
          {activeTab === 'visual' && renderVisualGuide()}
          {activeTab === 'thinking' && renderCriticalThinking()}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Story Content on Left */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-3xl bg-card border shadow-sm">
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
                        {renderParagraph(paragraph, index)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
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
    </div>
  );
};

export default StoryDisplay;
