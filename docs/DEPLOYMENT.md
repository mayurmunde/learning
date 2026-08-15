# Deployment runbook

## Targets

| Thing            | Value                                          |
| ---------------- | ---------------------------------------------- |
| Live site        | https://learning.mmunde.in                     |
| Vercel project   | `learning` (`prj_W6SPgWLjd2Vxi4naogFQ9GVi7Dgv`) |
| Vercel team      | `mayur-75a2`                                    |
| Default alias    | `learning-mayur-75a2.vercel.app`                |
| Repo             | `github.com/mayurmunde/learning` (branch `main`) |

## How deploys happen

The repo is **not** wired to Vercel's Git integration, so pushing to GitHub does
**not** deploy. Publishing is a separate, explicit step against the Vercel API.

That means a normal change is two actions:

```bash
git push origin main     # source of truth
# then deploy (below)     # what users actually see
```

If you only push, the live site stays on the previous build. Do not report a
change as live until a deployment reaches `READY`.

## Credentials

The API token lives in `.vercel-token` at the repo root. It is listed in
`.gitignore`.

- Never commit it, never paste it into output, never echo it in a command whose
  result gets shown.
- Read it into a shell variable and unset it afterwards.
- It is scoped to this project — it cannot create new projects.

## Deploying

The build runs in Vercel's container (Node is not installed on the primary dev
machine), so deploying is also how a build gets verified.

1. Upload every source file to `POST /v2/files`, keyed by SHA-1 digest.
2. Create the deployment with `POST /v13/deployments`, passing the file manifest
   and `projectSettings: { framework: "vite", buildCommand: "npm run build",
   outputDirectory: "dist", installCommand: "npm install" }`.
3. Poll `GET /v13/deployments/{id}` until `readyState` is `READY` or `ERROR`.

Files to include: `package.json`, `vite.config.js`, `vercel.json`,
`index.html`, and everything under `src/` and `public/`. Do not upload
`node_modules/`, `dist/`, `.git/`, or `.vercel-token`.

A deployment with `target: "production"` moves the `learning.mmunde.in` alias
automatically once it is ready.

### Verifying

```bash
# every route must be 200, not 404 — proves the SPA rewrite works
for p in "" exam/assoc-f exam/dev-f exam/arch-f exam/arch-p exam/arch-p/mock; do
  printf '%s -> %s\n' "/$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://learning.mmunde.in/$p")"
done
```

Then confirm the change actually shipped rather than trusting the deploy status
— grep the built CSS/JS bundle for something the change introduced:

```bash
CSS=$(curl -s https://learning.mmunde.in | grep -oE '/assets/[^"]+\.css' | head -1)
curl -s "https://learning.mmunde.in$CSS" | grep -c 'some-new-class'
```

For layout changes, also check for horizontal overflow at mobile widths:
`document.documentElement.scrollWidth === document.documentElement.clientWidth`.

## Client-side routing

`vercel.json` rewrites all paths to `/index.html`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Without it, `BrowserRouter` works when navigating in-app but 404s on refresh or
direct link to `/exam/arch-p`. If deep links start 404ing, check this file
survived and that the build output directory is still `dist`.

## Custom domain

`learning.mmunde.in` → CNAME → `bb627d67393b652c.vercel-dns-017.com`
(nameservers are GoDaddy's). Vercel's generic `cname.vercel-dns.com` also works;
the project-specific target is what Vercel recommends for this domain.

DNS only reaches Vercel's edge — routing to the right project happens by
hostname (SNI plus the `Host` header) against the domain→project mapping created
when the domain was added. Adding a domain to a project is what makes that
mapping exist.

TLS certificates are issued automatically once DNS resolves correctly. Right
after a DNS change, expect HTTP to work while HTTPS fails the handshake for a
few minutes until the certificate is provisioned — that gap is normal and needs
no action.

## Troubleshooting

| Symptom                              | Likely cause                                   |
| ------------------------------------ | ---------------------------------------------- |
| Deploy 403 "cannot create a project" | Token is project-scoped; pass the existing `project` id rather than only `name` |
| Deep links 404                       | `vercel.json` missing from the uploaded file set |
| Site serves an old build             | Pushed to GitHub but never deployed             |
| HTTPS handshake fails, HTTP works    | Certificate still provisioning after a DNS change |
| Build fails on Vite                  | Read the Vercel build logs; there is no local Node to reproduce with |
