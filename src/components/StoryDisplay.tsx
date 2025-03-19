import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Bookmark, Share2, RefreshCw, ArrowRight, List, Eye, BrainCircuit, Book, CheckCircle2, Sparkles, Brain, Heart, Lightbulb, AlertCircle, ArrowLeft, Circle } from 'lucide-react';
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
    visualization: true,
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
    // Add debug logging
    console.log('Visual Guide Debug:', {
      isAutismFriendly,
      visualizationEnabled: supportTools.visualization,
      hasStoryInsights: !!storyInsights,
      visualElements: storyInsights?.visualElements
    });

    if (!isAutismFriendly || !supportTools.visualization || !storyInsights) {
      console.log('Visual Guide not rendered because:', {
        isAutismFriendly,
        visualizationEnabled: supportTools.visualization,
        hasStoryInsights: !!storyInsights
      });
      return null;
    }

    return (
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-green-500">👀 Visual Guide</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Reviewed: {reviewedScenes.length} / {storyInsights?.visualElements?.length || 0} scenes
          </div>
        </div>

        {storyInsights.visualElements && storyInsights.visualElements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyInsights.visualElements.map((scene, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  reviewedScenes.includes(index)
                    ? "bg-green-50 border-green-200"
                    : "bg-background/50 border-border/30 hover:border-green-200"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">{scene.scene}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      reviewedScenes.includes(index)
                        ? "text-green-500 hover:text-green-600"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                    onClick={() => handleSceneReview(index)}
                  >
                    {reviewedScenes.includes(index) ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </Button>
                </div>

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
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No visual elements available for this story.</p>
          </div>
        )}

        {reviewedScenes.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewedScenes([])}
              className="text-green-600 hover:text-green-700"
            >
              Reset Progress
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionFeedback = (index: number, question: any) => {
    const state = questionStates[index] || {
      hasIdea: false,
      needsHelp: false,
      feedback: '',
      userIdea: '',
      helpType: undefined
    };

    return (
      <div className="mt-2 space-y-2">
        {state.hasIdea && (
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Share your idea:</p>
                <textarea
                  className="w-full p-3 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 bg-[#F0FDF4] dark:bg-[#1A2E1A] placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-700 dark:text-gray-200 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-colors duration-200"
                  placeholder="What do you think will happen next? Share your thoughts here..."
                  rows={3}
                  value={state.userIdea || ''}
                  onChange={(e) => handleShareIdea(index, e.target.value)}
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {state.userIdea ? `${state.userIdea.length} characters` : 'Start typing your idea...'}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                    onClick={() => handleShareIdea(index, state.userIdea || '', true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Idea
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state.needsHelp && (
          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700 mb-2">Let's explore this together:</p>
                <div className="space-y-2">
                  <p className="text-sm text-blue-600">Think about:</p>
                  <ul className="text-sm space-y-1 text-blue-600 list-disc list-inside">
                    {question.type === 'prediction' && (
                      <>
                        <li>What clues in the story suggest what might happen next?</li>
                        <li>How do the characters' actions hint at future events?</li>
                        <li>What patterns or similar situations have you seen before?</li>
                      </>
                    )}
                    {question.type === 'analysis' && (
                      <>
                        <li>What details in the story tell us about the characters?</li>
                        <li>How do their words and actions reveal their personality?</li>
                        <li>What might be their motivations?</li>
                      </>
                    )}
                    {question.type === 'empathy' && (
                      <>
                        <li>How would you feel in this situation?</li>
                        <li>What might the character be thinking?</li>
                        <li>What experiences have you had that are similar?</li>
                      </>
                    )}
                    {question.type === 'problem-solving' && (
                      <>
                        <li>What are the main challenges in this situation?</li>
                        <li>What options might the character have?</li>
                        <li>What would be the best solution and why?</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCriticalThinking = () => {
    if (!isAutismFriendly || !supportTools.inferencing || !storyInsights) return null;

    return (
      <div className="mt-6 p-4 bg-[#7F8B8D]/10 rounded-lg border border-[#7F8B8D]/20">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-[#7F8B8D]" />
          <h3 className="text-lg font-semibold text-[#7F8B8D]">💭 Thinking Helper</h3>
        </div>

        {/* Usage Tips */}
        <div className="mb-6 p-3 bg-[#7F8B8D]/5 rounded-md border border-[#7F8B8D]/10">
          <h4 className="text-sm font-medium text-[#7F8B8D] mb-2">How to use Thinking Helper:</h4>
          <ul className="text-xs space-y-2 text-[#7F8B8D]">
            <li className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Read each question carefully and think about what might happen next</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Consider how characters might feel in different situations</span>
            </li>
            <li className="flex items-start gap-2">
              <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Use the "I have an idea!" button when you want to share your thoughts</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Click "Need help" if you'd like to explore the question together</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          {storyInsights.suggestedQuestions.map((q, index) => {
            const questionState = questionStates[index] || {
              hasIdea: false,
              needsHelp: false,
              feedback: ''
            };

            return (
              <div
                key={index}
                className={cn(
                  "p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border transition-all duration-200",
                  questionState.hasIdea && "border-green-200 bg-green-50/50",
                  questionState.needsHelp && "border-blue-200 bg-blue-50/50",
                  !questionState.hasIdea && !questionState.needsHelp && "hover:border-[#7F8B8D]/30"
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
                    </div>
                    {renderQuestionFeedback(index, q)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-[#7F8B8D]">
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
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <Button
          variant="ghost"
          className="group text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        {isAutismFriendly && (
          <div className="w-full sm:w-auto bg-[#F1F5F9] dark:bg-[#1E293B] rounded-[20px] px-2 sm:px-4 py-2 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className={cn(
                "flex-1 sm:flex-none gap-2 text-slate-700 dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#233B60] hover:text-slate-900 dark:hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'sequence' && "bg-[#E2E8F0] dark:bg-[#233B60] text-slate-900 dark:text-white"
              )}
              onClick={() => setActiveTab(activeTab === 'sequence' ? null : 'sequence')}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Order Events</span>
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 sm:flex-none gap-2 text-slate-700 dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#233B60] hover:text-slate-900 dark:hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'visual' && "bg-[#E2E8F0] dark:bg-[#233B60] text-slate-900 dark:text-white"
              )}
              onClick={() => setActiveTab(activeTab === 'visual' ? null : 'visual')}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Picture It</span>
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 sm:flex-none gap-2 text-slate-700 dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#233B60] hover:text-slate-900 dark:hover:text-white rounded-[10px] transition-colors duration-200",
                activeTab === 'thinking' && "bg-[#E2E8F0] dark:bg-[#233B60] text-slate-900 dark:text-white"
              )}
              onClick={() => setActiveTab(activeTab === 'thinking' ? null : 'thinking')}
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden sm:inline">Think Deeper</span>
            </Button>
          </div>
        )}
      </div>

      {/* Support Tools Content */}
      {isAutismFriendly && activeTab && (
        <div className="w-full bg-muted/30 rounded-[20px] p-2 sm:p-4">
          {activeTab === 'sequence' && renderStorySequence()}
          {activeTab === 'visual' && renderVisualGuide()}
          {activeTab === 'thinking' && renderCriticalThinking()}
        </div>
      )}

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
          />
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
