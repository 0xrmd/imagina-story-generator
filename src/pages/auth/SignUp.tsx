import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { successToast, errorToast } from '@/lib/toast.tsx'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Eye, EyeOff, Sparkles } from 'lucide-react'

// Function to generate random avatar URL
function generateRandomAvatar() {
    const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral', 'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs', 'open-peeps', 'personas', 'pixel-art', 'pixel-art-neutral']
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    const randomSeed = Math.random().toString(36).substring(7)
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`
}

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signUp, updateProfile } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const avatarUrl = generateRandomAvatar()

            const { user } = await signUp(email, password)

            if (user) {
                try {
                    // Create the profile in the database with only avatar_url
                    await updateProfile({
                        avatar_url: avatarUrl
                    })
                } catch (profileError: any) {
                    console.error('Profile update error details:', {
                        message: profileError.message,
                        code: profileError.code,
                        details: profileError.details,
                        hint: profileError.hint
                    })
                    // Continue with success flow even if profile update fails
                }
                successToast('✨ Welcome to the magical world of stories! Check your email to confirm your account.')
                navigate('/auth/signin')
            }
        } catch (error: any) {
            console.error('Sign up error:', error)
            // Check for specific error messages that indicate success
            if (error.message?.includes('confirmation email') ||
                error.message?.includes('Email not confirmed') ||
                error.message?.includes('Please check your email for the confirmation link')) {
                // These are actually success cases
                successToast('✨ Welcome to the magical world of stories! Check your email to confirm your account.')
                navigate('/auth/signin')
            } else if (error.code === '23505') {
                errorToast('This magical email is already registered in our storybook!')
            } else {
                errorToast('Oops! Something went wrong. Please try again with your magical details.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center">
            <AnimatedBackground />
            <div className="relative z-10">
                <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center">Join the Magic!</CardTitle>
                        <CardDescription className="text-sm text-center">
                            Create your account to start your magical story journey
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/50 dark:bg-slate-800/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white/50 dark:bg-slate-800/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 relative rounded group font-medium text-white inline-block text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                                <span className="relative flex items-center justify-center gap-2 text-sm">
                                    {loading ? (
                                        <>
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>Creating your magical account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3 w-3 text-yellow-300" />
                                            <span>Sign Up</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 