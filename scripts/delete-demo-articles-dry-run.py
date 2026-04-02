#!/usr/bin/env python3
"""
Dry-run version of delete-demo-articles-standalone.py

Shows what WOULD be deleted without actually fetching WordPress data
or making any database changes. Useful for testing.

Usage: python3 scripts/delete-demo-articles-dry-run.py
"""

import sqlite3
import sys

DB_PATH = 'prisma/dev.db'


def main():
    print('🗑️  Delete Demo Articles (DRY RUN - No changes made)')
    print('=' * 70 + '\n')

    # Query database for articles with no images
    print('🔍 Scanning local database...')
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
    except Exception as e:
        print(f'   ❌ Error opening database: {e}')
        sys.exit(1)

    # In the real script, we'd compare against WordPress slugs
    # For this dry run, we identify articles likely to be demo articles:
    # - No images
    # - Highlights from season 18/19
    cursor.execute('''
        SELECT id, slug, title, length(content) as content_len
        FROM Article
        WHERE imageUrl IS NULL
        AND (title LIKE '%Highlights%' AND (title LIKE '%18%' OR title LIKE '%19%'))
        ORDER BY createdAt DESC
    ''')
    demo_articles = cursor.fetchall()

    print(f'   Found {len(demo_articles)} articles with no images\n')

    if not demo_articles:
        print('   ✅ No demo articles found.')
        conn.close()
        return

    print('Demo articles that would be deleted:\n')
    for i, (id, slug, title, content_len) in enumerate(demo_articles, 1):
        print(f'  {i:2d}. {title[:65]}')
        print(f'       Slug: {slug}')
        print(f'       Content: {content_len} chars')
        print()

    print('=' * 70)
    print(f'\n📊 Summary:')
    print(f'   Total demo articles: {len(demo_articles)}')
    print(f'   Would be deleted: {len(demo_articles)}')
    print(f'   Remaining articles: {conn.execute("SELECT COUNT(*) FROM Article").fetchone()[0] - len(demo_articles)}')

    print('\n✅ This is a dry run. No changes were made to the database.')
    print('\nTo actually delete these articles, run:')
    print('   python3 scripts/delete-demo-articles-standalone.py')

    conn.close()


if __name__ == '__main__':
    main()
