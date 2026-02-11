# SpinWisely AI - Document-Based Chatbot

An AI-powered chatbot that answers questions exclusively from your uploaded documents, with user authentication, admin controls, and activity tracking.

## Features

- 🤖 **AI Chat**: Answers questions only from your uploaded documents
- 📄 **Multi-Format Support**: PDF, Word, PowerPoint, Excel, and text files
- 🔐 **Authentication**: Secure user login and registration
- 👥 **User Management**: Admin dashboard to manage users and access
- 📊 **Activity Logging**: Track who logged in and what they asked
- 🔒 **Fine-Grained Permissions**: Control who can access which documents
- 🌍 **Multi-Language**: Support for multiple languages
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **AI**: HuggingFace Inference API (Mistral-7B)
- **Vector Database**: Pinecone
- **Hosting**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- HuggingFace account (free tier)
- Pinecone account (free tier)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/neospinllc/spinwisely.AI.git
cd spinwisely.AI
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy the environment file and fill in your credentials:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your config to `.env`

5. Set up HuggingFace:
   - Get a free API token at https://huggingface.co/settings/tokens
   - Add it to `.env`

6. Set up Pinecone:
   - Create a free account at https://www.pinecone.io
   - Create an index named `spinwisely-ai-docs`
   - Copy your API key to `.env`

7. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

Deploy to Cloudflare Pages:

\`\`\`bash
npm run pages:build
npm run pages:deploy
\`\`\`

## Project Structure

\`\`\`
spinwisely.AI/
├── app/                  # Next.js App Router pages
│   ├── layout.js         # Root layout
│   ├── page.js           # Landing/login page
│   ├── chat/             # Chat interface
│   └── admin/            # Admin dashboard
├── components/           # React components
│   ├── ChatInterface.jsx
│   ├── DocumentUploader.jsx
│   └── ...
├── lib/                  # Utility functions
│   ├── firebase.js       # Firebase config
│   ├── rag-engine.js     # AI logic
│   └── ...
├── public/               # Static assets
└── styles/               # Global styles
\`\`\`

## Usage

### For Users
1. Register/login with your email
2. Start chatting with the AI
3. The AI will answer based on uploaded documents

### For Admins
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. Upload documents
4. Manage users and permissions
5. View activity logs

## License

Proprietary - © 2026 NeoSpin LLC

## Support

For support, email support@spinwisely.com
