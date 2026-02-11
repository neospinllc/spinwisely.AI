# SpinWisely AI - Industry Knowledge Chatbot 🤖

An AI-powered chatbot that answers questions exclusively from admin-curated, industry-credible documents. Built with Next.js, Firebase, and state-of-the-art AI technologies.

## ✨ Features

### For Users:
- ✅ **Real-time Chat Interface** - Beautiful, responsive chat UI
- ✅ **Industry-Credible Answers** - Responses based solely on uploaded documents
- ✅ **Secure Authentication** - Email/password login with Firebase
- ✅ **No Source Leakage** - Answers don't reveal which documents were used

### For Admins:
- ✅ **Document Management** - Upload and manage PDF, Word, Excel, text files
- ✅ **Automatic Processing** - Documents are parsed, chunked, and embedded automatically
- ✅ **User Management** - View and manage user accounts
- ✅ **Activity Logs** - Track user questions and system usage
- ✅ **Dashboard Analytics** - Overview of documents, users, and queries

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **AI/ML**: HuggingFace Inference API
- **Vector Database**: Pinecone
- **Deployment**: Vercel (recommended) or Cloudflare Pages

## 📁 Project Structure

```
spinwisely.AI/
├── app/
│   ├── page.js                    # Landing page with auth
│   ├── chat/page.js               # User chat interface
│   ├── admin/page.js              # Admin dashboard
│   ├── admin/documents/page.js    # Document management
│   └── api/
│       ├── chat/route.js          # RAG chat endpoint
│       └── documents/upload/route.js  # Document processing
├── lib/
│   ├── firebase.js                # Firebase config
│   ├── firestore.js               # Firestore utilities
│   ├── llm-client.js              # HuggingFace integration
│   ├── vector-store.js            # Pinecone integration
│   ├── document-parser.js         # Document parsing
│   └── auth-context.js            # Auth provider
├── SETUP.md                       # Setup instructions
└── DEPLOYMENT.md                  # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- HuggingFace account  
- Pinecone account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/neospinllc/spinwisely.AI.git
cd spinwisely.AI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Follow the detailed setup guide in `SETUP.md` to configure:
   - Firebase (authentication, database, storage)
   - HuggingFace API token
   - Pinecone vector database

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions for all services
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide for Vercel or Cloudflare

## 🎯 Usage

### For Users:
1. Sign up or log in at the landing page
2. Start chatting with the AI about the available documents
3. Ask specific questions to get accurate, document-based answers

### For Admins:
1. Sign in with admin account
2. Navigate to `/admin/documents` to upload new documents
3. Supported formats: PDF, Word (.docx), Excel (.xlsx), Text, CSV, Markdown
4. View dashboard at `/admin` for analytics and user management

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# HuggingFace
HUGGINGFACE_API_TOKEN=

# Pinecone
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=spinwisely-ai-docs
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Recommended:** Deploy to Vercel for zero-config deployment.

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the repository owner for contribution guidelines.

## 📧 Contact

For questions or support, contact neospinllc
