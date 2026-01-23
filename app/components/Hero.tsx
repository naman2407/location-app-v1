'use client'

import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from './HeroSearchBar'

export function Hero() {
  return (
    <div className="relative flex flex-col gap-[20px] h-auto sm:h-[533px] items-center justify-center pt-12 sm:pt-0 px-4 sm:px-8 lg:px-8 xl:px-[150px] text-black w-full max-w-full overflow-visible">
      <div className="flex flex-col font-bold text-center justify-center relative shrink-0 text-[48px] sm:text-[64px] leading-[1.25]">
        <p>Your Go-To Guide for Businesses</p>
      </div>
      <p className="font-medium text-[20px] leading-[1.4] sm:text-[24px] sm:leading-normal relative shrink-0 text-center px-4 pb-12 md:pb-0">
        Discover businesses and services you can trust with ABCD Directory
      </p>
      
      {/* Search Bar - Hidden on mobile, shown on tablet/desktop */}
      <div className="hidden md:flex relative z-10 w-full justify-center mt-4 pb-12 sm:pb-0 overflow-visible">
        <HeroSearchBar />
      </div>
      
      {/* Background Image */}
      <div className="absolute flex flex-col h-full sm:h-[533px] items-start left-0 opacity-20 top-0 w-full overflow-hidden z-0">
        <SafeImage alt="Background" className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full" src={IMAGES.heroBackground} />
      </div>
    </div>
  )
}
