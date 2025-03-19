import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

type AuthContextType = {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (data: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
            return
        }

        setProfile(data)
    }

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
    }

    async function signUp(email: string, password: string) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) throw error
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    async function updateProfile(data: Partial<Profile>) {
        if (!user) throw new Error('No user logged in')

        const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id)

        if (error) throw error

        // Refresh profile data
        await fetchProfile(user.id)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signIn,
                signUp,
                signOut,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 