'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Trash2, Loader2, Check, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DocumentManagement() {
    const [documents, setDocuments] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [loading, setLoading] = useState(true)
    const fileInputRef = useRef(null)

    // Fetch documents on mount
    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await fetch('/api/documents')
                if (response.ok) {
                    const data = await response.json()
                    setDocuments(data.documents.map(doc => ({
                        id: doc.id,
                        name: doc.filename, // Map filename to name
                        size: doc.size,
                        chunks: doc.chunksCount, // Map chunksCount to chunks
                        uploadedAt: new Date(doc.uploadedAt.seconds * 1000), // Convert Firestore Timestamp
                    })))
                }
            } catch (error) {
                console.error('Error fetching documents:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDocuments()
    }, [])

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        setUploading(true)

        for (const file of files) {
            const fileId = Math.random().toString(36).substring(7)

            setUploadProgress(prev => ({
                ...prev,
                [fileId]: { name: file.name, progress: 0, status: 'uploading' }
            }))

            try {
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/documents/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const data = await response.json()
                    setUploadProgress(prev => ({
                        ...prev,
                        [fileId]: { ...prev[fileId], progress: 100, status: 'success', documentId: data.id }
                    }))

                    // Add to documents list
                    setDocuments(prev => [...prev, {
                        id: data.id,
                        name: file.name,
                        size: file.size,
                        uploadedAt: new Date(),
                        chunks: data.chunks || 0,
                    }])
                } else {
                    setUploadProgress(prev => ({
                        ...prev,
                        [fileId]: { ...prev[fileId], status: 'error', error: 'Upload failed' }
                    }))
                }
            } catch (error) {
                console.error('Upload error:', error)
                setUploadProgress(prev => ({
                    ...prev,
                    [fileId]: { ...prev[fileId], status: 'error', error: error.message }
                }))
            }
        }

        setUploading(false)

        // Clear progress after 3 seconds
        setTimeout(() => {
            setUploadProgress({})
        }, 3000)
    }

    const handleDelete = async (documentId) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setDocuments(prev => prev.filter(doc => doc.id !== documentId))
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete document')
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin">
                        <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Upload and manage industry-credible documents for the AI knowledge base</p>
                </div>

                {/* Upload Area */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-8">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,.md"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="text-center">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Documents</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Supported formats: PDF, Word, Excel, Text, CSV, Markdown
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {uploading ? 'Uploading...' : 'Choose Files'}
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                        <div className="mt-6 space-y-3">
                            {Object.entries(uploadProgress).map(([id, file]) => (
                                <div key={id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {file.status === 'uploading' && `${file.progress}%`}
                                            </span>
                                        </div>
                                        {file.status === 'uploading' && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${file.progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {file.status === 'success' && <Check className="w-5 h-5 text-green-500" />}
                                    {file.status === 'error' && <X className="w-5 h-5 text-red-500" />}
                                    {file.status === 'uploading' && <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Documents List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Uploaded Documents ({documents.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
                            <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Upload your first document to get started</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatFileSize(doc.size)} • {doc.chunks} chunks • Uploaded {doc.uploadedAt.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
