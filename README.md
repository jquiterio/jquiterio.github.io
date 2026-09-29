# jorge.quiterio.eu

The whole site is one file, `index.html`. Articles are Markdown files in `posts/`.
There is no build step: GitHub Pages serves the files as they are.

## Publish an article

Add a Markdown file to `posts/` and merge it into `main`. It appears on the site straight away.

**File name:** `YYYY-MM-DD-topic-short-title.md`, for example `posts/2026-10-06-math-fisher-information-in-one-idea.md`

- The **date** is the publication date. Files are listed newest first, and a file dated in the future stays hidden until that day, so you can schedule articles in advance.
- The **topic** is the word after the date. The site shows topics in this order:

  | Topic | Menu |
  |---|---|
  | `math` | Math |
  | `science` | Science |
  | `ai` | AI |
  | `leadership` | Leadership |
  | anything else (`society`, `security`, `engineering`, …) | Other |

**Contents:**

```markdown
---
title: "Your title"
summary: "One or two sentences shown under the title and in lists."
---

Your article in Markdown. Use ## for headings.

Inline maths: $I(\mu) = 1/\sigma^2$

Display maths:

$$
f(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2}
$$

The interactive γGN figure:

<div data-gn="full" data-start="3" data-title="Explore the γGN family" data-note="Caption text."></div>
```

`data-gn="full"` adds the tail readout and log scale; `data-gn="compact"` gives the small version.

## Publish on Medium instead

Publish on Medium as usual. Once a day, `.github/workflows/medium.yml` reads your Medium feed and adds a small link file to `posts/` for each new article, so it appears in the list and opens on Medium. To list an article immediately: **Actions → List new Medium articles → Run workflow**.

The topic comes from your first Medium tag that matches the lists in `scripts/medium_sync.py` (for example `mathematics`, `statistics`, `ai`, `leadership`, `cybersecurity`, `europe`). To change it later, rename the file.

Medium's feed only includes your ten most recent articles. Older ones need a link file added by hand; copy one of the `engineering` files in `posts/`.

## Change other things

| What | Where in `index.html` |
|---|---|
| Topics, their order and descriptions | `TOPICS` near the top of the script |
| Home page text and headline | `viewHome()` |
| About page and contact | `viewAbout()` |
| Colours and fonts | `:root` at the top of the `<style>` block |

## How it works

`index.html` asks the GitHub API for the list of files in `posts/`, reads each file from GitHub, and renders the Markdown in the browser (marked for Markdown, KaTeX for maths). Addresses look like `jorge.quiterio.eu/#/2026-09-29-math-beyond-the-bell-curve`.

To preview locally, run `python3 -m http.server` in the repository and open <http://localhost:8000>. The article list comes from GitHub, so local previews show what is on `main`.
