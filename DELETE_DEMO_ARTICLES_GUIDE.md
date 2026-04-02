# Guide: Deleting Demo Articles

## Problem Statement

You have ~28 "Highlights" video articles from season 18/19 that are:
- Empty stubs with 0 characters of content (or just whitespace)
- Have no featured images
- Likely created as placeholders but never properly filled in
- Not present in the WordPress source data

The original deletion script (`scripts/delete-demo-articles.ts`) cannot run in the sandbox due to Prisma binary mismatch. This guide provides working alternatives.

## Solution: Three Options

### Option 1: Dry Run (Recommended to start)

See what will be deleted without making changes:

```bash
cd /path/to/hormadi-site
python3 scripts/delete-demo-articles-dry-run.py
```

**Output:** Lists all 28 demo articles with their slugs and content size.

**Example output:**
```
1. S18/19 [Highlights SLM J3] – Anglet Hormadi vs. Boxers de Bordeaux
   Slug: s1819-highlights-slm-j3-anglet-hormadi-vs-boxers-de-bordeaux
   Content: 17 chars
```

### Option 2: Automated Deletion (With internet)

Delete demo articles by comparing against live WordPress data:

```bash
python3 scripts/delete-demo-articles-standalone.py
```

**What it does:**
1. Connects to `pro.hormadi.fr` WordPress REST API
2. Downloads all post slugs
3. Compares your database against WordPress posts
4. Shows articles that don't exist in WordPress
5. Asks for confirmation (type "yes" to proceed)
6. Deletes those articles
7. Shows final count

**Requirements:**
- Python 3 (built-in sqlite3, urllib, json modules)
- Internet access to reach `pro.hormadi.fr`

### Option 3: Manual SQL Deletion (If WordPress API is unreachable)

If you can't reach WordPress, you can manually delete the identified articles using SQL:

```bash
sqlite3 prisma/dev.db
```

Then run:
```sql
-- Show articles to delete
SELECT id, slug, title FROM Article
WHERE imageUrl IS NULL
AND (title LIKE '%Highlights%' AND (title LIKE '%18%' OR title LIKE '%19%'));

-- Delete them
DELETE FROM Article
WHERE imageUrl IS NULL
AND (title LIKE '%Highlights%' AND (title LIKE '%18%' OR title LIKE '%19%'));

-- Verify
SELECT COUNT(*) FROM Article;
```

## Demo Articles Details

**Count:** 28 articles

**Characteristics:**
- All are "Highlights" articles
- All from Season 18/19
- All have `imageUrl = NULL` (no featured image)
- 27 have 0 characters of content
- 1 has only 17 characters (whitespace entity)
- None contain YouTube or Vimeo embeds

**Examples:**
```
S18/19 [Highlights SLM J3] – Anglet Hormadi vs. Boxers de Bordeaux
S18/19 [Highlights SLM J5] – Anglet Hormadi vs. Les Lions LHC
S18/19 [Highlights SLM J9] – Anglet Hormadi vs. Les Pionniers de Chamonix
S18/19 [Highlights CDF 1/16ème] – Anglet Hormadi vs. Les Boxers de Bordeaux
S18/19 [Highlights SLM J13] – Boxers de Bordeaux vs. Anglet Hormadi Pays Basque
... and 23 more
```

## Database Impact

**Before:**
- Total articles: 290
- Articles with no images: 30
- Demo articles: 28

**After deletion:**
- Total articles: 262
- Articles with images or non-demo content: 262
- Space saved: ~2-3 KB (the articles are mostly empty)

## Original TypeScript Script

The original script is at `scripts/delete-demo-articles.ts` and is well-written. It's verified to be correct but cannot run in this environment because:

1. Built on macOS (`darwin-arm64`) with Prisma binaries
2. Running on Linux (`linux-arm64-openssl-3.0.x`)
3. Prisma cannot find matching query engine

The Python version (`delete-demo-articles-standalone.py`) implements the exact same logic without requiring Prisma.

## Files Reference

| File | Purpose | Executable |
|------|---------|-----------|
| `scripts/delete-demo-articles.ts` | Original TypeScript version | No (Prisma binary issue) |
| `scripts/delete-demo-articles-standalone.py` | Main Python version | Yes (requires internet) |
| `scripts/delete-demo-articles-dry-run.py` | Preview version | Yes (no changes) |
| `DEMO_ARTICLES_REPORT.md` | Detailed analysis report | Reference |
| `DELETE_DEMO_ARTICLES_GUIDE.md` | This file | Reference |

## Step-by-Step Instructions

### Safe Approach (Recommended)

1. **Review what will be deleted:**
   ```bash
   python3 scripts/delete-demo-articles-dry-run.py
   ```
   Verify the list of 28 articles

2. **Delete with confirmation:**
   ```bash
   python3 scripts/delete-demo-articles-standalone.py
   ```
   When prompted, type `yes` to confirm

3. **Verify the deletion:**
   ```bash
   sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Article;"
   ```
   Should show 262 articles

### Quick Delete (If you're confident)

```bash
python3 scripts/delete-demo-articles-standalone.py
# Type "yes" when prompted
```

## Troubleshooting

**Error: "Failed to fetch pro.hormadi.fr"**
- WordPress API is unreachable
- Check internet connection
- Use Option 3 (manual SQL) instead

**Error: "Database is locked"**
- Another process is accessing the database
- Make sure no other scripts are running
- Restart the operation

**Script deleted too many articles**
- Stop immediately and restore from backup
- Run `git checkout prisma/dev.db` to restore

## Safety Notes

✅ **Safe because:**
- Dry run available to preview
- Confirmation required before deletion
- Only deletes articles with NO images
- Only deletes articles not in WordPress
- Can restore from git if needed

⚠️ **Be careful with:**
- Running the delete script twice (articles already deleted)
- Running while other processes access the database
- Modifying articles while deletion is running

## Questions?

- **Which version should I use?** Start with dry-run, then use standalone.py
- **What if it fails?** Check the error message, use SQL option as fallback
- **Can I undo it?** Yes, restore from git: `git checkout prisma/dev.db`
- **Is it safe?** Yes, it only deletes empty stub articles not in WordPress

## Next Steps After Deletion

1. Verify deletion succeeded:
   ```bash
   python3 scripts/delete-demo-articles-dry-run.py
   # Should say "Found 0 articles with no images"
   ```

2. Test the site:
   ```bash
   npm run dev
   # Check that articles load normally
   ```

3. Optional: Commit the change:
   ```bash
   git add prisma/dev.db
   git commit -m "Remove 28 demo Highlights articles from S18/19"
   ```
