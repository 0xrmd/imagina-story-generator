
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';

interface StoryDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
  className?: string;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  title,
  content,
  isLoading = false,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [content]);

  const paragraphs = content.split('\n\n').filter(p => p.trim());

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
            
            <div className="story-text space-y-4">
              {paragraphs.map((paragraph, index) => (
                <AnimatedTransition key={index} delay={index * 100}>
                  <p>{paragraph}</p>
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
