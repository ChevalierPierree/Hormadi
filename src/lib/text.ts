/**
 * Normalizes Unicode "Mathematical Alphanumeric Symbols" (U+1D400-U+1D7FF) —
 * the fake-bold/italic/script letters social media caption generators produce
 * (e.g. "𝐂𝐚𝐥𝐞𝐧𝐝𝐫𝐢𝐞𝐫") — back to plain ASCII. The site's heading font (Anton)
 * has no glyphs for that block, so pasted captions render as tofu/empty boxes
 * unless normalized first.
 */

interface Block {
  start: number
  // 'AZ' = 26 upper then 26 lower (52 chars), 'digits' = 10 digits (0-9)
  kind: 'AZ' | 'digits'
  // codepoints within this block that don't follow the sequence and should be
  // left alone (some styles reuse legacy Unicode letter-like symbols instead)
  exceptions?: Record<number, string>
}

const BLOCKS: Block[] = [
  { start: 0x1d400, kind: 'AZ' }, // Bold
  { start: 0x1d434, kind: 'AZ', exceptions: { 0x1d455: 'h' } }, // Italic (h -> Planck constant symbol slot, skip)
  { start: 0x1d468, kind: 'AZ' }, // Bold Italic
  {
    start: 0x1d49c,
    kind: 'AZ',
    exceptions: {
      0x1d4a0: 'G', 0x1d4a1: '?', 0x1d4a3: 'J', 0x1d4a4: 'K',
      0x1d4a7: 'N', 0x1d4a8: 'O', 0x1d4ad: 'T',
      0x1d4ba: 'e', 0x1d4bc: 'g', 0x1d4c4: 'o',
    },
  }, // Script (has several legacy-symbol gaps)
  { start: 0x1d4d0, kind: 'AZ' }, // Bold Script
  {
    start: 0x1d504,
    kind: 'AZ',
    exceptions: { 0x1d506: 'C', 0x1d50b: 'H', 0x1d50c: 'I', 0x1d515: 'R', 0x1d51d: 'Z' },
  }, // Fraktur
  {
    start: 0x1d538,
    kind: 'AZ',
    exceptions: {
      0x1d53a: 'C', 0x1d53f: 'H', 0x1d545: 'N', 0x1d547: 'P', 0x1d548: 'Q', 0x1d549: 'R', 0x1d551: 'Z',
    },
  }, // Double-struck
  { start: 0x1d56c, kind: 'AZ' }, // Bold Fraktur
  { start: 0x1d5a0, kind: 'AZ' }, // Sans-serif
  { start: 0x1d5d4, kind: 'AZ' }, // Sans-serif Bold
  { start: 0x1d608, kind: 'AZ' }, // Sans-serif Italic
  { start: 0x1d63c, kind: 'AZ' }, // Sans-serif Bold Italic
  { start: 0x1d670, kind: 'AZ' }, // Monospace
  { start: 0x1d7ce, kind: 'digits' }, // Bold digits
  { start: 0x1d7d8, kind: 'digits' }, // Double-struck digits
  { start: 0x1d7e2, kind: 'digits' }, // Sans-serif digits
  { start: 0x1d7ec, kind: 'digits' }, // Sans-serif Bold digits
  { start: 0x1d7f6, kind: 'digits' }, // Monospace digits
]

const CODEPOINT_MAP = new Map<number, string>()
for (const block of BLOCKS) {
  const length = block.kind === 'AZ' ? 52 : 10
  for (let i = 0; i < length; i++) {
    const cp = block.start + i
    if (block.exceptions?.[cp]) continue // legacy-symbol gap, leave untouched
    const ascii = block.kind === 'AZ'
      ? String.fromCharCode((i < 26 ? 65 : 97) + (i % 26))
      : String.fromCharCode(48 + i)
    CODEPOINT_MAP.set(cp, ascii)
  }
}

/** Replaces fake-bold/italic/script/etc. Unicode letters and digits with plain ASCII. Leaves emoji and everything else untouched. */
export function normalizeUnicodeText(text: string): string {
  return Array.from(text).map(ch => {
    const cp = ch.codePointAt(0)!
    return CODEPOINT_MAP.get(cp) ?? ch
  }).join('')
}
