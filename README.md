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
* **CMS & Editor:** Browser-based [Tiptap](https://tiptap.dev) WYSIWYG editor with rich UI controls
* **Git-Backed Storage:** All articles are stored as Markdown (`.md`) files in `src/content/posts/` with YAML frontmatter
* **Continuous Deployment:** Free [Cloudflare Pages](https://pages.cloudflare.com) detects Git commits and deploys production builds worldwide in 30–60 seconds

---

## ✦ How the Writer Admin Studio Works

The entire administration and editorial suite runs **directly in the client browser** with no server or database needed:

### 1. Accessing the Dashboard (`/admin`)
Navigate to `https://yourblog.com/admin` (or `http://localhost:4321/admin` locally).
* **GitHub Integration:** Click **"GitHub Settings"** to link your repository using a fine-grained or classic GitHub Personal Access Token (PAT) with `repo` permissions. Your token is stored securely in your browser's `localStorage`.
* **Repository Overview:** The dashboard fetches `src/content/posts/` via the GitHub API, categorizing posts into **Published** vs **Draft** status with real-time stats and search filters.
* **Offline / Local Mode:** If GitHub is not yet connected, you can still author, edit, and preview articles locally.

### 2. Composing & Saving a Draft (`/admin/new`)
* Open the Tiptap Studio at `/admin/new`.
* Fill out the structured metadata: **Title**, **Slug**, **Subtitle**, **Excerpt**, **Botanical Specimen**, **Coordinates**, and **Tags**.
* Write in the Tiptap editor with full formatting controls (Headings H1–H3, bold, italic, strikethrough, blockquotes, code blocks, lists, horizontal rules, and image insertion).
* Toggle **"Show Split Preview"** to view a live, real-time mirror of the exact published layout side-by-side with your writing.
* Clicking **"Save Draft"** commits a new file (e.g. `src/content/posts/my-post.md`) to your GitHub repository with `draft: true`.

### 3. Publishing to Production
* When your essay is complete, click **"Publish to Production"**.
* The editor updates the frontmatter in GitHub to `draft: false`.
* Cloudflare Pages automatically detects the Git commit and rebuilds the site in 30–60 seconds.

### 4. Draft Previews (`/admin/preview/[...slug]`)
* In production, the public `/posts/[...slug]` routes render **only published articles** (`draft: false`).
* The dedicated preview engine under `/admin/preview/[...slug]` renders **both drafts and published articles** with an alert banner and direct link to resume editing in Tiptap.

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
