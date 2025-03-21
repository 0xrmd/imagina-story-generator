import { useAuth } from '@/contexts/AuthContext'
import OnboardingForm from './OnboardingForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function AuthenticatedOnboardingForm() {
    const { user, profile } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return (
            <Card className="w-full max-w-lg mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                            <Sparkles className="w-12 h-12 text-primary relative z-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-medium tracking-tight">Welcome to StoryLand</CardTitle>
                        <CardDescription className="text-base">
                            Create magical, personalized stories for your child in minutes
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button
                        onClick={() => navigate('/auth')}
                        className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        variant="default"
                    >
                        Get Started
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.user_metadata?.display_name || user.email}!
                </p>
            </div>
            <OnboardingForm />
        </div>
    )
} 