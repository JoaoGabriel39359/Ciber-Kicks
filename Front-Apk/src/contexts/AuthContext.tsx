import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    signed: boolean;
    loading: boolean;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Busca a sessão atual salva
        supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
            const currentSession = data.session;
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
        });

        // 2. Escuta mudanças no estado de autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    async function signIn(email: string, pass: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        if (error) throw error;
    }

    async function signUp(email: string, pass: string) {
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
        });
        if (error) throw error;
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                signed: !!user,
                loading,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
    }
    return context;
}