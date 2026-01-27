import { IMAGES } from '../constants/images'
import { getBrandBySlug, countBrandLocations } from '../constants/brandData'
import { isClaimedFoodBrand } from '../constants/foodAndDiningBrands'

export interface BrandCardData {
  name: string
  locations: string
  category: string
  rating: number
  logo: string
  claimed: boolean
}

// Helper to get brand logo
function getBrandLogo(brandName: string): string {
  const normalized = brandName.toLowerCase()
  
  if (normalized === 'taco bell') {
    return IMAGES.brands.tacoBell
  }
  if (normalized === 'baskin-robbins') {
    return IMAGES.brands.baskinRobbins
  }
  if (normalized === 'starbucks') {
    return IMAGES.brands.starbucks
  }
  if (normalized === 'western union') {
    return IMAGES.brands.westernUnion
  }
  if (normalized === "freddy's custard" || normalized === "freddy's frozen custard & steakburgers") {
    return IMAGES.brands.freddys
  }
  if (normalized === 'advance auto parts') {
    return IMAGES.brands.advanceAuto
  }
  if (normalized === 'lenscrafters') {
    return IMAGES.brands.lensCrafters
  }
  
  // Default logo
  return IMAGES.brands.all
}

// Helper to get location count
function getLocationCount(brandName: string, claimed: boolean): number {
  const normalized = brandName.toLowerCase()
  
  // For Taco Bell and Baskin-Robbins, get actual count
  if (normalized === 'taco bell' || normalized === 'baskin-robbins') {
    const slug = normalized === 'taco bell' ? 'taco-bell' : 'baskin-robbins'
    const brandData = getBrandBySlug(slug)
    if (brandData) {
      const count = countBrandLocations(brandData)
      return count * 1000 // Scale to thousands
    }
  }
  
  // Generate consistent random number for other brands
  let hash = 0
  for (let i = 0; i < brandName.length; i++) {
    hash = ((hash << 5) - hash) + brandName.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash % 4990) + 10
}

// Helper to format location count as string
function formatLocationCount(count: number): string {
  return `${count.toLocaleString()} locations`
}

// Helper to get category
function getCategory(brandName: string): string {
  const normalized = brandName.toLowerCase()
  
  // Check if we have brand data
  const slug = normalized === 'taco bell' ? 'taco-bell' : normalized === 'baskin-robbins' ? 'baskin-robbins' : null
  if (slug) {
    const brandData = getBrandBySlug(slug)
    if (brandData) {
      return brandData.category
    }
  }
  
  // Default categories based on brand name patterns
  if (normalized.includes('hardware') || normalized.includes('lumber') || normalized.includes('supply') || 
      normalized === 'home depot' || normalized === "lowe's" || normalized === 'ace hardware' ||
      normalized === 'true value' || normalized === 'menards' || normalized === 'harbor freight' ||
      normalized === 'northern tool' || normalized === 'tractor supply' || normalized === 'fastenal' ||
      normalized === 'grainger' || normalized === 'do it best' || normalized === '84 lumber' ||
      normalized === 'build.com' || normalized === 'sears hardware' || normalized === 'orchard supply' ||
      normalized === 'westlake ace hardware' || normalized === 'handyman' || normalized === 'builders firstsource' ||
      normalized === 'stock building supply' || normalized === 'hd supply') {
    return 'Home & Garden'
  }
  
  // Default to Food & Dining for most brands in our lists
  return 'Food & Dining'
}

// Main function to convert brand name to brand card data
export function brandNameToCardData(brandName: string, isClaimed?: boolean): BrandCardData {
  // Determine claimed status
  let claimed = false
  if (isClaimed !== undefined) {
    claimed = isClaimed
  } else {
    const normalized = brandName.toLowerCase()
    if (normalized === 'taco bell') {
      claimed = true
    } else if (normalized === 'baskin-robbins') {
      claimed = false
    } else {
      // Use hash-based logic for other brands
      let hash = 0
      for (let i = 0; i < brandName.length; i += 1) {
        hash = (hash * 31 + brandName.charCodeAt(i)) % 1000
      }
      claimed = hash % 3 !== 0
    }
  }
  
  const locationCount = getLocationCount(brandName, claimed)
  
  return {
    name: brandName,
    locations: formatLocationCount(locationCount),
    category: getCategory(brandName),
    rating: 4.5,
    logo: getBrandLogo(brandName),
    claimed,
  }
}

// Convert array of brand names to brand card data
export function brandNamesToCardData(brandNames: readonly string[], isClaimedFn?: (name: string) => boolean): BrandCardData[] {
  return brandNames.map(name => {
    const claimed = isClaimedFn ? isClaimedFn(name) : undefined
    return brandNameToCardData(name, claimed)
  })
}

