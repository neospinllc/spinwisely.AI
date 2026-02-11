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
        console.log('🔍 Searching Pinecone with embedding of length:', embeddingResult.embedding.length)
        const searchResult = await queryVectors(embeddingResult.embedding, {
            topK: 35, // Increased to 35 (approx 8k tokens) - max for GPT-3.5 context limit
            includeMetadata: true,
        })

        console.log('📊 Pinecone search result:', {
            success: searchResult.success,
            matchCount: searchResult.matches?.length || 0,
            error: searchResult.error
        })

        if (searchResult.matches && searchResult.matches.length > 0) {
            console.log('✅ Match scores:', searchResult.matches.slice(0, 3).map(m => m.score))
            console.log('📄 First chunk preview:', searchResult.matches[0].metadata?.text?.substring(0, 150))
        }

        if (!searchResult.success || searchResult.matches.length === 0) {
            console.log('❌ No matches found in Pinecone')
            return NextResponse.json({
                response: 'I don\'t have enough information in my knowledge base to answer that question. Please ask about topics covered in the available documents.',
            })
        }

        // Extract relevant context from search results (without metadata)
        const context = searchResult.matches
            .map((match) => match.metadata?.text || '')
            .filter(text => text.length > 0)
            .join('\n\n---\n\n')

        // Build the prompt with context (no source attribution)
        const prompt = `Context information from knowledge base:
${context}

User question: ${message}

Provide a COMPREHENSIVE and PRECISE answer based ONLY on the context above.
- Synthesize the information: If the context provides different values (e.g., 50% vs 90%), EXPLAIN the specific scenario for each (e.g., machine type, material).
- Extract ALL relevant details, steps, and technical parameters.
- STRICTLY PLAIN TEXT: Do NOT use markdown (**bold**, *italics*, # headers). Use plain text numbering (1., 2.) and indentation.`

        // Generate response using LLM with enhanced privacy system prompt
        const aiResponse = await generateChatResponse(prompt, {
            systemPrompt: `You are an expert AI assistant for fiber to yarn technology and processes. Follow these rules:

CONTENT RULES:
- Answer ONLY based on the provided context
- Contextualize Data: If numbers conflict, explain WHY (e.g., "Standard card: 50%, High-Production card: 90%").
- Be EXHAUSTIVE: List all relevant details found in the 35 chunks of context.

FORMATTING RULES (STRICT):
- OUTPUT MUST BE PLAIN TEXT ONLY.
- NO MARKDOWN **bold**.
- NO MARKDOWN # headers.
- NO MARKDOWN *italics*.
- Use "Step 1:" or "1." for structure.
- Use indentation for sub-points.

PRIVACY RULES:
- NEVER mention document names, filenames, or sources.
- Present information naturally as your own knowledge.`,
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
