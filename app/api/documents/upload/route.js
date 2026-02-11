import { NextResponse } from 'next/server'
import { parseDocument, chunkText } from '@/lib/document-parser'
import { generateEmbeddingsBatch } from '@/lib/llm-client'
import { upsertVectors } from '@/lib/vector-store'
import { saveDocumentMetadata } from '@/lib/firestore'

export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 100MB limit' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Parse the document
        const parseResult = await parseDocument(buffer, file.type, file.name)

        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error },
                { status: 400 }
            )
        }

        // Chunk the text
        const chunks = chunkText(parseResult.text, 1000, 200)

        if (chunks.length === 0) {
            return NextResponse.json(
                { error: 'No text content found in document' },
                { status: 400 }
            )
        }

        // Generate embeddings for all chunks
        const embeddingsResult = await generateEmbeddingsBatch(chunks)

        if (!embeddingsResult.success) {
            return NextResponse.json(
                { error: 'Failed to generate embeddings: ' + embeddingsResult.error },
                { status: 500 }
            )
        }

        // Save document metadata to Firestore
        const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const metadataResult = await saveDocumentMetadata({
            id: documentId,
            filename: file.name,
            size: file.size,
            mimeType: file.type,
            chunksCount: chunks.length,
            uploadedBy: 'admin', // TODO: Get from auth
        })

        if (!metadataResult.success) {
            console.error('Failed to save metadata:', metadataResult.error)
        }

        // Prepare vectors for Pinecone
        const vectors = embeddingsResult.embeddings.map((embedding, index) => ({
            id: `${documentId}_chunk_${index}`,
            values: embedding,
            metadata: {
                documentId,
                filename: file.name,
                chunkIndex: index,
                text: chunks[index],
                uploadedAt: new Date().toISOString(),
            },
        }))

        // Upsert vectors to Pinecone
        const upsertResult = await upsertVectors(vectors)

        if (!upsertResult.success) {
            return NextResponse.json(
                { error: 'Failed to store vectors: ' + upsertResult.error },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            id: documentId,
            filename: file.name,
            chunks: chunks.length,
            message: `Successfully processed ${chunks.length} chunks from ${file.name}`,
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
