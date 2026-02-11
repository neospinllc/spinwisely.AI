'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Loader2, LogOut, User, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
    const router = useRouter()
    const { user, userData, signOut, loading } = useAuth()
    const [showVerificationMessage, setShowVerificationMessage] = useState(false)
    const [resendingVerification, setResendingVerification] = useState(false)

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant. Ask me anything about the industry-credible documents in our knowledge base.',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // Check email verification
    useEffect(() => {
        if (user && !loading) {
            if (!user.emailVerified) {
                setShowVerificationMessage(true)
            }
        }
    }, [user, loading])

    const resendVerificationEmail = async () => {
        if (!user) return

        setResendingVerification(true)
        try {
            const { sendEmailVerification } = await import('firebase/auth')
            await sendEmailVerification(user)
            alert('Verification email sent! Please check your inbox.')
        } catch (error) {
            console.error('Error sending verification:', error)
            alert('Failed to send verification email. Please try again later.')
        } finally {
            setResendingVerification(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        // Block if email not verified
        if (!user?.emailVerified) {
            alert('Please verify your email before using the chat.')
            return
        }

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            })

            const data = await response.json()

            const assistantMessage = {
                role: 'assistant',
                content: data.response || 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting right now. Please ensure the backend services are configured.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        await signOut()
        router.push('/')
    }

    // Get display name
    const displayName = userData?.name || user?.email || 'User'
    const displayInitial = displayName.charAt(0).toUpperCase()

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Email Verification Banner */}
            {showVerificationMessage && user && !user.emailVerified && (
                <div className="bg-yellow-500 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                            Please verify your email address to use the chat. Check your inbox for the verification link.
                        </span>
                    </div>
                    <button
                        onClick={resendVerificationEmail}
                        disabled={resendingVerification}
                        className="px-4 py-1.5 bg-white text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors disabled:opacity-50"
                    >
                        {resendingVerification ? 'Sending...' : 'Resend Email'}
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-primary-600" />
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            SpinWisely AI
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Industry Knowledge Assistant</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold">
                            {displayInitial}
                        </div>
                        <span className="hidden md:inline">{displayName}</span>
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 mb-6 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-600'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                {message.role === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <MessageCircle className="w-5 h-5 text-primary-600" />
                                )}
                            </div>
                            <div
                                className={`flex-1 max-w-2xl ${message.role === 'user' ? 'text-right' : ''
                                    }`}
                            >
                                <div
                                    className={`inline-block px-6 py-4 rounded-2xl shadow-sm ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 px-2">
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block px-6 py-4 rounded-2xl bg-white dark:bg-gray-800">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSubmit(e)
                                    }
                                }}
                                placeholder="Ask a question about the documents..."
                                rows={1}
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                style={{ minHeight: '52px', maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </form>
            </div>
        </div>
    )
}
