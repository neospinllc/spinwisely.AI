import { generateChatResponse } from '@/lib/llm-client'
import { generateEmbedding } from '@/lib/llm-client'
import { queryVectors } from '@/lib/vector-store'
import { logActivity } from '@/lib/firestore'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { message, userId = 'anonymous' } = await request.json()

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Log the user's question
        await logActivity(userId, {
            type: 'chat_question',
            question: message,
        })

        // Generate embedding for the user's question
        const embeddingResult = await generateEmbedding(message)

        if (!embeddingResult.success) {
            console.error('Embedding generation failed:', embeddingResult.error)
            return NextResponse.json(
                {
                    response: 'I\'m having trouble processing your question. Please ensure the AI services are configured correctly.',
                    error: 'embedding_failed'
                },
                { status: 200 }
            )
        }

        // Search for relevant document chunks in the vector database
        const searchResult = await queryVectors(embeddingResult.embedding, {
            topK: 5,
            includeMetadata: true,
        })

        if (!searchResult.success || searchResult.matches.length === 0) {
            return NextResponse.json({
                response: 'I don\'t have enough information in my knowledge base to answer that question. Please ask about topics covered in the available documents.',
            })
        }

        // Extract relevant context from search results
        const context = searchResult.matches
            .map((match) => match.metadata?.text || '')
            .filter(text => text.length > 0)
            .join('\n\n')

        // Build the prompt with context
        const prompt = `Context from documents:
${context}

User question: ${message}

Please provide a helpful, accurate answer based ONLY on the context provided above. If the answer is not in the context, say so clearly.`

        // Generate response using LLM
        const aiResponse = await generateChatResponse(prompt, {
            systemPrompt: 'You are a helpful AI assistant that answers questions based strictly on provided document context. Never make up information or use knowledge outside the given context. Be concise and accurate.',
        })

        if (!aiResponse.success) {
            console.error('AI response generation failed:', aiResponse.error)
            return NextResponse.json({
                response: 'I encountered an error generating a response. Please try again.',
                error: 'generation_failed'
            })
        }

        // Log the successful interaction
        await logActivity(userId, {
            type: 'chat_response',
            question: message,
            response: aiResponse.text,
            documentsUsed: searchResult.matches.length,
        })

        return NextResponse.json({
            response: aiResponse.text,
            success: true,
        })

    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            {
                response: 'An unexpected error occurred. Please try again later.',
                error: error.message
            },
            { status: 500 }
        )
    }
}
