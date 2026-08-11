/**
 * iPhone Product Image Provider
 * 
 * Provides automatic image resolution for iPhone products based on model.
 * This system uses a centralized mapping to ensure consistent, accurate product images.
 * 
 * Image Source: CONFIGURATION REQUIRED
 * 
 * CURRENT STATE: Using placeholder/fallback system
 * 
 * TO CONFIGURE PRODUCTION IMAGES:
 * 1. Replace the imageUrl values in IPHONE_IMAGE_MAPPINGS with legitimate image URLs from:
 *    - Apple's official product images (requires authorization)
 *    - Your own product photography hosted on your CDN
 *    - Licensed stock images
 * 2. All images must be legally licensed for commercial use
 * 3. DO NOT use scraped images, hotlinks, or unauthorized sources
 * 
 * Configuration Point: IPHONE_IMAGE_MAPPINGS object below
 */

export interface IPhoneImageConfig {
  model: string;
  series: string;
  imageKey: string;
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Image mappings for iPhone models
 * 
 * CURRENT CONFIGURATION: Using null/empty to trigger fallback system
 * 
 * To configure production images, replace imageUrl with legitimate URLs.
 * Example:
 *   imageUrl: 'https://your-cdn.com/iphone-15-pro-max.png'
 * 
 * The imageKey is used as a stable identifier that can be mapped to different image sources.
 */
const IPHONE_IMAGE_MAPPINGS: Record<string, IPhoneImageConfig> = {
  // iPhone 17 Series
  'iphone-17-pro-max': {
    model: 'iPhone 17 Pro Max',
    series: 'iPhone 17',
    imageKey: 'iphone-17-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 17 Pro Max',
  },
  
  // iPhone 16 Series
  'iphone-16-pro-max': {
    model: 'iPhone 16 Pro Max',
    series: 'iPhone 16',
    imageKey: 'iphone-16-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 16 Pro Max',
  },
  'iphone-16-plus': {
    model: 'iPhone 16 Plus',
    series: 'iPhone 16',
    imageKey: 'iphone-16-plus',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 16 Plus',
  },
  'iphone-16': {
    model: 'iPhone 16',
    series: 'iPhone 16',
    imageKey: 'iphone-16',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 16',
  },
  
  // iPhone 15 Series
  'iphone-15-pro-max': {
    model: 'iPhone 15 Pro Max',
    series: 'iPhone 15',
    imageKey: 'iphone-15-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 15 Pro Max',
  },
  'iphone-15-plus': {
    model: 'iPhone 15 Plus',
    series: 'iPhone 15',
    imageKey: 'iphone-15-plus',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 15 Plus',
  },
  'iphone-15': {
    model: 'iPhone 15',
    series: 'iPhone 15',
    imageKey: 'iphone-15',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 15',
  },
  
  // iPhone 14 Series
  'iphone-14-pro-max': {
    model: 'iPhone 14 Pro Max',
    series: 'iPhone 14',
    imageKey: 'iphone-14-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 14 Pro Max',
  },
  'iphone-14-pro': {
    model: 'iPhone 14 Pro',
    series: 'iPhone 14',
    imageKey: 'iphone-14-pro',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 14 Pro',
  },
  'iphone-14-plus': {
    model: 'iPhone 14 Plus',
    series: 'iPhone 14',
    imageKey: 'iphone-14-plus',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 14 Plus',
  },
  'iphone-14': {
    model: 'iPhone 14',
    series: 'iPhone 14',
    imageKey: 'iphone-14',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 14',
  },
  
  // iPhone 13 Series
  'iphone-13-pro-max': {
    model: 'iPhone 13 Pro Max',
    series: 'iPhone 13',
    imageKey: 'iphone-13-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 13 Pro Max',
  },
  'iphone-13-pro': {
    model: 'iPhone 13 Pro',
    series: 'iPhone 13',
    imageKey: 'iphone-13-pro',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 13 Pro',
  },
  'iphone-13': {
    model: 'iPhone 13',
    series: 'iPhone 13',
    imageKey: 'iphone-13',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 13',
  },
  
  // iPhone 12 Series
  'iphone-12-pro-max': {
    model: 'iPhone 12 Pro Max',
    series: 'iPhone 12',
    imageKey: 'iphone-12-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 12 Pro Max',
  },
  'iphone-12-pro': {
    model: 'iPhone 12 Pro',
    series: 'iPhone 12',
    imageKey: 'iphone-12-pro',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 12 Pro',
  },
  'iphone-12': {
    model: 'iPhone 12',
    series: 'iPhone 12',
    imageKey: 'iphone-12',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 12',
  },
  
  // iPhone 11 Series
  'iphone-11-pro-max': {
    model: 'iPhone 11 Pro Max',
    series: 'iPhone 11',
    imageKey: 'iphone-11-pro-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 11 Pro Max',
  },
  'iphone-11-pro': {
    model: 'iPhone 11 Pro',
    series: 'iPhone 11',
    imageKey: 'iphone-11-pro',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 11 Pro',
  },
  'iphone-11': {
    model: 'iPhone 11',
    series: 'iPhone 11',
    imageKey: 'iphone-11',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone 11',
  },
  
  // iPhone X / XR / XS Series
  'iphone-xs-max': {
    model: 'iPhone XS Max',
    series: 'iPhone X / XR / XS',
    imageKey: 'iphone-xs-max',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone XS Max',
  },
  'iphone-xr': {
    model: 'iPhone XR',
    series: 'iPhone X / XR / XS',
    imageKey: 'iphone-xr',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone XR',
  },
  'iphone-x': {
    model: 'iPhone X',
    series: 'iPhone X / XR / XS',
    imageKey: 'iphone-x',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone X',
  },
  
  // Default fallback
  'default': {
    model: 'iPhone',
    series: 'iPhone',
    imageKey: 'default',
    imageUrl: '', // CONFIGURE: Add legitimate image URL
    width: 400,
    height: 400,
    alt: 'iPhone',
  },
};

/**
 * Convert model name to image key
 * Normalizes the model name to a consistent format
 */
export function modelToImageKey(model: string): string {
  if (!model) return 'default';
  
  const normalized = model
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Check if we have a direct mapping
  if (IPHONE_IMAGE_MAPPINGS[normalized]) {
    return normalized;
  }
  
  // Try to find a partial match
  const keys = Object.keys(IPHONE_IMAGE_MAPPINGS);
  for (const key of keys) {
    if (normalized.includes(key.replace('-', ' '))) {
      return key;
    }
  }
  
  // Default fallback
  return 'default';
}

/**
 * Get image configuration for a model
 */
export function getIPhoneImageConfig(model: string): IPhoneImageConfig {
  const imageKey = modelToImageKey(model);
  return IPHONE_IMAGE_MAPPINGS[imageKey] || IPHONE_IMAGE_MAPPINGS['default'];
}

/**
 * Get image URL for a model
 */
export function getIPhoneImageUrl(model: string): string {
  const config = getIPhoneImageConfig(model);
  return config.imageUrl;
}

/**
 * Get image URL from image key directly
 */
export function getImageUrlByKey(imageKey: string): string {
  const config = IPHONE_IMAGE_MAPPINGS[imageKey];
  return config?.imageUrl || '/images/default-iphone.png';
}

/**
 * Add a custom image mapping (for admin overrides)
 */
export function addCustomImageMapping(imageKey: string, imageUrl: string): void {
  if (IPHONE_IMAGE_MAPPINGS[imageKey]) {
    IPHONE_IMAGE_MAPPINGS[imageKey].imageUrl = imageUrl;
  }
}

/**
 * Get all available image keys
 */
export function getAllImageKeys(): string[] {
  return Object.keys(IPHONE_IMAGE_MAPPINGS);
}

/**
 * Check if an image key exists
 */
export function hasImageKey(imageKey: string): boolean {
  return imageKey in IPHONE_IMAGE_MAPPINGS;
}
