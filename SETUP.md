# 🚀 Setup Guide for SpinWisely AI

This guide will walk you through setting up the complete AI chatbot system.

## Prerequisites

✅ **Already Completed:**
- Node.js and npm installed
- Project dependencies installed
- Development server running

## Required Setup Steps

### 1. Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name it "SpinWisely AI"
   - Disable Google Analytics (optional)

2. **Enable Authentication:**
   - In Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"
   - Click Save

3. **Create Firestore Database:**
   - In Firebase Console → Firestore Database
   - Click "Create database"
   - Choose "Production mode"
   - Select your preferred location

4. **Enable Storage:**
   - In Firebase Console → Storage
   - Click "Get started"
   - Use default security rules for now

5. **Get Configuration:**
   - Firebase Console → Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the configuration

6. **Update `.env` file:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. HuggingFace Setup

1. **Get API Token:**
   - Go to [HuggingFace](https://huggingface.co/)
   - Sign up or log in
   - Go to Settings → Access Tokens
   - Create new token with "Read" permission
   - Copy the token

2. **Update `.env` file:**
   ```env
   HUGGINGFACE_API_TOKEN=hf_your_token_here
   ```

### 3. Pinecone Setup

1. **Create Account:**
   - Go to [Pinecone](https://www.pinecone.io/)
   - Sign up for free account

2. **Create Index:**
   - Click "Create Index"
   - Name: `spinwisely-ai-docs`
   - Dimensions: `384`
   - Metric: `cosine`
   - Cloud: Free tier (Starter)

3. **Get API Credentials:**
   - Go to API Keys section
   - Copy your API key and environment

4. **Update `.env` file:**
   ```env
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_environment
   PINECONE_INDEX_NAME=spinwisely-ai-docs
   ```

### 4. Create `.env` File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then fill in all the values from steps 1-3 above.

### 5. Create Your Admin Account

1. Restart the dev server after adding environment variables
2. Go to http://localhost:3000
3. Click "Sign up" and create your account
4. Open Firebase Console → Firestore Database
5. Find your user document in the `users` collection
6. Edit the document and change `role` from `user` to `admin`

## Testing the Application

### Test Authentication:
1. Visit http://localhost:3000
2. Sign up with your email
3. Should redirect to /chat automatically

### Test Chat (after Firebase/HuggingFace/Pinecone setup):
1. Sign in
2. Go to chat interface
3. Ask a question (will fail until you upload documents)

### Test Document Upload (Admin only):
1. Sign in as admin
2. Go to http://localhost:3000/admin/documents
3. Upload a PDF, Word, or text file
4. Wait for processing
5. Go back to chat and ask questions about the document

## Troubleshooting

### Authentication not working:
- Check that Firebase credentials are correct in `.env`
- Restart the dev server after changing `.env`
- Check browser console for errors

### Upload fails:
- Verify HuggingFace API token is valid
- Check Pinecone credentials
- Ensure index name matches exactly: `spinwisely-ai-docs`
- Check file size is under 100MB

### Chat doesn't respond:
- Make sure you've uploaded at least one document
- Verify all API keys are configured
- Check browser console and terminal for errors

## Next Steps

Once everything is set up:

1. ✅ Upload your industry-credible documents
2. ✅ Test the chat with various questions
3. ✅ Create additional user accounts
4. ✅ Review activity logs in admin dashboard
5. ✅ Configure deployment to Cloudflare Pages (see deployment guide)

## Support

If you encounter issues:
- Check the terminal for error messages
- Review browser console (F12)
- Verify all API keys are correct
- Ensure Firebase, HuggingFace, and Pinecone services are active
