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

        // Extract relevant context from search results (without metadata)
        const context = searchResult.matches
            .map((match) => match.metadata?.text || '')
            .filter(text => text.length > 0)
            .join('\n\n')

        // Build the prompt with context (no source attribution)
        const prompt = `Context information:
${context}

User question: ${message}

Based on the context above, provide a helpful answer. IMPORTANT: Rephrase and simplify the information - do not copy text verbatim from the context.`

        // Generate response using LLM with enhanced privacy system prompt
        const aiResponse = await generateChatResponse(prompt, {
            systemPrompt: `You are a knowledgeable AI assistant. Follow these CRITICAL rules:

PRIVACY & SECURITY:
- NEVER mention document names, filenames, or sources
- NEVER reveal how many documents are in the database
- NEVER reference "the document says" or "according to the source"
- NEVER copy text verbatim from the context

RESPONSE STYLE:
- Synthesize and rephrase information in your own words
- Simplify complex information for clarity
- Present information as your own knowledge
- Be natural and conversational
- If you don't know something from the context, say "I don't have information about that topic"

Answer questions based strictly on the provided context, but always rephrase and simplify the information naturally.`,
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
