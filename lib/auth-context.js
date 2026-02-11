'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, createUser, acceptTerms as firestoreAcceptTerms } from '@/lib/firestore'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser)
                // Fetch user data from Firestore
                const result = await getUser(firebaseUser.uid)
                if (result.success) {
                    setUserData(result.data)
                }
            } else {
                setUser(null)
                setUserData(null)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signIn = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            return { success: true, user: result.user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const signUp = async (email, password, name, termsAccepted = false) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)

            // Send email verification
            const { sendEmailVerification } = await import('firebase/auth')
            await sendEmailVerification(result.user)
            console.log('Email verification sent to:', email)

            // Create user document in Firestore
            await createUser(result.user.uid, {
                email,
                name,
                role: 'user', // Default role (will be overridden if admin email)
                termsAccepted, // Pass terms acceptance status
            })

            return { success: true, user: result.user }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const signOut = async () => {
        try {
            await firebaseSignOut(auth)
            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const isAdmin = () => {
        return userData?.role === 'admin'
    }

    const hasAcceptedTerms = () => {
        return userData?.termsAccepted === true
    }

    const acceptTerms = async () => {
        if (!user) return { success: false, error: 'Not authenticated' }

        const result = await firestoreAcceptTerms(user.uid)
        if (result.success) {
            // Update local userData
            const updatedUserData = await getUser(user.uid)
            if (updatedUserData.success) {
                setUserData(updatedUserData.data)
            }
        }
        return result
    }

    const value = {
        user,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        hasAcceptedTerms,
        acceptTerms,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
