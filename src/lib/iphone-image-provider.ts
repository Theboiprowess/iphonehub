/**
 * iPhone Product Image Provider
 * 
 * Manual Upload Only - No Automatic Images
 * 
 * This system only provides images when they are manually uploaded.
 * No automatic Apple CDN images are used.
 * 
 * Images must be manually uploaded via the admin panel for each product.
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
 * Empty image mappings - Manual upload only
 * 
 * All automatic image sources have been removed.
 * Images must be manually uploaded via admin panel.
 */
const IPHONE_IMAGE_MAPPINGS: Record<string, IPhoneImageConfig> = {
  // No automatic images - manual upload only
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
  
  // Try to find a partial match - check each key
  const keys = Object.keys(IPHONE_IMAGE_MAPPINGS);
  for (const key of keys) {
    const keyWithoutDashes = key.replace(/-/g, ' ');
    const normalizedWithoutDashes = normalized.replace(/-/g, ' ');
    
    // Check if model contains the key name
    if (normalizedWithoutDashes.includes(keyWithoutDashes) || keyWithoutDashes.includes(normalizedWithoutDashes)) {
      return key;
    }
    
    // Check for specific model patterns
    if (normalized.includes('pro-max') && key.includes('pro-max')) {
      return key;
    }
    if (normalized.includes('pro') && key.includes('pro') && !key.includes('pro-max')) {
      return key;
    }
    if (normalized.includes('plus') && key.includes('plus')) {
      return key;
    }
  }
  
  // Comprehensive series matching with specific patterns
  // iPhone 17
  if (normalized.includes('17')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-17-pro-max';
    if (normalized.includes('pro')) return 'iphone-17-pro-max';
    if (normalized.includes('plus')) return 'iphone-16-plus';
    return 'iphone-17-pro-max';
  }
  
  // iPhone 16
  if (normalized.includes('16')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-16-pro-max';
    if (normalized.includes('pro')) return 'iphone-16-pro-max';
    if (normalized.includes('plus')) return 'iphone-16-plus';
    return 'iphone-16';
  }
  
  // iPhone 15
  if (normalized.includes('15')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-15-pro-max';
    if (normalized.includes('pro')) return 'iphone-15-pro-max';
    if (normalized.includes('plus')) return 'iphone-15-plus';
    return 'iphone-15';
  }
  
  // iPhone 14
  if (normalized.includes('14')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-14-pro-max';
    if (normalized.includes('pro')) return 'iphone-14-pro';
    if (normalized.includes('plus')) return 'iphone-14-plus';
    if (normalized.includes('mini')) return 'iphone-14-mini';
    return 'iphone-14';
  }
  
  // iPhone 13
  if (normalized.includes('13')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-13-pro-max';
    if (normalized.includes('pro')) return 'iphone-13-pro';
    if (normalized.includes('mini')) return 'iphone-13-mini';
    return 'iphone-13';
  }
  
  // iPhone 12
  if (normalized.includes('12')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-12-pro-max';
    if (normalized.includes('pro')) return 'iphone-12-pro';
    if (normalized.includes('mini')) return 'iphone-12-mini';
    return 'iphone-12';
  }
  
  // iPhone 13
  if (normalized.includes('13')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-13-pro-max';
    if (normalized.includes('pro')) return 'iphone-13-pro';
    if (normalized.includes('mini')) return 'iphone-13-mini';
    return 'iphone-13';
  }
  
  // iPhone 12
  if (normalized.includes('12')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-12-pro-max';
    if (normalized.includes('pro')) return 'iphone-12-pro';
    if (normalized.includes('mini')) return 'iphone-12-mini';
    return 'iphone-12';
  }
  
  // iPhone 11
  if (normalized.includes('11')) {
    if (normalized.includes('pro-max') || normalized.includes('promax')) return 'iphone-11-pro-max';
    if (normalized.includes('pro')) return 'iphone-11-pro';
    return 'iphone-11';
  }
  
  // iPhone X series
  if (normalized.includes('xs') && normalized.includes('max')) return 'iphone-xs-max';
  if (normalized.includes('xs')) return 'iphone-xs-max';
  if (normalized.includes('xr')) return 'iphone-xr';
  if (normalized.includes('x')) return 'iphone-x';
  
  // iPhone SE
  if (normalized.includes('se')) {
    if (normalized.includes('3') || normalized.includes('2022') || normalized.includes('2023')) return 'iphone-se-3';
    if (normalized.includes('2') || normalized.includes('2020')) return 'iphone-se-2';
    return 'iphone-se-3';
  }
  
  // iPhone 8
  if (normalized.includes('8')) {
    if (normalized.includes('plus')) return 'iphone-8-plus';
    return 'iphone-8';
  }
  
  // iPhone 7
  if (normalized.includes('7')) {
    if (normalized.includes('plus')) return 'iphone-7-plus';
    return 'iphone-7';
  }
  
  // Default fallback - use iPhone 15 as the most recent reliable image
  return 'default';
}

/**
 * Get image configuration for a model
 */
export function getIPhoneImageConfig(model: string): IPhoneImageConfig | null {
  const imageKey = modelToImageKey(model);
  return IPHONE_IMAGE_MAPPINGS[imageKey] || null;
}

/**
 * Get image URL for a model
 * Returns null if no manual image is uploaded
 */
export function getIPhoneImageUrl(model: string): string | null {
  const config = getIPhoneImageConfig(model);
  return config?.imageUrl || null;
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