'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { auth } from '@/lib/firebase'
import { CheckCircle, XCircle, Info, Key } from 'lucide-react'
import Link from 'next/link'

export default function AuthDiagnosticPage() {
    const { user: currentUser, userData } = useAuth()
    const [authInfo, setAuthInfo] = useState(null)

    useEffect(() => {
        if (currentUser) {
            // Get provider data from current user
            const providers = currentUser.providerData.map(p => p.providerId)

            setAuthInfo({
                email: currentUser.email,
                uid: currentUser.uid,
                emailVerified: currentUser.emailVerified,
                providers: providers,
                metadata: {
                    creationTime: currentUser.metadata.creationTime,
                    lastSignInTime: currentUser.metadata.lastSignInTime
                }
            })
        }
    }, [currentUser])

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Authentication Required
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please sign in to view your authentication information.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    const hasPasswordAuth = authInfo?.providers?.includes('password')

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="w-8 h-8 text-primary-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Your Authentication Info
                        </h1>
                    </div>

                    {authInfo && (
                        <div className="space-y-6">
                            {/* Account Details */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Account Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{authInfo.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
                                        <span className={authInfo.emailVerified ? 'text-green-600' : 'text-red-600'}>
                                            {authInfo.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                                        <span className="font-mono text-xs text-gray-900 dark:text-white">{authInfo.uid}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Authentication Methods */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Authentication Methods
                                </h3>
                                <div className="space-y-2">
                                    {authInfo.providers.map((provider) => (
                                        <div
                                            key={provider}
                                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="font-medium">
                                                {provider === 'password' ? 'Email/Password' : provider}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Password Reset Status */}
                            <div className={`p-6 rounded-lg border ${hasPasswordAuth
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}>
                                <div className="flex items-start gap-3">
                                    {hasPasswordAuth ? (
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <h3 className={`font-semibold mb-2 ${hasPasswordAuth ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                                            }`}>
                                            {hasPasswordAuth ? 'Password Reset Available' : 'Password Reset Not Available'}
                                        </h3>
                                        <p className={`text-sm ${hasPasswordAuth ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                            }`}>
                                            {hasPasswordAuth
                                                ? 'Your account uses Email/Password authentication. You can reset your password via email.'
                                                : `Your account uses ${authInfo.providers.join(', ')} authentication. Password reset emails are not applicable for this authentication method.`
                                            }
                                        </p>
                                        {hasPasswordAuth && (
                                            <Link
                                                href="/forgot-password"
                                                className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Reset Password
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Account History
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Created:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(authInfo.metadata.creationTime).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Sign In:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(authInfo.metadata.lastSignInTime).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
