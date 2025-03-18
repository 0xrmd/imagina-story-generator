import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import StoryOptions from '../components/StoryOptions';
import Onboarding from '../components/Onboarding';

interface Story {
    title: string;
    content: string;
    author?: string;
}

export default function StoryGenerator() {
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(false);

    const handleStoryGenerated = (generatedStory: Story) => {
        setStory(generatedStory);
    };

    const handleRegenerate = () => {
        setStory(null);
    };

    const handleDownloadPDF = () => {
        // Implementation will be handled by StoryOptions component
    };

    const handleDownloadTXT = () => {
        if (!story) return;

        const content = `${story.title}\n\n${story.content}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${story.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Story saved as text file');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">I</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Imagina
                                </h1>
                                <p className="text-sm text-gray-600">AI Story Generator</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About</a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Create a Personalized Story for Your Child
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered story generator creates unique, engaging stories tailored to your child's interests, age, and preferences.
                        </p>
                    </div>

                    {!story ? (
                        <Onboarding onStoryGenerated={handleStoryGenerated} />
                    ) : (
                        <Card className="story-text">
                            <CardHeader>
                                <CardTitle>{story.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-lg max-w-none">
                                    {story.content.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>
                                <StoryOptions
                                    className="mt-8"
                                    onRegenerateStory={handleRegenerate}
                                    onDownloadPDF={handleDownloadPDF}
                                    onDownloadTXT={handleDownloadTXT}
                                    storyTitle={story.title}
                                    storyContent={story.content}
                                    author={story.author}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <footer className="bg-white border-t mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-600">
                        <p>© 2024 Imagina. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 