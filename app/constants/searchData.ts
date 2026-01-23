// Dummy data for unified search suggestions
import { isClaimedFoodBrand } from './foodAndDiningBrands'

// Brand data - unique brands only (for brand suggestions)
export const brands = [
  { id: 'tb', name: 'Taco Bell', image: '/images/brands/taco-bell.svg', claimed: true },
  { id: 'br', name: 'Baskin-Robbins', image: '/images/brands/BR.png', claimed: false },
  { id: 'tbc', name: 'Taco Mahal', image: '/images/brands/store.svg', claimed: isClaimedFoodBrand('Taco Mahal') },
  { id: 'tt', name: 'Taco Time', image: '/images/brands/store.svg', claimed: isClaimedFoodBrand('Taco Time') },
]

// Location data - brand locations with addresses
export const locations = [
  // Taco Bell locations (at least 8)
  { id: 'tb1', brandName: 'Taco Bell', address: '200 W 34th St, New York, NY 10001' },
  { id: 'tb2', brandName: 'Taco Bell', address: '81 Delancey St, New York, NY 10002' },
  { id: 'tb3', brandName: 'Taco Bell', address: '570 Lexington Ave, New York, NY 10022' },
  { id: 'tb4', brandName: 'Taco Bell', address: '123 Main St, Los Angeles, CA 90001' },
  { id: 'tb5', brandName: 'Taco Bell', address: '456 Broadway, New York, NY 10013' },
  { id: 'tb6', brandName: 'Taco Bell', address: '789 Market St, San Francisco, CA 94102' },
  { id: 'tb7', brandName: 'Taco Bell', address: '321 Elm Ave, Chicago, IL 60601' },
  { id: 'tb8', brandName: 'Taco Bell', address: '654 Oak Blvd, Houston, TX 77001' },
  // Baskin-Robbins locations
  { id: 'br1', brandName: 'Baskin-Robbins', address: '150 Broadway, New York, NY 10038' },
  { id: 'br2', brandName: 'Baskin-Robbins', address: '89 5th Ave, New York, NY 10003' },
  { id: 'br3', brandName: 'Baskin-Robbins', address: '234 Madison Ave, New York, NY 10016' },
  { id: 'br4', brandName: 'Baskin-Robbins', address: '567 Park Ave S, New York, NY 10010' },
  { id: 'br5', brandName: 'Baskin-Robbins', address: '123 3rd Ave, New York, NY 10003' },
  { id: 'br6', brandName: 'Baskin-Robbins', address: '890 Lexington Ave, New York, NY 10021' },
  { id: 'br7', brandName: 'Baskin-Robbins', address: '789 Sunset Blvd, Los Angeles, CA 90028' },
  { id: 'br8', brandName: 'Baskin-Robbins', address: '321 Main St, Houston, TX 77002' },
  // Other brand locations
  { id: 'ph1', brandName: 'Pizza Hut', address: '100 Broadway, New York, NY 10005' },
  { id: 'kfc1', brandName: 'KFC', address: '250 Park Ave, New York, NY 10017' },
]

// Legacy exports for backward compatibility (if needed elsewhere)
export const brandSuggestions = brands.map(b => ({ 
  id: b.id, 
  name: b.name, 
  address: '', 
  rating: 4.2 
}))

export const locationSuggestions = [
  { id: '1', city: 'New York', state: 'NY', full: 'New York, NY' },
  { id: '2', city: 'Los Angeles', state: 'CA', full: 'Los Angeles, CA' },
  { id: '3', city: 'Chicago', state: 'IL', full: 'Chicago, IL' },
]

// Function to filter brands based on search query
export function filterBrands(query: string) {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return brands.filter(brand => 
    brand.name.toLowerCase().includes(lowerQuery)
  )
}

// Function to filter locations based on search query
export function filterLocations(query: string) {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return locations.filter(location => 
    location.brandName.toLowerCase().includes(lowerQuery) ||
    location.address.toLowerCase().includes(lowerQuery)
  )
}

