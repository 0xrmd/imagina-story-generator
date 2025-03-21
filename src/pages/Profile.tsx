import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw, User, Mail, Lock, ArrowLeft } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'
import { supabase } from '@/lib/supabase'

export default function Profile() {
    const { user, profile, loading: authLoading, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        display_name: user?.user_metadata?.display_name || '',
    })

    // Generate a random avatar URL using DiceBear
    const getRandomAvatar = () => {
        const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral', 'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs', 'open-peeps', 'personas', 'pixel-art', 'pixel-art-neutral']
        const randomStyle = styles[Math.floor(Math.random() * styles.length)]
        const randomSeed = Math.random().toString(36).substring(7)
        return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`
    }

    useEffect(() => {
        if (user?.user_metadata?.display_name) {
            setFormData({
                display_name: user.user_metadata.display_name,
            })
        }
    }, [user])

    const handleNewAvatar = async () => {
        try {
            setIsLoading(true)
            const newAvatarUrl = getRandomAvatar()

            // First update the user metadata
            const { error: userUpdateError } = await supabase.auth.updateUser({
                data: { avatar_url: newAvatarUrl }
            })

            if (userUpdateError) {
                throw userUpdateError
            }

            // Then update the profile
            await updateProfile({ avatar_url: newAvatarUrl })

            toast.success('Avatar updated successfully!')
        } catch (error: any) {
            console.error('Avatar update error:', error)
            toast.error(error.message || 'Error updating avatar. Please try again.')
        } finally {
            setIsLoading(false)
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
            <div className="relative min-h-screen w-screen flex items-center justify-center">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl text-center">Not Authenticated</CardTitle>
                            <CardDescription className="text-sm text-center">
                                Please sign in to view your profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Button onClick={() => navigate('/auth')} className="w-full">
                                Sign In or Create Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate required fields
            if (!formData.display_name.trim()) {
                toast.error('Display name is required')
                return
            }

            // Only update user metadata
            const { error } = await supabase.auth.updateUser({
                data: { display_name: formData.display_name }
            })

            if (error) throw error

            toast.success('Profile updated successfully!')
        } catch (error: any) {
            console.error('Profile update error:', error)
            if (error.message === 'No user logged in') {
                toast.error('Please sign in to update your profile')
                navigate('/auth')
            } else {
                toast.error(error.message || 'Error updating profile. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center">
            <AnimatedBackground />
            <div className="relative z-10">
                <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center">Profile Settings</CardTitle>
                        <CardDescription className="text-sm text-center">
                            Update your profile information and settings
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                                        <Avatar className="h-28 w-28 ring-4 ring-white/20 dark:ring-slate-800/20 shadow-lg">
                                            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url || getRandomAvatar()} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-semibold">
                                                {user?.user_metadata?.display_name?.charAt(0) || user.email.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={isLoading}
                                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-white/90 dark:hover:bg-slate-700 transition-colors"
                                            onClick={handleNewAvatar}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            ) : (
                                                <RefreshCw className="h-4 w-4 text-primary" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Label htmlFor="display_name">Display Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="display_name"
                                            value={formData.display_name}
                                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                            placeholder="Your display name"
                                            required
                                            className="bg-white/50 dark:bg-slate-800/50 pl-10"
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <div className="relative">
                                    <Input
                                        value={user.email}
                                        disabled
                                        className="bg-white/50 dark:bg-slate-800/50 pl-10"
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 relative rounded group font-medium text-white inline-block text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                                <span className="relative flex items-center justify-center gap-2 text-sm">
                                    {isLoading ? (
                                        <>
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Saving changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-3 w-3 text-yellow-300" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-primary hover:underline font-medium flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 