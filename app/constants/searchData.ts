// Dummy data for unified search suggestions
import { isClaimedFoodBrand } from './foodAndDiningBrands'

// Brand data - unique brands only (for brand suggestions)
export const brands = [
  { id: 'tb', name: 'Taco Bell', image: '/images/brands/taco-bell.svg', claimed: true },
  { id: 'br', name: 'Baskin-Robbins', image: '/images/brands/BR.png', claimed: false },
  { id: 'tbc', name: 'Taco Mahal', image: '/images/brands/store.svg', claimed: isClaimedFoodBrand('Taco Mahal') },
  { id: 'tt', name: 'Taco Time', image: '/images/brands/store.svg', claimed: isClaimedFoodBrand('Taco Time') },
  // Hardware stores
  { id: 'hd1', name: 'Home Depot', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd2', name: 'Lowe\'s', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd3', name: 'Ace Hardware', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd4', name: 'True Value', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd5', name: 'Menards', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd6', name: 'Harbor Freight Tools', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd7', name: 'Northern Tool', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd8', name: 'Tractor Supply', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd9', name: 'Fastenal', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd10', name: 'Grainger', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd11', name: 'Do it Best', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd12', name: '84 Lumber', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd13', name: 'Build.com', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd14', name: 'Sears Hardware', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd15', name: 'Orchard Supply Hardware', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd16', name: 'Westlake Ace Hardware', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd17', name: 'Handyman', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd18', name: 'Builders FirstSource', image: '/images/brands/store.svg', claimed: true },
  { id: 'hd19', name: 'Stock Building Supply', image: '/images/brands/store.svg', claimed: false },
  { id: 'hd20', name: 'HD Supply', image: '/images/brands/store.svg', claimed: true },
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
  // Hardware store locations
  { id: 'hd1', brandName: 'Home Depot', address: '40 W 23rd St, New York, NY 10010' },
  { id: 'hd2', brandName: 'Home Depot', address: '620 6th Ave, New York, NY 10011' },
  { id: 'hd3', brandName: 'Home Depot', address: '585 3rd Ave, New York, NY 10016' },
  { id: 'hd4', brandName: 'Lowe\'s', address: '200 5th Ave, New York, NY 10010' },
  { id: 'hd5', brandName: 'Lowe\'s', address: '1234 Broadway, New York, NY 10001' },
  { id: 'hd6', brandName: 'Ace Hardware', address: '789 Lexington Ave, New York, NY 10021' },
  { id: 'hd7', brandName: 'Ace Hardware', address: '456 Park Ave, New York, NY 10022' },
  { id: 'hd8', brandName: 'True Value', address: '321 Madison Ave, New York, NY 10017' },
  { id: 'hd9', brandName: 'True Value', address: '567 2nd Ave, New York, NY 10016' },
  { id: 'hd10', brandName: 'Menards', address: '890 1st Ave, New York, NY 10022' },
  { id: 'hd11', brandName: 'Harbor Freight Tools', address: '234 3rd Ave, New York, NY 10003' },
  { id: 'hd12', brandName: 'Northern Tool', address: '678 Broadway, New York, NY 10012' },
  { id: 'hd13', brandName: 'Tractor Supply', address: '345 5th Ave, New York, NY 10016' },
  { id: 'hd14', brandName: 'Home Depot', address: '123 1st Ave, New York, NY 10009' },
  { id: 'hd15', brandName: 'Lowe\'s', address: '456 2nd Ave, New York, NY 10010' },
  { id: 'hd16', brandName: 'Ace Hardware', address: '789 3rd Ave, New York, NY 10016' },
  { id: 'hd17', brandName: 'True Value', address: '321 4th Ave, New York, NY 10010' },
  { id: 'hd18', brandName: 'Menards', address: '654 5th Ave, New York, NY 10019' },
  { id: 'hd19', brandName: 'Harbor Freight Tools', address: '987 6th Ave, New York, NY 10018' },
  { id: 'hd20', brandName: 'Northern Tool', address: '147 7th Ave, New York, NY 10011' },
  { id: 'hd21', brandName: 'Tractor Supply', address: '258 8th Ave, New York, NY 10011' },
  { id: 'hd22', brandName: 'Fastenal', address: '369 9th Ave, New York, NY 10001' },
  { id: 'hd23', brandName: 'Grainger', address: '741 10th Ave, New York, NY 10019' },
  { id: 'hd24', brandName: 'Do it Best', address: '852 11th Ave, New York, NY 10019' },
  { id: 'hd25', brandName: '84 Lumber', address: '963 12th Ave, New York, NY 10027' },
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

