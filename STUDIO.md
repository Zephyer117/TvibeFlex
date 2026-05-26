# Sanity Studio access

The storefront and CMS admin run separately for faster builds.

## Local development (recommended)

```bash
npm run studio
```

Opens at **http://localhost:3333**

Run the shop in another terminal:

```bash
npm run dev
```

→ **http://localhost:3000**

## Hosted studio (production) — share this with clients

**https://tvibeflex.sanity.studio**

Sign in with a Google account that is invited to project **3tavxqc3**.

To redeploy after schema changes:

```bash
npm run studio:deploy
```

Also available from [sanity.io/manage](https://sanity.io/manage) → project **3tavxqc3** → **Studios**.

> The Vercel shop (`https://tvibe-flex.vercel.app`) does not include `/studio` by design. CMS admin lives on `*.sanity.studio`, not on your store domain.

## Sanity project access

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Open project **3tavxqc3** (production dataset)
3. **Members** → invite teammates as needed
4. Only invited members can open Studio

## CORS (for API writes from the storefront)

In [sanity.io/manage](https://sanity.io/manage) → Project → **API** → **CORS origins**, add:

- `http://localhost:3000`
- `https://tvibe-flex.vercel.app`

Allow credentials: **yes** for both.

## Change hosted studio hostname

Edit `studioHost` in `sanity-studio/sanity.cli.ts`, then run `npm run studio:deploy`.


"cd "C:\Users\msuts\OneDrive\Desktop\project3"; git add .; git commit -m "Update project"; git push origin main"


"
Every time you change code locally
Run these in your project folder (project3):

cd "C:\Users\msuts\OneDrive\Desktop\project3"
git add .
git status
git commit -m "Describe what you changed"
git push origin main
Replace the commit message with something real, e.g. "Fix checkout form" or "Update homepage hero".

One-liner (quick push)
cd "C:\Users\msuts\OneDrive\Desktop\project3"; git add .; git commit -m "Update project"; git push origin main
Notes
.env.local is not pushed (it’s in .gitignore) — good for secrets.
If git push asks you to log in, you’re already set up with GitHub CLI as Zephyer117.
Repo URL: https://github.com/Zephyer117/TvibeFlex
Optional: npm script (run npm run push)
Add this to package.json under "scripts":

"push": "git add . && git commit -m \"Update\" && git push origin main"
Then:

npm run push -- -m "Your commit message"
On Windows, a simpler approach is a small script file push.ps1:

param([string]$msg = "Update project")
Set-Location $PSScriptRoot
git add .
git commit -m $msg
git push origin main
Run:

.\push.ps1 "Fixed navbar on mobile"
Vercel: If the repo is connected to Vercel, a git push usually triggers a new deploy automatically within a few minutes.

"