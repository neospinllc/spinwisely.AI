'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Lock, Mail, Sparkles, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import TermsModal from './components/TermsModal'

export default function Home() {
    const router = useRouter()
    const { user, loading, signIn, signUp, userData, hasAcceptedTerms, acceptTerms } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [pendingSignupData, setPendingSignupData] = useState(null)
    const [checkingTerms, setCheckingTerms] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const [resetEmailSent, setResetEmailSent] = useState(false)

    // Redirect if already logged in AND has accepted terms
    useEffect(() => {
        if (user && !loading && userData) {
            if (hasAcceptedTerms()) {
                router.push('/chat')
            } else {
                // User logged in but hasn't accepted terms
                setShowTermsModal(true)
            }
        }
    }, [user, loading, userData, hasAcceptedTerms, router])

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const { sendPasswordResetEmail } = await import('firebase/auth')
            const { auth } = await import('@/lib/firebase')

            await sendPasswordResetEmail(auth, forgotPasswordEmail)
            setResetEmailSent(true)
            setError('')
        } catch (err) {
            setError(err.message || 'Failed to send password reset email')
        } finally {
            setSubmitting(false)
        }
    }

    const closeForgotPassword = () => {
        setShowForgotPassword(false)
        setForgotPasswordEmail('')
        setResetEmailSent(false)
        setError('')
    }

    const handleTermsAccept = async () => {
        setCheckingTerms(true)
        setTermsAccepted(true)
        setShowTermsModal(false)

        // If user is logged in but hasn't accepted terms
        if (user && !hasAcceptedTerms()) {
            const result = await acceptTerms()
            if (result.success) {
                router.push('/chat')
            } else {
                setError('Failed to save terms acceptance')
            }
            setCheckingTerms(false)
            return
        }

        // If this is during signup
        if (pendingSignupData) {
            const { email, password, name } = pendingSignupData
            const result = await signUp(email, password, name, true)
            if (!result.success) {
                setError(result.error)
            }
            setPendingSignupData(null)
            setCheckingTerms(false)
        }
    }

    const handleTermsDecline = () => {
        setShowTermsModal(false)
        setTermsAccepted(false)
        setPendingSignupData(null)

        // If user declined after logging in, sign them out
        if (user) {
            router.push('/')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            if (!isLogin) {
                // Validate password confirmation
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setSubmitting(false)
                    return
                }

                // For signup, show terms modal first
                setPendingSignupData({ email, password, name })
                setShowTermsModal(true)
                setSubmitting(false)
                return
            }

            // For login: just sign in
            const result = await signIn(email, password)

            if (result.success) {
                // Check if user has accepted terms
                setCheckingTerms(true)
                if (!hasAcceptedTerms()) {
                    setShowTermsModal(true)
                } else {
                    router.push('/chat')
                }
                setCheckingTerms(false)
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 md:ml-12">
                        <MessageCircle className="w-10 h-10 text-primary-600" />
                        <span className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            SpinWisely AI
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Hero */}
                    <div className="text-center md:text-left space-y-6 animate-fade-in md:ml-12">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                            <Sparkles className="w-5 h-5 text-accent-500" />
                            <span className="text-xs font-semibold text-accent-600 uppercase tracking-wider">
                                AI-Powered Knowledge Base
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                            <span className="block mb-3">Fiber to yarn</span>
                            <div className="text-xl sm:text-3xl md:text-4xl mt-2 mb-6 font-semibold text-gray-700 dark:text-gray-200">
                                Technology and Process
                            </div>
                            <div className="mt-4">
                                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block pb-2 text-2xl sm:text-4xl">
                                    Your AI Assistant
                                </span>
                            </div>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                            Get instant answers from curated, industry-credible documents. Secure, private, and powered by advanced AI technology.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">100% Document-Based</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">No Internet Search</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm">Secure & Private</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login/Register Form */}
                    <div className="w-full max-w-md mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {isLogin ? 'Welcome Back' : 'Get Started'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {isLogin ? 'Sign in to access your AI assistant' : 'Create your account to begin'}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Mail className="inline w-4 h-4 mr-1" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Lock className="inline w-4 h-4 mr-1" />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {isLogin && (
                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Lock className="inline w-4 h-4 mr-1" />
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {submitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium text-sm"
                                >
                                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Reset Password
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            {resetEmailSent
                                ? "Check your email for password reset instructions."
                                : "Enter your email address and we'll send you a link to reset your password."
                            }
                        </p>

                        {!resetEmailSent ? (
                            <>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        placeholder="you@example.com"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleForgotPassword()
                                            }
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeForgotPassword}
                                        className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleForgotPassword}
                                        disabled={submitting}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-green-800 dark:text-green-300 text-sm">
                                        ✓ Password reset email sent to <strong>{forgotPasswordEmail}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={closeForgotPassword}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
                                >
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Terms & Conditions Modal */}
            <TermsModal
                isOpen={showTermsModal}
                onAccept={handleTermsAccept}
                onDecline={handleTermsDecline}
            />
        </div>
    )
}
