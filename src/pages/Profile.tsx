import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw } from 'lucide-react'

export default function Profile() {
    const { user, profile, loading: authLoading, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
    })

    // Generate a random avatar URL using DiceBear
    const getRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7)
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
    }

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
            })
        }
    }, [profile])

    const handleNewAvatar = async () => {
        try {
            const newAvatarUrl = getRandomAvatar()
            await updateProfile({ avatar_url: newAvatarUrl })
            toast.success('New avatar generated!')
        } catch (error: any) {
            console.error('Avatar update error:', error)
            toast.error('Error updating avatar. Please try again.')
        }
    }

    if (authLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container flex h-screen w-screen flex-col items-center justify-center">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Not Authenticated</CardTitle>
                        <CardDescription>Please sign in to view your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button onClick={() => navigate('/auth/signin')} className="w-full">
                            Sign In
                        </Button>
                        <Button onClick={() => navigate('/auth/signup')} variant="outline" className="w-full">
                            Create Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate required fields
            if (!formData.full_name.trim()) {
                toast.error('Full name is required')
                return
            }

            await updateProfile(formData)
            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error('Profile update error:', error)
            if (error.message === 'No user logged in') {
                toast.error('Please sign in to update your profile')
                navigate('/auth/signin')
            } else if (error.code === '23505') {
                toast.error('Username is already taken')
            } else {
                toast.error(error.message || 'Error updating profile. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your profile information and settings.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                                    <AvatarImage src={profile?.avatar_url || getRandomAvatar()} />
                                    <AvatarFallback>
                                        {profile?.full_name?.charAt(0) || user.email.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={handleNewAvatar}
                                >
                                    <RefreshCw className="h-6 w-6 text-white" />
                                </Button>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Choose a username"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={user.email} disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
} 