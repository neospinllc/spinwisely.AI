// HuggingFace API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models' // Using inference API
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN

// Default models
const CHAT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'
const EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'

/**
 * Generate a chat completion using HuggingFace
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

        const fullPrompt = `${systemPrompt}

${prompt}

Answer:`

        const response = await fetch(`${HF_API_URL}/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: maxTokens,
                    temperature,
                    top_p: 0.95,
                    repetition_penalty: 1.2,
                    return_full_text: false,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data[0]?.generated_text || data.generated_text || ''

        return {
            success: true,
            text: text.trim(),
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
 * Generate embeddings for text using HuggingFace
 * @param {string} text - Text to embed
 * @param {Object} options - Additional options
 * @returns {Promise<Array<number>>} - The embedding vector
 */
export async function generateEmbedding(text, options = {}) {
    try {
        const { model = EMBEDDING_MODEL } = options

        const response = await fetch(`${HF_API_URL}/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: text,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HuggingFace API error: ${response.statusText} - ${errorText}`)
        }

        const embedding = await response.json()

        return {
            success: true,
            embedding: Array.isArray(embedding) ? embedding : Array.from(embedding),
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
