#!/usr/bin/env python3
"""
Delete demo articles that aren't from the WordPress import.

This standalone script works without Prisma. It:
1. Fetches WordPress post slugs from the WP REST API
2. Queries the local SQLite database for articles
3. Identifies articles that don't match any WordPress slug
4. Deletes those demo/seed articles

The ~28 'Highlights' articles from season 18/19 with no images are detected
as demo articles since they're not in WordPress.

Usage: python3 scripts/delete-demo-articles-standalone.py

Requires: sqlite3 (built-in), urllib (built-in)
"""

import sqlite3
import urllib.request
import json
import urllib.error
import sys
import unicodedata
import re

WP_BASE = 'https://pro.hormadi.fr/wp-json/wp/v2'
DB_PATH = 'prisma/dev.db'


def strip_html(html: str) -> str:
    """Remove HTML tags and decode entities."""
    s = html
    s = re.sub(r'<script[^>]*>[\s\S]*?</script>', '', s, flags=re.IGNORECASE)
    s = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', s, flags=re.IGNORECASE)
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('&nbsp;', ' ')
    s = s.replace('&amp;', '&')
    s = s.replace('&lt;', '<')
    s = s.replace('&gt;', '>')
    s = s.replace('&quot;', '"')
    s = s.replace('&#8217;', "'")
    s = s.replace('&#8211;', '–')
    s = s.replace('&#8230;', '…')
    s = s.replace('&#8216;', "'")
    s = re.sub(r'\s+', ' ', s)
    return s.strip()


def slugify(text: str) -> str:
    """Convert text to a URL-friendly slug."""
    # Normalize unicode
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')

    # Remove non-word chars
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = text.lower()
    text = re.sub(r'-+', '-', text)
    text = re.sub(r'^-|-$', '', text)
    return text[:120]


def fetch_json(url: str) -> dict:
    """Fetch JSON from URL."""
    headers = {'User-Agent': 'Hormadi-Site-Importer/1.0'}
    req = urllib.request.Request(url, headers=headers)

    try:
        with urllib.request.urlopen(req) as response:
            # Handle redirects manually
            if response.status in (301, 302):
                return fetch_json(response.headers.get('Location'))
            data = response.read().decode('utf-8')
            return json.loads(data), response.headers
    except urllib.error.HTTPError as e:
        raise Exception(f"HTTP {e.code} from {url}")
    except urllib.error.URLError as e:
        raise Exception(f"Failed to fetch {url}: {e.reason}")


def main():
    print('🗑️  Delete Demo Articles')
    print('========================\n')

    # Fetch WordPress post slugs
    print('📰 Fetching WordPress post slugs...')
    wp_slugs = set()
    page = 1
    total_pages = 1

    while page <= total_pages:
        try:
            json_data, headers = fetch_json(
                f'{WP_BASE}/posts?per_page=100&page={page}&_fields=id,title,slug'
            )
        except Exception as e:
            print(f'   ❌ Error fetching WordPress posts: {e}')
            print('   (Make sure you have internet access and pro.hormadi.fr is reachable)')
            sys.exit(1)

        if page == 1:
            total_pages = int(headers.get('x-wp-totalpages', '1'))

        for post in json_data:
            title_raw = strip_html(post.get('title', {}).get('rendered', ''))
            slug = slugify(title_raw)
            if not slug or len(slug) < 3:
                slug = f'article-{post.get("id")}'
            wp_slugs.add(slug)
            wp_slugs.add(f'{slug}-{post.get("id")}')

        page += 1

    print(f'   {len(wp_slugs)} WordPress slug variants indexed\n')

    # Query database for demo articles
    print('🔍 Scanning local database...')
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
    except Exception as e:
        print(f'   ❌ Error opening database: {e}')
        sys.exit(1)

    cursor.execute('SELECT id, slug, title FROM Article')
    all_articles = cursor.fetchall()

    demo_articles = [a for a in all_articles if a[1] not in wp_slugs]

    if not demo_articles:
        print('   ✅ No demo articles found — all articles match WordPress posts.')
        conn.close()
        return

    print(f'   Found {len(demo_articles)} demo articles\n')
    print('Articles to delete:\n')
    for article in demo_articles:
        print(f'  🗑️  "{article[2][:60]}" (slug: {article[1]})')

    # Confirm deletion
    print('\n' + '=' * 80)
    response = input(
        f'\nDelete {len(demo_articles)} demo articles? Type "yes" to confirm: '
    ).strip()

    if response != 'yes':
        print('Cancelled.')
        conn.close()
        return

    # Delete articles
    print('\n🗑️  Deleting...')
    ids = [a[0] for a in demo_articles]
    placeholders = ','.join('?' * len(ids))

    try:
        cursor.execute(f'DELETE FROM Article WHERE id IN ({placeholders})', ids)
        conn.commit()
        print(f'✅ Deleted {cursor.rowcount} demo articles.')
    except Exception as e:
        print(f'❌ Error deleting articles: {e}')
        conn.rollback()
        conn.close()
        sys.exit(1)

    # Show final count
    cursor.execute('SELECT COUNT(*) FROM Article')
    remaining = cursor.fetchone()[0]
    print(f'📊 Remaining articles: {remaining}')

    conn.close()
    print('\n✅ Done!')


if __name__ == '__main__':
    main()
