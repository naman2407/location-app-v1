'use client'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { CategoriesSection } from './components/CategoriesSection'
import { BrandsSection } from './components/BrandsSection'
import { VerifiedSection } from './components/VerifiedSection'
import { VerifiedBusinessBanner } from './components/VerifiedBusinessBanner'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <div className="flex flex-col items-start overflow-hidden relative w-full flex-1">
        <Header />
        <Hero />
        
        {/* Main Content */}
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-[100px] items-center pb-12 sm:pb-16 md:pb-[100px] pt-8 sm:pt-12 md:pt-[60px] px-4 sm:px-8 lg:px-8 xl:px-[150px] relative w-full max-w-[1500px] mx-auto">
          {/* Banner Section */}
          <div className="w-full flex flex-col items-center gap-4 sm:gap-6 py-8">
            <h2 className="font-light text-2xl sm:text-3xl md:text-4xl text-center max-w-[464px] leading-[48px]">
              Turn Your Brand Visibility into a Differentiator™
            </h2>
            <p className="text-base text-gray-700 text-center max-w-[568px]">
            Manage accurate, consistent business information across search, maps, and digital platforms with TX3Y. <span className="font-semibold">Verified brands see up to 30% more traffic.</span>
            </p>
            <a
              href="https://www.yext.com/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-colors whitespace-nowrap shrink-0"
            >
              Claim your competitive edge
            </a>
          </div>
          
          <BrandsSection />
          <CategoriesSection />
        </div>

        <VerifiedSection />
        <VerifiedBusinessBanner />
        <Footer />
      </div>
    </div>
  )
}
