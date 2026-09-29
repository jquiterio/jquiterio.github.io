# jorge.quiterio.eu

Personal site of Jorge Quitério, built with Jekyll and published with GitHub Pages.

## Publishing new writing

### On Medium (the usual way)

1. Publish the article on Medium as usual.
2. Give it Medium tags. The **first tag that matches a section** decides where it is listed:

   | Section | Example tags |
   |---|---|
   | Life & Society | `society`, `philosophy`, `luxembourg`, `europe`, `future-of-work` |
   | Science | `mathematics`, `statistics`, `data-science`, `time-series`, `research` |
   | Security & Space | `cybersecurity`, `information-security`, `space`, `satellite`, `sovereignty` |
   | Engineering & AI | `software-development`, `devops`, `ai`, `programming`, `open-source` |
   | Leadership | `leadership`, `management`, `strategy`, `teams` |

   The full lists are the `medium_tags` in `_data/sections.yml`. Articles that match nothing go to Engineering & AI.
3. That's it. Once a day the site checks Medium's feed and lists new articles. To list one immediately, open **Actions → Build and publish site → Run workflow**.

Each Medium article becomes a small file in `_posts/` (for example `_posts/2026-10-01-my-title.md`). To move an article to another section, edit `section:` in that file. The sync never overwrites a file that exists.

> Medium's feed only shows your 10 most recent articles, so anything older than that needs to be added by hand once. Copy one of the existing stubs in `_posts/`.

### On the site itself

For pieces that need interactive figures or mathematics:

1. Copy `_templates/article.md` to `_posts/YYYY-MM-DD-short-title.md`.
2. Set `title`, `section` and `summary`, and write the article in Markdown.
3. Commit and push to `main`. The site rebuilds in about a minute.

`math: true` enables LaTeX (KaTeX). `gn: true` together with `{% include gamma-gn.html %}` embeds the γGN figure; `{% include gamma-gn.html full=true %}` adds the tail readout and log scale.

## Other content

| What | Where |
|---|---|
| Section names, summaries, topics, Medium tag mapping | `_data/sections.yml` |
| Section pages (headline, focus areas, open questions) | `society/`, `science/`, `security/`, `engineering/`, `leadership/` |
| Projects | `_data/projects.yml` |
| About page | `about/index.html` |
| Links (LinkedIn, GitHub, Medium), e-mail | `_config.yml` |
| Styles, γGN figure | `assets/css/site.css`, `assets/js/gamma-gn.js` |

## Preview locally

```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
python3 scripts/medium_sync.py   # optional: pull Medium articles now
```

## One-time GitHub setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** `jorge.quiterio.eu` (the `CNAME` file keeps it recorded), and tick **Enforce HTTPS**.
3. The workflow in `.github/workflows/site.yml` builds on every push, daily at 05:17 UTC, and on demand.
