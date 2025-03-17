# Secure Deployment Guide for Event Master

This guide explains how to securely deploy Event Master to Vercel without exposing server-side code.

## Security Notice

If you're seeing server code exposed in your deployed application (such as seeing imports from server files in your browser), this indicates a security issue that needs to be fixed immediately.

## Correct Deployment Process

### 1. Project Structure

Ensure your project follows this structure:
- `/api` - Serverless API functions (these will be deployed to Vercel)
- `/client` - Frontend React code
- `/server` - Server code (should NOT be deployed)
- `/shared` - Shared types (only types should be used, not implementation)

### 2. Deployment Preparation

1. **Use the dedicated deployment script**:
   ```bash
   # Make the script executable (on Unix systems)
   chmod +x vercel-deploy.sh
   
   # Run the deployment script
   ./vercel-deploy.sh
   ```

2. **Verify the build output**:
   Check the `dist` directory to make sure no server code has been included.

### 3. Environment Variables

Make sure to set up these environment variables in the Vercel dashboard:
- `JWT_SECRET`: A secure random string for JWT tokens

### 4. Deployment

Run the deployment command:
```bash
vercel --prod
```

### 5. Post-Deployment Verification

After deployment, check for these security issues:
1. Navigate to your deployed site
2. Verify you cannot access server files by attempting URLs like:
   - `https://your-site.vercel.app/server/index.ts`
   - `https://your-site.vercel.app/server/storage.ts`
3. Check the Network tab in DevTools to ensure no server files are being loaded

## Troubleshooting

If you still see server code exposed:

1. **Check build configuration**:
   - Make sure you're not including server files in the build output
   - Verify `.vercelignore` is properly set up

2. **Update Vercel project settings**:
   - In the Vercel dashboard, go to your project settings
   - Under "Build & Development Settings", make sure:
     - Build Command is set to `npm run vercel-build`
     - Output Directory is set to `dist`
     - Include source files is set to OFF

3. **Force redeployment**:
   - Delete the existing deployment
   - Run `vercel --prod` again with the correct settings

## Security Best Practices

- Never expose your server code to the client
- Store all secrets as environment variables
- Use JWT tokens instead of session cookies
- Implement proper authentication in all API routes
- Follow the principle of least privilege for all operations

## Support

If you continue to experience issues, check the Vercel documentation or contact support. 