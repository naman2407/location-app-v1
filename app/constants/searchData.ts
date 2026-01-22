// Dummy data for search suggestions

export const brandSuggestions = [
  // Taco Bell locations (multiple addresses for same brand)
  { id: 'tb1', name: 'Taco Bell', address: '123 Main St, Los Angeles, CA 90001', rating: 4.2 },
  { id: 'tb2', name: 'Taco Bell', address: '456 Broadway, New York, NY 10013', rating: 4.5 },
  { id: 'tb3', name: 'Taco Bell', address: '789 Market St, San Francisco, CA 94102', rating: 4.0 },
  { id: 'tb4', name: 'Taco Bell', address: '321 Elm Ave, Chicago, IL 60601', rating: 4.3 },
  { id: 'tb5', name: 'Taco Bell', address: '654 Oak Blvd, Houston, TX 77001', rating: 4.4 },
  { id: 'tb6', name: 'Taco Bell', address: '890 Sunset Blvd, Los Angeles, CA 90028', rating: 4.1 },
  { id: 'tb7', name: 'Taco Bell', address: '234 5th Ave, New York, NY 10001', rating: 4.6 },
  { id: 'tb8', name: 'Taco Bell', address: '567 Mission St, San Francisco, CA 94105', rating: 4.2 }
]

export const locationSuggestions = [
  { id: '1', city: 'New York', state: 'NY', full: 'New York, NY' },
  { id: '2', city: 'Los Angeles', state: 'CA', full: 'Los Angeles, CA' },
  { id: '3', city: 'Chicago', state: 'IL', full: 'Chicago, IL' },
  { id: '4', city: 'Houston', state: 'TX', full: 'Houston, TX' },
  { id: '5', city: 'Phoenix', state: 'AZ', full: 'Phoenix, AZ' },
  { id: '6', city: 'Philadelphia', state: 'PA', full: 'Philadelphia, PA' },
  { id: '7', city: 'San Antonio', state: 'TX', full: 'San Antonio, TX' },
  { id: '8', city: 'San Diego', state: 'CA', full: 'San Diego, CA' },
  { id: '9', city: 'Dallas', state: 'TX', full: 'Dallas, TX' },
  { id: '10', city: 'San Jose', state: 'CA', full: 'San Jose, CA' },
  { id: '11', city: 'Austin', state: 'TX', full: 'Austin, TX' },
  { id: '12', city: 'Jacksonville', state: 'FL', full: 'Jacksonville, FL' },
  { id: '13', city: 'Fort Worth', state: 'TX', full: 'Fort Worth, TX' },
  { id: '14', city: 'Columbus', state: 'OH', full: 'Columbus, OH' },
  { id: '15', city: 'Charlotte', state: 'NC', full: 'Charlotte, NC' },
]

// Function to filter brands based on search query
export function filterBrands(query: string) {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return brandSuggestions.filter(brand => 
    brand.name.toLowerCase().includes(lowerQuery)
  )
}

// Function to filter locations based on search query
export function filterLocations(query: string) {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  return locationSuggestions.filter(location => 
    location.city.toLowerCase().includes(lowerQuery) ||
    location.state.toLowerCase().includes(lowerQuery) ||
    location.full.toLowerCase().includes(lowerQuery)
  )
}

