// Helper functions for brand navigation

// Map brand names to their category slugs
const brandNameToSlug: Record<string, string> = {
  'taco bell': 'taco-bell',
  'baskin-robbins': 'baskin-robbins',
  'baskin robbins': 'baskin-robbins',
  'pizza hut': 'pizza-hut',
  'kfc': 'kfc',
  'starbucks': 'starbucks',
  'western union': 'western-union',
  "Freddy's Custard": 'freddys',
  'advance auto parts': 'advance-auto-parts',
  'lenscrafters': 'lenscrafters',
}

// Map brand names to their category paths
const brandNameToCategory: Record<string, string> = {
  'taco bell': 'food-and-dining',
  'baskin-robbins': 'food-and-dining',
  'baskin robbins': 'food-and-dining',
  'pizza hut': 'food-and-dining',
  'kfc': 'food-and-dining',
  'starbucks': 'food-and-dining',
  'western union': 'financial-services',
  "Freddy's Custard": 'food-and-dining',
  'advance auto parts': 'automotive',
  'lenscrafters': 'health',
}

// Map location addresses to business slugs (for Taco Bell and Baskin-Robbins locations)
const locationAddressToSlug: Record<string, string> = {
  // Taco Bell locations
  '200 W 34th St, New York, NY 10001': 'taco-bell-200-w-34th-st',
  '81 Delancey St, New York, NY 10002': 'taco-bell-81-delancey-st',
  '570 Lexington Ave, New York, NY 10022': 'taco-bell-570-lexington-ave',
  '456 Broadway, New York, NY 10013': 'taco-bell-456-broadway',
  '234 5th Ave, New York, NY 10001': 'taco-bell-234-5th-ave',
  '789 Park Ave, New York, NY 10021': 'taco-bell-789-park-ave',
  '123 Main St, Los Angeles, CA 90001': 'taco-bell-la-main-st',
  '789 Market St, San Francisco, CA 94102': 'taco-bell-sf-market-st',
  '321 Elm Ave, Chicago, IL 60601': 'taco-bell-chicago-elm',
  '654 Oak Blvd, Houston, TX 77001': 'taco-bell-houston-oak',
  // Baskin-Robbins locations
  '150 Broadway, New York, NY 10038': 'baskin-robbins-150-broadway',
  '89 5th Ave, New York, NY 10003': 'baskin-robbins-89-5th-ave',
  '234 Madison Ave, New York, NY 10016': 'baskin-robbins-234-madison-ave',
  '567 Park Ave S, New York, NY 10010': 'baskin-robbins-567-park-ave-s',
  '123 3rd Ave, New York, NY 10003': 'baskin-robbins-123-3rd-ave',
  '890 Lexington Ave, New York, NY 10021': 'baskin-robbins-890-lexington-ave',
  '456 State St, Albany, NY 12210': 'baskin-robbins-albany-state-st',
  '789 Sunset Blvd, Los Angeles, CA 90028': 'baskin-robbins-la-sunset-blvd',
  '321 Main St, Houston, TX 77002': 'baskin-robbins-houston-main-st',
  // Additional mappings for other locations (fallback to first NY location if not found)
}

/**
 * Get the brand page URL for a given brand name
 */
export function getBrandPageUrl(brandName: string): string | null {
  const normalizedName = brandName.toLowerCase().trim()
  const slug = brandNameToSlug[normalizedName]
  const category = brandNameToCategory[normalizedName]
  
  if (slug && category) {
    return `/categories/${category}/${slug}`
  }
  
  return null
}

/**
 * Get the business page URL for a given location address
 */
export function getBusinessPageUrl(address: string): string | null {
  const normalizedAddress = address.trim()
  const slug = locationAddressToSlug[normalizedAddress]
  
  if (slug) {
    return `/business/${slug}`
  }
  
  return null
}

