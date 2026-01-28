'use client'

import { BrandCard } from './BrandCard'
import { Link } from './Link'
import { brands } from '../constants/data'
import { allBrandNames } from '../constants/allBrandsData'
import { brandNamesToCardData } from '../utils/brandCardData'
import { getBrandPageUrl } from '../constants/brandNavigation'
import { IMAGES } from '../constants/images'
import { useMemo, useState, useEffect } from 'react'

export function BrandsSection() {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  useEffect(() => {
    const compute = () => {
      if (window.innerWidth >= 1024) return setViewport('desktop')
      if (window.innerWidth >= 768) return setViewport('tablet')
      return setViewport('mobile')
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Get original 6 brands plus 4 more verified brands (including Baskin-Robbins and 10Com)
  const brandCards = useMemo(() => {
    // Start with original 6 brands from data.ts
    const originalBrands = brands.map(brand => ({
      name: brand.name,
      locations: brand.locations,
      category: brand.category,
      rating: brand.rating,
      logo: brand.logo,
      claimed: brand.claimed || true, // All original brands are verified
    }))

    // Type for brand card data
    type BrandCardType = {
      name: string
      locations: string
      category: string
      rating: number
      logo: string
      claimed: boolean
    }

    // Manually create Baskin-Robbins card to avoid build-time issues with getBrandBySlug
    const baskinRobbinsCard: BrandCardType = {
      name: 'Baskin-Robbins',
      locations: '9,000 locations',
      category: 'Food & Dining',
      rating: 4.5,
      logo: IMAGES.brands.baskinRobbins,
      claimed: false,
    }

    // Helper to check if brand should be claimed
    const isClaimed = (name: string) => {
      const normalized = name.toLowerCase()
      // Exclude brands already in original list and Baskin-Robbins (we're adding it manually)
      const originalNames = originalBrands.map(b => b.name.toLowerCase())
      if (originalNames.includes(normalized)) return false
      if (normalized === 'baskin-robbins') return false
      
      // Prioritize specific brands
      if (normalized === 'taco bell') return true
      if (normalized === '10com') return true
      let hash = 0
      for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000
      }
      return hash % 3 !== 0
    }

    // Find 10Com first and create its card
    const tenComName = allBrandNames.find(name => name.toLowerCase() === '10com')
    let tenComCard: BrandCardType | null = null
    if (tenComName) {
      try {
        const tenComCards = brandNamesToCardData([tenComName], isClaimed)
        const tenComData = tenComCards[0]
        if (tenComData) {
          tenComCard = {
            name: tenComData.name,
            locations: tenComData.locations,
            category: tenComData.category,
            rating: tenComData.rating,
            logo: tenComData.logo,
            claimed: tenComData.claimed,
          }
        }
      } catch (error) {
        console.error('Error creating 10Com card:', error)
      }
    }
    
    // Get other verified brands (limit to first 50 brands to avoid processing all 300+)
    const otherBrandNames = allBrandNames
      .filter(name => {
        const normalized = name.toLowerCase()
        const originalNames = originalBrands.map(b => b.name.toLowerCase())
        return !originalNames.includes(normalized) && 
               normalized !== 'baskin-robbins' && 
               normalized !== '10com'
      })
      .slice(0, 50) // Limit to first 50 to improve performance
    
    let otherVerifiedBrands: BrandCardType[] = []
    try {
      const otherCardData = brandNamesToCardData(otherBrandNames, isClaimed)
      otherVerifiedBrands = otherCardData
        .filter(brand => brand.claimed)
        .map(brand => ({
          name: brand.name,
          locations: brand.locations,
          category: brand.category,
          rating: brand.rating,
          logo: brand.logo,
          claimed: brand.claimed,
        }))
        .slice(0, 2) // Get 2 more verified brands (since we're adding Baskin-Robbins and 10Com)
    } catch (error) {
      console.error('Error creating other brand cards:', error)
    }

    // Combine: original 6 + Baskin-Robbins + 10Com (if found) + 2 others = 10 total
    const additionalBrands: BrandCardType[] = tenComCard 
      ? [baskinRobbinsCard, tenComCard, ...otherVerifiedBrands] 
      : [baskinRobbinsCard, ...otherVerifiedBrands.slice(0, 3)]
    return [...originalBrands, ...additionalBrands].slice(0, 10) as typeof originalBrands
  }, [])

  // Determine how many brands to show based on viewport
  const visibleCount = viewport === 'desktop' ? 10 : viewport === 'tablet' ? 9 : 10
  const visibleBrands = brandCards.slice(0, visibleCount)

  return (
    <div className="bg-white flex flex-col gap-6 sm:gap-8 md:gap-[32px] items-center relative w-full max-w-[1500px] mx-auto">
      <div className="flex flex-col gap-[8px] items-center leading-[1.5] relative w-full">
        <p className="text-2xl sm:text-3xl font-medium text-[#1c1d20]">
          Brands
        </p>
        <p className="font-normal min-w-full relative shrink-0 text-base text-[#5b5d60] text-center tracking-[-0.38px] px-4">
          Explore all brands and locations
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-[24px] items-center relative w-full">
        {/* Brand Cards Grid - Match all brands page: 1 col mobile, 3 col tablet, 5 col lg+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full items-stretch">
          {visibleBrands.map((brand) => {
            // Only make Taco Bell and Baskin-Robbins clickable
            const normalizedName = brand.name.toLowerCase().trim()
            const isClickable = normalizedName === 'taco bell' || normalizedName === 'baskin-robbins' || normalizedName === 'baskin robbins'
            const brandUrl = isClickable ? getBrandPageUrl(brand.name) : null
            return (
              <div key={brand.name}>
                <BrandCard brand={brand} href={brandUrl || undefined} showClaimedBadge={true} variant="compact" />
            </div>
            )
          })}
        </div>
        
        {/* View All Brands Link */}
        <Link
          href="/brands"
          className="no-focus-ring font-medium h-[30px] leading-[1.5] relative shrink-0 text-base text-center tracking-[-0.38px] w-full"
        >
          Discover All brands
        </Link>
      </div>
    </div>
  )
}
