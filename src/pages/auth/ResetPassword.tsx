import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { successToast, errorToast } from '@/lib/toast.tsx'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Eye, EyeOff, Lock, ArrowLeft, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const { updatePassword } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if we have a valid reset token
        const checkResetToken = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error

                if (!session) {
                    errorToast('The password reset link has expired. Please request a new one.')
                    navigate('/auth/forgot-password')
                    return
                }

                setUserEmail(session.user?.email || '')
                setIsValid(true)
            } catch (error: any) {
                console.error('Reset token check error:', error)
                errorToast('The password reset link has expired. Please request a new one.')
                navigate('/auth/forgot-password')
            }
        }

        checkResetToken()
    }, [navigate])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        if (password !== confirmPassword) {
            errorToast('Passwords do not match!')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            errorToast('Password must be at least 6 characters long!')
            setLoading(false)
            return
        }

        try {
            await updatePassword(password)
            successToast('✨ Your password has been updated successfully!')
            navigate('/auth')
        } catch (error: any) {
            console.error('Reset password error:', error)
            if (error.message?.includes('expired')) {
                errorToast('The reset link has expired. Please request a new one.')
                navigate('/auth/forgot-password')
            } else {
                errorToast('Oops! Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }
    //? Check if we have a valid reset token and if not, show the check your email page
    if (!isValid) {
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
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-10 w-10 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        We've sent a password reset link to:
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                        {userEmail}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
                                <p>Didn't receive the email? Check your spam folder or try again.</p>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/auth')}
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
    //? If we have a valid reset token, show the set new password page
    return (
        <div className="relative min-h-screen w-screen flex items-center justify-center">
            <AnimatedBackground />
            <div className="relative z-10">
                <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center">Set New Password</CardTitle>
                        <CardDescription className="text-sm text-center">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-white/50 dark:bg-slate-800/50 pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="bg-white/50 dark:bg-slate-800/50 pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
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
                                            <span>Updating password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-3 w-3 text-yellow-300" />
                                            <span>Update Password</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            <div className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
                                <Link to="/auth" className="text-primary hover:underline font-medium flex items-center justify-center gap-1">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 