import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'SpinWisely AI - Document-Based Chatbot',
    description: 'AI chatbot that answers questions exclusively from your uploaded documents',
    keywords: ['AI', 'chatbot', 'documents', 'RAG', 'knowledge base'],
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
