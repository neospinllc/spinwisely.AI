import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

/**
 * GET /api/documents
 * Fetch all documents from Firestore
 */
export async function GET() {
    try {
        const documentsRef = collection(db, 'documents')
        const q = query(documentsRef, orderBy('uploadedAt', 'desc'))
        const querySnapshot = await getDocs(q)

        const documents = []
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                ...doc.data(),
            })
        })

        return NextResponse.json({
            success: true,
            documents,
            count: documents.length,
        })
    } catch (error) {
        console.error('Error fetching documents:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
