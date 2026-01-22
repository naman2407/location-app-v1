'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import BusinessProfilePage from '../../../src/pages/BusinessProfilePage'
import { Footer } from '../../components/Footer'
import { HeroSearchBar } from '../../components/HeroSearchBar'
import { SafeImage } from '../../components/SafeImage'
import { IMAGES } from '../../constants/images'
import { Link as CustomLink } from '../../components/Link'
import { mockBusinesses } from '../../../src/mocks/mockBusinesses'

interface PageProps {
  params: { slug: string }
}

export default function Page({ params }: PageProps) {
  const searchParams = useSearchParams()
  const brand = searchParams?.get('brand') || ''
  const categoryFromParams = searchParams?.get('category') || ''
  const location = searchParams?.get('location') || ''
  
  // Derive category: use query param if present, otherwise fallback to business primary category
  const category = useMemo(() => {
    if (categoryFromParams && categoryFromParams !== 'All') {
      return categoryFromParams
    }
    
    // Fallback to business primary category
    const business = mockBusinesses.find((b) => b.slug === params.slug)
    if (business) {
      const categories = business.descriptor.split('·').map((item) => item.trim()).filter(Boolean)
      let primaryCategory = categories[0] || 'Food & Dining'
      
      // Normalize category names to match search page categories
      const categoryMap: Record<string, string> = {
        'Fast Food': 'Food & Dining',
        'Mexican': 'Food & Dining',
        'Restaurant': 'Food & Dining',
        'Coffee': 'Food & Dining',
        'Cafe': 'Food & Dining',
        'Agriculture & Industry': 'Agriculture & Industry',
      }
      
      if (categoryMap[primaryCategory]) {
        primaryCategory = categoryMap[primaryCategory]
      }
      
      return primaryCategory
    }
    
    return 'All'
  }, [categoryFromParams, params.slug])

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="flex flex-col items-start overflow-hidden relative w-full">
        {/* Custom Header with Search Bar - Matches Header component exactly */}
        <div className="bg-white relative w-full">
          <div className="relative flex items-center justify-center md:justify-between overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] h-[96px] w-full max-w-[1440px] mx-auto">
            {/* Mobile/Tablet hamburger button */}
            <button
              className="absolute left-4 sm:left-8 lg:left-8 xl:left-[150px] flex items-center md:hidden text-sm font-medium text-black z-10"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Logo - centered on mobile/tablet, left on desktop */}
          <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
            <a href="/" aria-label="Home">
              <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
            </a>
          </div>

          {/* Search Bar in Middle - Hidden on mobile/tablet, shown on desktop (md+) */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
            <HeroSearchBar 
              initialBrand={brand || ''}
              initialCategory={category}
              initialLocation={location || ''}
            />
          </div>

          {/* Desktop link on right */}
          <div className="hidden md:flex items-center justify-center">
            <CustomLink href="#" className="font-medium leading-[24px] text-sm sm:text-[16px] text-center">
              ABCD for Businesses
            </CustomLink>
          </div>
          </div>
        </div>

        {/* Mobile/Tablet Search Bar - Below header */}
        <div className="md:hidden w-full px-4 sm:px-8 pb-4">
          <HeroSearchBar 
            initialBrand={brand || ''}
            initialCategory={category}
            initialLocation={location || ''}
          />
        </div>

        <BusinessProfilePage params={params} />
        <Footer />
      </div>
    </div>
  )
}
