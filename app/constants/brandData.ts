// Brand navigation data structure

export interface BrandLocation {
  id: string
  name: string
  address: string
  slug: string
  phone?: string
  claimed: boolean
  rating: number
  reviewCount: number
}

export interface City {
  name: string
  slug: string
  locations: BrandLocation[]
}

export interface State {
  name: string
  slug: string
  cities: City[]
}

export interface Brand {
  name: string
  slug: string
  category: string
  claimed?: boolean
  states: State[]
}

// Taco Bell data
export const tacoBellData: Brand = {
  name: 'Taco Bell',
  slug: 'taco-bell',
  category: 'Food & Dining',
  claimed: true,
  states: [
    {
      name: 'New York',
      slug: 'new-york',
      cities: [
        {
          name: 'New York',
          slug: 'new-york',
          locations: [
            {
              id: 'tb-ny-1',
              name: 'Taco Bell',
              address: '200 W 34th St, New York, NY 10001',
              slug: 'taco-bell-200-w-34th-st',
              phone: '(212) 555-0123',
              claimed: true,
              rating: 4.2,
              reviewCount: 862,
            },
            {
              id: 'tb-ny-2',
              name: 'Taco Bell',
              address: '81 Delancey St, New York, NY 10002',
              slug: 'taco-bell-81-delancey-st',
              phone: '(212) 555-0124',
              claimed: true,
              rating: 4.5,
              reviewCount: 523,
            },
            {
              id: 'tb-ny-3',
              name: 'Taco Bell',
              address: '570 Lexington Ave, New York, NY 10022',
              slug: 'taco-bell-570-lexington-ave',
              phone: '(212) 555-0125',
              claimed: true,
              rating: 4.0,
              reviewCount: 312,
            },
            {
              id: 'tb-ny-4',
              name: 'Taco Bell',
              address: '456 Broadway, New York, NY 10013',
              slug: 'taco-bell-456-broadway',
              phone: '(212) 555-0126',
              claimed: true,
              rating: 4.3,
              reviewCount: 445,
            },
            {
              id: 'tb-ny-5',
              name: 'Taco Bell',
              address: '234 5th Ave, New York, NY 10001',
              slug: 'taco-bell-234-5th-ave',
              phone: '(212) 555-0127',
              claimed: true,
              rating: 4.6,
              reviewCount: 678,
            },
            {
              id: 'tb-ny-6',
              name: 'Taco Bell',
              address: '789 Park Ave, New York, NY 10021',
              slug: 'taco-bell-789-park-ave',
              phone: '(212) 555-0128',
              claimed: true,
              rating: 4.1,
              reviewCount: 389,
            },
          ],
        },
        {
          name: 'Albany',
          slug: 'albany',
          locations: [
            {
              id: 'tb-ny-albany-1',
              name: 'Taco Bell',
              address: '123 Main St, Albany, NY 12201',
              slug: 'taco-bell-albany-main-st',
              claimed: true,
              rating: 4.2,
              reviewCount: 234,
            },
          ],
        },
      ],
    },
    {
      name: 'California',
      slug: 'california',
      cities: [
        {
          name: 'Los Angeles',
          slug: 'los-angeles',
          locations: [
            {
              id: 'tb-ca-la-1',
              name: 'Taco Bell',
              address: '123 Main St, Los Angeles, CA 90001',
              slug: 'taco-bell-la-main-st',
              claimed: false,
              rating: 4.0,
              reviewCount: 189,
            },
          ],
        },
      ],
    },
    {
      name: 'Texas',
      slug: 'texas',
      cities: [
        {
          name: 'Houston',
          slug: 'houston',
          locations: [
            {
              id: 'tb-tx-houston-1',
              name: 'Taco Bell',
              address: '654 Oak Blvd, Houston, TX 77001',
              slug: 'taco-bell-houston-oak',
              claimed: true,
              rating: 4.4,
              reviewCount: 321,
            },
          ],
        },
      ],
    },
  ],
}

