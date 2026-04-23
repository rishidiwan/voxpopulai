# VoxPopulAI

**Voice of the People in the AI Age**

A nonprofit, reader-supported publication explaining what the AI news deluge means for everyday people — and how to advocate for yourself in representation, policy, and at work.

## Site structure

```
voxpopulai/
├── index.html           Homepage
├── brief.html           The Brief — daily digest
├── article.html         Article template (3-tier reading model)
├── policy-watch.html    Policy Watch — global → local legislation tracker
├── take-action.html     Take Action — advocacy toolkit
├── assets/
│   ├── css/styles.css   Shared styles + responsive breakpoints
│   └── js/main.js       Shared JS (nav, donate modal, cookie handling)
├── netlify.toml         Netlify deployment config
└── README.md
```

## Tech stack

Pure HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies. Deployable anywhere static files are served.

- Fonts: [Inter](https://fonts.google.com/specimen/Inter) + [Lora](https://fonts.google.com/specimen/Lora) via Google Fonts
- Deployment: Netlify
- Analytics: to be configured
- Newsletter: to be integrated (Mailchimp / ConvertKit)
- Payments: Stripe (donate flow — to be wired to live account)

## Running locally

Open any HTML file directly in a browser, or use a local server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploying to Netlify

1. Push this folder to a GitHub repo at `github.com/rishidiwan/voxpopulai`
2. Log in to [netlify.com](https://netlify.com)
3. Click **Add new site → Import an existing project**
4. Connect GitHub and select the `voxpopulai` repo
5. Build settings: leave blank (static site, no build command)
6. Click **Deploy site**

Netlify will assign a `*.netlify.app` subdomain. To use `voxpopulai.org`, add the domain under **Site configuration → Domain management**.

## Content pillars

| Pillar | Description |
|--------|-------------|
| Understand | AI news in plain language |
| Your Impact | How AI affects your work, data, and rights |
| Take Action | Advocacy tools and templates |
| Policy Watch | Global → federal → state → local legislation |
| Community | Verified reader stories |

## Credibility framework

- Source transparency on every article
- Editorial board of diverse voices (labor, policy, civil rights, tech)
- Public corrections log
- Community-verified badge for reader submissions
- No AI corporate funding — supported by readers and foundations

## License

Content © VoxPopulAI. Code available under MIT License.
