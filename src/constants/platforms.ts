// List of supported platforms mirrored from backend platformNameLabel in api/validate.ts
// Keep this list in sync with the backend mapping
export const SUPPORTED_PLATFORMS: string[] = [
  // Core social + discovery
  'twitter',       // X
  'reddit',
  'linkedin',
  'instagram',
  'tiktok',
  'youtube',
  'facebook',
  'producthunt',
  'pinterest',

  // Dev & tech
  'github',
  'stackoverflow',
  'hackernews',

  // Business & market intel
  'angellist',
  'crunchbase',
  'medium',

  // Design & creative
  'dribbble',
  'behance',
  'figma',
  'canva',

  // Pro/creator & knowledge
  'substack',
  'notion',
  'devto',
  'hashnode',
  'indiehackers',

  // E‑commerce & retail
  'etsy',
  'amazon',
  'shopify',
  'woocommerce',
];

export const PLATFORM_COUNT = SUPPORTED_PLATFORMS.length;


