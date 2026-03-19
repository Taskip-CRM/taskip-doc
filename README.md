# Taskip Docs

Official documentation site for [Taskip](https://taskip.net), built with [Astro Starlight](https://starlight.astro.build/) + [Keystatic CMS](https://keystatic.com/).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build/) + [Starlight](https://starlight.astro.build/) |
| CMS | [Keystatic](https://keystatic.com/) — git-based, no database |
| Hosting | [Vercel](https://vercel.com/) |
| Search | [Pagefind](https://pagefind.app/) — built-in, runs in browser |
| Adapter | `@astrojs/vercel` for SSR (required by Keystatic) |

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Taskip-CRM/taskip-doc.git
git push -u origin main
```

### Step 2 — Import project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select `Taskip-CRM/taskip-doc` from the list
4. Leave all build settings as defaults (Vercel auto-detects Astro)
5. Click **Deploy** — your first deploy will succeed ✅

### Step 3 — Create a GitHub App

Keystatic requires a **GitHub App** (not an OAuth App) because it expects expiring user tokens (`expires_in`, `refresh_token`). A standard OAuth App won't work.

1. Go to **[github.com/organizations/Taskip-CRM/settings/apps](https://github.com/organizations/Taskip-CRM/settings/apps)**
   *(GitHub → Your Org → Settings → Developer Settings → GitHub Apps)*
2. Click **"New GitHub App"**
3. Fill in:
   - **GitHub App name:** `Taskip Docs CMS`
   - **Homepage URL:** `https://docs.taskip.net`
   - **Callback URL:** `https://docs.taskip.net/api/keystatic/github/oauth/callback`
   - **Expire user authorization tokens:** ✅ enabled (default)
   - **Webhook → Active:** uncheck (not needed)
   - **Permissions → Repository contents:** Read & write
   - **Permissions → Metadata:** Read-only
4. Click **Create GitHub App**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy the **Client Secret**

### Step 4 — Add Environment Variables in Vercel

In your Vercel project dashboard → **Settings → Environment Variables**, add:

| Variable | Value | Example |
|---|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | Your GitHub OAuth App Client ID | `Ov23liXXXXXXXXXX` |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Client Secret | `abc123...` |
| `KEYSTATIC_SECRET` | Any random 32-char string | run `openssl rand -hex 16` |

After adding env vars → **Redeploy** the project (Deployments → ⋯ → Redeploy).

### Step 5 — Set your custom domain (optional)

In Vercel → **Settings → Domains** → add `docs.taskip.net`. Then update your DNS at your domain registrar:

```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
```

Update the GitHub OAuth App URLs to use `https://docs.taskip.net`.

---

## Logging in to the CMS

Once deployed, content writers log in at:

```
https://docs.taskip.net/keystatic
```

Or locally:

```
http://localhost:4321/keystatic
```

### Login flow

1. Go to `/keystatic`
2. Click **"Sign in with GitHub"**
3. Authorise the Taskip Docs CMS app (first time only)
4. You're in — no passwords, no extra accounts needed

### What writers can do in the CMS

- **Create** new docs pages with a rich-text editor (headings, bold, tables, code blocks, images)
- **Edit** existing pages without touching any code
- **Add images** — upload directly in the editor; Astro auto-optimises them
- **Embed YouTube videos** — paste a YouTube Video ID in the "Hero / Video" field on any Guide page
- **Reorder** pages via the `sidebar.order` field (lower number = higher in sidebar)

When a writer saves, Keystatic **automatically commits to GitHub**, which triggers a Vercel redeploy. Changes are live within ~60 seconds.

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/Taskip-CRM/taskip-doc.git
cd taskip-doc

# 2. Install (uses legacy-peer-deps automatically via .npmrc)
npm install

# 3. Copy env file
cp .env.example .env
# Fill in KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET

# 4. Start dev server
npm run dev
```

| URL | What it is |
|---|---|
| `http://localhost:4321` | Documentation site |
| `http://localhost:4321/keystatic` | CMS admin panel |

> **Tip:** For local development, Keystatic can run in "local" mode (no GitHub OAuth required). Change `storage.kind` from `'github'` to `'local'` in `keystatic.config.tsx` while developing, then revert before pushing.

---

## Content Structure

```
src/content/docs/
├── index.mdx                          ← Homepage (hero, feature cards)
├── getting-started/
│   ├── introduction.mdx               ← sidebar.order: 1
│   ├── quick-start.mdx                ── sidebar.order: 2
│   ├── installation.mdx               ── sidebar.order: 3
│   └── key-concepts.mdx               ── sidebar.order: 4
└── guides/
    ├── task-management.mdx            ── sidebar.order: 1
    ├── projects-and-boards.mdx        ── sidebar.order: 2
    ├── team-collaboration.mdx         ── sidebar.order: 3
    └── integrations.mdx               ── sidebar.order: 4
```

## Controlling Page Order in the Sidebar

There are **two ways** to control ordering:

### Option A — Frontmatter `sidebar.order` (for auto-generated sidebars)

Add `order` to each page's frontmatter. Lower = higher up.

```yaml
---
title: Quick Start
sidebar:
  order: 2
---
```

### Option B — Explicit list in `astro.config.mjs` (recommended — current setup)

The sidebar order is defined directly in `astro.config.mjs`. Just reorder the items array:

```js
sidebar: [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', slug: 'getting-started/introduction' },   // 1st
      { label: 'Quick Start', slug: 'getting-started/quick-start' },     // 2nd
      { label: 'Installation', slug: 'getting-started/installation' },   // 3rd
      { label: 'Key Concepts', slug: 'getting-started/key-concepts' },   // 4th
    ],
  },
]
```

Simply move a line up or down to reorder. No frontmatter needed.

---

## Adding a New Page

1. Create a `.mdx` file in `src/content/docs/getting-started/` or `src/content/docs/guides/`
2. Add frontmatter:
   ```yaml
   ---
   title: My New Page
   description: A short description for SEO.
   sidebar:
     order: 5
   ---
   ```
3. Add the page to the sidebar in `astro.config.mjs`
4. Commit and push — Vercel deploys automatically

Or, use the CMS at `/keystatic` — no code needed.

> **Tip:** The homepage content (hero tagline, feature cards, CTA button) is fully editable via the **Homepage** singleton in the CMS — no code changes required.
