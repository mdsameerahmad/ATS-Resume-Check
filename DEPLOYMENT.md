# Deployment Guide

## Vercel dashboard

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New > Project** and import the repository.
3. Vercel detects Vite automatically. Confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Deploy. No environment variables, backend, or API keys are required.

## Vercel CLI

```bash
npm install
npm run build
npx vercel
npx vercel --prod
```

## Pre-deployment checks

```bash
npm run lint
npm run build
npm run preview
```

The application is a static client-side SPA. Resume files are parsed locally and are never uploaded.
