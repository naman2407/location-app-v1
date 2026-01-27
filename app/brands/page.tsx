'use client'

import { useMemo, Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandHeader } from '../components/BrandHeader'
import { Footer } from '../components/Footer'
import { VerifiedBusinessBanner } from '../components/VerifiedBusinessBanner'
import Link from 'next/link'
import { SafeImage } from '../components/SafeImage'
import { IMAGES } from '../constants/images'
import { allBrandNames } from '../constants/allBrandsData'
import { BrandCard } from '../components/BrandCard'
import { brandNamesToCardData } from '../utils/brandCardData'
import { getBrandPageUrl } from '../constants/brandNavigation'
import { PageSizeDropdown } from '../components/PageSizeDropdown'

const DEFAULT_PAGE_SIZE = 25
const PAGE_SIZE_OPTIONS = [25, 50, 75, 100]

function AllBrandsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = Number(searchParams?.get('page') || '1')
  const pageSizeParam = Number(searchParams?.get('pageSize') || DEFAULT_PAGE_SIZE)
  const [pageSize, setPageSize] = useState(pageSizeParam)

  // Responsive page size based on screen width
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth
      let newSize = 25 // desktop default
      
      if (width < 768) {
        // mobile
        newSize = 10
      } else if (width < 1024) {
        // tablet
        newSize = 18
      }
      
      // Only update if not manually set via dropdown
      if (!searchParams?.get('pageSize')) {
        setPageSize(newSize)
      }
    }
    
    updatePageSize()
    window.addEventListener('resize', updatePageSize)
    return () => window.removeEventListener('resize', updatePageSize)
  }, [searchParams])

  // Convert all brand names to card data and sort alphabetically
  const brandCards = useMemo(() => {
    const isClaimed = (name: string) => {
      const normalized = name.toLowerCase()
      if (normalized === 'taco bell') return true
      if (normalized === 'baskin-robbins') return false
      let hash = 0
      for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) % 1000
      }
      return hash % 3 !== 0
    }

    const cardData = brandNamesToCardData(allBrandNames, isClaimed)
    // Sort alphabetically by name
    return cardData.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }, [])

  const totalPages = Math.max(1, Math.ceil(brandCards.length / pageSize))
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalPages) : 1
  const startIndex = (currentPage - 1) * pageSize
  const pageItems = brandCards.slice(startIndex, startIndex + pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('pageSize', newSize.toString())
    router.push(`/brands?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', pageSize.toString())
    }
    router.push(`/brands?${params.toString()}`)
  }

  const heroDescription =
    'Browse brands and locations with business information from brand-verified profiles and publicly sourced data across the web.'

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-white">
          <div className="container py-8 sm:py-12">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li className="flex items-center">
                  <Link href="/" className="link-primary flex items-center gap-1.5 font-normal">
                    <SafeImage src={IMAGES.home} alt="" className="w-4 h-4" />
                <span>Home</span>
                  </Link>
                  <span className="mx-2 text-[#DADCE0]">/</span>
            </li>
                <li className="flex items-center">
                  <span className="font-medium">All Brands</span>
            </li>
          </ol>
        </nav>

            {/* Hero Content - Horizontal Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
              {/* Left side: Icon, Title, Description */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* All Brands Icon - Square with rounded border */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
                    <SafeImage
                      src={IMAGES.all_brands}
                      alt="All Brands"
                      className="w-[50%] object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="mb-3 text-[32px] sm:text-[40px] leading-[1.1] font-semibold text-[#1c1d20]">
                      All Brands
                    </h1>
                    <p className="text-base text-[#767676] leading-relaxed">
                      Browse brands and locations with business information from brand-verified profiles and publicly sourced data across the web.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side: Banner */}
              <div className="lg:w-[420px] xl:w-[480px] shrink-0">
                <div className="bg-[#F2F2FA] rounded-2xl p-5 lg:p-6 flex flex-col gap-5">
                  <h2 className="text-xl font-semibold text-[#5A58F2]">
                    The Advantage of Brand-Verified Information
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 text-[15px] text-[#1c1d20]">
                      <SafeImage
                        src={IMAGES.check}
                        alt=""
                        className="w-5 h-5 shrink-0 mt-0.5"
                      />
                      <p className="leading-relaxed">
                        Brands that manage certified business facts through TX3Y see up to 30% more traffic compared to pages without brand-verified information.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 text-[15px] text-[#1c1d20]">
                      <SafeImage
                        src={IMAGES.arrow}
                        alt=""
                        className="w-5 h-5 shrink-0 mt-0.5"
                      />
                      <a
                        href="https://www.yext.com/customers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1c1d20] underline hover:no-underline leading-relaxed"
                      >
                        Discover how other brands do this at scale
                      </a>
                    </div>
                  </div>
                  <a
                    href="https://www.yext.com/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-6 py-3 rounded-full transition-colors w-fit mt-1 text-center"
                  >
                    Claim your competitive edge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="container pt-8 pb-12 sm:pb-[100px]">
          {/* Show dropdown - Top Right */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#767676]">Show</span>
              <PageSizeDropdown
                value={pageSize}
                options={PAGE_SIZE_OPTIONS}
                onChange={handlePageSizeChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full items-stretch">
            {pageItems.map((brand) => {
              const brandUrl = getBrandPageUrl(brand.name)
              return (
                <div key={brand.name}>
                  <BrandCard brand={brand} href={brandUrl || undefined} showClaimedBadge={true} variant="compact" />
                </div>
              )
            })}
          </div>

          {/* Pagination - Bottom Center */}
          <div className="mt-8 lg:mt-10 w-full">
            <div className="flex justify-center items-center w-full">
            {/* Page navigation */}
            <div className="flex items-center gap-2 justify-center px-4 sm:px-0">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                  currentPage === 1
                    ? 'border-[#DADCE0] cursor-not-allowed'
                    : 'border-[#1c1d20] hover:bg-[#f5f5f5] cursor-pointer'
                }`}
                aria-label="Previous page"
              >
                <SafeImage 
                  src={IMAGES.chevron} 
                  alt="Previous" 
                  className={`w-4 h-4 rotate-180 ${currentPage === 1 ? 'opacity-30' : ''}`}
                />
              </button>
              
              {/* Page numbers */}
              {(() => {
                const pages: JSX.Element[] = []
                
                if (totalPages <= 1) {
                  // Just show page 1 if only one page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors bg-[#1c1d20] text-white border-[#1c1d20]`}
                    >
                      1
                    </button>
                  )
                } else {
                  // Mobile: Show only 1 ... last
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                        currentPage === 1
                          ? 'bg-[#1c1d20] text-white border-[#1c1d20]'
                          : 'border-[#1c1d20] text-[#1c1d20] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      1
                    </button>
                  )
                  
                  // Ellipsis on mobile (between 1 and last)
                  if (totalPages > 2) {
                    pages.push(
                      <span key="ellipsis-mobile" className="md:hidden flex items-center justify-center w-12 h-12 text-[#1c1d20]">
                      ...
                    </span>
                  )
                }
                  
                  // Desktop: Show first 8 pages
                  if (totalPages > 10) {
                    for (let i = 2; i <= Math.min(8, totalPages - 1); i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                            currentPage === i
                              ? 'bg-[#1c1d20] text-white border-[#1c1d20]'
                              : 'border-[#1c1d20] text-[#1c1d20] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          {i}
                        </button>
                      )
                    }
                    
                    // Desktop ellipsis
                    if (totalPages > 9) {
                      pages.push(
                        <span key="ellipsis-desktop" className="hidden md:flex items-center justify-center w-12 h-12 text-[#1c1d20]">
                          ...
                        </span>
                      )
                    }
                  } else {
                    // Desktop: Show all pages if 10 or fewer
                    for (let i = 2; i < totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                            currentPage === i
                              ? 'bg-[#1c1d20] text-white border-[#1c1d20]'
                              : 'border-[#1c1d20] text-[#1c1d20] hover:bg-[#f5f5f5]'
                  }`}
                >
                          {i}
                        </button>
              )
                    }
                  }
                  
                  // Last page (shown on both mobile and desktop)
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                          currentPage === totalPages
                            ? 'bg-[#1c1d20] text-white border-[#1c1d20]'
                            : 'border-[#1c1d20] text-[#1c1d20] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        {totalPages}
                      </button>
                    )
                  }
                }
                
                return pages
              })()}
              
              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                  currentPage === totalPages
                    ? 'border-[#DADCE0] cursor-not-allowed'
                    : 'border-[#1c1d20] hover:bg-[#f5f5f5] cursor-pointer'
                }`}
                aria-label="Next page"
              >
                <SafeImage 
                  src={IMAGES.chevron} 
                  alt="Next" 
                  className={`w-4 h-4 ${currentPage === totalPages ? 'opacity-30' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <VerifiedBusinessBanner />
      <Footer />
    </div>
  )
}

export default function AllBrandsPage() {
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
      <AllBrandsContent />
    </Suspense>
  )
}
