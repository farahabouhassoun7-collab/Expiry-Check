/**
 * Image Registry — auto-discovery via Vite's import.meta.glob.
 *
 * HOW IT WORKS
 * ────────────
 * At build time Vite scans every file matching the glob pattern and
 * bundles each image with a hashed URL. We never manually import or
 * hardcode image paths here.
 *
 * MATCHING ALGORITHM  (getProductImage)
 * ───────────────────────────────────────
 * Both the product name AND each image filename are run through the
 * same normalizer before comparison:
 *
 *   normalize("Organic Hydration Serum - Batch A1") → "organichydrationserum"
 *   normalize("organic hydro.jpg")                  → "organichydro"
 *
 * A product name MATCHES an image when:
 *   • exact match after normalization, OR
 *   • the normalized filename is a PREFIX of the normalized product name, OR
 *   • the normalized product name CONTAINS the normalized filename (≥ 4 chars)
 *
 * This handles real-world filenames like "organic hydro.jpg" matching
 * "Organic Hydration Serum" without any manual registry entry.
 *
 * USAGE
 * ─────
 *   import { getProductImage } from '@/assets/images';
 *   const url = getProductImage('Organic Hydration Serum');
 *   // → "/assets/organic hydro-Abc123.jpg"  (Vite hashed URL)
 *   // → undefined if no match (ProductImage shows initials fallback)
 */

// Auto-import every image file in this directory (exclude this JS file).
// eager: true  → synchronous, URLs available immediately (no lazy loading needed at registry level)
const IMAGE_MODULES = import.meta.glob(
  './*.{jpg,jpeg,png,webp,gif,svg,avif}',
  { eager: true }
);

/**
 * Build a lookup map:
 *   normalizedBasename → resolvedURL
 *
 * e.g. "organichydro" → "/assets/organic hydro-Abc123.jpg"
 */
const IMAGE_MAP = Object.entries(IMAGE_MODULES).reduce((acc, [path, mod]) => {
  // path looks like "./organic hydro.jpg"
  const filename = path.replace(/^\.\//, '');               // "organic hydro.jpg"
  const basename = filename.replace(/\.[^.]+$/, '');        // "organic hydro"
  const key      = normalize(basename);                     // "organichydro"
  const url      = mod.default ?? mod;                      // resolved asset URL
  acc[key] = url;
  return acc;
}, {});

/**
 * Normalize a string for fuzzy comparison.
 * Removes spaces, hyphens, underscores, dots, and non-alphanumeric chars,
 * then lowercases. Truncates batch/variant suffixes after common separators.
 *
 * @param {string} str
 * @returns {string}
 */
export function normalize(str = '') {
  return str
    .toLowerCase()
    // Drop everything after " - " or " (" (batch IDs, sizes, variants)
    .replace(/\s*[-–]\s.*$/, '')
    .replace(/\s*\(.*$/, '')
    // Strip separators and non-alphanumeric
    .replace(/[\s\-_.,()[\]!?'"/\\]+/g, '')
    .trim();
}

/**
 * getProductImage — resolve a product name to its image URL.
 *
 * Priority order:
 *   1. Exact normalized match   (normalize(name) === normalize(filename))
 *   2. Prefix match             (normalized filename is a prefix of normalized name, min 4 chars)
 *   3. Contains match           (normalized name contains normalized filename, min 4 chars)
 *
 * Returns undefined when no image found — ProductImage will show the
 * initials fallback in that case.
 *
 * @param {string} productName
 * @returns {string|undefined}
 */
export function getProductImage(productName) {
  if (!productName) return undefined;

  const needle = normalize(productName);
  if (!needle) return undefined;

  // 1. Exact match
  if (IMAGE_MAP[needle]) return IMAGE_MAP[needle];

  // 2 & 3. Fuzzy: iterate all registered images
  let bestMatch;
  let bestScore = 0;

  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    // Exact — already handled above but included for completeness
    if (key === needle) return url;

    // Prefix: filename key is a prefix of the product needle (e.g. "organichydro" ⊂ "organichydrationserum")
    if (key.length >= 4 && needle.startsWith(key)) {
      const score = key.length;
      if (score > bestScore) { bestScore = score; bestMatch = url; }
    }

    // Contains: needle contains the key (looser, used as fallback)
    if (key.length >= 4 && needle.includes(key)) {
      const score = key.length * 0.8;
      if (score > bestScore) { bestScore = score; bestMatch = url; }
    }
  }

  return bestMatch;
}

/**
 * Returns all registered image entries for debugging / dev tooling.
 * @returns {Record<string, string>}
 */
export function getAllImages() {
  return { ...IMAGE_MAP };
}
