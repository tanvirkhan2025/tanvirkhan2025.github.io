# Md. Tanvir Khan — Personal Website

Single-page site with a 3D Three.js hero, dark navy/gold theme, animated stats, and a small
GRE-tips blog (`blog/`). No build step — pure HTML/CSS/JS, `three.js` loaded from a CDN. Free to
host anywhere, including GitHub Pages.

## Current status

Content is filled in from your resume + our conversation: bio, all 4 roles (Luminedge, GREC BD,
Thrive Edtech, PRAN-RFL), education, 5 services, achievement stats (4000+ hours / 70+ batches /
30+ seminars & webinars / 30+ trainings), your LinkedIn and WhatsApp, and 3 starter GRE-tips
articles. Your resume headshot is already in `assets/profile.png`.

Google Form is wired up and your GitHub username (`tanvirkhan2025`) is set everywhere
(`index.html`, `robots.txt`, `sitemap.xml`) — the site is ready to deploy.

**Optional nice-to-have**: a 1200×630px `assets/og-image.jpg`/similar for a nicer link-preview
crop — currently the Open Graph image just points at `assets/profile.jpg`, which works but isn't
an ideal 1200×630 crop.

## Deploy to GitHub Pages (free)

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository named exactly `<your-username>.github.io`.
3. From this `personal-site` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
4. Repo **Settings → Pages** → source: `main` branch, root folder. Visit
   `https://<your-username>.github.io` after a minute or two.

## Editing content later

- All copy lives directly in `index.html` (no CMS/build step) — edit the text between tags directly.
- New blog posts: copy `blog/vocab-without-burnout.html` as a template, update the `<title>`,
  headings, and body copy, then add a card for it in both `index.html` (`#gre-tips` section) and
  `blog/index.html`, and a new `<url>` entry in `sitemap.xml`.
- The 3D hero, tilt-on-hover cards, and animated stat counters are all in `script.js` — no
  configuration needed, they run automatically. If `three.js` (loaded via CDN in `index.html`)
  fails to load for any reason, the hero text/photo still render fine; only the animated
  background is skipped.

## Launch checklist (all free)

- [ ] Site loads correctly on mobile and desktop, 3D hero renders and doesn't lag
- [ ] Submit the site + `sitemap.xml` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Add free [Google Analytics (GA4)](https://analytics.google.com) if you want visit tracking
- [ ] Run a Lighthouse audit (Chrome DevTools) — the 3D hero and CDN script are the most likely
      performance flags; both degrade gracefully if needed
- [ ] Add the site link to LinkedIn, WhatsApp/Facebook bio, and email signature

## Optional later upgrades

- Custom domain (~$10–15/yr): buy a domain, add a `CNAME` file, point DNS at GitHub Pages.
- Testimonials section once you have student quotes to feature.
- Downloadable CV button.
- Bilingual (English/Bangla) toggle.
