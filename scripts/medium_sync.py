#!/usr/bin/env python3
"""Sync Medium articles into the site.

Reads https://medium.com/feed/@<medium_username> and writes one small Markdown stub per
article into _posts/. Each stub links to the article on Medium; the site lists it in the
right section. Existing stubs are never overwritten, so you can edit a stub by hand (for
example to change its `section:`) and the change is kept.

Section is chosen from the article's Medium tags using `medium_tags` in _data/sections.yml.
The first tag that matches wins; untagged or unmatched articles go to DEFAULT_SECTION.

Standard library only. Run from the repository root:  python3 scripts/medium_sync.py
"""
import html
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "_posts")
DEFAULT_SECTION = "engineering"
NS = {"content": "http://purl.org/rss/1.0/modules/content/", "dc": "http://purl.org/dc/elements/1.1/"}


def read_config():
    """Tiny reader for the two keys we need; avoids a YAML dependency."""
    cfg = open(os.path.join(ROOT, "_config.yml"), encoding="utf-8").read()
    m = re.search(r"^medium_username:\s*([\w.-]+)", cfg, re.M)
    if not m:
        sys.exit("medium_username missing from _config.yml")
    user = m.group(1)

    tag_map, current = {}, None
    for line in open(os.path.join(ROOT, "_data", "sections.yml"), encoding="utf-8"):
        m = re.match(r"^- id:\s*(\S+)", line)
        if m:
            current = m.group(1)
            continue
        m = re.match(r"^\s+medium_tags:\s*\[(.*)\]", line)
        if m and current:
            for t in m.group(1).split(","):
                t = t.strip().strip("'\"").lower()
                if t and t not in tag_map:
                    tag_map[t] = current
    return user, tag_map


def existing_urls():
    urls = set()
    if not os.path.isdir(POSTS):
        return urls
    for name in os.listdir(POSTS):
        with open(os.path.join(POSTS, name), encoding="utf-8") as fh:
            m = re.search(r"^external_url:\s*(\S+)", fh.read(), re.M)
            if m:
                urls.add(clean_url(m.group(1)))
    return urls


def clean_url(url):
    return url.split("?")[0].rstrip("/")


def slugify(url, title):
    last = clean_url(url).rsplit("/", 1)[-1]
    last = re.sub(r"-[0-9a-f]{8,}$", "", last)  # drop Medium's post id
    slug = last or re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug[:80].strip("-")


def summarise(markup, limit=240):
    text = re.sub(r"<figure.*?</figure>", " ", markup or "", flags=re.S)
    text = re.sub(r"<h[1-6].*?</h[1-6]>", " ", text, flags=re.S)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(",;:—-")
    return cut + "…"


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    user, tag_map = read_config()
    feed_url = f"https://medium.com/feed/@{user}"
    if len(sys.argv) > 2 and sys.argv[1] == "--file":  # offline testing
        root = ET.parse(sys.argv[2]).getroot()
    else:
        req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0 (site sync; +https://jorge.quiterio.eu)"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            root = ET.fromstring(resp.read())

    known = existing_urls()
    os.makedirs(POSTS, exist_ok=True)
    added = 0
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = clean_url(item.findtext("link") or "")
        if not title or not link or link in known:
            continue
        date = parsedate_to_datetime(item.findtext("pubDate"))
        tags = [c.text.strip().lower() for c in item.findall("category") if c.text]
        section = next((tag_map[t] for t in tags if t in tag_map), DEFAULT_SECTION)
        body = item.findtext("content:encoded", namespaces=NS) or item.findtext("description") or ""
        summary = summarise(body)

        path = os.path.join(POSTS, f"{date:%Y-%m-%d}-{slugify(link, title)}.md")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("---\n")
            fh.write("layout: external\n")
            fh.write(f"title: {yaml_str(title)}\n")
            fh.write(f"date: {date:%Y-%m-%d %H:%M:%S %z}\n")
            fh.write(f"section: {section}\n")
            fh.write("source: Medium\n")
            fh.write(f"external_url: {link}\n")
            fh.write(f"summary: {yaml_str(summary)}\n")
            fh.write(f"medium_tags: {json.dumps(tags, ensure_ascii=False)}\n")
            fh.write("---\n")
        known.add(link)
        added += 1
        print(f"added  [{section}] {title}")

    print(f"{added} new article(s)")


if __name__ == "__main__":
    main()
