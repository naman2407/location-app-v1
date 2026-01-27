// Food & Dining brands data
// This list contains only Food & Dining related brands

export const foodAndDiningBrands = [
  // Claimed brands
  'Taco Bell',
  'Starbucks',
  "Freddy's Custard",
  "Freddy's Frozen Custard & Steakburgers",
  'Pizza Hut',
  'KFC',
  'McDonald\'s',
  'Burger King',
  'Subway',
  'Domino\'s Pizza',
  'Dunkin\'',
  'Chipotle',
  'Panera Bread',
  'Olive Garden',
  'Red Lobster',
  'Outback Steakhouse',
  'Applebee\'s',
  'TGI Friday\'s',
  'Buffalo Wild Wings',
  'Chili\'s',
  
  // More claimed brands
  'The Cheesecake Factory',
  'PF Chang\'s',
  'Texas Roadhouse',
  'IHOP',
  'Denny\'s',
  'Waffle House',
  'Cracker Barrel',
  'LongHorn Steakhouse',
  'Ruth\'s Chris Steak House',
  'Morton\'s The Steakhouse',
  
  // Unclaimed brands
  '4 Rivers Smokehouse',
  'Auntie Anne\'s',
  'Bahama Breeze',
  'Barcelona Wine Bar',
  'Barro\'s Pizza',
  'Baskin-Robbins',
  'Ben & Jerry\'s',
  'Bertucci\'s Restaurant',
  'Bibibop Asian Grill',
  'Big Chicken',
  'Blaze Pizza LLC',
  'Bojangles\' Restaurants',
  'Bonefish Grill',
  'Boston\'s Pizza',
  'BRAVO Cucina Italiana',
  'Brio Tuscan Grille',
  'Bruegger\'s Bagels',
  'Bubba Gump Shrimp Co',
  'California Pizza Kitchen',
  'Carrabba\'s Italian Grill',
  
  // More unclaimed brands
  'Cheesecake Factory',
  'Cold Stone Creamery',
  'Culver\'s',
  'Dairy Queen',
  'Five Guys',
  'Firehouse Subs',
  'Golden Corral',
  'Hooters',
  'In-N-Out Burger',
  'Jack in the Box',
  
  // Additional unclaimed
  'Jamba Juice',
  'Jimmy John\'s',
  'Krispy Kreme',
  'Little Caesars',
  'Panda Express',
  'Papa John\'s',
  'Popeyes',
  'Qdoba',
  'Raising Cane\'s',
  'Shake Shack',
  
  // More brands
  'Sonic Drive-In',
  'Taco John\'s',
  'Taco Time',
  'Wendy\'s',
  'White Castle',
  'Wingstop',
  'Zaxby\'s',
  'Arby\'s',
  'Carl\'s Jr.',
  'Hardee\'s',
]

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

