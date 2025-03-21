import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, BookOpen, Heart, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedBackground from '@/components/AnimatedBackground'

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
            <div className="relative min-h-screen w-screen flex items-center justify-center">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl text-center">Please Sign In</CardTitle>
                            <CardDescription className="text-sm text-center">
                                Sign in to view your saved stories
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button
                                onClick={() => navigate('/auth')}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white"
                            >
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-screen flex flex-col items-center justify-center p-4">
            <AnimatedBackground />
            <div className="relative z-10 w-full max-w-4xl">
                <div className="flex items-center mb-6">
                    <Button
                        onClick={() => navigate('/')}
                        variant="ghost"
                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                {isLoading ? (
                    <Card className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground text-center">
                                    Loading your magical stories...
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : stories.length === 0 ? (
                    <Card className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">No Saved Stories</CardTitle>
                            <CardDescription className="text-sm text-center">
                                Your saved stories will appear here
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white"
                            >
                                Create Your First Story
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {stories.map((story) => (
                            <Card key={story.id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="space-y-1">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl line-clamp-2">{story.title}</CardTitle>
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
        </div>
    )
}

export default SavedStories 