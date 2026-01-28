'use client'

import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from './HeroSearchBar'

export function Hero() {
  return (
    <div className="bg-[#FAFCFE] w-full">
      <div className="flex flex-col gap-8 lg:gap-12 pb-6 sm:pb-10 lg:pb-20 pt-12 sm:pt-16 lg:pt-20 px-4 sm:px-8 lg:px-8 xl:px-[150px] relative w-full max-w-[1500px] mx-auto">
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-14 items-center justify-between text-black w-full">
          {/* Left Section */}
          <div className="flex flex-col gap-2 sm:gap-3 w-full lg:w-1/2 text-center lg:text-left">
            {/* Meta Description */}
            <p className="text-gray-500 uppercase font-semibold text-sm tracking-wider">
              POWERING ONLINE PRESENCE FOR BRANDS
            </p>
            {/* Title */}
            <h1 className="font-medium text-[48px] sm:text-[64px] leading-[1.15]">
              A Source of Truth for <span className="bg-gradient-to-r from-[#5755EF] to-[#00BDE2] bg-clip-text text-transparent">Business Presence</span>
            </h1>
            
            {/* Description */}
            <p className="font-regular text-[16px] leading-[1.4] sm:text-[20px] sm:leading-normal text-gray-700">
              Trusted, reliable business information. Powered by TX3Y.
      </p>
      
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block mt-6 w-full mb-4 sm:mb-0">
        <HeroSearchBar />
            </div>
      </div>
      
          {/* Right Section */}
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <SafeImage 
              alt="Hero" 
              className="w-full h-auto object-contain" 
              src={IMAGES.hero} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
