# Geographies of Textiles and Natural Dyes
> *Where the rigorous chemistry of botanical pigments meets the timeless art of living color.*

A poetic and scientific digital journal created for a PhD researcher and textile artist. This website explores historical dye chemistry, botanical cartography, anaerobic fermentation vats, and ancient textile trade routes across the globe.

---

## ✦ Aesthetic & Brand Architecture

Designed around the visual atmosphere of **field notebooks, antique botanical herbarium sheets, earth swatches, and natural maps**.

### Three-Tier Typography Hierarchy
* **Headings & Main Titles:** `Cormorant Garamond` (Classic 16th-century serif, evoking botany manuscripts and fine art monographs)
* **Body Text & Articles:** `Lora` (Comfortable, brushed curves for extended scientific essays, line-height 1.65)
* **Technical Accents & Data:** `Courier Prime` (Monospaced typewriter font for chemical formulas, botanical binomials, coordinates, and figure captions)

### Earth & Mineral Color Palette
* **Field Parchment (Base):** `#F4EFE6` / `#FAF7F2`
* **Deep Indigo Blue:** `#2C4251` (Primary text, monograph titles, navigation)
* **Madder Terracotta Red:** `#943D36` (Draft badges, specimen tags, active pills)
* **Weld Golden Ochre:** `#C98E3A` (Flavone indicators, warm swatch tags)
* **Botanical Sage:** `#5B7065` (Coordinates, field ledger borders, metadata)

---

## ✦ System Architecture

* **Static Site Generator:** [Astro 5](https://astro.build) (Static output, zero runtime server overhead)
* **Styling:** [Tailwind CSS](https://tailwindcss.com) with `@tailwindcss/typography`
* **Dual Editors:**
  * **[Tiptap](https://tiptap.dev) Editor:** Specialized for long-form research monographs, laboratory observations, and poetic essays with drop caps and formula blocks.
  * **[Easyblocks](https://github.com/easyblockshq/easyblocks) Visual Builder:** Specialized for modular, custom landing pages, symposia, and exhibition pages using No-Code components.
* **Smart CI Skip Policy:** Rapid autosaves and draft saves commit to GitHub with `[skip ci]`, preventing Cloudflare Pages from rebuilding during writing. Rebuilds trigger **strictly when the Publish button is clicked**.
* **Git-Backed Flat-File Storage:** 
  * Articles stored as Markdown (`.md`) in `src/content/posts/`
  * Landing pages stored as Easyblocks JSON (`.json`) in `src/content/pages/`
* **Continuous Deployment:** Free [Cloudflare Pages](https://pages.cloudflare.com) detects production Git commits and deploys in 30–60 seconds.

---

## ✦ Editorial Workflow & Smart CI Rebuild Control

### Why Cloudflare Pages Does Not Rebuild on Draft Saves
Cloudflare Pages natively recognizes git commit message flags such as `[skip ci]`, `[ci skip]`, and `[CF-Pages-Skip]`:
1. **While editing in Tiptap or Easyblocks:** Changes are instantly autosaved to the browser's `localStorage` in $0\text{ms}$.
2. **Clicking "Save Draft":** Commits to GitHub with commit message `Draft: <title> [skip ci]`. Cloudflare Pages inspects the commit, detects the flag, and **skips the build entirely**. You can make dozens of rapid saves without consuming Cloudflare build minutes.
3. **Clicking "Publish to Production":** Commits to GitHub **WITHOUT** `[skip ci]` (e.g. `Publish to production: <title>`). Cloudflare Pages immediately triggers the static build, updating your live production website in 30–60 seconds.

---

## ✦ Dual Studio Suite

### 1. Long-Form Writing Studio (Tiptap) &mdash; `/admin/new` & `/admin/edit`
* For narrative essays, chemical analysis of vat fermentations, and field notes.
* Full Tiptap UI toolbar (Bold, Italic, Headings H1–H3, Lists, Blockquotes, Images, Links).
* Side-by-side split preview mirroring the exact published editorial layout.
* Draft preview route: `/admin/preview/[...slug]`.

### 2. Custom Landing Pages Studio (Easyblocks) &mdash; `/admin/landing-pages/new` & `/admin/landing-pages/edit`
* For custom symposia, workshops, event announcements, and interactive pigment portfolios.
* Component Palette:
  * **HeroSectionBlock:** Main banner, title, subtitle, CTA button, and flat-lay image.
  * **EditorialTwoColBlock:** 2-column layout with drop cap text and studio figure image.
  * **SwatchAtlasBlock:** Grid of authentic fabric swatches with binomial Latin names.
  * **SpecimenShowcaseBlock:** Chemical and geographic specimen card.
  * **QuoteCalloutBlock:** Research quotes and journal citations.
  * **GalleryTriptychBlock:** 3-card photo expedition gallery.
  * **NewsletterDispatchBlock:** Postal dispatch subscription call-to-action.
  * **RawMarkdownBlock:** Freeform markdown or raw HTML section.
* Move blocks up/down, duplicate, delete, and live edit properties in the Inspector sidebar.
* Draft preview route: `/admin/preview/pages/[...slug]`.

---

## ✦ Local Development & Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
# The site is now live at http://localhost:4321

# 3. Build static production bundle
npm run build
# Outputs to dist/ directory
```

---

## ✦ Deploying to Cloudflare Pages (100% Free)

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit: Geographies of Textiles and Natural Dyes"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your repository.
4. Set the build configuration:
   * **Framework preset:** `Astro`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Environment variable:** `NODE_VERSION = 20`
5. Click **Save and Deploy**. Your site will be live at `https://<your-project>.pages.dev` with a free global CDN and SSL certificate!
