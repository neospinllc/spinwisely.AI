'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, createUser } from '@/lib/firestore'

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

    const signUp = async (email, password, name) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)

            // Create user document in Firestore
            await createUser(result.user.uid, {
                email,
                name,
                role: 'user', // Default role
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

    const value = {
        user,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
