export type Business = {
  slug: string
  name: string
  rating: number
  reviewCount: number
  statusText: string
  closesAt: string
  claimed?: boolean
  imageUrl?: string // Matches search result card image
  address: {
    line1: string
    city: string
    state: string
    postalCode: string
  }
  phone: string
  website: string
  links: { label: string; href: string }[]
  descriptor: string
  about: string
  detailsPrimary: string[]
  detailsMore: string[]
  hours: {
    openNowText: string
    rows: { day: string; range: string }[]
  }
  ratingHistogram: { stars: number; count: number }[]
  aiSummary: string
  reviews: {
    author: string
    rating: number
    date: string
    text: string
  }[]
  faqs: { question: string; answer: string }[]
}

// Helper function to create business data from search result data
function createBusinessFromSearchResult(
  slug: string,
  name: string,
  address: string,
  rating: number,
  reviewCount: number,
  isOpen: boolean,
  openText: string,
  phone: string,
  hours: string,
  city: string = 'Albany',
  claimed: boolean = true,
  imageUrl?: string
): Business {
  const addressParts = address.split(', ')
  const line1 = addressParts[0]
  const stateZip = addressParts[addressParts.length - 1] || 'NY'
  const state = stateZip.split(' ')[0] || 'NY'
  const postalCode = stateZip.split(' ')[1] || '12207'

  // Parse closesAt from openText
  let closesAt = '11:00 PM'
  if (openText.includes('Closes')) {
    const match = openText.match(/Closes (.+)/)
    closesAt = match ? match[1] : '11:00 PM'
  }

  const statusText = isOpen ? 'Open Now' : 'Closed'

  // Generate rating histogram based on rating
  const baseCount = Math.floor(reviewCount / 5)
  const ratingHistogram = [
    { stars: 5, count: Math.floor(baseCount * (rating / 5) * 2.5) },
    { stars: 4, count: Math.floor(baseCount * (rating / 5) * 1.5) },
    { stars: 3, count: Math.floor(baseCount * (rating / 5) * 0.8) },
    { stars: 2, count: Math.floor(baseCount * (rating / 5) * 0.4) },
    { stars: 1, count: Math.floor(baseCount * (rating / 5) * 0.2) },
  ]

  // Parse hours range
  const hoursRange = hours || '10:00 AM - 11:00 PM'
  const [openTime, closeTime] = hoursRange.split(' - ')

  return {
    slug,
    name,
    rating,
    reviewCount,
    statusText,
    closesAt,
    claimed,
    imageUrl: imageUrl || undefined,
    address: {
      line1,
      city,
      state,
      postalCode,
    },
    phone,
    website: 'https://www.tacobell.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/tacobell' },
      { label: 'Instagram', href: 'https://instagram.com/tacobell' },
    ],
    descriptor: 'Fast Food · Mexican · Takeout',
    about: `Taco Bell offers Mexican-inspired favorites including tacos, burritos, and Crunchwraps. This ${city} location provides quick service, drive-thru convenience, and friendly staff ready to serve late into the night.`,
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Drive-thru', 'Wheelchair accessible', 'Parking', 'Wi-Fi', 'Restrooms'],
    hours: {
      openNowText: isOpen ? `Open Now • Closes at ${closesAt}` : `Closed • Opens at ${openTime}`,
      rows: [
        { day: 'Monday', range: hoursRange },
        { day: 'Tuesday', range: hoursRange },
        { day: 'Wednesday', range: hoursRange },
        { day: 'Thursday', range: hoursRange },
        { day: 'Friday', range: hoursRange },
        { day: 'Saturday', range: hoursRange },
        { day: 'Sunday', range: hoursRange },
      ],
    },
    ratingHistogram,
    aiSummary: `Guests praise quick service, friendly staff, and consistent availability at this ${city} location. Food is fresh and affordable, with drive-thru convenience noted as a plus.`,
    reviews: [
      {
        author: 'Sarah M.',
        rating: 5,
        date: 'Jan 15, 2024',
        text: 'Great service and food! Drive-thru was fast and my order was perfect.',
      },
      {
        author: 'Mike T.',
        rating: 4,
        date: 'Jan 10, 2024',
        text: 'Good food for the price. Can get busy at lunch, but staff handles it well.',
      },
      {
        author: 'Jessica L.',
        rating: 5,
        date: 'Jan 08, 2024',
        text: `Love this Taco Bell in ${city}! Orders are consistently accurate and fresh.`,
      },
      {
        author: 'David K.',
        rating: 3,
        date: 'Jan 05, 2024',
        text: 'Solid fast food option. Waited a bit longer than usual during dinner rush.',
      },
      {
        author: 'Emily R.',
        rating: 4,
        date: 'Jan 03, 2024',
        text: 'Quick service and tasty food. Clean dining area and friendly team.',
      },
    ],
    faqs: [
      { question: `Where is this Taco Bell located?`, answer: `${address}.` },
      { question: 'What are the hours?', answer: `Open daily, typically ${hoursRange}.` },
      { question: 'Do they have a drive-thru?', answer: 'Yes, a full drive-thru is available.' },
      { question: 'Is delivery offered?', answer: 'Yes, via third-party delivery services.' },
      { question: 'Is parking available?', answer: 'Yes, on-site parking is available.' },
      { question: 'Is it wheelchair accessible?', answer: 'Yes, the location is wheelchair accessible.' },
    ],
  }
}

