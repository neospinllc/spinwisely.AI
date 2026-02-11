'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUser } from '@/lib/firestore'
import { Search, CheckCircle, XCircle, Info } from 'lucide-react'

export default function AuthDiagnosticPage() {
    const { user: currentUser } = useAuth()
    const [email, setEmail] = useState('neospinllc@gmail.com')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const checkAuthProvider = async () => {
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/admin/check-auth-provider', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()
            setResult(data)
        } catch (error) {
            setResult({
                error: true,
                message: 'Failed to check authentication provider'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        🔍 Authentication Diagnostic
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Check which authentication provider is being used for an account
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address to Check
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="user@example.com"
                                />
                                <button
                                    onClick={checkAuthProvider}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Search className="w-5 h-5" />
                                    Check
                                </button>
                            </div>
                        </div>

                        {result && (
                            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                {result.error ? (
                                    <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                                        <XCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Error</h3>
                                            <p>{result.message}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                                            <div>
                                                <h3 className="font-semibold mb-1">Account Found</h3>
                                                <p className="text-sm">Email: {result.email}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                Authentication Providers:
                                            </h4>
                                            <div className="space-y-2">
                                                {result.providers?.map((provider) => (
                                                    <div
                                                        key={provider}
                                                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="font-mono text-sm">{provider}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex items-start gap-3 text-blue-600 dark:text-blue-400">
                                                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    {result.providers?.includes('password') ? (
                                                        <p>✅ This account uses <strong>Email/Password</strong> authentication and can receive password reset emails.</p>
                                                    ) : (
                                                        <p>❌ This account does NOT use Email/Password authentication. Password reset emails won't work. The account uses: <strong>{result.providers?.join(', ')}</strong></p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {result.metadata && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Account Details:
                                                </h4>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                    <p>Created: {new Date(result.metadata.creationTime).toLocaleString()}</p>
                                                    <p>Last Sign In: {new Date(result.metadata.lastSignInTime).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
