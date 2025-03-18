import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface StoryOptionsProps {
  className?: string;
  onRegenerateStory: () => void;
  title: string;
  content: string;
  storyType: 'adventure' | 'fantasy' | 'animals' | 'educational';
}

const StoryOptions: React.FC<StoryOptionsProps> = ({
  className,
  onRegenerateStory,
  title,
  content,
  storyType
}) => {
  const getThemeColors = (type: string) => {
    switch (type) {
      case 'adventure':
        return {
          background: '#FFF9E6', // Light yellow
          primary: '#FF6B6B', // Coral red
          secondary: '#4ECDC4', // Turquoise
          accent: '#FFD93D', // Golden yellow
          text: '#2C3E50', // Dark blue-gray
          titleBg: '#FFE8E8' // Light coral
        };
      case 'fantasy':
        return {
          background: '#F8F1FF', // Light purple
          primary: '#9B6DFF', // Purple
          secondary: '#FF9ECD', // Pink
          accent: '#80DDFF', // Light blue
          text: '#4A4A4A', // Dark gray
          titleBg: '#E8F0FF' // Light blue
        };
      case 'animals':
        return {
          background: '#F0F9F0', // Light green
          primary: '#66BB6A', // Green
          secondary: '#FFA726', // Orange
          accent: '#81C784', // Light green
          text: '#33691E', // Dark green
          titleBg: '#E8F5E9' // Lighter green
        };
      case 'educational':
        return {
          background: '#E3F2FD', // Light blue background
          contentBg: '#FFFFFF', // White content area
          primary: '#2196F3', // Blue
          secondary: '#FF5722', // Deep orange
          accent: '#FFC107', // Amber
          text: '#1A237E', // Indigo
          titleBg: '#FFFFFF', // White
          border: '#81D4FA' // Light blue border
        };
      default:
        return {
          background: '#FFF9E6',
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFD93D',
          text: '#2C3E50',
          titleBg: '#FFE8E8'
        };
    }
  };

  const getThemeDecorations = (type: string, doc: any, x: number, y: number, size: number = 5) => {
    switch (type) {
      case 'adventure':
        // Compass rose
        doc.setFillColor(getThemeColors(type).primary);
        doc.circle(x, y, size, 'F');
        doc.setDrawColor(getThemeColors(type).secondary);
        doc.line(x - size, y, x + size, y);
        doc.line(x, y - size, x, y + size);
        break;
      case 'fantasy':
        // Magic star
        const points = 5;
        const outerRadius = size;
        const innerRadius = size / 2;
        doc.setFillColor(getThemeColors(type).primary);
        let path = [];
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points;
          const px = x + radius * Math.cos(angle);
          const py = y + radius * Math.sin(angle);
          if (i === 0) path.push(['M', px, py]);
          else path.push(['L', px, py]);
        }
        path.push(['Z']);
        doc.path(path);
        break;
      case 'animals':
        // Paw print
        doc.setFillColor(getThemeColors(type).primary);
        doc.circle(x, y, size / 2, 'F');
        doc.circle(x - size / 2, y - size / 2, size / 3, 'F');
        doc.circle(x + size / 2, y - size / 2, size / 3, 'F');
        doc.circle(x - size / 3, y + size / 2, size / 3, 'F');
        doc.circle(x + size / 3, y + size / 2, size / 3, 'F');
        break;
      case 'educational':
        // Book shape
        doc.setFillColor(getThemeColors(type).primary);
        doc.rect(x - size, y - size, size * 2, size * 2, 'F');
        doc.setFillColor(getThemeColors(type).secondary);
        doc.rect(x - size + 1, y - size + 1, size * 2 - 2, size * 2 - 2, 'F');
        break;
    }
  };

  const handleDownload = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const colors = getThemeColors(storyType);

      if (storyType === 'educational') {
        // Main background
        doc.setFillColor(colors.background);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Cloud-like content area with border
        const contentWidth = pageWidth - margin * 2;
        const contentHeight = pageHeight - margin * 2;
        doc.setFillColor(colors.contentBg);

        // Draw cloud-like shape
        const cloudMargin = margin / 2;
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.5);

        // Main content area (cloud shape)
        doc.roundedRect(cloudMargin, cloudMargin, pageWidth - cloudMargin * 2, pageHeight - cloudMargin * 2, 30, 30, 'F');
        doc.roundedRect(cloudMargin, cloudMargin, pageWidth - cloudMargin * 2, pageHeight - cloudMargin * 2, 30, 30, 'S');

        // Educational icons in corners
        const drawEducationalIcon = (x: number, y: number, type: string) => {
          doc.setFillColor(colors.primary);
          switch (type) {
            case 'pencil':
              // Pencil shape
              doc.setFillColor(colors.secondary);
              doc.rect(x - 3, y - 8, 6, 16, 'F');
              doc.setFillColor(colors.accent);
              doc.triangle(x - 3, y + 8, x + 3, y + 8, x, y + 12, 'F');
              break;
            case 'ruler':
              // Ruler shape
              doc.setFillColor(colors.primary);
              doc.rect(x - 8, y - 3, 16, 6, 'F');
              doc.setFillColor(colors.contentBg);
              for (let i = 0; i < 4; i++) {
                doc.rect(x - 6 + (i * 4), y - 2, 1, 4, 'F');
              }
              break;
            case 'globe':
              // Globe shape
              doc.circle(x, y, 6, 'F');
              doc.setFillColor(colors.contentBg);
              doc.rect(x - 4, y - 1, 8, 2, 'F');
              doc.circle(x, y, 6, 'S');
              break;
            case 'books':
              // Stacked books
              const bookColors = [colors.secondary, colors.accent, colors.primary];
              bookColors.forEach((color, i) => {
                doc.setFillColor(color);
                doc.rect(x - 6, y - 6 + (i * 4), 12, 3, 'F');
              });
              break;
          }
        };

        // Add educational decorations in corners
        drawEducationalIcon(margin * 1.5, margin * 1.5, 'pencil');
        drawEducationalIcon(pageWidth - margin * 1.5, margin * 1.5, 'ruler');
        drawEducationalIcon(margin * 1.5, pageHeight - margin * 1.5, 'globe');
        drawEducationalIcon(pageWidth - margin * 1.5, pageHeight - margin * 1.5, 'books');

        // Title section with subtle background
        const titleY = margin * 2;
        doc.setFillColor(colors.titleBg);
        const titleWidth = doc.getTextWidth(title);
        doc.roundedRect(pageWidth / 2 - titleWidth / 2 - 15, titleY - 15, titleWidth + 30, 30, 5, 5, 'F');

        doc.setTextColor(colors.primary);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text(title, pageWidth / 2, titleY, { align: 'center' });

        // Content area
        doc.setTextColor(colors.text);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        const paragraphs = content.split('\n\n');
        let yPosition = titleY + 30;
        const lineSpacing = 7;

        paragraphs.forEach((paragraph, index) => {
          const lines = doc.splitTextToSize(paragraph, contentWidth - margin * 2);
          doc.text(lines, margin * 2, yPosition);
          yPosition += lineSpacing * (lines.length + (index < paragraphs.length - 1 ? 1 : 0));

          if (yPosition > pageHeight - margin * 3) {
            doc.addPage();
            // Repeat background
            doc.setFillColor(colors.background);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Repeat cloud shape
            doc.setFillColor(colors.contentBg);
            doc.roundedRect(cloudMargin, cloudMargin, pageWidth - cloudMargin * 2, pageHeight - cloudMargin * 2, 30, 30, 'F');
            doc.roundedRect(cloudMargin, cloudMargin, pageWidth - cloudMargin * 2, pageHeight - cloudMargin * 2, 30, 30, 'S');

            // Repeat corner decorations
            drawEducationalIcon(margin * 1.5, margin * 1.5, 'pencil');
            drawEducationalIcon(pageWidth - margin * 1.5, margin * 1.5, 'ruler');
            drawEducationalIcon(margin * 1.5, pageHeight - margin * 1.5, 'globe');
            drawEducationalIcon(pageWidth - margin * 1.5, pageHeight - margin * 1.5, 'books');

            doc.setTextColor(colors.text);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            yPosition = margin * 2;
          }
        });

        // Footer
        const footerY = pageHeight - margin;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(colors.primary);
        doc.text('Created with love by StoryLand', pageWidth / 2, footerY, { align: 'center' });

      } else {
        // Background with rounded corners
        doc.setFillColor(colors.background);
        doc.roundedRect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin, 5, 5, 'F');

        // Theme-specific corner decorations
        const cornerPositions = [
          [margin + 5, margin + 5],
          [pageWidth - margin - 5, margin + 5],
          [margin + 5, pageHeight - margin - 5],
          [pageWidth - margin - 5, pageHeight - margin - 5]
        ];

        cornerPositions.forEach(([x, y]) => {
          getThemeDecorations(storyType, doc, x, y, 6);
        });

        // Title with themed background
        doc.setTextColor(colors.primary);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        const titleY = margin + 18;
        const titleWidth = doc.getTextWidth(title);

        // Title background
        doc.setFillColor(colors.titleBg);
        doc.roundedRect(pageWidth / 2 - titleWidth / 2 - 10, titleY - 15, titleWidth + 20, 25, 5, 5, 'F');
        doc.text(title, pageWidth / 2, titleY, { align: 'center' });

        // Theme-specific divider
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(1);
        doc.line(margin + 10, titleY + 15, pageWidth - margin - 10, titleY + 15);

        // Add themed decorative elements along the line
        for (let x = margin + 20; x < pageWidth - margin - 10; x += 30) {
          getThemeDecorations(storyType, doc, x, titleY + 15, 3);
        }

        // Content area with themed background
        doc.setFillColor(colors.background);
        doc.roundedRect(margin + 5, titleY + 25, pageWidth - (margin * 2) - 10, pageHeight - margin * 3, 3, 3, 'F');

        // Story content
        doc.setTextColor(colors.text);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Split content into paragraphs with themed spacing
        const paragraphs = content.split('\n\n');
        let yPosition = titleY + 35;
        const lineSpacing = 6;

        paragraphs.forEach((paragraph, index) => {
          const lines = doc.splitTextToSize(paragraph, pageWidth - (margin * 2) - 20);
          doc.text(lines, margin + 15, yPosition);
          yPosition += lineSpacing * (lines.length + (index < paragraphs.length - 1 ? 1 : 0));

          if (yPosition > pageHeight - margin * 2) {
            doc.addPage();
            // Repeat themed background
            doc.setFillColor(colors.background);
            doc.roundedRect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin, 5, 5, 'F');

            // Repeat corner decorations
            cornerPositions.forEach(([x, y]) => {
              getThemeDecorations(storyType, doc, x, y, 6);
            });

            // Reset for content
            doc.setTextColor(colors.text);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            yPosition = margin + 20;
          }
        });

        // Themed footer
        const footerY = pageHeight - margin / 2;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(colors.primary);
        doc.text('Created with love by StoryLand', pageWidth / 2, footerY, { align: 'center' });

        // Add small themed decorations around footer
        getThemeDecorations(storyType, doc, pageWidth / 2 - 50, footerY, 3);
        getThemeDecorations(storyType, doc, pageWidth / 2 + 50, footerY, 3);
      }

      doc.save(`${title}.pdf`);
      toast.success(`Your magical ${storyType} story has been saved! ✨`);
    });
  };

  const handleShare = async () => {
    const textToShare = `${title}\n\n${content}`;

    try {
      await navigator.clipboard.writeText(textToShare);
      toast.success("Story copied to clipboard");
    } catch (error) {
      //  Simple fallback for older browsers
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
