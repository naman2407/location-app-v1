# Dev Server Webpack Chunk Error Fix

If you encounter the error `Cannot find module './819.js'` or similar webpack chunk errors:

## Quick Fix

1. **Stop the dev server** (Ctrl+C)

2. **Clean the cache:**
   ```bash
   npm run clean
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Alternative: Clean Start

Use the clean dev command:
```bash
npm run dev:clean
```

This automatically cleans the cache before starting the dev server.

## Why This Happens

This error occurs when Next.js webpack chunks become stale after code changes. The dev server's hot module replacement (HMR) can sometimes fail to properly update chunks, especially after:
- Large refactoring
- Adding/removing dependencies
- Changing import paths
- Server/client component boundary changes

## Prevention

- Always stop the dev server cleanly (Ctrl+C) before making major changes
- Use `npm run clean` if you see any webpack-related errors
- The webpack config has been updated to use deterministic chunk IDs to reduce this issue

