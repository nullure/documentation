---
title: Cloud Deployment | OpenMemory
description: Deploy OpenMemory to cloud providers like Vercel, Railway, and Render.
keywords: vercel deployment, railway deployment, render deployment, cloud memory
---

# Cloud Deployment

## Railway

1.  Fork the [OpenMemory Repository](https://github.com/caviraoss/openmemory).
2.  Login to Railway.
3.  Click "New Project" > "Deploy from GitHub repo".
4.  Select your fork.
5.  Add a Volume for `/app/data` to ensure persistence.

## Render

1.  Create a new "Web Service".
2.  Connect your repo.
3.  Runtime: `Node`.
4.  Build Command: `npm install && npm run build`.
5.  Start Command: `npm start`.
6.  Add a "Disk" attached to `/app/data`.

## Vercel (Client Only)

You cannot deploy the *Backend Server* to Vercel (it requires a persistent process). However, you can use the **Standalone Mode** directly in your Vercel Next.js apps.

See [Vercel AI SDK Integration](/docs/integrations/vercel-ai).
