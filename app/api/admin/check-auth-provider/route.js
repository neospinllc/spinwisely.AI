import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export const runtime = 'nodejs'

export async function POST(request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: true, message: 'Email is required' },
                { status: 400 }
            )
        }

        // Get user by email
        const userRecord = await adminAuth.getUserByEmail(email)

        // Extract provider information
        const providers = userRecord.providerData.map(provider => provider.providerId)

        return NextResponse.json({
            error: false,
            email: userRecord.email,
            uid: userRecord.uid,
            providers: providers,
            emailVerified: userRecord.emailVerified,
            metadata: {
                creationTime: userRecord.metadata.creationTime,
                lastSignInTime: userRecord.metadata.lastSignInTime
            }
        })

    } catch (error) {
        console.error('Auth provider check error:', error)

        if (error.code === 'auth/user-not-found') {
            return NextResponse.json(
                { error: true, message: 'No user found with this email address' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: true, message: error.message || 'Failed to check authentication provider' },
            { status: 500 }
        )
    }
}
