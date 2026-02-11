import { deleteDocumentVectors } from '@/lib/vector-store'
import { deleteDocument } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
    try {
        const { id } = params

        // Delete vectors from Pinecone
        const vectorsResult = await deleteDocumentVectors(id)

        if (!vectorsResult.success) {
            console.error('Failed to delete vectors:', vectorsResult.error)
        }

        // Delete metadata from Firestore
        const metadataResult = await deleteDocument(id)

        if (!metadataResult.success) {
            console.error('Failed to delete metadata:', metadataResult.error)
        }

        return NextResponse.json({
            success: true,
            message: 'Document deleted successfully',
        })

    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
