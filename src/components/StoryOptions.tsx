
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StoryOptionsProps {
  className?: string;
  onRegenerateStory: () => void;
}

const StoryOptions: React.FC<StoryOptionsProps> = ({ 
  className,
  onRegenerateStory
}) => {
  const handleDownload = () => {
    toast.success("Story saved to your device");
    // In a real implementation, this would create a PDF or text file
  };
  
  const handleShare = () => {
    toast.success("Share link copied to clipboard");
    // In a real implementation, this would generate a shareable link
  };
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button 
        variant="outline" 
        className="flex-1 gap-2 group" 
        onClick={onRegenerateStory}
      >
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        <span>New Story</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 gap-2" 
        onClick={handleDownload}
      >
        <Download className="w-4 h-4" />
        <span>Save</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 gap-2" 
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>
    </div>
  );
};

export default StoryOptions;
