#!/usr/bin/env python3
"""List new Medium articles on the site.

Reads https://medium.com/feed/@jorgequiterio and writes one small Markdown file per new
article into posts/, named YYYY-MM-DD-topic-slug.md. The file links to Medium; the site
shows it under its topic. Existing files are never overwritten, so a topic can be changed
by renaming the file.

The topic comes from the article's Medium tags: the first tag found in TAG_TOPICS wins.
Articles with no matching tag go to DEFAULT_TOPIC.

Standard library only. Run from the repository root:  python3 scripts/medium_sync.py
"""
import html, json, os, re, sys, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

MEDIUM_USER = "jorgequiterio"
DEFAULT_TOPIC = "engineering"
TAG_TOPICS = {
    "math":       ["mathematics", "math", "maths", "probability", "calculus", "linear-algebra", "information-theory"],
    "science":    ["science", "statistics", "data-science", "time-series", "research", "econometrics", "rstats",
                   "r", "optimization", "forecasting", "physics", "astronomy"],
    "ai":         ["ai", "artificial-intelligence", "machine-learning", "llm", "generative-ai", "deep-learning",
                   "ai-agents", "chatgpt", "claude"],
    "leadership": ["leadership", "management", "strategy", "teams", "mba", "organizational-culture", "careers",
                   "decision-making", "governance"],
    "security":   ["cybersecurity", "information-security", "security", "infosec", "space", "satellite", "defense",
                   "defence", "sovereignty", "digital-sovereignty", "compliance", "cryptography", "risk-management"],
    "society":    ["society", "philosophy", "life", "luxembourg", "europe", "european-union", "culture", "ethics",
                   "future-of-work", "languages", "democracy"],
    "engineering": ["software-development", "programming", "software-engineering", "devops", "devsecops", "go",
                    "golang", "python", "docker", "kubernetes", "linux", "unix", "postgresql", "sql", "open-source"],
}
TAG_TO_TOPIC = {t: topic for topic, tags in TAG_TOPICS.items() for t in tags}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "posts")
NS = {"content": "http://purl.org/rss/1.0/modules/content/"}


def clean_url(url):
    return url.split("?")[0].rstrip("/")


def known_urls():
    urls = set()
    for name in os.listdir(POSTS) if os.path.isdir(POSTS) else []:
        if name.endswith(".md"):
            m = re.search(r"^external:\s*(\S+)", open(os.path.join(POSTS, name), encoding="utf-8").read(), re.M)
            if m:
                urls.add(clean_url(m.group(1)))
    return urls


def slugify(url, title):
    last = re.sub(r"-[0-9a-f]{8,}$", "", clean_url(url).rsplit("/", 1)[-1])
    slug = last or re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug[:80].strip("-")


def summarise(markup, limit=240):
    text = re.sub(r"<figure.*?</figure>|<h[1-6].*?</h[1-6]>", " ", markup or "", flags=re.S)
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text))).strip()
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0].rstrip(",;:—-") + "…"


def main():
    if len(sys.argv) > 2 and sys.argv[1] == "--file":          # offline testing
        root = ET.parse(sys.argv[2]).getroot()
    else:
        req = urllib.request.Request(f"https://medium.com/feed/@{MEDIUM_USER}",
                                     headers={"User-Agent": "Mozilla/5.0 (jorge.quiterio.eu sync)"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            root = ET.fromstring(resp.read())

    os.makedirs(POSTS, exist_ok=True)
    known, added = known_urls(), 0
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = clean_url(item.findtext("link") or "")
        if not title or not link or link in known:
            continue
        date = parsedate_to_datetime(item.findtext("pubDate"))
        tags = [c.text.strip().lower() for c in item.findall("category") if c.text]
        topic = next((TAG_TO_TOPIC[t] for t in tags if t in TAG_TO_TOPIC), DEFAULT_TOPIC)
        summary = summarise(item.findtext("content:encoded", namespaces=NS) or item.findtext("description"))
        path = os.path.join(POSTS, f"{date:%Y-%m-%d}-{topic}-{slugify(link, title)}.md")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("---\n")
            fh.write(f"title: {json.dumps(title, ensure_ascii=False)}\n")
            fh.write(f"summary: {json.dumps(summary, ensure_ascii=False)}\n")
            fh.write(f"external: {link}\n")
            fh.write("source: Medium\n")
            fh.write(f"tags: {json.dumps(tags, ensure_ascii=False)}\n")
            fh.write("---\n")
        known.add(link)
        added += 1
        print(f"added  {os.path.basename(path)}")
    print(f"{added} new article(s)")


if __name__ == "__main__":
    main()
