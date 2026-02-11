# 🌐 Deployment Guide - Cloudflare Pages

This guide covers deploying your SpinWisely AI application to Cloudflare Pages.

## Important Note About Architecture

Since we're using:
- **Next.js API routes** (server-side)
- **Firebase** (client and server-side)
- **Vector search and AI processing** (server-side)

We have two deployment options:

## Option 1: Vercel (Recommended for This App)

Vercel is the easiest option because it's built for Next.js and handles API routes automatically.

### Steps:

1. **Push to GitHub** (already done ✅)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your `spinwisely.AI` repository

3. **Configure Environment Variables:**
   - In project settings → Environment Variables
   - Add all your `.env` variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     HUGGINGFACE_API_TOKEN
     PINECONE_API_KEY
     PINECONE_ENVIRONMENT
     PINECONE_INDEX_NAME
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `your-project.vercel.app`

5. **Custom Domain (Optional):**
   - Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Option 2: Cloudflare Pages  (Requires Refactoring)

Cloudflare Pages with Workers is possible but requires architectural changes:

### Required Changes:

1. **Split Backend to Cloudflare Workers:**
   - Move API routes (`/app/api/*`) to separate Workers
   - Use Cloudflare Workers for document processing
   - Set up Workers KV or R2 for file storage

2. **Convert to Static Export:**
   - Use `output: 'export'` in next.config.js
   - All dynamic routes become client-side
   - API calls go to separate Worker endpoints

3. **Environment Setup:**
   - Use Cloudflare Pages environment variables
   - Configure Workers environment variables separately
   - Use Workers Secrets for API keys

### Basic Steps (if you choose this path):

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Create Cloudflare Workers for APIs:
   ```bash
   wrangler init spinwisely-workers
   ```

3. Deploy Workers:
   ```bash
   wrangler publish
   ```

4. Update Next.js to call Worker URLs

5. Deploy to Cloudflare Pages:
   ```bash
   npm run build
   wrangler pages publish out
   ```

## Recommendation

**Use Vercel** for this application because:
- ✅ Zero configuration needed
- ✅ API routes work out of the box
- ✅ Automatic HTTPS and CDN
- ✅ Free tier is generous
- ✅ Built specifically for Next.js
- ✅ Great developer experience

Cloudflare Pages is excellent for static sites, but adds complexity for this full-stack app.

## Free Tier Limits

### Vercel Free:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Custom domains
- **Perfect for ~1000 users**

### If you need Cloudflare:
We can refactor the architecture to use:
- Cloudflare Pages (frontend)
- Cloudflare Workers (backend APIs)
- Cloudflare R2 (file storage)

Let me know if you want me to implement the Cloudflare-specific architecture!

## Post-Deployment Checklist

After deploying to either platform:

1. ✅ Test authentication (sign up/sign in)
2. ✅ Upload test documents
3. ✅ Test chat functionality
4. ✅ Verify admin dashboard access
5. ✅ Check activity logs
6. ✅ Test file deletion
7. ✅ Verify mobile responsiveness

## Monitoring

### Vercel:
- Built-in analytics dashboard
- Real-time logs
- Performance monitoring

### Firebase:
- Authentication logs
- Firestore usage metrics
- Storage usage

### Pinecone:
- Vector count
- Query metrics
- Index statistics

## Scaling Considerations

Your application should handle:
- ✅ ~1000 users
- ✅ ~150 documents (up to 100MB each)
- ✅ 5GB total storage

All within free tiers of:
- Vercel (or Cloudflare)
- Firebase
- Pinecone
- HuggingFace
