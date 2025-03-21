import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { successToast, errorToast } from '@/components/CuteToast'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Eye, EyeOff, Sparkles } from 'lucide-react'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/')
            successToast('✨ Welcome back! Your magical journey continues...')
        } catch (error) {
            errorToast('Oops! Please check your magical credentials and try again.')
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
                        <CardTitle className="text-xl text-center">Welcome Back!</CardTitle>
                        <CardDescription className="text-sm text-center">
                            Sign in to continue your magical story journey
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
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3 w-3 text-yellow-300" />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <div className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
                                <Link to="/auth/forgot-password" className="text-primary hover:underline font-medium">
                                    Forgot your password?
                                </Link>
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/auth/signup" className="text-primary hover:underline font-medium">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 