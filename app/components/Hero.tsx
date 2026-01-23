'use client'

import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from './HeroSearchBar'

export function Hero() {
  return (
    <div className="w-full flex flex-col gap-8 lg:gap-12 pb-6 sm:pb-10 lg:pb-20 pt-12 sm:pt-16 lg:pt-20 px-4 sm:px-8 lg:px-8 xl:px-[150px] relative w-full max-w-[1440px] mx-auto">
      <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-14 items-center justify-between text-black w-full">
        {/* Left Section */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full lg:w-1/2 text-center lg:text-left">
          {/* Meta Description */}
          <p className="text-gray-500 uppercase font-bold text-sm tracking-wider">
            POWERING ONLINE PRESENCE FOR BRANDS
          </p>
          {/* Title */}
          <h1 className="text-[48px] sm:text-[64px] leading-[1.15]">
            A <span className="font-semibold text-[#4a48e0]">Source of Truth</span> for Business Presence
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
      
      {/* Banner Section */}
      <div className="w-full bg-[white]">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-[white] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 grid sm:flex items-start gap-4">
              <SafeImage 
                alt="TX3Y logo" 
                src={IMAGES.logo} 
                className="h-full shrink-0"
              />
              <div>
                <h2 className="text-xl font-semibold text-[#4a48e0] mb-1">
                  Turn Your Brand Visibility into a Differentiator™
                </h2>
                <p className="text-base text-gray-700">
                Manage accurate, consistent business information across search, maps, and digital platforms with TX3Y. <br /> <span className="font-semibold">Brands with certified facts see up to 30% more traffic.</span>
                </p>
              </div>
            </div>
            <a
              href="https://www.yext.com/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-colors whitespace-nowrap shrink-0"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
