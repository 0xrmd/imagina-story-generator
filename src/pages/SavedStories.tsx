import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

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

export default function SavedStories() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stories, setStories] = useState<SavedStory[]>([])
    const [loading, setLoading] = useState(true)

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
            setLoading(false)
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
        });
    }

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Not Authenticated</CardTitle>
                        <CardDescription>Please sign in to view your saved stories.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Saved Stories
                </h1>
                <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 transition-colors"
                >
                    Create New Story
                </Button>
            </div>

            {stories.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">No Saved Stories</CardTitle>
                        <CardDescription className="text-center">
                            Your saved stories will appear here. Start creating some amazing stories!
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stories.map((story) => (
                        <Card key={story.id} className="group hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="line-clamp-2 text-xl">{story.title}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(story.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                                <CardDescription>
                                    {new Date(story.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-4 text-muted-foreground mb-4">
                                    {story.content}
                                </p>
                                <Button
                                    onClick={() => handleReadStory(story)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white"
                                >
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Read Story
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 