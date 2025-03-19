import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/')
            toast.success('Successfully signed in!')
        } catch (error) {
            toast.error('Error signing in. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your email and password to sign in to your account</CardDescription>
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
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
} 