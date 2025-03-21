import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

type AuthContextType = {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ user: User | null }>
    signOut: () => Promise<void>
    updateProfile: (data: Partial<Profile>) => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updatePassword: (password: string) => Promise<void>
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

    async function signUp(email: string, password: string, options?: { data?: any }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: options?.data
            }
        })
        if (error) throw error
        return { user: data.user }
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    async function updateProfile(data: Partial<Profile>) {
        if (!user) throw new Error('No user logged in')

        // First, check if the profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError
        }

        if (!existingProfile) {
            //* If profile doesn't exist, create it
            const { error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: user.id, ...data }])

            if (insertError) throw insertError
        } else {
            // If profile exists, update it
            const { error: updateError } = await supabase
                .from('profiles')
                .update(data)
                .eq('id', user.id)

            if (updateError) throw updateError
        }

        // Refresh profile data
        await fetchProfile(user.id)
    }

    async function resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
    }

    async function updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({
            password: password
        })
        if (error) throw error
    }

    //? This is the context provider that will be used to wrap the app
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
                resetPassword,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

//? This is the hook that will be used to access the auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 