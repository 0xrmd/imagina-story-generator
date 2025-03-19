import { useAuth } from '@/contexts/AuthContext'
import OnboardingForm from './OnboardingForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function AuthenticatedOnboardingForm() {
    const { user, profile } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return (
            <Card className="w-full max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Welcome to StoryLand</CardTitle>
                    <CardDescription>
                        Please sign in or create an account to start creating magical stories for your child.
                    </CardDescription>
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
        )
    }

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Welcome back, {profile?.full_name || user.email}!
                </p>
            </div>
            <OnboardingForm />
        </div>
    )
} 