// Helper function to create Baskin-Robbins business data
function createBaskinRobbinsBusiness(
  slug: string,
  name: string,
  address: string,
  rating: number,
  reviewCount: number,
  isOpen: boolean,
  openText: string,
  phone: string,
  hours: string,
  city: string = 'New York',
  claimed: boolean = false
): Business {
  const addressParts = address.split(', ')
  const line1 = addressParts[0]
  const stateZip = addressParts[addressParts.length - 1] || 'NY'
  const state = stateZip.split(' ')[0] || 'NY'
  const postalCode = stateZip.split(' ')[1] || '10001'

  // Parse closesAt from openText
  let closesAt = '10:00 PM'
  if (openText.includes('Closes')) {
    const match = openText.match(/Closes (.+)/)
    closesAt = match ? match[1] : '10:00 PM'
  }

  const statusText = isOpen ? 'Open Now' : 'Closed'

  // Generate rating histogram based on rating
  const baseCount = Math.floor(reviewCount / 5)
  const ratingHistogram = [
    { stars: 5, count: Math.floor(baseCount * (rating / 5) * 2.5) },
    { stars: 4, count: Math.floor(baseCount * (rating / 5) * 1.5) },
    { stars: 3, count: Math.floor(baseCount * (rating / 5) * 0.8) },
    { stars: 2, count: Math.floor(baseCount * (rating / 5) * 0.4) },
    { stars: 1, count: Math.floor(baseCount * (rating / 5) * 0.2) },
  ]

  // Parse hours range
  const hoursRange = hours || '10:00 AM - 10:00 PM'
  const [openTime, closeTime] = hoursRange.split(' - ')

  return {
    slug,
    name,
    rating,
    reviewCount,
    statusText,
    closesAt,
    claimed,
    address: {
      line1,
      city,
      state,
      postalCode,
    },
    phone,
    website: 'https://www.baskinrobbins.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/baskinrobbins' },
      { label: 'Instagram', href: 'https://instagram.com/baskinrobbins' },
    ],
    descriptor: 'Ice Cream · Desserts · Frozen Treats',
    about: `Baskin-Robbins offers 31 flavors of ice cream, frozen yogurt, and ice cream cakes. This ${city} location provides a wide selection of classic and seasonal flavors, custom ice cream cakes, and friendly service in a welcoming atmosphere.`,
    detailsPrimary: ['Dine-in', 'Takeout', 'Credit card', 'Ice cream cakes'],
    detailsMore: ['Debit', 'Wheelchair accessible', 'Parking', 'Wi-Fi', 'Restrooms', 'Party orders'],
    hours: {
      openNowText: isOpen ? `Open Now • Closes at ${closesAt}` : `Closed • Opens at ${openTime}`,
      rows: [
        { day: 'Monday', range: hoursRange },
        { day: 'Tuesday', range: hoursRange },
        { day: 'Wednesday', range: hoursRange },
        { day: 'Thursday', range: hoursRange },
        { day: 'Friday', range: hoursRange },
        { day: 'Saturday', range: hoursRange },
        { day: 'Sunday', range: hoursRange },
      ],
    },
    ratingHistogram,
    aiSummary: `Guests enjoy the variety of flavors, friendly staff, and quality ice cream at this ${city} location. The ice cream cakes are popular for celebrations, and the atmosphere is family-friendly.`,
    reviews: [
      {
        author: 'Sarah M.',
        rating: 5,
        date: 'Jan 15, 2024',
        text: 'Amazing ice cream! So many flavors to choose from. The staff is always friendly and helpful.',
      },
      {
        author: 'Mike T.',
        rating: 4,
        date: 'Jan 10, 2024',
        text: 'Great selection of flavors. The ice cream is always fresh and delicious. Perfect for a treat!',
      },
      {
        author: 'Jessica L.',
        rating: 5,
        date: 'Jan 08, 2024',
        text: `Love this Baskin-Robbins in ${city}! Ordered an ice cream cake for my daughter's birthday and it was perfect.`,
      },
      {
        author: 'David K.',
        rating: 4,
        date: 'Jan 05, 2024',
        text: 'Good ice cream, lots of flavors. Can get busy on weekends but worth the wait.',
      },
      {
        author: 'Emily R.',
        rating: 4,
        date: 'Jan 03, 2024',
        text: 'Classic ice cream shop with great variety. The seasonal flavors are always a hit!',
      },
    ],
    faqs: [
      { question: `Where is this Baskin-Robbins located?`, answer: `${address}.` },
      { question: 'What are the hours?', answer: `Open daily, typically ${hoursRange}.` },
      { question: 'Do they make custom ice cream cakes?', answer: 'Yes, custom ice cream cakes are available for order.' },
      { question: 'How many flavors do they have?', answer: 'Baskin-Robbins offers 31 flavors, including seasonal options.' },
      { question: 'Is parking available?', answer: 'Yes, parking is available at this location.' },
      { question: 'Is it wheelchair accessible?', answer: 'Yes, the location is wheelchair accessible.' },
    ],
  }
}

