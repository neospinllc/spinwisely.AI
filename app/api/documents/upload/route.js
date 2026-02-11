import { NextResponse } from 'next/server'
import { parseDocument, chunkText } from '@/lib/document-parser'
import { generateEmbeddingsBatch } from '@/lib/llm-client'
import { upsertVectors } from '@/lib/vector-store'
import { saveDocumentMetadata } from '@/lib/firestore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request) {
    try {
        console.log('=== Upload API called ===')
        const formData = await request.formData()
        const file = formData.get('file')
        console.log('File received:', file ? file.name : 'NO FILE')

        if (!file) {
            console.log('ERROR: No file in formData')
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024
        console.log('File size:', file.size, 'Max:', maxSize)
        if (file.size > maxSize) {
            console.log('ERROR: File too large')
            return NextResponse.json(
                { error: 'File size exceeds 100MB limit' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        console.log('Converting file to buffer...')
        const buffer = Buffer.from(await file.arrayBuffer())
        console.log('Buffer created, size:', buffer.length)

        // Parse the document
        console.log('Parsing document...')
        const parseResult = await parseDocument(buffer, file.type, file.name)
        console.log('Parse result:', parseResult.success ? `Success (${parseResult.text?.length} chars)` : `Failed: ${parseResult.error}`)

        if (!parseResult.success) {
            console.log('ERROR: Document parsing failed')
            return NextResponse.json(
                { error: parseResult.error },
                { status: 400 }
            )
        }

        // Chunk the text
        console.log('Chunking text...')
        const chunks = chunkText(parseResult.text, 500, 100) // Reduced from 1000 to 500
        console.log('Chunks created:', chunks.length)

        if (chunks.length === 0) {
            console.log('ERROR: No chunks created')
            return NextResponse.json(
                { error: 'No text content found in document' },
                { status: 400 }
            )
        }

        // Generate embeddings for all chunks
        console.log('Generating embeddings for', chunks.length, 'chunks...')
        const embeddingsResult = await generateEmbeddingsBatch(chunks)
        console.log('Embeddings result:', embeddingsResult.success ? `Success (${embeddingsResult.embeddings?.length} embeddings)` : `Failed: ${embeddingsResult.error}`)

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
