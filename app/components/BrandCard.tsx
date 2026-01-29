'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { useState } from 'react'

interface BrandCardProps {
  brand: {
    name: string
    locations: string
    category: string
    rating: number
    logo: string
    claimed?: boolean
  }
  href?: string
  showClaimedBadge?: boolean
  variant?: 'default' | 'compact'
}

export function BrandCard({ brand, href, showClaimedBadge = false, variant = 'default' }: BrandCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showNameTooltip, setShowNameTooltip] = useState(false)
  
  // Extract number from locations string (e.g., "13,445 locations" -> "13,445")
  const locationCount = brand.locations.split(' ')[0]
  
  // Compact variant (for pages with pagination)
  if (variant === 'compact') {
    const cardContent = (
      <div className={`bg-white card-border-normal flex flex-col h-full w-full min-w-0 relative overflow-hidden lg:overflow-visible transition-[border,background-color] duration-200 group ${href ? 'cursor-pointer' : 'cursor-default'}`}>
        {/* Content section */}
        <div className="flex flex-col gap-2.5 p-4 min-w-0 flex-1 items-center text-center">
          {/* Logo - Square with rounded corners */}
          <div className="relative shrink-0 w-[80px] h-[80px] rounded-lg overflow-hidden bg-white border border-[#e0e0e0] flex items-center justify-center">
            <SafeImage alt={brand.name} className="block max-w-none w-full h-full object-contain p-2" src={brand.logo} />
          </div>
          
          {/* Business info */}
          <div className="flex flex-col gap-1.5 items-center leading-tight min-w-0 w-full flex-1">
            {/* Brand name with icon - Desktop: icon attached to last word, Mobile: normal layout */}
            <div className="text-center w-full min-w-0 px-2 leading-normal">
              <h1 className="font-medium text-base inline-block max-w-full">
                {(() => {
                  const nameParts = brand.name.split(' ')
                  const lastWord = nameParts[nameParts.length - 1]
                  const restOfName = nameParts.slice(0, -1).join(' ')
                  
                  return (
                    <>
                      {/* Desktop: show split name with icon on last word */}
                      <span className="hidden lg:inline">
                        {restOfName && <span>{restOfName} </span>}
                        <span className="lg:whitespace-nowrap lg:inline-flex lg:items-center">
                          {lastWord}
                          {showClaimedBadge && (
                            <span 
                              className="relative hidden lg:inline-flex cursor-pointer lg:ml-2"
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              <SafeImage 
                                alt={brand.claimed ? "Verified" : "Warning"}
                                src={brand.claimed ? IMAGES.verified_icon : IMAGES.warning_icon}
                                className="w-4 h-4 inline-block align-middle"
                              />
                              {showTooltip && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                                  {brand.claimed ? 'Brand-Verified Information' : 'Publicly Sourced Information'}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                                </div>
                              )}
                            </span>
                          )}
                        </span>
                      </span>
                      {/* Mobile/Tablet: show full name normally */}
                      <span className="lg:hidden">{brand.name}</span>
                    </>
                  )
                })()}
              </h1>
            </div>
            
            {/* Location count and Rating - Normal spacing, no mt-auto */}
            <div className="flex flex-col gap-1.5 items-center">
              {/* Location count */}
              <p className="font-normal text-sm text-[#767676]">
                {locationCount} locations
              </p>
              
              {/* Rating */}
              <div className="flex gap-1.5 items-center justify-center">
                <p className="font-normal text-sm text-[#767676]">
                  {brand.rating.toFixed(1)}
                </p>
                <div className="relative shrink-0 w-[80px] h-4">
                  <SafeImage alt="Stars" className="block max-w-none w-full h-full" src={IMAGES.stars} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section with verification badge - Mobile/Tablet only */}
        {showClaimedBadge && (
          <>
            {brand.claimed ? (
              <div className="lg:hidden bg-[#EEE8F7] px-4 py-1 flex items-center justify-center gap-2 mt-auto">
                <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[14px] font-medium text-[#6F42C1]">
                  Brand-Verified
                </span>
              </div>
            ) : (
              <div className="lg:hidden bg-[#FFCD39] px-4 py-1 flex items-center justify-center gap-2 mt-auto">
                <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[14px] font-medium text-[#1c1d20]">
                  Publicly Sourced
                </span>
              </div>
            )}
          </>
        )}
      </div>
    )

    if (href) {
  return (
        <Link href={href} className="block w-full h-full no-underline">
          {cardContent}
        </Link>
      )
    }

    return cardContent
  }
  
  // Default variant (for homepage)
  const cardContent = (
    <div className={`bg-white card-border-normal flex flex-col h-full w-full min-w-0 relative overflow-hidden transition-[border,background-color] duration-200 group ${href ? 'cursor-pointer' : 'cursor-default'}`} title={brand.name}>
      {/* White upper section */}
      <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 min-w-0 flex-1">
        {/* Logo - Square with rounded corners */}
        <div className="relative shrink-0 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-lg overflow-hidden bg-white border border-[#e0e0e0] flex items-center justify-center">
          <SafeImage alt={brand.name} className="block max-w-none w-full h-full object-contain p-2" src={brand.logo} />
        </div>
        
        {/* Business info */}
        <div className="flex flex-col gap-1.5 sm:gap-2 items-start leading-tight min-w-0 flex-1 text-black overflow-hidden">
          <p className="font-bold text-lg sm:text-xl line-clamp-2">
            {brand.name}
          </p>
          <p className="font-normal text-[14px] text-black">
            {locationCount} locations
          </p>
          <div className="flex gap-1.5 items-center mt-1">
            <p className="font-normal text-[14px] text-black">
              {brand.rating.toFixed(1)}
            </p>
            <div className="relative shrink-0 w-[80px] sm:w-[90px] h-4">
              <SafeImage alt="Stars" className="block max-w-none w-full h-full" src={IMAGES.stars} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section with verification badge */}
      {showClaimedBadge && (
        <>
          {brand.claimed ? (
            <div className="bg-[#EEE8F7] px-4 sm:px-5 md:px-6 py-1 flex items-center justify-center gap-2 mt-auto">
              <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-4 h-4 shrink-0" />
              <span className="text-[14px] font-medium text-[#6F42C1]">
                Brand-Verified
              </span>
            </div>
          ) : (
            <div className="bg-[#FFCD39] px-4 sm:px-5 md:px-6 py-1 flex items-center justify-center gap-2 mt-auto">
              <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-4 h-4 shrink-0" />
              <span className="text-[14px] font-medium text-[#1c1d20]">
                Publicly Sourced
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block w-full h-full no-underline">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}


