# 🚨 VERCEL DEPLOYMENT TROUBLESHOOTING

## DEPLOYMENT_NOT_FOUND Error

If you're getting `DEPLOYMENT_NOT_FOUND`, this means the Vercel deployment failed during the build process. Follow these steps:

### Step 1: Check Your Vercel Project Configuration

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to **Settings** → **General**
4. Verify these settings:

```
Framework Preset: Other
Root Directory: backend
Build Command: npm run build
Output Directory: (leave empty)
Install Command: npm install
Development Command: npm run dev
```

### Step 2: Check Build Logs

1. Go to **Deployments** tab
2. Click on the failed deployment
3. Check the **Build Logs** for specific errors
4. Look for:
   - Missing dependencies
   - File not found errors
   - Environment variable issues

### Step 3: Common Fixes

#### Fix 1: Redeploy from GitHub

1. Make sure all changes are committed and pushed to GitHub
2. Go to Vercel dashboard → Your project
3. Click **Settings** → **Git**
4. Click **Redeploy** or trigger a new deployment

#### Fix 2: Clear Build Cache

1. Go to your project in Vercel
2. **Settings** → **Functions**
3. Clear any existing function cache
4. Redeploy

#### Fix 3: Check File Structure

Make sure your backend folder has this structure:

```
backend/
├── api/
│   └── index.js          ← This file must exist!
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── clientRoutes.js
│   └── invoiceRoutes.js
├── models/
├── middleware/
├── package.json
├── vercel.json
└── server.js
```

#### Fix 4: Environment Variables

Ensure these are set in Vercel dashboard:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

#### Fix 5: Dependencies Issue

If you get dependency errors, try this package.json:

```json
{
  "name": "fromagerie-invoice-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "api/index.js",
  "scripts": {
    "build": "echo 'Build completed'",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Step 4: Alternative Deployment Method

If the above doesn't work, try this:

1. **Delete the Vercel project** (Settings → Advanced → Delete Project)
2. **Create a new project** from GitHub
3. **Select the backend folder** as root directory
4. **Set environment variables** again
5. **Deploy**

### Step 5: Manual Deployment Check

Test locally first:

```bash
cd backend
npm install
npm run build
node api/index.js
```

### Step 6: Simplified vercel.json

If still having issues, use this minimal vercel.json:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

## Other Common Vercel Errors

### BUILD_FAILED

- Check package.json syntax
- Verify all dependencies are listed
- Check for TypeScript errors

### FUNCTION_INVOCATION_FAILED

- Check environment variables
- Verify database connection string
- Check for runtime errors in code

### ROUTE_NOT_FOUND

- Verify vercel.json routes configuration
- Check that api/index.js exists
- Ensure proper export in serverless function

## Emergency Deployment Steps

If nothing else works:

1. Create a new repository
2. Copy only the essential files:
   - api/index.js
   - routes/
   - models/
   - middleware/
   - package.json
   - vercel.json
3. Deploy the new repository
4. Gradually add back other files

## Getting Help

If you're still stuck:

1. Check the exact error message in Vercel build logs
2. Copy the error and search for it
3. Join the Vercel Discord for real-time help
4. Check Vercel documentation for Node.js serverless functions