// Baskin-Robbins data
export const baskinRobbinsData: Brand = {
  name: 'Baskin-Robbins',
  slug: 'baskin-robbins',
  category: 'Food & Dining',
  claimed: false, // Unclaimed
  states: [
    {
      name: 'New York',
      slug: 'new-york',
      cities: [
        {
          name: 'New York',
          slug: 'new-york',
          locations: [
            {
              id: 'br-ny-1',
              name: 'Baskin-Robbins',
              address: '150 Broadway, New York, NY 10038',
              slug: 'baskin-robbins-150-broadway',
              phone: '(212) 555-0201',
              claimed: false,
              rating: 4.3,
              reviewCount: 512,
            },
            {
              id: 'br-ny-2',
              name: 'Baskin-Robbins',
              address: '89 5th Ave, New York, NY 10003',
              slug: 'baskin-robbins-89-5th-ave',
              phone: '(212) 555-0202',
              claimed: false,
              rating: 4.5,
              reviewCount: 678,
            },
            {
              id: 'br-ny-3',
              name: 'Baskin-Robbins',
              address: '234 Madison Ave, New York, NY 10016',
              slug: 'baskin-robbins-234-madison-ave',
              phone: '(212) 555-0203',
              claimed: false,
              rating: 4.1,
              reviewCount: 389,
            },
            {
              id: 'br-ny-4',
              name: 'Baskin-Robbins',
              address: '567 Park Ave S, New York, NY 10010',
              slug: 'baskin-robbins-567-park-ave-s',
              phone: '(212) 555-0204',
              claimed: false,
              rating: 4.4,
              reviewCount: 445,
            },
            {
              id: 'br-ny-5',
              name: 'Baskin-Robbins',
              address: '123 3rd Ave, New York, NY 10003',
              slug: 'baskin-robbins-123-3rd-ave',
              phone: '(212) 555-0205',
              claimed: false,
              rating: 4.2,
              reviewCount: 523,
            },
            {
              id: 'br-ny-6',
              name: 'Baskin-Robbins',
              address: '890 Lexington Ave, New York, NY 10021',
              slug: 'baskin-robbins-890-lexington-ave',
              phone: '(212) 555-0206',
              claimed: false,
              rating: 4.6,
              reviewCount: 712,
            },
          ],
        },
        {
          name: 'Albany',
          slug: 'albany',
          locations: [
            {
              id: 'br-ny-albany-1',
              name: 'Baskin-Robbins',
              address: '456 State St, Albany, NY 12210',
              slug: 'baskin-robbins-albany-state-st',
              claimed: false,
              rating: 4.0,
              reviewCount: 198,
            },
          ],
        },
      ],
    },
    {
      name: 'California',
      slug: 'california',
      cities: [
        {
          name: 'Los Angeles',
          slug: 'los-angeles',
          locations: [
            {
              id: 'br-ca-la-1',
              name: 'Baskin-Robbins',
              address: '789 Sunset Blvd, Los Angeles, CA 90028',
              slug: 'baskin-robbins-la-sunset-blvd',
              claimed: false,
              rating: 4.3,
              reviewCount: 267,
            },
          ],
        },
      ],
    },
    {
      name: 'Texas',
      slug: 'texas',
      cities: [
        {
          name: 'Houston',
          slug: 'houston',
          locations: [
            {
              id: 'br-tx-houston-1',
              name: 'Baskin-Robbins',
              address: '321 Main St, Houston, TX 77002',
              slug: 'baskin-robbins-houston-main-st',
              claimed: false,
              rating: 4.4,
              reviewCount: 334,
            },
          ],
        },
      ],
    },
  ],
}

// Helper function to get brand by slug
export function getBrandBySlug(slug: string): Brand | null {
  if (slug === 'taco-bell') {
    return tacoBellData
  }
  if (slug === 'baskin-robbins') {
    return baskinRobbinsData
  }
  return null
}

// Helper function to get state by slug
export function getStateBySlug(brandSlug: string, stateSlug: string): State | null {
  const brand = getBrandBySlug(brandSlug)
  if (!brand) return null
  return brand.states.find(s => s.slug === stateSlug) || null
}

// Helper function to get city by slug
export function getCityBySlug(brandSlug: string, stateSlug: string, citySlug: string): City | null {
  const state = getStateBySlug(brandSlug, stateSlug)
  if (!state) return null
  return state.cities.find(c => c.slug === citySlug) || null
}

// Helper function to find location by slug and return brand/state/city info
export function findLocationBySlug(locationSlug: string): {
  brand: Brand
  state: State
  city: City
  location: BrandLocation
} | null {
  const brands = [tacoBellData, baskinRobbinsData]
  
  for (const brand of brands) {
    for (const state of brand.states) {
      for (const city of state.cities) {
        const location = city.locations.find(loc => loc.slug === locationSlug)
        if (location) {
          return { brand, state, city, location }
        }
      }
    }
  }
  
  return null
}

// Helper function to count total locations for a brand
export function countBrandLocations(brand: Brand): number {
  let count = 0
  for (const state of brand.states) {
    for (const city of state.cities) {
      count += city.locations.length
    }
  }
  return count
}
