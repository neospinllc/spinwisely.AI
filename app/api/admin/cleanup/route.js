import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

/**
 * DELETE /api/admin/cleanup
 * Clean up orphaned documents without uploadedAt field
 */
export async function DELETE() {
    try {
        const documentsRef = collection(db, 'documents')
        const snapshot = await getDocs(documentsRef)

        const orphanedDocs = []
        const validDocs = []

        snapshot.forEach((document) => {
            const data = document.data()
            // Documents without uploadedAt are orphaned from the old bug
            if (!data.uploadedAt) {
                orphanedDocs.push(document.id)
            } else {
                validDocs.push({ id: document.id, ...data })
            }
        })

        // Delete orphaned documents
        const deletePromises = orphanedDocs.map(docId =>
            deleteDoc(doc(db, 'documents', docId))
        )
        await Promise.all(deletePromises)

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${orphanedDocs.length} orphaned documents`,
            deleted: orphanedDocs.length,
            remaining: validDocs.length,
            validDocuments: validDocs.map(d => ({ id: d.id, filename: d.filename })),
        })
    } catch (error) {
        console.error('Error cleaning up documents:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
