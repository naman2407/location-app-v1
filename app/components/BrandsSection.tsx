'use client'

import { BrandCard } from './BrandCard'
import { Link } from './Link'
import { brands } from '../constants/data'
import { allBrandNames } from '../constants/allBrandsData'
import { brandNamesToCardData } from '../utils/brandCardData'
import { getBrandPageUrl } from '../constants/brandNavigation'
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

  // Get original 6 brands plus 4 more verified brands
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

    // Get 4 more verified brands from allBrandNames
    const isClaimed = (name: string) => {
      const normalized = name.toLowerCase()
      // Exclude brands already in original list
      const originalNames = originalBrands.map(b => b.name.toLowerCase())
      if (originalNames.includes(normalized)) return false
      
      if (normalized === 'taco bell') return true
      if (normalized === 'baskin-robbins') return false
      let hash = 0
      for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000
      }
      return hash % 3 !== 0
    }

    const cardData = brandNamesToCardData(allBrandNames, isClaimed)
    // Filter to only verified brands, exclude originals, and take first 4
    const additionalBrands = cardData
      .filter(brand => brand.claimed && !originalBrands.some(ob => ob.name.toLowerCase() === brand.name.toLowerCase()))
      .slice(0, 4)

    return [...originalBrands, ...additionalBrands]
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
            const brandUrl = getBrandPageUrl(brand.name)
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
