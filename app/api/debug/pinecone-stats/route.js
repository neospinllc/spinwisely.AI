import { NextResponse } from 'next/server'
import { getIndexStats } from '@/lib/vector-store'

export async function GET() {
    try {
        const statsResult = await getIndexStats()

        if (!statsResult.success) {
            return NextResponse.json({
                success: false,
                error: statsResult.error
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            stats: statsResult.stats,
            vectorCount: statsResult.stats?.totalRecordCount || statsResult.stats?.totalVectorCount || 0
        })
    } catch (error) {
        console.error('Error fetching Pinecone stats:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
