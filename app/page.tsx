'use client'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { CategoriesSection } from './components/CategoriesSection'
import { BrandsSection } from './components/BrandsSection'
import { VerifiedSection } from './components/VerifiedSection'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="flex flex-col items-start overflow-hidden relative w-full">
        <Header />
        <Hero />
        
        {/* Main Content */}
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-[100px] items-center pb-12 sm:pb-16 md:pb-[100px] pt-8 sm:pt-12 md:pt-[60px] px-4 sm:px-8 lg:px-8 xl:px-[150px] relative w-full max-w-[1440px] mx-auto">
          <CategoriesSection />
          <BrandsSection />
          <VerifiedSection />
        </div>

        <Footer />
      </div>
    </div>
  )
}
