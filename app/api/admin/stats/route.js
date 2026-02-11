import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'

/**
 * GET /api/admin/stats
 * Fetch dashboard statistics
 */
export async function GET() {
    try {
        // Fetch documents count
        const documentsRef = collection(db, 'documents')
        const docsSnapshot = await getDocs(documentsRef)
        const totalDocuments = docsSnapshot.size

        // Fetch users count
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        const totalUsers = usersSnapshot.size

        // Fetch activity logs for query count
        const activitiesRef = collection(db, 'activities')
        const activitiesSnapshot = await getDocs(activitiesRef)
        const totalQueries = activitiesSnapshot.size

        // Count active users (users with activity in last 24 hours)
        const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))
        const recentActivitiesQuery = query(
            activitiesRef,
            where('timestamp', '>=', oneDayAgo)
        )
        const recentActivitiesSnapshot = await getDocs(recentActivitiesQuery)

        // Get unique user IDs from recent activities
        const activeUserIds = new Set()
        recentActivitiesSnapshot.forEach((doc) => {
            const data = doc.data()
            if (data.uid) {
                activeUserIds.add(data.uid)
            }
        })
        const activeUsers = activeUserIds.size

        return NextResponse.json({
            success: true,
            stats: {
                totalDocuments,
                totalUsers,
                totalQueries,
                activeUsers,
            },
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stats: {
                    totalDocuments: 0,
                    totalUsers: 0,
                    totalQueries: 0,
                    activeUsers: 0,
                }
            },
            { status: 500 }
        )
    }
}
