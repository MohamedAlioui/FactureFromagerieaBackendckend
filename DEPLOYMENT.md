# Vercel Deployment Guide

## Quick Setup

### 1. Environment Variables in Vercel Dashboard

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fromagerie-invoice?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Vercel Project Settings

- **Framework Preset**: Other
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 3. Domain Configuration

After deployment, your API will be available at:

- `https://your-backend-domain.vercel.app/api/health`
- `https://your-backend-domain.vercel.app/api/auth/login`
- etc.

### 4. Update Frontend API URL

Update your frontend's environment variable:

```
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
```

## File Structure Created

```
backend/
├── api/
│   └── index.js          # Serverless function entry point
├── package.json          # Dependencies for backend
├── vercel.json           # Vercel configuration
├── env.example           # Environment variables template
├── DEPLOYMENT.md         # This file
└── README.md             # Complete documentation
```

## Testing After Deployment

1. Test health endpoint: `GET https://your-domain.vercel.app/api/health`
2. Test CORS: Make a request from your frontend
3. Test authentication: `POST https://your-domain.vercel.app/api/auth/login`

## Common Issues

- **Function timeout**: Increase `maxDuration` in vercel.json
- **CORS errors**: Set correct `FRONTEND_URL` environment variable
- **Database connection**: Ensure MongoDB Atlas allows connections from 0.0.0.0/0
