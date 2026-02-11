import { Pinecone } from '@pinecone-database/pinecone'

// Initialize Pinecone
let pineconeClient = null

function getPineconeClient() {
    if (!pineconeClient) {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        })
    }
    return pineconeClient
}

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'spinwisely-ai-docs'

/**
 * Initialize Pinecone index
 * @returns {Promise<Object>} - Pinecone index instance
 */
export async function getIndex() {
    try {
        const client = getPineconeClient()
        const index = client.index(INDEX_NAME)
        return { success: true, index }
    } catch (error) {
        console.error('Error connecting to Pinecone:', error)
        return { success: false, error: error.message, index: null }
    }
}

/**
 * Upsert vectors to Pinecone
 * @param {Array} vectors - Array of {id, values, metadata}
 * @returns {Promise<Object>} - Result of upsert operation
 */
export async function upsertVectors(vectors) {
    try {
        const { index } = await getIndex()
        if (!index) throw new Error('Failed to connect to Pinecone index')

        await index.upsert(vectors)

        return {
            success: true,
            count: vectors.length,
        }
    } catch (error) {
        console.error('Error upserting vectors:', error)
        return {
            success: false,
            error: error.message,
        }
    }
}

/**
 * Query Pinecone for similar vectors
 * @param {Array<number>} queryVector - The query embedding
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Query results
 */
export async function queryVectors(queryVector, options = {}) {
    try {
        const {
            topK = 5,
            filter = {},
            includeMetadata = true,
            includeValues = false,
        } = options

        const { index } = await getIndex()
        if (!index) throw new Error('Failed to connect to Pinecone index')

        const queryResponse = await index.query({
            vector: queryVector,
            topK,
            filter,
            includeMetadata,
            includeValues,
        })

        return {
            success: true,
            matches: queryResponse.matches || [],
        }
    } catch (error) {
        console.error('Error querying vectors:', error)
        return {
            success: false,
            error: error.message,
            matches: [],
        }
    }
}

/**
 * Delete vectors from Pinecone
 * @param {Array<string>} ids - IDs to delete
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteVectors(ids) {
    try {
        const { index } = await getIndex()
        if (!index) throw new Error('Failed to connect to Pinecone index')

        await index.deleteMany(ids)

        return {
            success: true,
            count: ids.length,
        }
    } catch (error) {
        console.error('Error deleting vectors:', error)
        return {
            success: false,
            error: error.message,
        }
    }
}

/**
 * Delete all vectors for a specific document
 * @param {string} documentId - Document ID to delete
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteDocumentVectors(documentId) {
    try {
        const { index } = await getIndex()
        if (!index) throw new Error('Failed to connect to Pinecone index')

        await index.deleteMany({
            filter: { documentId },
        })

        return {
            success: true,
        }
    } catch (error) {
        console.error('Error deleting document vectors:', error)
        return {
            success: false,
            error: error.message,
        }
    }
}

/**
 * Get index statistics
 * @returns {Promise<Object>} - Index stats
 */
export async function getIndexStats() {
    try {
        const { index } = await getIndex()
        if (!index) throw new Error('Failed to connect to Pinecone index')

        const stats = await index.describeIndexStats()

        return {
            success: true,
            stats,
        }
    } catch (error) {
        console.error('Error getting index stats:', error)
        return {
            success: false,
            error: error.message,
            stats: null,
        }
    }
}
