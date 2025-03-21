import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Bookmark, Share2, RefreshCw, ArrowRight, List, Eye, BrainCircuit, Book, CheckCircle2, Sparkles, Brain, Heart, Lightbulb, AlertCircle, ArrowLeft, Circle, Wand2, Loader2, BookmarkX } from 'lucide-react';
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
  isLoading: boolean;
  className?: string;
  onNewStory: () => void;
  onSave: () => void;
  onShare: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
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
  isSaved?: boolean;
  isSaving?: boolean;
}> = ({ childName, age, storyType, interests, onNewStory, onSave, onShare, className, isLoading, isSaved = false, isSaving = false }) => {
  return (
    <div className={cn(
      "rounded-3xl bg-card p-4 sm:p-6 space-y-4 sm:space-y-6 border shadow-sm",
      className
    )}>
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-medium">Story for</h3>
          <p className="text-sm sm:text-base text-muted-foreground">{childName}, {age} years</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-medium">Story type</h3>
          <p className="text-sm sm:text-base text-muted-foreground">{storyType}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-medium">Interests</h3>
          <p className="text-sm sm:text-base text-muted-foreground">{interests}</p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onNewStory}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          {isLoading ? "Generating..." : "New Story"}
        </Button>
        <Button
          variant={isSaved ? "destructive" : "outline"}
          className="w-full"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isSaved ? (
            <BookmarkX className="w-4 h-4 mr-2" />
          ) : (
            <Bookmark className="w-4 h-4 mr-2" />
          )}
          {isSaving ? "Saving..." : isSaved ? "Remove from Saved" : "Save Story"}
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
  isLoading,
  className,
  onNewStory,
  onSave,
  onShare,
  isSaved = false,
  isSaving = false
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeReadingIndex, setActiveReadingIndex] = useState<number | null>(null);
  const [completedEvents, setCompletedEvents] = useState<number[]>([]);
  const [sequenceProgress, setSequenceProgress] = useState<number[]>([]);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [questionStates, setQuestionStates] = useState<Record<number, {
    hasIdea: boolean;
    needsHelp: boolean;
    feedback: string;
    userIdea?: string;
    helpType?: 'prediction' | 'analysis' | 'empathy' | 'problem-solving';
  }>>({});
  const [activeTab, setActiveTab] = useState<'sequence' | 'visual' | 'thinking' | null>(null);
  const [reviewedScenes, setReviewedScenes] = useState<number[]>([]);
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
        needsHelp: feedback === 'help'
      }
    }));

    // Show appropriate toast message based on feedback
    if (feedback === 'idea') {
      toast.success('Great thinking! Take a moment to share your idea.', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#7F8B8D',
          color: 'white',
        }
      });
    } else if (feedback === 'help') {
      toast.success('Let\'s think about this together!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#7F8B8D',
          color: 'white',
        }
      });
    }
  };

  const handleShareIdea = (index: number, idea: string, isSubmitting: boolean = false) => {
    setQuestionStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        userIdea: idea
      }
    }));

    // Only process and show feedback when actually submitting the idea
    if (isSubmitting && idea.trim()) {
      // Process the idea based on question type
      const question = storyInsights?.suggestedQuestions[index];
      if (question) {
        let feedback = '';
        switch (question.type) {
          case 'prediction':
            feedback = 'Great prediction! Your idea about what might happen next shows good thinking about story patterns and character actions.';
            break;
          case 'analysis':
            feedback = 'Excellent analysis! You\'ve noticed important details about the characters and their motivations.';
            break;
          case 'empathy':
            feedback = 'Wonderful empathy! You\'ve really thought about how the characters might be feeling in this situation.';
            break;
          case 'problem-solving':
            feedback = 'Smart problem-solving! You\'ve considered different options and thought about the best solution.';
            break;
        }

        toast.success(feedback, {
          duration: 4000,
          position: 'bottom-center',
          style: {
            background: '#7F8B8D',
            color: 'white',
          }
        });

        // Add a small delay before showing the next question
        setTimeout(() => {
          setQuestionStates(prev => ({
            ...prev,
            [index]: {
              ...prev[index],
              hasIdea: false,
              userIdea: ''
            }
          }));
        }, 2000);
      }
    } else if (isSubmitting && !idea.trim()) {
      toast.error('Please share your idea before submitting.', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#7F8B8D',
          color: 'white',
        }
      });
    }
  };

  const handleGetHelp = (index: number, helpType: 'prediction' | 'analysis' | 'empathy' | 'problem-solving') => {
    setQuestionStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        helpType
      }
    }));
  };

  const handleSceneReview = (index: number) => {
    setReviewedScenes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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
        <div className={cn(
          "prose prose-sm max-w-none",
        )}>
          {paragraph.split('\n\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-500">📖 Story Sequence</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Progress: {sequenceProgress.length} / {storyInsights.sequence.length}
          </div>
        </div>

        <div className="space-y-3">
          {storyInsights.sequence.map((event, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                sequenceProgress.includes(index)
                  ? "bg-primary/10 border-primary/20"
                  : "bg-background/50 border-border/30 hover:border-blue-200"
              )}
              onClick={() => {
                if (!sequenceProgress.includes(index)) {
                  // Check if this is the next event in sequence
                  const nextExpectedIndex = sequenceProgress.length;
                  if (index === nextExpectedIndex) {
                    setSequenceProgress([...sequenceProgress, index]);
                    toast.success('Great job tracking the story!', {
                      duration: 2000,
                      position: 'bottom-center'
                    });
                  } else {
                    toast.error('Let\'s follow the story in order!', {
                      duration: 2000,
                      position: 'bottom-center'
                    });
                  }
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                  sequenceProgress.includes(index)
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{event.event}</p>
                  {event.importance === 'high' && (
                    <span className="text-xs text-primary mt-1 inline-block">Important moment</span>
                  )}
                </div>
                {sequenceProgress.includes(index) && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualGuide = () => {
    if (!isAutismFriendly || !supportTools.visualization || !storyInsights) return null;

    // Function to find matching paragraph for a scene
    const findMatchingParagraph = (scene: { scene: string; description: string }) => {
      return paragraphs.findIndex(p => {
        const paragraphLower = p.toLowerCase();
        const sceneTitleLower = scene.scene.toLowerCase();
        const sceneDescLower = scene.description.toLowerCase();

        // Check if either the scene title or description is mentioned in the paragraph
        return paragraphLower.includes(sceneTitleLower) ||
          paragraphLower.includes(sceneDescLower) ||
          // Check for key objects in the paragraph
          scene.keyObjects.some(obj => paragraphLower.includes(obj.toLowerCase()));
      });
    };

    return (
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-purple-500">🎨 Picture It</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedScene !== null ? `Scene ${selectedScene + 1} of ${storyInsights.visualElements.length}` : 'Select a scene'}
          </div>
        </div>

        <div className="space-y-4">
          {storyInsights.visualElements.map((scene, index) => {
            const matchingParagraphIndex = findMatchingParagraph(scene);
            const isMatched = matchingParagraphIndex !== -1;

            return (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md",
                  selectedScene === index
                    ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700"
                    : "bg-white dark:bg-slate-800/50 border-purple-100 dark:border-purple-800/30 hover:border-purple-200"
                )}
                onClick={() => {
                  setSelectedScene(selectedScene === index ? null : index);
                  if (selectedScene !== index) {
                    if (isMatched) {
                      setActiveReadingIndex(matchingParagraphIndex);
                      contentRef.current?.scrollTo({
                        top: contentRef.current.children[matchingParagraphIndex].getBoundingClientRect().top + contentRef.current.scrollTop - 100,
                        behavior: 'smooth'
                      });
                      toast.success('Great observation! Let\'s explore this scene together.', {
                        duration: 2000,
                        position: 'bottom-center'
                      });
                    } else {
                      toast.error('This scene appears later in the story. Keep reading!', {
                        duration: 2000,
                        position: 'bottom-center'
                      });
                    }
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{scene.scene}</h4>
                    {isMatched && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                        Found in story
                      </span>
                    )}
                  </div>
                  {selectedScene === index && (
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{scene.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Key Objects:</p>
                    <div className="flex flex-wrap gap-2">
                      {scene.keyObjects.map((obj, i) => (
                        <span
                          key={i}
                          className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            isMatched && paragraphs[matchingParagraphIndex].toLowerCase().includes(obj.toLowerCase())
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          )}
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Emotions:</p>
                    <div className="flex flex-wrap gap-2">
                      {scene.emotions.map((emotion, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCriticalThinking = () => {
    if (!isAutismFriendly || !supportTools.inferencing || !storyInsights) return null;

    return (
      <div className="mt-6 p-4 bg-[#7F8B8D]/10 rounded-lg border border-[#7F8B8D]/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#7F8B8D]" />
            <h3 className="text-lg font-semibold text-[#7F8B8D]">💭 Think Deeper</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {Object.values(questionStates).filter(state => state.hasIdea || state.needsHelp).length} / {storyInsights.suggestedQuestions.length} questions explored
          </div>
        </div>

        <div className="space-y-4">
          {storyInsights.suggestedQuestions.map((question, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                questionStates[index]?.hasIdea && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
                questionStates[index]?.needsHelp && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
                !questionStates[index]?.hasIdea && !questionStates[index]?.needsHelp && "bg-white dark:bg-slate-800/50 border-[#7F8B8D]/20"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{question.question}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{question.context}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    question.difficulty === 'easy' ? "bg-green-100 text-green-700" :
                      question.difficulty === 'medium' ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                  )}>
                    {question.difficulty}
                  </span>
                  {questionStates[index]?.hasIdea && (
                    <span className="text-xs text-green-600 dark:text-green-400">Shared your idea</span>
                  )}
                  {questionStates[index]?.needsHelp && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">Getting help</span>
                  )}
                </div>
              </div>

              {!questionStates[index]?.hasIdea && !questionStates[index]?.needsHelp && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionFeedback(index, 'idea')}
                    className="flex-1 gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    I have an idea
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionFeedback(index, 'help')}
                    className="flex-1 gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    I need help
                  </Button>
                </div>
              )}

              {questionStates[index]?.hasIdea && (
                <div className="space-y-2">
                  <textarea
                    className="w-full p-2 text-sm rounded-md border bg-white dark:bg-slate-800"
                    placeholder="Share your thoughts about this question..."
                    value={questionStates[index]?.userIdea || ''}
                    onChange={(e) => handleShareIdea(index, e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleShareIdea(index, questionStates[index]?.userIdea || '', true)}
                      className="flex-1"
                    >
                      Share My Idea
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuestionStates(prev => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            hasIdea: false,
                            userIdea: ''
                          }
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {questionStates[index]?.needsHelp && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    Let's think about this together:
                  </div>
                  <ul className="space-y-2">
                    {question.hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-[#7F8B8D] mt-1">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuestionStates(prev => ({
                        ...prev,
                        [index]: {
                          ...prev[index],
                          needsHelp: false
                        }
                      }));
                    }}
                    className="mt-2"
                  >
                    I understand now
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <Button
          variant="ghost"
          className="group text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Story Content on Left */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-3xl bg-card border shadow-sm">
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8" ref={contentRef}>
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{title}</h1>
                  <div className="space-y-4 lg:space-y-6">
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
        <div className="w-full lg:w-80 flex-shrink-0">
          <StoryDetailsSidebar
            childName={childName}
            age={childAge}
            storyType={storyType}
            interests={interests}
            onNewStory={onNewStory}
            onSave={onSave}
            onShare={onShare}
            isLoading={isLoading}
            isSaved={isSaved}
            isSaving={isSaving}
          />
        </div>
      </div>

    </div>
  );
};

export default StoryDisplay;
