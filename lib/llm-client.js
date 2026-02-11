import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Default models
const CHAT_MODEL = 'gpt-3.5-turbo'
const EMBEDDING_MODEL = 'text-embedding-3-small' // Cheapest and good quality

/**
 * Generate a chat completion using OpenAI
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - The generated response
 */
export async function generateChatResponse(prompt, options = {}) {
    try {
        const {
            model = CHAT_MODEL,
            temperature = 0.7,
            maxTokens = 1024,
            systemPrompt = 'You are a helpful AI assistant that answers questions based only on the provided context. If the answer is not in the context, say "I cannot find that information in the documents."'
        } = options

        const response = await openai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature,
            max_tokens: maxTokens,
        })

        return {
            success: true,
            text: response.choices[0].message.content.trim(),
        }
    } catch (error) {
        console.error('Error generating chat response:', error)
        return {
            success: false,
            error: error.message,
            text: 'Sorry, I encountered an error generating a response.',
        }
    }
}

/**
 * Generate embeddings for text using OpenAI
 * @param {string} text - Text to embed
 * @param {Object} options - Additional options
 * @returns {Promise<Array<number>>} - The embedding vector
 */
export async function generateEmbedding(text, options = {}) {
    try {
        const { model = EMBEDDING_MODEL } = options

        const response = await openai.embeddings.create({
            model,
            input: text,
        })

        return {
            success: true,
            embedding: response.data[0].embedding,
        }
    } catch (error) {
        console.error('Error generating embedding:', error)
        return {
            success: false,
            error: error.message,
            embedding: null,
        }
    }
}

/**
 * Generate embeddings for multiple texts (batch processing)
 * @param {Array<string>} texts - Array of texts to embed
 * @param {Object} options - Additional options
 * @returns {Promise<Array<Array<number>>>} - Array of embedding vectors
 */
export async function generateEmbeddingsBatch(texts, options = {}) {
    try {
        const embeddings = await Promise.all(
            texts.map(text => generateEmbedding(text, options))
        )

        const successfulEmbeddings = embeddings
            .filter(result => result.success)
            .map(result => result.embedding)

        return {
            success: true,
            embeddings: successfulEmbeddings,
        }
    } catch (error) {
        console.error('Error generating embeddings batch:', error)
        return {
            success: false,
            error: error.message,
            embeddings: [],
        }
    }
}

/**
 * Test the HuggingFace API connection
 * @returns {Promise<boolean>} - True if connection successful
 */
export async function testConnection() {
    try {
        const result = await generateEmbedding('test')
        return result.success
    } catch (error) {
        console.error('HuggingFace connection test failed:', error)
        return false
    }
}
