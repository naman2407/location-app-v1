// Helper function to determine if a brand is claimed
export function isClaimedFoodBrand(brandName: string): boolean {
  const normalized = brandName.toLowerCase()
  
  // Always claimed brands
  const alwaysClaimed = [
    'taco bell',
    'starbucks',
    "freddy's custard",
    "freddy's frozen custard & steakburgers",
    'pizza hut',
    'kfc',
    "mcdonald's",
    'burger king',
    'subway',
    "domino's pizza",
    'dunkin\'',
    'chipotle',
    'panera bread',
    'olive garden',
    'red lobster',
    'outback steakhouse',
    "applebee's",
    'tgi friday\'s',
    'buffalo wild wings',
    "chili's",
    'the cheesecake factory',
    'pf chang\'s',
    'texas roadhouse',
    'ihop',
    "denny's",
    'waffle house',
    'cracker barrel',
    'longhorn steakhouse',
    'ruth\'s chris steak house',
    "morton's the steakhouse",
  ]
  
  // Always unclaimed brands
  const alwaysUnclaimed = [
    'baskin-robbins',
  ]
  
  if (alwaysClaimed.includes(normalized)) {
    return true
  }
  
  if (alwaysUnclaimed.includes(normalized)) {
    return false
  }
  
  // Use hash-based logic for other brands to create a mix
  let hash = 0
  for (let i = 0; i < brandName.length; i += 1) {
    hash = (hash * 31 + brandName.charCodeAt(i)) % 1000
  }
  // Make about 40% claimed, 60% unclaimed
  return hash % 5 < 2
}

