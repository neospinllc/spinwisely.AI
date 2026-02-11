import pdf from 'pdf-parse'
import mammoth from 'mammoth'
import * as xlsx from 'xlsx'

/**
 * Parse PDF files
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parsePDF(buffer) {
    try {
        const data = await pdf(buffer)
        return {
            success: true,
            text: data.text,
            pages: data.numpages,
        }
    } catch (error) {
        console.error('PDF parsing error:', error)
        return {
            success: false,
            error: error.message,
            text: '',
        }
    }
}

/**
 * Parse Word documents (.docx)
 * @param {Buffer} buffer - Word file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parseWord(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer })
        return {
            success: true,
            text: result.value,
            warnings: result.messages,
        }
    } catch (error) {
        console.error('Word parsing error:', error)
        return {
            success: false,
            error: error.message,
            text: '',
        }
    }
}

/**
 * Parse Excel files (.xlsx, .xls)
 * @param {Buffer} buffer - Excel file buffer
 * @returns {Promise<string>} - Extracted text from all sheets
 */
export async function parseExcel(buffer) {
    try {
        const workbook = xlsx.read(buffer, { type: 'buffer' })
        let allText = ''

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName]
            const sheetText = xlsx.utils.sheet_to_csv(sheet)
            allText += `\n\n=== Sheet: ${sheetName} ===\n${sheetText}`
        })

        return {
            success: true,
            text: allText.trim(),
            sheets: workbook.SheetNames,
        }
    } catch (error) {
        console.error('Excel parsing error:', error)
        return {
            success: false,
            error: error.message,
            text: '',
        }
    }
}

/**
 * Parse text files
 * @param {Buffer} buffer - Text file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parseText(buffer) {
    try {
        const text = buffer.toString('utf-8')
        return {
            success: true,
            text,
        }
    } catch (error) {
        console.error('Text parsing error:', error)
        return {
            success: false,
            error: error.message,
            text: '',
        }
    }
}

/**
 * Parse PowerPoint files (.pptx)
 * Note: This is a basic implementation using the Open XML format
 * @param {Buffer} buffer - PowerPoint file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parsePowerPoint(buffer) {
    try {
        // For now, return a placeholder
        // In production, you'd use a library like officegen or pptx-parser
        return {
            success: false,
            error: 'PowerPoint parsing not yet implemented. Please use PDF export of your slides.',
            text: '',
        }
    } catch (error) {
        console.error('PowerPoint parsing error:', error)
        return {
            success: false,
            error: error.message,
            text: '',
        }
    }
}

/**
 * Parse document based on file type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type of the file
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} - Parse result with text content
 */
export async function parseDocument(buffer, mimeType, filename) {
    const ext = filename.split('.').pop().toLowerCase()

    switch (ext) {
        case 'pdf':
            return await parsePDF(buffer)

        case 'doc':
        case 'docx':
            return await parseWord(buffer)

        case 'xls':
        case 'xlsx':
            return await parseExcel(buffer)

        case 'txt':
        case 'md':
        case 'csv':
            return await parseText(buffer)

        case 'ppt':
        case 'pptx':
            return await parsePowerPoint(buffer)

        default:
            return {
                success: false,
                error: `Unsupported file type: ${ext}. Supported formats: PDF, Word, Excel, Text, PowerPoint`,
                text: '',
            }
    }
}

/**
 * Split text into chunks for embedding
 * @param {string} text - Text to chunk
 * @param {number} chunkSize - Maximum chunk size in characters
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<string>} - Array of text chunks
 */
export function chunkText(text, chunkSize = 1000, overlap = 200) {
    const chunks = []
    let start = 0

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length)
        const chunk = text.slice(start, end).trim()

        if (chunk.length > 0) {
            chunks.push(chunk)
        }

        start += chunkSize - overlap
    }

    return chunks
}
