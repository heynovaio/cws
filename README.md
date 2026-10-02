# CWS — Canadian Women & Sport

Bilingual (EN/FR) marketing site for Canadian Women & Sport, live at
[womenandsport.ca](https://womenandsport.ca) and [femmesetsport.ca](https://femmesetsport.ca).

Built with **Next.js 15 (App Router)**, **Prismic** (headless CMS + Slice Machine), **Tailwind CSS**, and
deployed on **Netlify**. Based on [The HN Prismic Boilerplate](https://github.com/heynovaio/hn-prismic-boilerplate-2025).

---

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **22.x** (min 20.19) | Pinned in `.nvmrc` — run `nvm use`. Slice Machine crashes with `ERR_REQUIRE_ESM` on older Node. |
| npm | 10+ (ships with Node 22) | The project uses **npm** — `package-lock.json` is the only lockfile. Don't use Yarn or pnpm. |
| Prismic access | — | HeyNova manages invites to the `canadian-women-in-sports` repository — ask your HeyNova contact. |
| Netlify access | — | HeyNova manages invites to the `stage-cws` project. You don't need it to deploy (see [Deployment](#deployment)). |

## Getting started

```bash
nvm use
npm ci
cp .env.example .env.local   # then fill in values — ask HeyNova for secrets
npm run dev
```

Use `npm ci` for a clean install from the lockfile. Use `npm install <pkg>` only when you're adding or upgrading a dependency, and commit the updated `package-lock.json`.

`npm run dev` runs two processes side by side:

- **Next.js** — <http://localhost:3000>
- **Slice Machine** — <http://localhost:9999> (Prismic's local UI for editing slices and custom types)

Run Next.js alone with `npm run next:dev`.

### Viewing the French site locally

The locale is chosen by **domain**, not by URL path. To see French locally, set these in `.env.local`:

```
NEXT_PUBLIC_DOMAIN_EN=localhost
NEXT_PUBLIC_DOMAIN_FR=fr.localhost
```

Then open <http://fr.localhost:3000> (Chrome and Firefox resolve `*.localhost` automatically). The language switcher swaps between the two hosts.

## Environment variables

Copy `.env.example` to `.env.local`. `.env*` files are gitignored — **never commit secrets**. Production values are in Netlify → Site configuration → Environment variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_DOMAIN_EN` / `DOMAIN_EN` | Prod | English host, e.g. `womenandsport.ca`. Decides locale and language-switcher links. |
| `NEXT_PUBLIC_DOMAIN_FR` / `DOMAIN_FR` | Prod | French host, e.g. `femmesetsport.ca`. |
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | No | Overrides the Prismic repo name (e.g. a Prismic environment for staging). Defaults to `slicemachine.config.json`. |
| `SITE_URL` | No | Base URL for the generated sitemap. Defaults to `https://womenandsport.ca/`. |
| `MAILCHIMP_API_KEY` | For newsletter | Mailchimp API key. |
| `MAILCHIMP_SERVER_PREFIX` | For newsletter | Data-center prefix, e.g. `us12`. |
| `MAILCHIMP_AUDIENCE_ID` | For newsletter | Audience/list ID. |
| `MAILCHIMP_DOUBLE_OPT_IN` | No | `true` sends a confirmation email before subscribing. |
| `MAILCHIMP_LANG_MERGE_TAG` | No | Merge tag that stores the subscriber's language, e.g. `LANG`. |
| `MAILCHIMP_REQUIRED_FIELDS` | No | Comma-separated merge tags the audience requires, e.g. `LNAME,MMERGE4`. |
| `MAILCHIMP_FALLBACK_<TAG>` | No | Fallback value for each required field above, e.g. `MAILCHIMP_FALLBACK_LNAME`. |
| `PRISMIC_WEBHOOK_SECRET` | Prod | Must match the **Secret** on the Prismic publish webhook. `/api/revalidate` rejects requests without it. If unset, the endpoint is open (and logs a warning). |

`NEXT_PUBLIC_*` values are baked in at **build time**, so changing them in Netlify needs a redeploy.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server + Slice Machine |
| `npm run next:dev` | Next.js dev server only |
| `npm run build` | Production build. `postbuild` then runs `next-sitemap`, which rewrites `public/sitemap*.xml` and `public/robots.txt` |
| `npm run next:start` | Serve the production build locally |
| `npm run lint` | ESLint CLI (`eslint .`, `next/core-web-vitals` + `next/typescript`) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run format` / `format:check` | Prettier: format everything / check only |
| `npm run slicemachine` | Slice Machine only |

## Code quality checks

There is no automated test suite. These checks run at three stages:

| When | What runs | Where it's configured |
| --- | --- | --- |
| **Every commit** | `eslint --fix` + `prettier --write` on staged files (husky + lint-staged). A lint error blocks the commit. | `.husky/pre-commit`, `lint-staged` in `package.json` |
| **Every PR / push to `develop` or `main`** | GitHub Actions: `npm ci` → lint → format check → typecheck → `next build`, plus `npm audit` (production deps, high+) | `.github/workflows/ci.yml` |
| **Weekly** | Dependabot opens grouped minor/patch update PRs against `develop`. Majors are ignored and need a planned upgrade. | `.github/dependabot.yml` |

`main` and `develop` are protected: changes go in by PR only, and the **Lint, typecheck & build** check must pass.
Hooks install automatically on `npm ci` / `npm install` (the `prepare` script). To bypass one in an emergency, use
`git commit --no-verify`. CI still runs.

Formatting lives in `.prettierrc.json`. The repo was formatted in one commit, which is listed in
`.git-blame-ignore-revs`. Run `git config blame.ignoreRevsFile .git-blame-ignore-revs` once so local `git blame` skips it.

**Pinned on purpose:** `react-multi-carousel` stays at `2.8.5`. 2.8.6 has identical code but mistakenly depends on
the whole `npm` CLI, which pulls in 20+ vulnerable packages. `next` is pinned exactly, and its bundled `postcss` is
forced to the patched version via `overrides` in `package.json`.

## Project structure

```
customtypes/          Prismic custom type models (page, program_page, resource_page, …). Edit with Slice Machine.
src/
  app/
    (site)/           All public routes — see "Routing" below
    api/              preview / exit-preview (Prismic previews), revalidate (cache bust), newsletter (Mailchimp)
    slice-simulator/  Used by Slice Machine to render slice previews
    layout.tsx        Root layout: Outfit font, Google Tag Manager, <html lang>
  slices/             One folder per Prismic slice: index.tsx (component), model.json, mocks.json, screenshots
  components/         Shared UI (Layout, Menu/Header/Footer, Cards, Grid, SearchPage, Heros, …)
  hooks/ providers/   React Query hooks + the category filter context used by the search page
  utils/              Prismic fetch helpers, link resolver, locale/domain helpers
  constants/          Languages, search filters, program formats
  middleware.ts       Locale detection, legacy URL handling, campaign vanity domains
  prismicio.ts        Prismic client + route resolver
netlify/edge-functions/files-proxy.ts   Serves Prismic media under /files/* on our own domain
next.config.mjs       Image domains + ~200 permanent redirects from the old WordPress site
prismicio-types.d.ts  Generated by Slice Machine — do not hand-edit
```

## How it works

### Prismic & Slice Machine

- Content comes from the Prismic repo **`canadian-women-in-sports`** (set in `slicemachine.config.json`).
- Pages are made of **slices**. To add or change one, use Slice Machine at <http://localhost:9999>. It writes
  `src/slices/<Name>/model.json`, updates `prismicio-types.d.ts`, and registers the slice in `src/slices/index.ts`.
  Then write the component in `index.tsx`.
- **Push model changes** to Prismic from Slice Machine ("Review changes" → Push) — committing to git isn't enough.
  Push only after the code that uses the change is merged/deployed, or editors may see fields the live site can't render.
- Prismic locales are `en-ca` and `fr-ca`.

### Routing & locales

Routes live in `src/app/(site)` and match the route resolver in `src/prismicio.ts`:

| Prismic type | URL |
| --- | --- |
| `page` (uid `home`) | `/` |
| `page` | `/:uid` |
| `program_page` | `/program/:uid` |
| `resource_page` | `/resource/:uid` |
| `campaign_page` | `/campaign/:uid` |
| `career_hub` / `career_page` | `/careers[/:uid]` (EN) · `/carrieres[/:uid]` (FR) |
| `contact_page`, `team_members`, `search_page` | `/contact`, `/team`, `/search` |

**The locale comes from the domain** (`womenandsport.ca` = EN, `femmesetsport.ca` = FR), worked out in
`src/utils/localeHosts.ts`. `src/middleware.ts` also:

- redirects old `/en-ca/...` and `/fr-ca/...` URLs to the matching domain;
- swaps `/careers` ↔ `/carrieres` for the active language;
- serves the campaign vanity domains (`keepgirlsplaying.ca`, `dansléquipedesfilles.ca`) from `/campaign/...`;
- sets the `NEXT_LOCALE` cookie.

Redirects from the old WordPress site are in `next.config.mjs` (`LEGACY_PAIRS`). When you add one there, also add
the source path to `LEGACY_SOURCES` in `middleware.ts` so the middleware doesn't handle it first.

### Caching, previews & revalidation

- In production, Prismic fetches are cached with the `prismic` tag. Pages update only when the tag is revalidated.
- A **Prismic webhook** (already set up) `POST`s to `https://<domain>/api/revalidate` on publish, so published
  content goes live without a redeploy. The webhook's **Secret** must equal `PRISMIC_WEBHOOK_SECRET` in Netlify.
  If content edits aren't showing up, check the webhook's delivery log in Prismic first. A `401` there means the
  secrets don't match.
- **Previews**: in Prismic's preview settings, the preview URL is `/api/preview` and exit is `/api/exit-preview`.

### Media URLs

`src/utils/maskPrismicMediaUrl.tsx` rewrites Prismic CDN links to `/files/...`. On Netlify, the
`files-proxy` edge function (configured in `netlify.toml`) streams them from Prismic. **This only works on
Netlify or `netlify dev`**, so `/files/*` links will 404 under plain `npm run dev`.

### Analytics

Google Tag Manager (`GTM-PN5JLZD`) is loaded in `src/app/layout.tsx`. Custom events are in `src/utils/analytics.ts`.

## Git workflow

| Branch | Purpose |
| --- | --- |
| `main` | **Production.** Every merge deploys to womenandsport.ca / femmesetsport.ca. Only merge `develop` into it. |
| `develop` | Integration branch. Branch from here, and open feature PRs into `develop`. |
| `feature/<name>`, `QA/<name>`, `<ticket-id>-<name>` | Working branches |

Keep `main` a direct ancestor of `develop`: no commits straight to `main`, and hotfixes go through `develop` too.
That keeps release PRs conflict-free.

## Deployment

Hosted on **Netlify**. The project is [`stage-cws`](https://app.netlify.com/projects/stage-cws), served at
<https://womenandsport.ca>, and Netlify uses its Next.js runtime automatically. **`main` is the production branch.**
You don't need Netlify access to ship — git drives everything:

1. **Feature work** → open a PR into `develop`. Get it reviewed, then merge.
2. **Release** → open a PR **from `develop` into `main`**. Netlify builds a **Deploy Preview** for it and posts the
   preview URL as a check on the PR. QA the preview in EN and FR, including the newsletter form and `/files/*` links.
3. **Ship** → merge the PR. Netlify builds `main` and publishes it to production, usually within a few minutes.
   Watch the Netlify check on the merge commit. A failed build leaves the previous deploy live.
4. **Rollback** → revert the merge on `develop`, then release again. In an emergency, HeyNova can republish a
   previous deploy from the Netlify **Deploys** tab.

Build details:

- Netlify runs `npm ci` (it detects `package-lock.json`), then the build command set in Netlify → Build settings (should be `npm run build`).
- The Node version comes from `.nvmrc` (22).
- Environment variables (see above) are set per-context in Netlify. HeyNova changes them. `NEXT_PUBLIC_*` changes
  need a new deploy.
- Content publishes from Prismic **don't** need a deploy — the webhook revalidates the cache.
- `netlify.toml` registers the `files-proxy` edge function for `/files/*`.

To reproduce Netlify locally, including the `/files/*` edge function:

```bash
npx netlify dev
```

## Package manager

The project uses **npm** only. `package-lock.json` is the single lockfile — Yarn was removed. Commit lockfile
changes together with the `package.json` change that caused them, and don't add a `yarn.lock` or
`pnpm-lock.yaml` (Netlify would switch package managers).

## Troubleshooting

- **"Node.js version … is required" or Slice Machine fails with `ERR_REQUIRE_ESM`** → run `nvm use` (Node 22).
- **Next warns "Found multiple lockfiles"** → a stray `package-lock.json` in a parent folder (e.g. your home
  directory) is confusing it. Delete that one, not ours.
- **TypeScript errors under `.next/types/...`** → stale build output. Delete `.next/` and rebuild.
- **Content changes don't appear in production** → check the Prismic → `/api/revalidate` webhook (`401` = secret
  mismatch), or redeploy.
- **Commit rejected by the pre-commit hook** → fix the ESLint error it prints. Formatting is fixed for you.
- **French site shows English locally** → set `NEXT_PUBLIC_DOMAIN_FR=fr.localhost` and browse `fr.localhost:3000`.
- **Newsletter returns "Mailchimp environment is not configured"** → set the `MAILCHIMP_*` variables.
