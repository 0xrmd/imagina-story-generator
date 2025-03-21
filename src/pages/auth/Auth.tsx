import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { successToast, errorToast } from '@/components/CuteToast'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Eye, EyeOff, Sparkles, Lock, Mail, ArrowLeft } from 'lucide-react'

// Function to generate random avatar URL
function generateRandomAvatar() {
    const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral', 'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs', 'open-peeps', 'personas', 'pixel-art', 'pixel-art-neutral']
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    const randomSeed = Math.random().toString(36).substring(7)
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`
}

type AuthMode = 'signin' | 'signup' | 'forgot-password'

export default function Auth() {
    const [mode, setMode] = useState<AuthMode>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { signIn, signUp, updateProfile, resetPassword } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (mode === 'signup') {
                // Extract username from email (everything before @)
                const username = email.split('@')[0]
                const avatarUrl = generateRandomAvatar()

                const { user } = await signUp(email, password, {
                    data: {
                        display_name: displayName,
                        username: username,
                        avatar_url: avatarUrl
                    }
                })

                if (user) {
                    try {
                        // Create the profile in the database
                        await updateProfile({
                            username: username,
                            email: email,
                            avatar_url: avatarUrl
                        })
                    } catch (profileError) {
                        console.error('Profile update error:', profileError)
                        // Continue with success flow even if profile update fails
                    }
                    successToast('✨ Welcome to the magical world of stories! Check your email to confirm your account.')
                    setMode('signin')
                }
            } else if (mode === 'signin') {
                await signIn(email, password)
                navigate('/')
                successToast('✨ Welcome back! Your magical journey continues...')
            } else if (mode === 'forgot-password') {
                await resetPassword(email)
                setIsSubmitted(true)
                successToast('✨ Check your email for the password reset link!')
            }
        } catch (error: any) {
            console.error('Auth error:', error)
            if (mode === 'signup') {
                // Check for specific error messages that indicate success
                if (error.message?.includes('confirmation email') ||
                    error.message?.includes('Email not confirmed') ||
                    error.message?.includes('Please check your email for the confirmation link')) {
                    // These are actually success cases
                    successToast('✨ Welcome to the magical world of stories! Check your email to confirm your account.')
                    setMode('signin')
                } else if (error.code === '23505') {
                    errorToast('This magical email is already registered in our storybook!')
                } else {
                    errorToast('Oops! Something went wrong. Please try again with your magical details.')
                }
            } else if (mode === 'signin') {
                errorToast('Oops! Please check your magical credentials and try again.')
            } else if (mode === 'forgot-password') {
                if (error.message?.includes('Email not found')) {
                    errorToast('This email is not registered in our storybook!')
                } else {
                    errorToast('Oops! Something went wrong. Please try again.')
                }
            }
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setDisplayName('')
        setShowPassword(false)
        setIsSubmitted(false)
    }

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode)
        resetForm()
    }

    if (mode === 'forgot-password' && isSubmitted) {
        return (
            <div className="relative min-h-screen w-screen flex items-center justify-center">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl text-center">Check Your Email</CardTitle>
                            <CardDescription className="text-sm text-center">
                                We've sent a password reset link to your email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
                                <p>Didn't receive the email? Check your spam folder or try again.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubmitted(false)
                                        resetForm()
                                    }}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => handleModeChange('signin')}
                                className="text-primary hover:underline font-medium flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Sign In
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center">
            <AnimatedBackground />
            <div className="relative z-10">
                <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center">
                            {mode === 'signup' ? 'Join the Magic!' :
                                mode === 'signin' ? 'Welcome Back!' :
                                    'Reset Password'}
                        </CardTitle>
                        <CardDescription className="text-sm text-center">
                            {mode === 'signup'
                                ? 'Create your account to start your magical story journey'
                                : mode === 'signin'
                                    ? 'Sign in to continue your magical story journey'
                                    : 'Enter your email to receive a password reset link'}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            {mode === 'signup' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        placeholder="Choose a display name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required
                                        className="bg-white/50 dark:bg-slate-800/50"
                                    />
                                </div>
                            )}
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
                            {mode !== 'forgot-password' && (
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
                            )}
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
                                            <span>
                                                {mode === 'signup' ? 'Creating your magical account...' :
                                                    mode === 'signin' ? 'Signing in...' :
                                                        'Sending reset link...'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3 w-3 text-yellow-300" />
                                            <span>
                                                {mode === 'signup' ? 'Sign Up' :
                                                    mode === 'signin' ? 'Sign In' :
                                                        'Send Reset Link'}
                                            </span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <div className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
                                {mode === 'signin' && (
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('forgot-password')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Forgot your password?
                                    </button>
                                )}
                                <p>
                                    {mode === 'signup' ? "Already have an account?" :
                                        mode === 'signin' ? "Don't have an account?" :
                                            "Remember your password?"}{' '}
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange(mode === 'signup' ? 'signin' : 'signup')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {mode === 'signup' ? 'Sign in' : 'Sign up'}
                                    </button>
                                </p>
                                {mode === 'forgot-password' && (
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('signin')}
                                        className="text-primary hover:underline font-medium flex items-center justify-center gap-1"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Sign In
                                    </button>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 