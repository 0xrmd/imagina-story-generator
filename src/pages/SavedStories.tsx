import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, BookOpen, Heart, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedTransition from '@/components/AnimatedTransition'

interface SavedStory {
    id: string
    title: string
    content: string
    created_at: string
    user_id: string
    child_name?: string
    child_age?: number
    story_type?: string
    interests?: string
    is_autism_friendly?: boolean
    moral?: string
    vocabulary?: string[]
    reading_time?: string
}

const SavedStories = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [stories, setStories] = useState<SavedStory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchSavedStories()
        }
    }, [user])

    const fetchSavedStories = async () => {
        try {
            const { data, error } = await supabase
                .from('saved_stories')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setStories(data || [])
        } catch (error: any) {
            console.error('Error fetching saved stories:', error)
            toast.error('Failed to load saved stories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (storyId: string) => {
        try {
            const { error } = await supabase
                .from('saved_stories')
                .delete()
                .eq('id', storyId)

            if (error) throw error

            setStories(stories.filter(story => story.id !== storyId))
            toast.success('Story deleted successfully')
        } catch (error: any) {
            console.error('Error deleting story:', error)
            toast.error('Failed to delete story')
        }
    }

    const handleReadStory = (story: SavedStory) => {
        navigate('/story', {
            state: {
                story: {
                    title: story.title,
                    content: story.content,
                    childName: story.child_name || '',
                    childAge: story.child_age || 0,
                    storyType: story.story_type || 'adventure',
                    interests: story.interests || '',
                    isAutismFriendly: story.is_autism_friendly || false,
                    moral: story.moral || 'The importance of kindness and friendship',
                    vocabulary: story.vocabulary || ['adventure', 'friendship', 'discovery'],
                    readingTime: story.reading_time || '5-7 minutes'
                }
            }
        })
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
                <Header />
                <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-10">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Please Sign In</CardTitle>
                            <CardDescription className="text-center">
                                Sign in to view your saved stories
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => navigate('/auth/signin')}>
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
            <Header />

            <main className="flex-1 w-full max-w-4xl mx-auto py-10">
                <AnimatedTransition>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold tracking-tight">Saved Stories</h1>
                            <Button onClick={() => navigate('/')} variant="outline">
                                Create New Story
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : stories.length === 0 ? (
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-center">No Saved Stories</CardTitle>
                                    <CardDescription className="text-center">
                                        Your saved stories will appear here
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <Button onClick={() => navigate('/')}>
                                        Create Your First Story
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {stories.map((story) => (
                                    <Card key={story.id} className="group hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader className="space-y-1">
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-xl line-clamp-2">{story.title}</CardTitle>
                                                {story.is_autism_friendly && (
                                                    <div className="flex items-center gap-1 text-primary" title="Autism-friendly story">
                                                        <Sparkles className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardDescription>
                                                {story.child_name && `${story.child_name}, ${story.child_age || 0} years`}
                                                {story.story_type && ` • ${story.story_type}`}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {story.content}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Heart className="w-4 h-4" />
                                                <span>{new Date(story.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReadStory(story)}
                                                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                >
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    Read
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(story.id)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </AnimatedTransition>
            </main>

            <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-muted-foreground">
                <p>StoryLand • Crafting magical stories for children © {new Date().getFullYear()}</p>
                <p>Made with ❤️ by <a href="https://github.com/medrami-dev" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Mohamed Rami</a></p>
            </footer>
        </div>
    )
}

export default SavedStories 