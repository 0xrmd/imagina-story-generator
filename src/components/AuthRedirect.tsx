import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (user) {
        return (
            <div className="relative min-h-screen w-screen flex items-center justify-center">
                <AnimatedBackground />
                <div className="relative z-10">
                    <Card className="w-[350px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-white/20 shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl text-center">Already Signed In</CardTitle>
                            <CardDescription className="text-sm text-center">
                                You are already signed in to your magical account!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Redirecting you to the home page...
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Navigate to="/" replace />
            </div>
        )
    }

    return <>{children}</>
} 