'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SafeImage } from '../components/SafeImage'
import { IMAGES } from '../constants/images'
import { Footer } from '../components/Footer'
import { HeroSearchBar } from '../components/HeroSearchBar'
import { BrandHeader } from '../components/BrandHeader'
import Link from 'next/link'

function SearchContent() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams?.get('q') || ''

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="pb-4 flex-1 flex flex-col">
        {/* Breadcrumbs */}
        <nav className="my-4 container" aria-label="Breadcrumb">
          <ol className="flex flex-wrap">
            <li>
              <Link href="/" className="link-primary">
                <span>Home</span>
              </Link>
              <span className="mx-2 text-[#767676]">/</span>
            </li>
            <li>
              <span>No results found</span>
            </li>
          </ol>
        </nav>

        <div className="container py-6 lg:py-8 flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center flex-1 min-h-0">
            <div className="flex flex-col items-center text-center max-w-[420px] w-full">
              <SafeImage alt="No results" className="mb-7" src={IMAGES.noResult} />

              <h2 className="text-lg font-semibold text-center mb-2">
                {searchTerm ? `No results found for "${searchTerm}"` : "Can't find what you're looking for?"}
              </h2>

              <p className="text-sm font-normal text-[#5C5D60] text-center mb-[28px]">
                No results were found. Try adjusting your search, or contact our team for help adding or updating a business listing.
              </p>

              <a 
                href="https://www.yext.com/demo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="my-2 px-[14px] py-2 bg-[#5A58F2] text-white text-base font-normal rounded-full hover:opacity-90 transition-opacity inline-block text-center"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen w-full flex flex-col">
        <BrandHeader showSearch={true} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#5b5d60]">Loading...</p>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
