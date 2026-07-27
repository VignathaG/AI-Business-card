# AI Business Card — Vignatha

Personal portfolio + AI chatbot that answers questions about me, built with Azure OpenAI + Azure Static Web Apps + Azure Functions.

## Files
- `index.html`, `style.css`, `script.js` — the site + chat UI
- `api/src/functions/chat.js` — the Azure Function that calls Azure OpenAI
- `staticwebapp.config.json` — routes `/api/*` for the function
- `.github/workflows/...yml` — auto-deploy workflow (created by Azure Portal when you connect GitHub)

## Before you deploy — fill in this placeholder
- `index.html` → project "Live Demo" buttons currently link to `#` — replace with your real deployed URLs (Bailer, AskMyDocs, etc.) once you have them

## Deploy steps (matches your Azure for Students setup — use mentor's shared Azure OpenAI credentials, not your own subscription)

1. **Push this to GitHub**
   ```
   git init
   git add .
   git commit -m "AI business card"
   git branch -M main
   git remote add origin https://github.com/VignathaG/ai-business-card.git
   git push -u origin main
   ```

2. **Create the Static Web App**
   - Go to portal.azure.com → Create a resource → Static Web App
   - Plan type: **Free**
   - Deployment source: **GitHub** → sign in, pick this repo, branch `main`
   - Build details:
     - App location: `/`
     - Api location: `api`
     - Output location: *(leave blank)*
   - Click Create. Azure will auto-commit a GitHub Actions workflow file to your repo (like the one already in `.github/workflows`) and deploy automatically.

3. **Add environment variables** (use your mentor's shared Azure OpenAI credentials — same as Session 5/6)
   - Go to your Static Web App → Settings → **Environment variables** (or **Configuration**)
   - Add:
     - `AZURE_OPENAI_KEY`
     - `AZURE_OPENAI_ENDPOINT`
     - `AZURE_OPENAI_DEPLOYMENT`
     - `AZURE_OPENAI_API_VERSION` → `2024-12-01-preview`
   - Save (this may trigger a redeploy — that's normal)

4. **Wait ~2 minutes**, then open the URL shown on the Static Web App's Overview page.

## Test locally first (optional but recommended)
```
npm install -g @azure/static-web-apps-cli
cd api && npm install && cd ..
```
Create `.env` in the root with the same 4 variables as above, then:
```
swa start --app-location . --api-location api
```
Open `http://localhost:4280`

## If Static Web Apps fails again
Your Azure for Students subscription has blocked Static Web Apps / region-restricted resources before (Smart Image Tagger, AskMyDocs). If this session hits the same wall:
- Fallback: deploy `index.html`/`style.css`/`script.js` to Vercel as a static site, and rewrite `api/src/functions/chat.js` as a Vercel serverless function (same pattern used for Smart Image Tagger). Ask me and I'll convert it.
