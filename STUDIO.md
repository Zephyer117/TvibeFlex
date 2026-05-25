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

## Hosted studio (production)

```bash
npm run studio:deploy
```

After deploy, open your studio from [sanity.io/manage](https://sanity.io/manage) → project **3tavxqc3** → **Studios**.

## Sanity project access

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Open project **3tavxqc3** (production dataset)
3. **Members** → invite teammates as needed
4. Only invited members can open Studio

## CORS (for API writes from the storefront)

In [sanity.io/manage](https://sanity.io/manage) → Project → **API** → **CORS origins**, add:

- `http://localhost:3000`
- Your production URL, e.g. `https://your-store.vercel.app`

Allow credentials: **yes** for both.

## Change hosted studio hostname

Edit `studioHost` in `sanity-studio/sanity.cli.ts`, then run `npm run studio:deploy`.