export const mockBusinesses: Business[] = [
  // Original detailed entry
  {
    slug: 'taco-bell-albany-central-ave',
    name: 'Taco Bell',
    rating: 4.2,
    reviewCount: 862,
    statusText: 'Open Now',
    closesAt: '1:00 AM',
    claimed: true,
    address: {
      line1: '123 Main Street',
      city: 'Albany',
      state: 'NY',
      postalCode: '12207',
    },
    phone: '(518) 555-0123',
    website: 'https://www.tacobell.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/tacobell' },
      { label: 'Instagram', href: 'https://instagram.com/tacobell' },
    ],
    descriptor: 'Fast Food · Mexican · Takeout',
    about:
      'Taco Bell offers Mexican-inspired favorites including tacos, burritos, and Crunchwraps. This Albany location provides quick service, drive-thru convenience, and friendly staff ready to serve late into the night.',
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Drive-thru', 'Wheelchair accessible', 'Parking', 'Wi-Fi', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 1:00 AM',
      rows: [
        { day: 'Monday', range: '7:00 AM – 1:00 AM' },
        { day: 'Tuesday', range: '7:00 AM – 1:00 AM' },
        { day: 'Wednesday', range: '7:00 AM – 1:00 AM' },
        { day: 'Thursday', range: '7:00 AM – 1:00 AM' },
        { day: 'Friday', range: '7:00 AM – 2:00 AM' },
        { day: 'Saturday', range: '8:00 AM – 2:00 AM' },
        { day: 'Sunday', range: '8:00 AM – 1:00 AM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 450 },
      { stars: 4, count: 250 },
      { stars: 3, count: 80 },
      { stars: 2, count: 50 },
      { stars: 1, count: 32 },
    ],
    aiSummary:
      'Guests praise quick service, friendly staff, and consistent late-night availability. Food is fresh and affordable, with drive-thru convenience noted as a plus.',
    reviews: [
      {
        author: 'Sarah M.',
        rating: 5,
        date: 'Jan 15, 2024',
        text: 'Great service and food! Drive-thru was fast and my order was perfect.',
      },
      {
        author: 'Mike T.',
        rating: 4,
        date: 'Jan 10, 2024',
        text: 'Good food for the price. Can get busy at lunch, but staff handles it well.',
      },
      {
        author: 'Jessica L.',
        rating: 5,
        date: 'Jan 08, 2024',
        text: 'Love this Taco Bell! Orders are consistently accurate and fresh.',
      },
      {
        author: 'David K.',
        rating: 3,
        date: 'Jan 05, 2024',
        text: 'Solid fast food option. Waited a bit longer than usual during dinner rush.',
      },
      {
        author: 'Emily R.',
        rating: 4,
        date: 'Jan 03, 2024',
        text: 'Quick service and tasty food. Clean dining area and friendly team.',
      },
    ],
    faqs: [
      { question: 'Where is this Taco Bell located?', answer: '123 Main Street, Albany, NY 12207.' },
      { question: 'What are the hours?', answer: 'Open daily, typically 7:00 AM to 1:00 AM; later on weekends.' },
      { question: 'Do they have a drive-thru?', answer: 'Yes, a full drive-thru is available.' },
      { question: 'Is delivery offered?', answer: 'Yes, via third-party delivery services.' },
      { question: 'Is parking available?', answer: 'Yes, on-site parking is available.' },
      { question: 'Is it wheelchair accessible?', answer: 'Yes, the location is wheelchair accessible.' },
    ],
  },
  // Taco Bell locations linked from brand pages
  // New York locations
  createBusinessFromSearchResult(
    'taco-bell-200-w-34th-st',
    'Taco Bell',
    '200 W 34th St, New York, NY 10001',
    4.2,
    862,
    true,
    'Open now · Closes 1:00 AM',
    '(212) 555-0123',
    '10:00 AM - 1:00 AM',
    'New York',
    true
  ),
  createBusinessFromSearchResult(
    'taco-bell-81-delancey-st',
    'Taco Bell',
    '81 Delancey St, New York, NY 10002',
    4.5,
    523,
    true,
    'Open now · Closes 12:00 AM',
    '(212) 555-0124',
    '9:00 AM - 12:00 AM',
    'New York',
    true
  ),
  createBusinessFromSearchResult(
    'taco-bell-570-lexington-ave',
    'Taco Bell',
    '570 Lexington Ave, New York, NY 10022',
    4.0,
    312,
    true,
    'Open now · Closes 11:00 PM',
    '(212) 555-0125',
    '10:00 AM - 11:00 PM',
    'New York',
    true
  ),
  createBusinessFromSearchResult(
    'taco-bell-456-broadway',
    'Taco Bell',
    '456 Broadway, New York, NY 10013',
    4.3,
    445,
    true,
    'Open now · Closes 11:00 PM',
    '(212) 555-0126',
    '10:00 AM - 11:00 PM',
    'New York',
    true
  ),
  createBusinessFromSearchResult(
    'taco-bell-234-5th-ave',
    'Taco Bell',
    '234 5th Ave, New York, NY 10001',
    4.6,
    678,
    true,
    'Open now · Closes 11:30 PM',
    '(212) 555-0127',
    '10:30 AM - 11:30 PM',
    'New York',
    true
  ),
  createBusinessFromSearchResult(
    'taco-bell-789-park-ave',
    'Taco Bell',
    '789 Park Ave, New York, NY 10021',
    4.1,
    389,
    true,
    'Open now · Closes 12:30 AM',
    '(212) 555-0128',
    '9:00 AM - 12:30 AM',
    'New York',
    true
  ),
  // Albany location
  createBusinessFromSearchResult(
    'taco-bell-albany-main-st',
    'Taco Bell',
    '123 Main St, Albany, NY 12201',
    4.2,
    234,
    true,
    'Open now · Closes 11:00 PM',
    '(518) 555-0200',
    '10:00 AM - 11:00 PM',
    'Albany',
    true
  ),
  // Los Angeles location
  createBusinessFromSearchResult(
    'taco-bell-la-main-st',
    'Taco Bell',
    '123 Main St, Los Angeles, CA 90001',
    4.0,
    189,
    true,
    'Open now · Closes 10:00 PM',
    '(323) 555-0100',
    '10:00 AM - 10:00 PM',
    'Los Angeles',
    false
  ),
  // Houston location
  createBusinessFromSearchResult(
    'taco-bell-houston-oak',
    'Taco Bell',
    '654 Oak Blvd, Houston, TX 77001',
    4.4,
    321,
    true,
    'Open now · Closes 11:00 PM',
    '(713) 555-0100',
    '10:00 AM - 11:00 PM',
    'Houston',
    true
  ),
  // Baskin-Robbins locations
  createBaskinRobbinsBusiness(
    'baskin-robbins-150-broadway',
    'Baskin-Robbins',
    '150 Broadway, New York, NY 10038',
    4.3,
    512,
    true,
    'Open now · Closes 10:00 PM',
    '(212) 555-0201',
    '10:00 AM - 10:00 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-89-5th-ave',
    'Baskin-Robbins',
    '89 5th Ave, New York, NY 10003',
    4.5,
    678,
    true,
    'Open now · Closes 11:00 PM',
    '(212) 555-0202',
    '9:00 AM - 11:00 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-234-madison-ave',
    'Baskin-Robbins',
    '234 Madison Ave, New York, NY 10016',
    4.1,
    389,
    true,
    'Open now · Closes 9:30 PM',
    '(212) 555-0203',
    '10:30 AM - 9:30 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-567-park-ave-s',
    'Baskin-Robbins',
    '567 Park Ave S, New York, NY 10010',
    4.4,
    445,
    true,
    'Open now · Closes 10:30 PM',
    '(212) 555-0204',
    '9:30 AM - 10:30 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-123-3rd-ave',
    'Baskin-Robbins',
    '123 3rd Ave, New York, NY 10003',
    4.2,
    523,
    true,
    'Open now · Closes 10:00 PM',
    '(212) 555-0205',
    '10:00 AM - 10:00 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-890-lexington-ave',
    'Baskin-Robbins',
    '890 Lexington Ave, New York, NY 10021',
    4.6,
    712,
    true,
    'Open now · Closes 11:00 PM',
    '(212) 555-0206',
    '9:00 AM - 11:00 PM',
    'New York',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-albany-state-st',
    'Baskin-Robbins',
    '456 State St, Albany, NY 12210',
    4.0,
    198,
    true,
    'Open now · Closes 9:00 PM',
    '(518) 555-0207',
    '10:00 AM - 9:00 PM',
    'Albany',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-la-sunset-blvd',
    'Baskin-Robbins',
    '789 Sunset Blvd, Los Angeles, CA 90028',
    4.3,
    267,
    true,
    'Open now · Closes 11:00 PM',
    '(323) 555-0208',
    '9:00 AM - 11:00 PM',
    'Los Angeles',
    false
  ),
  createBaskinRobbinsBusiness(
    'baskin-robbins-houston-main-st',
    'Baskin-Robbins',
    '321 Main St, Houston, TX 77002',
    4.4,
    334,
    true,
    'Open now · Closes 10:00 PM',
    '(713) 555-0209',
    '10:00 AM - 10:00 PM',
    'Houston',
    false
  ),
  // Other brands
  {
    slug: 'starbucks-georgetown',
    name: 'Starbucks',
    rating: 4.6,
    reviewCount: 412,
    statusText: 'Open Now',
    closesAt: '10:00 PM',
    claimed: true,
    address: {
      line1: '2145 M Street NW',
      city: 'Washington',
      state: 'DC',
      postalCode: '20037',
    },
    phone: '(202) 555-0126',
    website: 'https://www.starbucks.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/starbucks' },
      { label: 'Instagram', href: 'https://instagram.com/starbucks' },
    ],
    descriptor: 'Coffee & Tea · Cafe · Breakfast',
    about: 'Starbucks offers premium coffee, espresso drinks, teas, and fresh pastries. This Georgetown location provides a cozy atmosphere perfect for work or relaxation.',
    detailsPrimary: ['Dine-in', 'Takeout', 'Wi-Fi', 'Credit card'],
    detailsMore: ['Debit', 'Wheelchair accessible', 'Parking', 'Restrooms', 'Outdoor seating'],
    hours: {
      openNowText: 'Open Now • Closes at 10:00 PM',
      rows: [
        { day: 'Monday', range: '6:00 AM – 10:00 PM' },
        { day: 'Tuesday', range: '6:00 AM – 10:00 PM' },
        { day: 'Wednesday', range: '6:00 AM – 10:00 PM' },
        { day: 'Thursday', range: '6:00 AM – 10:00 PM' },
        { day: 'Friday', range: '6:00 AM – 10:00 PM' },
        { day: 'Saturday', range: '6:00 AM – 10:00 PM' },
        { day: 'Sunday', range: '6:00 AM – 10:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 240 },
      { stars: 4, count: 120 },
      { stars: 3, count: 35 },
      { stars: 2, count: 12 },
      { stars: 1, count: 5 },
    ],
    aiSummary: 'Customers appreciate the consistent quality coffee, friendly baristas, and comfortable seating. Great spot for remote work with reliable Wi-Fi.',
    reviews: [
      { author: 'Alex P.', rating: 5, date: 'Jan 14, 2024', text: 'Best Starbucks in the area! Always friendly staff and perfect coffee.' },
      { author: 'Maria G.', rating: 4, date: 'Jan 12, 2024', text: 'Great location, good coffee. Can get crowded during peak hours.' },
      { author: 'John D.', rating: 5, date: 'Jan 10, 2024', text: 'Love working here. Wi-Fi is fast and atmosphere is perfect.' },
      { author: 'Lisa K.', rating: 4, date: 'Jan 08, 2024', text: 'Consistent quality and quick service. My go-to coffee spot.' },
      { author: 'Tom R.', rating: 3, date: 'Jan 05, 2024', text: 'Good coffee but sometimes a long wait during rush hours.' },
    ],
    faqs: [
      { question: 'Where is this Starbucks located?', answer: '2145 M Street NW, Washington, DC 20037.' },
      { question: 'What are the hours?', answer: 'Open daily from 6:00 AM to 10:00 PM.' },
      { question: 'Do they have Wi-Fi?', answer: 'Yes, free Wi-Fi is available for customers.' },
      { question: 'Is parking available?', answer: 'Street parking is available nearby.' },
      { question: 'Do they offer mobile ordering?', answer: 'Yes, mobile ordering is available through the Starbucks app.' },
    ],
  },
  {
    slug: 'mcdonalds-clarendon',
    name: "McDonald's",
    rating: 4.1,
    reviewCount: 1180,
    statusText: 'Open Now',
    closesAt: '24 hours',
    claimed: true,
    address: {
      line1: '3100 Wilson Blvd',
      city: 'Arlington',
      state: 'VA',
      postalCode: '22201',
    },
    phone: '(703) 555-0127',
    website: 'https://www.mcdonalds.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/mcdonalds' },
      { label: 'Instagram', href: 'https://instagram.com/mcdonalds' },
    ],
    descriptor: 'Burgers · Fast Food · Breakfast',
    about: "McDonald's serves classic burgers, fries, and breakfast items 24 hours a day. This Clarendon location offers drive-thru, dine-in, and delivery options.",
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Drive-thru', '24 hours'],
    detailsMore: ['Credit card', 'Debit', 'Mobile ordering', 'Wheelchair accessible', 'Parking', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • 24 hours',
      rows: [
        { day: 'Monday', range: '24 hours' },
        { day: 'Tuesday', range: '24 hours' },
        { day: 'Wednesday', range: '24 hours' },
        { day: 'Thursday', range: '24 hours' },
        { day: 'Friday', range: '24 hours' },
        { day: 'Saturday', range: '24 hours' },
        { day: 'Sunday', range: '24 hours' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 590 },
      { stars: 4, count: 354 },
      { stars: 3, count: 118 },
      { stars: 2, count: 71 },
      { stars: 1, count: 47 },
    ],
    aiSummary: 'Customers value the 24-hour availability, quick service, and consistent food quality. Drive-thru is efficient even during busy times.',
    reviews: [
      { author: 'Chris B.', rating: 4, date: 'Jan 16, 2024', text: 'Great late-night option. Food is always fresh and service is quick.' },
      { author: 'Amanda S.', rating: 5, date: 'Jan 13, 2024', text: 'Perfect for early morning breakfast runs. Drive-thru is super fast.' },
      { author: 'Robert L.', rating: 4, date: 'Jan 11, 2024', text: 'Reliable fast food. Open 24/7 is a huge plus for night shifts.' },
      { author: 'Jennifer W.', rating: 3, date: 'Jan 09, 2024', text: 'Standard McDonald\'s experience. Can get busy but staff handles it well.' },
      { author: 'Michael H.', rating: 4, date: 'Jan 07, 2024', text: 'Convenient location and always open. Food quality is consistent.' },
    ],
    faqs: [
      { question: 'Is this location open 24 hours?', answer: 'Yes, this location is open 24 hours a day, 7 days a week.' },
      { question: 'Do they have a drive-thru?', answer: 'Yes, a full drive-thru is available.' },
      { question: 'Is delivery available?', answer: 'Yes, delivery is available through third-party services.' },
      { question: 'Is parking available?', answer: 'Yes, on-site parking is available.' },
    ],
  },
  {
    slug: 'freddys-ballston',
    name: "Freddy's",
    rating: 4.4,
    reviewCount: 536,
    statusText: 'Open Now',
    closesAt: '11:00 PM',
    claimed: false,
    address: {
      line1: '4238 Wilson Blvd',
      city: 'Arlington',
      state: 'VA',
      postalCode: '22203',
    },
    phone: '(703) 555-0128',
    website: 'https://www.freddys.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/freddys' },
    ],
    descriptor: 'Burgers · Fast Food · Frozen Custard',
    about: "Freddy's serves premium steakburgers, crispy shoestring fries, and frozen custard. This Ballston location offers a classic American fast-food experience.",
    detailsPrimary: ['Dine-in', 'Takeout', 'Drive-thru', 'Credit card'],
    detailsMore: ['Debit', 'Wheelchair accessible', 'Parking', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 11:00 PM',
      rows: [
        { day: 'Monday', range: '10:30 AM – 11:00 PM' },
        { day: 'Tuesday', range: '10:30 AM – 11:00 PM' },
        { day: 'Wednesday', range: '10:30 AM – 11:00 PM' },
        { day: 'Thursday', range: '10:30 AM – 11:00 PM' },
        { day: 'Friday', range: '10:30 AM – 11:00 PM' },
        { day: 'Saturday', range: '10:30 AM – 11:00 PM' },
        { day: 'Sunday', range: '10:30 AM – 11:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 295 },
      { stars: 4, count: 161 },
      { stars: 3, count: 54 },
      { stars: 2, count: 19 },
      { stars: 1, count: 7 },
    ],
    aiSummary: 'Guests love the quality burgers, crispy fries, and frozen custard. Service is friendly and food is consistently good.',
    reviews: [
      { author: 'Patricia M.', rating: 5, date: 'Jan 15, 2024', text: 'Best burgers in the area! Fries are perfectly crispy.' },
      { author: 'Kevin T.', rating: 4, date: 'Jan 12, 2024', text: 'Great food and fast service. Frozen custard is amazing.' },
      { author: 'Rachel F.', rating: 5, date: 'Jan 10, 2024', text: 'Love Freddy\'s! Always fresh and delicious.' },
      { author: 'Brian C.', rating: 4, date: 'Jan 08, 2024', text: 'Solid burger joint. Good value for the quality.' },
    ],
    faqs: [
      { question: 'What are the hours?', answer: 'Open daily from 10:30 AM to 11:00 PM.' },
      { question: 'Do they have frozen custard?', answer: 'Yes, frozen custard is available in various flavors.' },
      { question: 'Is parking available?', answer: 'Yes, parking is available.' },
    ],
  },
  {
    slug: 'chipotle-rosslyn',
    name: 'Chipotle',
    rating: 4.0,
    reviewCount: 674,
    statusText: 'Open Now',
    closesAt: '10:00 PM',
    claimed: true,
    address: {
      line1: '1701 N Lynn St',
      city: 'Arlington',
      state: 'VA',
      postalCode: '22209',
    },
    phone: '(703) 555-0129',
    website: 'https://www.chipotle.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/chipotle' },
      { label: 'Instagram', href: 'https://instagram.com/chipotle' },
    ],
    descriptor: 'Mexican · Fast Casual · Burritos',
    about: 'Chipotle serves responsibly sourced, freshly prepared Mexican food. This Rosslyn location offers burritos, bowls, tacos, and salads.',
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Mobile ordering', 'Wheelchair accessible', 'Parking', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 10:00 PM',
      rows: [
        { day: 'Monday', range: '10:45 AM – 10:00 PM' },
        { day: 'Tuesday', range: '10:45 AM – 10:00 PM' },
        { day: 'Wednesday', range: '10:45 AM – 10:00 PM' },
        { day: 'Thursday', range: '10:45 AM – 10:00 PM' },
        { day: 'Friday', range: '10:45 AM – 10:00 PM' },
        { day: 'Saturday', range: '10:45 AM – 10:00 PM' },
        { day: 'Sunday', range: '10:45 AM – 10:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 337 },
      { stars: 4, count: 202 },
      { stars: 3, count: 101 },
      { stars: 2, count: 27 },
      { stars: 1, count: 7 },
    ],
    aiSummary: 'Customers appreciate the fresh ingredients, customizable options, and quick service. Popular for lunch during the work week.',
    reviews: [
      { author: 'Daniel R.', rating: 4, date: 'Jan 14, 2024', text: 'Fresh ingredients and good portions. My go-to lunch spot.' },
      { author: 'Nicole A.', rating: 5, date: 'Jan 11, 2024', text: 'Love the customization options. Always fresh and delicious.' },
      { author: 'Mark S.', rating: 4, date: 'Jan 09, 2024', text: 'Great for a quick, healthy meal. Staff is friendly.' },
      { author: 'Laura B.', rating: 3, date: 'Jan 06, 2024', text: 'Good food but can get very busy during lunch rush.' },
    ],
    faqs: [
      { question: 'What are the hours?', answer: 'Open daily from 10:45 AM to 10:00 PM.' },
      { question: 'Do they offer online ordering?', answer: 'Yes, online and mobile ordering is available.' },
      { question: 'Is delivery available?', answer: 'Yes, delivery is available through Chipotle and third-party services.' },
    ],
  },
  {
    slug: 'sweetgreen-capitol-hill',
    name: 'sweetgreen',
    rating: 4.5,
    reviewCount: 289,
    statusText: 'Open Now',
    closesAt: '9:00 PM',
    claimed: true,
    address: {
      line1: '600 Pennsylvania Ave SE',
      city: 'Washington',
      state: 'DC',
      postalCode: '20003',
    },
    phone: '(202) 555-0130',
    website: 'https://www.sweetgreen.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Instagram', href: 'https://instagram.com/sweetgreen' },
    ],
    descriptor: 'Healthy · Salads · Fast Casual',
    about: 'sweetgreen serves healthy, seasonal salads and bowls made with locally sourced ingredients. This Capitol Hill location offers fresh, nutritious options.',
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Mobile ordering', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 9:00 PM',
      rows: [
        { day: 'Monday', range: '10:30 AM – 9:00 PM' },
        { day: 'Tuesday', range: '10:30 AM – 9:00 PM' },
        { day: 'Wednesday', range: '10:30 AM – 9:00 PM' },
        { day: 'Thursday', range: '10:30 AM – 9:00 PM' },
        { day: 'Friday', range: '10:30 AM – 9:00 PM' },
        { day: 'Saturday', range: '10:30 AM – 9:00 PM' },
        { day: 'Sunday', range: '10:30 AM – 9:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 173 },
      { stars: 4, count: 87 },
      { stars: 3, count: 20 },
      { stars: 2, count: 6 },
      { stars: 1, count: 3 },
    ],
    aiSummary: 'Customers love the fresh, healthy options and customizable salads. Great for a quick, nutritious meal.',
    reviews: [
      { author: 'Sophie K.', rating: 5, date: 'Jan 13, 2024', text: 'Best salads in DC! Always fresh and delicious.' },
      { author: 'James M.', rating: 4, date: 'Jan 10, 2024', text: 'Great healthy option. Love the seasonal menu.' },
      { author: 'Emma L.', rating: 5, date: 'Jan 08, 2024', text: 'Perfect for lunch. Fresh ingredients and great flavors.' },
    ],
    faqs: [
      { question: 'What are the hours?', answer: 'Open daily from 10:30 AM to 9:00 PM.' },
      { question: 'Do they offer online ordering?', answer: 'Yes, mobile and online ordering is available.' },
      { question: 'Are ingredients locally sourced?', answer: 'Yes, sweetgreen uses locally sourced, seasonal ingredients.' },
    ],
  },
  {
    slug: 'shake-shack-georgetown',
    name: 'Shake Shack',
    rating: 4.3,
    reviewCount: 903,
    statusText: 'Open Now',
    closesAt: '11:30 PM',
    claimed: false,
    address: {
      line1: '800 New Hampshire Ave NW',
      city: 'Washington',
      state: 'DC',
      postalCode: '20037',
    },
    phone: '(202) 555-0131',
    website: 'https://www.shakeshack.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Instagram', href: 'https://instagram.com/shakeshack' },
    ],
    descriptor: 'Burgers · Fast Casual · Shakes',
    about: 'Shake Shack serves premium burgers, hot dogs, crinkle-cut fries, and frozen custard shakes. This Georgetown location offers a modern take on classic American fast food.',
    detailsPrimary: ['Dine-in', 'Delivery', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Mobile ordering', 'Wheelchair accessible', 'Outdoor seating', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 11:30 PM',
      rows: [
        { day: 'Monday', range: '11:00 AM – 11:30 PM' },
        { day: 'Tuesday', range: '11:00 AM – 11:30 PM' },
        { day: 'Wednesday', range: '11:00 AM – 11:30 PM' },
        { day: 'Thursday', range: '11:00 AM – 11:30 PM' },
        { day: 'Friday', range: '11:00 AM – 11:30 PM' },
        { day: 'Saturday', range: '11:00 AM – 11:30 PM' },
        { day: 'Sunday', range: '11:00 AM – 11:30 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 496 },
      { stars: 4, count: 271 },
      { stars: 3, count: 90 },
      { stars: 2, count: 36 },
      { stars: 1, count: 10 },
    ],
    aiSummary: 'Guests rave about the quality burgers, crispy fries, and thick shakes. Service is friendly and atmosphere is lively.',
    reviews: [
      { author: 'Ryan P.', rating: 5, date: 'Jan 15, 2024', text: 'Best burgers in Georgetown! Shakes are incredible.' },
      { author: 'Michelle D.', rating: 4, date: 'Jan 12, 2024', text: 'Great food and atmosphere. Can get busy but worth the wait.' },
      { author: 'Andrew K.', rating: 5, date: 'Jan 10, 2024', text: 'Love Shake Shack! Always consistent quality.' },
      { author: 'Stephanie H.', rating: 4, date: 'Jan 07, 2024', text: 'Delicious burgers and fries. Great spot for a quick meal.' },
    ],
    faqs: [
      { question: 'What are the hours?', answer: 'Open daily from 11:00 AM to 11:30 PM.' },
      { question: 'Do they have outdoor seating?', answer: 'Yes, outdoor seating is available.' },
      { question: 'Is delivery available?', answer: 'Yes, delivery is available through third-party services.' },
    ],
  },
  {
    slug: 'five-guys-dupont',
    name: 'Five Guys',
    rating: 4.2,
    reviewCount: 745,
    statusText: 'Open Now',
    closesAt: '10:00 PM',
    address: {
      line1: '1211 Connecticut Ave NW',
      city: 'Washington',
      state: 'DC',
      postalCode: '20036',
    },
    phone: '(202) 555-0132',
    website: 'https://www.fiveguys.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/fiveguys' },
    ],
    descriptor: 'Burgers · Fast Casual · Fries',
    about: 'Five Guys serves fresh, made-to-order burgers and hand-cut fries. This Dupont Circle location offers customizable burgers with free toppings.',
    detailsPrimary: ['Dine-in', 'Takeout', 'Credit card'],
    detailsMore: ['Debit', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 10:00 PM',
      rows: [
        { day: 'Monday', range: '11:00 AM – 10:00 PM' },
        { day: 'Tuesday', range: '11:00 AM – 10:00 PM' },
        { day: 'Wednesday', range: '11:00 AM – 10:00 PM' },
        { day: 'Thursday', range: '11:00 AM – 10:00 PM' },
        { day: 'Friday', range: '11:00 AM – 10:00 PM' },
        { day: 'Saturday', range: '11:00 AM – 10:00 PM' },
        { day: 'Sunday', range: '11:00 AM – 10:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 410 },
      { stars: 4, count: 223 },
      { stars: 3, count: 75 },
      { stars: 2, count: 30 },
      { stars: 1, count: 7 },
    ],
    aiSummary: 'Customers love the fresh, customizable burgers and generous portions of fries. Quality ingredients and made-to-order preparation.',
    reviews: [
      { author: 'Gregory T.', rating: 5, date: 'Jan 14, 2024', text: 'Best burgers in DC! Fresh ingredients and great fries.' },
      { author: 'Catherine R.', rating: 4, date: 'Jan 11, 2024', text: 'Love the customization options. Always fresh and delicious.' },
      { author: 'Nathan B.', rating: 5, date: 'Jan 09, 2024', text: 'Five Guys never disappoints. Great quality burgers.' },
      { author: 'Olivia M.', rating: 4, date: 'Jan 06, 2024', text: 'Solid burger joint. Fries are amazing.' },
    ],
    faqs: [
      { question: 'What are the hours?', answer: 'Open daily from 11:00 AM to 10:00 PM.' },
      { question: 'Are toppings free?', answer: 'Yes, all toppings are included at no extra charge.' },
      { question: 'Do they have milkshakes?', answer: 'Yes, hand-spun milkshakes are available.' },
    ],
  },
  // Agriculture & Industry businesses
  {
    slug: 'farm-supply-albany',
    name: 'Albany Farm Supply',
    rating: 4.3,
    reviewCount: 145,
    statusText: 'Open Now',
    closesAt: '6:00 PM',
    claimed: true,
    address: {
      line1: '123 Farm Road',
      city: 'Albany',
      state: 'NY',
      postalCode: '12207',
    },
    phone: '(518) 555-0201',
    website: 'https://www.albanyfarmsupply.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/albanyfarmsupply' },
    ],
    descriptor: 'Agriculture & Industry · Farm Supplies · Equipment',
    about: 'Albany Farm Supply provides comprehensive agricultural supplies, tools, and equipment for local farmers and agricultural businesses. We offer everything from seeds and fertilizers to farm machinery and livestock supplies.',
    detailsPrimary: ['Farm supplies', 'Equipment sales', 'Consultation', 'Credit card'],
    detailsMore: ['Debit', 'Delivery available', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 6:00 PM',
      rows: [
        { day: 'Monday', range: '8:00 AM – 6:00 PM' },
        { day: 'Tuesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Wednesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Thursday', range: '8:00 AM – 6:00 PM' },
        { day: 'Friday', range: '8:00 AM – 6:00 PM' },
        { day: 'Saturday', range: '8:00 AM – 5:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 78 },
      { stars: 4, count: 44 },
      { stars: 3, count: 15 },
      { stars: 2, count: 6 },
      { stars: 1, count: 2 },
    ],
    aiSummary: 'Customers appreciate the knowledgeable staff, wide selection of farm supplies, and helpful consultation services. Great resource for local farmers.',
    reviews: [
      { author: 'Robert F.', rating: 5, date: 'Jan 14, 2024', text: 'Excellent service and knowledgeable staff. Always find what I need for my farm.' },
      { author: 'Mary K.', rating: 4, date: 'Jan 11, 2024', text: 'Good selection of supplies. Staff is helpful and prices are fair.' },
      { author: 'John D.', rating: 5, date: 'Jan 08, 2024', text: 'Best farm supply store in the area. Great quality products.' },
      { author: 'Susan M.', rating: 4, date: 'Jan 05, 2024', text: 'Reliable source for all my farming needs. Good customer service.' },
      { author: 'Tom W.', rating: 3, date: 'Jan 02, 2024', text: 'Decent selection but can be busy during peak farming season.' },
    ],
    faqs: [
      { question: 'What products do you carry?', answer: 'We carry seeds, fertilizers, farm equipment, livestock supplies, and agricultural tools.' },
      { question: 'Do you offer delivery?', answer: 'Yes, delivery is available for large orders.' },
      { question: 'What are the hours?', answer: 'Open Monday-Friday 8 AM to 6 PM, Saturday 8 AM to 5 PM, closed Sundays.' },
      { question: 'Do you provide consultation services?', answer: 'Yes, our knowledgeable staff can provide agricultural consultation.' },
    ],
  },
  {
    slug: 'industrial-equipment-albany',
    name: 'Industrial Equipment Co',
    rating: 4.1,
    reviewCount: 89,
    statusText: 'Open Now',
    closesAt: '5:00 PM',
    claimed: false,
    address: {
      line1: '456 Industrial Blvd',
      city: 'Albany',
      state: 'NY',
      postalCode: '12208',
    },
    phone: '(518) 555-0202',
    website: 'https://www.industrialequipment.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/industrialequipment' },
    ],
    descriptor: 'Agriculture & Industry · Industrial Equipment · Machinery',
    about: 'Industrial Equipment Co specializes in heavy machinery, industrial tools, and equipment for manufacturing and agricultural operations. We provide sales, service, and maintenance for industrial equipment.',
    detailsPrimary: ['Equipment sales', 'Service & maintenance', 'Parts', 'Credit card'],
    detailsMore: ['Debit', 'Financing available', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 5:00 PM',
      rows: [
        { day: 'Monday', range: '7:00 AM – 5:00 PM' },
        { day: 'Tuesday', range: '7:00 AM – 5:00 PM' },
        { day: 'Wednesday', range: '7:00 AM – 5:00 PM' },
        { day: 'Thursday', range: '7:00 AM – 5:00 PM' },
        { day: 'Friday', range: '7:00 AM – 5:00 PM' },
        { day: 'Saturday', range: '8:00 AM – 12:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 48 },
      { stars: 4, count: 27 },
      { stars: 3, count: 10 },
      { stars: 2, count: 3 },
      { stars: 1, count: 1 },
    ],
    aiSummary: 'Customers value the quality equipment, professional service, and reliable maintenance support. Great for industrial and agricultural operations.',
    reviews: [
      { author: 'Michael R.', rating: 5, date: 'Jan 13, 2024', text: 'Top-quality equipment and excellent service. Highly recommend.' },
      { author: 'Patricia L.', rating: 4, date: 'Jan 10, 2024', text: 'Good selection of industrial equipment. Service team is knowledgeable.' },
      { author: 'David S.', rating: 4, date: 'Jan 07, 2024', text: 'Reliable equipment supplier. Maintenance service is prompt.' },
      { author: 'Jennifer H.', rating: 3, date: 'Jan 04, 2024', text: 'Decent equipment but pricing can be high for some items.' },
    ],
    faqs: [
      { question: 'What types of equipment do you sell?', answer: 'We sell heavy machinery, industrial tools, and equipment for manufacturing and agriculture.' },
      { question: 'Do you offer financing?', answer: 'Yes, financing options are available for qualified buyers.' },
      { question: 'Do you provide maintenance services?', answer: 'Yes, we offer full service and maintenance for all equipment we sell.' },
    ],
  },
  {
    slug: 'tractor-sales-albany',
    name: 'Tractor Sales & Service',
    rating: 4.6,
    reviewCount: 234,
    statusText: 'Closed',
    closesAt: '6:00 PM',
    claimed: true,
    address: {
      line1: '789 Tractor Lane',
      city: 'Albany',
      state: 'NY',
      postalCode: '12209',
    },
    phone: '(518) 555-0203',
    website: 'https://www.tractorsales.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/tractorsales' },
    ],
    descriptor: 'Agriculture & Industry · Tractors · Farm Equipment',
    about: 'Tractor Sales & Service is the premier destination for new and used tractors, farm equipment, and agricultural machinery. We offer sales, service, parts, and expert advice for all your farming needs.',
    detailsPrimary: ['Tractor sales', 'Service & repair', 'Parts', 'Trade-ins'],
    detailsMore: ['Financing', 'Delivery', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Closed • Opens at 8:00 AM',
      rows: [
        { day: 'Monday', range: '8:00 AM – 6:00 PM' },
        { day: 'Tuesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Wednesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Thursday', range: '8:00 AM – 6:00 PM' },
        { day: 'Friday', range: '8:00 AM – 6:00 PM' },
        { day: 'Saturday', range: '8:00 AM – 4:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 140 },
      { stars: 4, count: 70 },
      { stars: 3, count: 18 },
      { stars: 2, count: 5 },
      { stars: 1, count: 1 },
    ],
    aiSummary: 'Customers praise the extensive inventory, knowledgeable sales team, and excellent service department. Best tractor dealer in the region.',
    reviews: [
      { author: 'James T.', rating: 5, date: 'Jan 15, 2024', text: 'Found the perfect tractor here. Great selection and fair pricing.' },
      { author: 'Linda B.', rating: 5, date: 'Jan 12, 2024', text: 'Excellent service department. They fixed my tractor quickly and professionally.' },
      { author: 'Robert K.', rating: 4, date: 'Jan 09, 2024', text: 'Good selection of new and used tractors. Sales staff is helpful.' },
      { author: 'Carol M.', rating: 5, date: 'Jan 06, 2024', text: 'Best tractor dealer around. Quality equipment and reliable service.' },
      { author: 'William P.', rating: 4, date: 'Jan 03, 2024', text: 'Great experience buying my tractor here. Financing was easy.' },
    ],
    faqs: [
      { question: 'Do you sell new and used tractors?', answer: 'Yes, we have both new and used tractors in stock.' },
      { question: 'Do you offer financing?', answer: 'Yes, we offer competitive financing options for qualified buyers.' },
      { question: 'Do you provide service and repair?', answer: 'Yes, our service department handles all tractor maintenance and repairs.' },
      { question: 'Do you accept trade-ins?', answer: 'Yes, we accept trade-ins on tractors and farm equipment.' },
    ],
  },
  {
    slug: 'seed-supply-albany',
    name: 'Seed Supply Warehouse',
    rating: 4.0,
    reviewCount: 67,
    statusText: 'Open Now',
    closesAt: '7:00 PM',
    claimed: true,
    address: {
      line1: '321 Seed Street',
      city: 'Albany',
      state: 'NY',
      postalCode: '12210',
    },
    phone: '(518) 555-0204',
    website: 'https://www.seedsupply.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
    ],
    descriptor: 'Agriculture & Industry · Seeds · Agricultural Supplies',
    about: 'Seed Supply Warehouse offers a comprehensive selection of seeds for crops, vegetables, and flowers. We provide quality seeds for farmers, gardeners, and agricultural businesses.',
    detailsPrimary: ['Seed sales', 'Bulk orders', 'Consultation', 'Credit card'],
    detailsMore: ['Debit', 'Delivery', 'Parking', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 7:00 PM',
      rows: [
        { day: 'Monday', range: '8:00 AM – 7:00 PM' },
        { day: 'Tuesday', range: '8:00 AM – 7:00 PM' },
        { day: 'Wednesday', range: '8:00 AM – 7:00 PM' },
        { day: 'Thursday', range: '8:00 AM – 7:00 PM' },
        { day: 'Friday', range: '8:00 AM – 7:00 PM' },
        { day: 'Saturday', range: '9:00 AM – 5:00 PM' },
        { day: 'Sunday', range: '10:00 AM – 4:00 PM' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 34 },
      { stars: 4, count: 20 },
      { stars: 3, count: 9 },
      { stars: 2, count: 3 },
      { stars: 1, count: 1 },
    ],
    aiSummary: 'Customers appreciate the wide variety of seeds, good germination rates, and helpful staff. Great for both commercial and home gardening needs.',
    reviews: [
      { author: 'Nancy G.', rating: 4, date: 'Jan 12, 2024', text: 'Good selection of seeds. Staff can help with planting advice.' },
      { author: 'Mark D.', rating: 5, date: 'Jan 09, 2024', text: 'Best seed quality in the area. Great germination rates.' },
      { author: 'Sarah L.', rating: 4, date: 'Jan 06, 2024', text: 'Good prices and variety. Helpful for my garden projects.' },
      { author: 'Paul R.', rating: 3, date: 'Jan 02, 2024', text: 'Decent selection but could use more organic options.' },
    ],
    faqs: [
      { question: 'What types of seeds do you carry?', answer: 'We carry crop seeds, vegetable seeds, flower seeds, and grass seeds.' },
      { question: 'Do you offer bulk orders?', answer: 'Yes, we offer bulk pricing for large orders.' },
      { question: 'Do you provide planting advice?', answer: 'Yes, our staff can provide guidance on seed selection and planting.' },
    ],
  },
  {
    slug: 'farm-machinery-albany',
    name: 'Farm Machinery Depot',
    rating: 4.4,
    reviewCount: 156,
    statusText: 'Open Now',
    closesAt: '6:30 PM',
    claimed: false,
    address: {
      line1: '654 Machinery Way',
      city: 'Albany',
      state: 'NY',
      postalCode: '12211',
    },
    phone: '(518) 555-0205',
    website: 'https://www.farmmachinerydepot.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/farmmachinery' },
    ],
    descriptor: 'Agriculture & Industry · Farm Machinery · Equipment',
    about: 'Farm Machinery Depot specializes in farm equipment, agricultural machinery, and tools. We offer sales, rentals, and service for all types of farm equipment.',
    detailsPrimary: ['Equipment sales', 'Rentals', 'Service', 'Parts'],
    detailsMore: ['Financing', 'Delivery', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 6:30 PM',
      rows: [
        { day: 'Monday', range: '7:30 AM – 6:30 PM' },
        { day: 'Tuesday', range: '7:30 AM – 6:30 PM' },
        { day: 'Wednesday', range: '7:30 AM – 6:30 PM' },
        { day: 'Thursday', range: '7:30 AM – 6:30 PM' },
        { day: 'Friday', range: '7:30 AM – 6:30 PM' },
        { day: 'Saturday', range: '8:00 AM – 4:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 86 },
      { stars: 4, count: 47 },
      { stars: 3, count: 16 },
      { stars: 2, count: 5 },
      { stars: 1, count: 2 },
    ],
    aiSummary: 'Customers value the extensive inventory, competitive pricing, and reliable service. Great resource for all farm equipment needs.',
    reviews: [
      { author: 'Thomas H.', rating: 5, date: 'Jan 14, 2024', text: 'Excellent selection of farm machinery. Found exactly what I needed.' },
      { author: 'Barbara C.', rating: 4, date: 'Jan 11, 2024', text: 'Good prices and quality equipment. Service department is reliable.' },
      { author: 'Richard N.', rating: 5, date: 'Jan 08, 2024', text: 'Best farm equipment dealer in the area. Highly recommend.' },
      { author: 'Karen W.', rating: 4, date: 'Jan 05, 2024', text: 'Great selection and helpful staff. Rental options are convenient.' },
    ],
    faqs: [
      { question: 'Do you rent equipment?', answer: 'Yes, we offer equipment rentals for short-term needs.' },
      { question: 'What brands do you carry?', answer: 'We carry major brands of farm machinery and equipment.' },
      { question: 'Do you provide delivery?', answer: 'Yes, delivery is available for purchased equipment.' },
    ],
  },
  {
    slug: 'agricultural-services-albany',
    name: 'Agricultural Services Inc',
    rating: 4.2,
    reviewCount: 98,
    statusText: 'Closed',
    closesAt: '5:00 PM',
    claimed: true,
    address: {
      line1: '987 Service Road',
      city: 'Albany',
      state: 'NY',
      postalCode: '12212',
    },
    phone: '(518) 555-0206',
    website: 'https://www.agriculturalservices.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/agriculturalservices' },
    ],
    descriptor: 'Agriculture & Industry · Consulting · Services',
    about: 'Agricultural Services Inc provides comprehensive agricultural consulting, crop management, soil testing, and farm planning services. We help farmers optimize their operations and maximize yields.',
    detailsPrimary: ['Consulting', 'Soil testing', 'Crop management', 'Farm planning'],
    detailsMore: ['Field services', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Closed • Opens at 7:00 AM',
      rows: [
        { day: 'Monday', range: '7:00 AM – 5:00 PM' },
        { day: 'Tuesday', range: '7:00 AM – 5:00 PM' },
        { day: 'Wednesday', range: '7:00 AM – 5:00 PM' },
        { day: 'Thursday', range: '7:00 AM – 5:00 PM' },
        { day: 'Friday', range: '7:00 AM – 5:00 PM' },
        { day: 'Saturday', range: '8:00 AM – 12:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 54 },
      { stars: 4, count: 29 },
      { stars: 3, count: 11 },
      { stars: 2, count: 3 },
      { stars: 1, count: 1 },
    ],
    aiSummary: 'Customers appreciate the expert consulting, practical advice, and professional service. Great resource for improving farm operations.',
    reviews: [
      { author: 'Daniel M.', rating: 5, date: 'Jan 13, 2024', text: 'Excellent consulting services. Helped improve my crop yields significantly.' },
      { author: 'Lisa P.', rating: 4, date: 'Jan 10, 2024', text: 'Knowledgeable consultants and helpful soil testing services.' },
      { author: 'Gary S.', rating: 5, date: 'Jan 07, 2024', text: 'Best agricultural consulting in the region. Very professional.' },
      { author: 'Deborah K.', rating: 4, date: 'Jan 04, 2024', text: 'Good service and practical advice for farm management.' },
    ],
    faqs: [
      { question: 'What services do you provide?', answer: 'We provide agricultural consulting, soil testing, crop management, and farm planning services.' },
      { question: 'Do you offer field services?', answer: 'Yes, we provide on-site field services and consultations.' },
      { question: 'How do I schedule a consultation?', answer: 'Call us or visit our office to schedule an appointment.' },
    ],
  },
  {
    slug: 'crop-consulting-albany',
    name: 'Crop Consulting Group',
    rating: 4.7,
    reviewCount: 201,
    statusText: 'Open Now',
    closesAt: '5:00 PM',
    claimed: true,
    address: {
      line1: '147 Consulting Ave',
      city: 'Albany',
      state: 'NY',
      postalCode: '12213',
    },
    phone: '(518) 555-0207',
    website: 'https://www.cropconsulting.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/cropconsulting' },
    ],
    descriptor: 'Agriculture & Industry · Crop Consulting · Agricultural Services',
    about: 'Crop Consulting Group offers expert crop consulting, pest management, fertilizer recommendations, and yield optimization services. Our team of agricultural experts helps farmers achieve better results.',
    detailsPrimary: ['Crop consulting', 'Pest management', 'Fertilizer planning', 'Yield optimization'],
    detailsMore: ['Field visits', 'Soil analysis', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 5:00 PM',
      rows: [
        { day: 'Monday', range: '8:00 AM – 5:00 PM' },
        { day: 'Tuesday', range: '8:00 AM – 5:00 PM' },
        { day: 'Wednesday', range: '8:00 AM – 5:00 PM' },
        { day: 'Thursday', range: '8:00 AM – 5:00 PM' },
        { day: 'Friday', range: '8:00 AM – 5:00 PM' },
        { day: 'Saturday', range: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 121 },
      { stars: 4, count: 60 },
      { stars: 3, count: 15 },
      { stars: 2, count: 4 },
      { stars: 1, count: 1 },
    ],
    aiSummary: 'Customers highly value the expert advice, practical solutions, and proven results. Top-rated crop consulting service in the area.',
    reviews: [
      { author: 'Frank B.', rating: 5, date: 'Jan 15, 2024', text: 'Outstanding consulting service. Increased my yields by 20% this season.' },
      { author: 'Patricia R.', rating: 5, date: 'Jan 12, 2024', text: 'Expert advice and excellent pest management strategies. Highly recommend.' },
      { author: 'Charles L.', rating: 5, date: 'Jan 09, 2024', text: 'Best crop consultants around. Knowledgeable and professional.' },
      { author: 'Diane M.', rating: 4, date: 'Jan 06, 2024', text: 'Great service and helpful recommendations. Improved my crop quality.' },
      { author: 'Edward T.', rating: 5, date: 'Jan 03, 2024', text: 'Excellent consulting team. Worth every penny for the results.' },
    ],
    faqs: [
      { question: 'What does crop consulting include?', answer: 'Crop consulting includes pest management, fertilizer planning, yield optimization, and field analysis.' },
      { question: 'Do you provide field visits?', answer: 'Yes, our consultants provide on-site field visits and analysis.' },
      { question: 'How do your services improve yields?', answer: 'We provide expert recommendations on fertilization, pest control, and crop management practices.' },
    ],
  },
  {
    slug: 'livestock-supplies-albany',
    name: 'Livestock Supplies Co',
    rating: 4.1,
    reviewCount: 112,
    statusText: 'Open Now',
    closesAt: '6:00 PM',
    claimed: false,
    address: {
      line1: '258 Livestock Lane',
      city: 'Albany',
      state: 'NY',
      postalCode: '12214',
    },
    phone: '(518) 555-0208',
    website: 'https://www.livestocksupplies.com',
    links: [
      { label: 'Google', href: 'https://maps.google.com' },
      { label: 'Facebook', href: 'https://facebook.com/livestocksupplies' },
    ],
    descriptor: 'Agriculture & Industry · Livestock Supplies · Animal Care',
    about: 'Livestock Supplies Co provides comprehensive supplies for livestock care, including feed, medications, equipment, and accessories. We serve farmers, ranchers, and livestock owners throughout the region.',
    detailsPrimary: ['Livestock feed', 'Medications', 'Equipment', 'Supplies'],
    detailsMore: ['Bulk orders', 'Delivery', 'Parking', 'Wheelchair accessible', 'Restrooms'],
    hours: {
      openNowText: 'Open Now • Closes at 6:00 PM',
      rows: [
        { day: 'Monday', range: '8:00 AM – 6:00 PM' },
        { day: 'Tuesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Wednesday', range: '8:00 AM – 6:00 PM' },
        { day: 'Thursday', range: '8:00 AM – 6:00 PM' },
        { day: 'Friday', range: '8:00 AM – 6:00 PM' },
        { day: 'Saturday', range: '8:00 AM – 4:00 PM' },
        { day: 'Sunday', range: 'Closed' },
      ],
    },
    ratingHistogram: [
      { stars: 5, count: 58 },
      { stars: 4, count: 34 },
      { stars: 3, count: 14 },
      { stars: 2, count: 4 },
      { stars: 1, count: 2 },
    ],
    aiSummary: 'Customers appreciate the wide selection of livestock supplies, quality products, and knowledgeable staff. Essential resource for livestock owners.',
    reviews: [
      { author: 'Robert G.', rating: 4, date: 'Jan 13, 2024', text: 'Good selection of livestock feed and supplies. Staff knows their products.' },
      { author: 'Margaret F.', rating: 5, date: 'Jan 10, 2024', text: 'Best livestock supply store around. Quality products and fair prices.' },
      { author: 'Joseph K.', rating: 4, date: 'Jan 07, 2024', text: 'Reliable source for all my livestock needs. Good customer service.' },
      { author: 'Helen D.', rating: 3, date: 'Jan 04, 2024', text: 'Decent selection but could use more organic feed options.' },
    ],
    faqs: [
      { question: 'What livestock supplies do you carry?', answer: 'We carry feed, medications, equipment, and accessories for all types of livestock.' },
      { question: 'Do you offer bulk orders?', answer: 'Yes, we offer bulk pricing for large feed and supply orders.' },
      { question: 'Do you deliver?', answer: 'Yes, delivery is available for bulk orders.' },
    ],
  },
]
