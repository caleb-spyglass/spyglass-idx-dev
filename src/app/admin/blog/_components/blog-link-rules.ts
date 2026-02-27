/**
 * Blog Link Rules
 * - Internal links: auto-append ?itm_source=blog tracking param
 * - External links: auto-add rel="noopener noreferrer" + target="_blank"
 * - Images: loading="lazy" on non-hero images (first image is hero)
 */

const INTERNAL_DOMAINS = [
  'spyglassrealty.com',
  'www.spyglassrealty.com',
  'spyglass-idx.vercel.app',
  'localhost',
];

/**
 * Process HTML content to apply link rules and image rules.
 * This runs on the rendered HTML before displaying on the published page.
 */
export function applyBlogContentRules(html: string): string {
  let processed = html;

  // Process links
  processed = processed.replace(
    /<a\s([^>]*?)href="([^"]*)"([^>]*?)>/gi,
    (_match, before, href, after) => {
      try {
        const url = new URL(href, 'https://spyglassrealty.com');
        const isInternal = INTERNAL_DOMAINS.some(
          (d) => url.hostname === d || url.hostname.endsWith(`.${d}`)
        );

        if (isInternal) {
          // Add tracking param
          if (!url.searchParams.has('itm_source')) {
            url.searchParams.set('itm_source', 'blog');
          }
          return `<a ${before}href="${url.toString()}"${after}>`;
        } else {
          // External link: add rel and target
          let attrs = `${before}href="${href}"${after}`;
          if (!attrs.includes('rel=')) {
            attrs += ' rel="noopener noreferrer"';
          }
          if (!attrs.includes('target=')) {
            attrs += ' target="_blank"';
          }
          return `<a ${attrs}>`;
        }
      } catch {
        // If URL parsing fails, return as-is
        return `<a ${before}href="${href}"${after}>`;
      }
    }
  );

  // Process images: add loading="lazy" to all images that don't have it
  // (hero image handling is done in the page component, not here)
  processed = processed.replace(
    /<img\s([^>]*?)>/gi,
    (_match, attrs) => {
      if (!attrs.includes('loading=')) {
        return `<img ${attrs} loading="lazy">`;
      }
      return `<img ${attrs}>`;
    }
  );

  return processed;
}
