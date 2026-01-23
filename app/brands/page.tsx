'use client'

import { useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandHeader } from '../components/BrandHeader'
import { Footer } from '../components/Footer'
import { Link as CustomLink } from '../components/Link'
import Link from 'next/link'
import { SafeImage } from '../components/SafeImage'
import { IMAGES } from '../constants/images'
import { allBrandNames } from '../constants/allBrandsData'

const PAGE_SIZE = 40

function AllBrandsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = Number(searchParams?.get('page') || '1')
  const statusParam = searchParams?.get('status')
  const activeTab = statusParam === 'unclaimed' ? 'unclaimed' : 'claimed'
  const totalPages = Math.max(1, Math.ceil(allBrandNames.length / PAGE_SIZE))
  const scrollPositionRef = useRef<number>(0)

  const tabs = useMemo(
    () => [
      {
        id: 'claimed' as const,
        label: 'Brand-Verified',
        icon: IMAGES.verified_icon,
        description:
          'Business information provided and managed by the brand through Yext, ensuring consistent, up-to-date details across locations and platforms.',
      },
      {
        id: 'unclaimed' as const,
        label: 'Publicly Sourced',
        icon: IMAGES.warning_icon,
        description: (
          <>
            Business profiles generated from publicly available sources, reflecting information aggregated across the web. Interested in verifying your brand with Yext?{' '}
            <a
              href="https://www.yext.com/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="link-primary"
            >
              Get in touch
            </a>
            .
          </>
        ),
      },
    ],
    []
  )

  const filteredBrands = useMemo(() => {
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

    const filtered = allBrandNames.filter((name) => (activeTab === 'claimed' ? isClaimed(name) : !isClaimed(name)))
    
    // For unclaimed tab, ensure Baskin-Robbins appears on page 3
    if (activeTab === 'unclaimed') {
      const baskinIndex = filtered.findIndex(name => name.toLowerCase() === 'baskin-robbins')
      if (baskinIndex !== -1) {
        // Calculate target index for page 3 (items 81-120, so target around index 100)
        const targetIndex = Math.min(100, filtered.length - 1)
        if (baskinIndex !== targetIndex) {
          const baskin = filtered[baskinIndex]
          filtered.splice(baskinIndex, 1)
          filtered.splice(targetIndex, 0, baskin)
        }
      }
    }
    
    return filtered
  }, [activeTab])

  const totalFilteredPages = Math.max(1, Math.ceil(filteredBrands.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalFilteredPages) : 1
  const startIndex = (currentPage - 1) * PAGE_SIZE

  // Restore scroll position after tab change
  useEffect(() => {
    if (scrollPositionRef.current > 0) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current)
        scrollPositionRef.current = 0 // Reset after restoring
      })
    }
  }, [activeTab])
  const pageItems = filteredBrands.slice(startIndex, startIndex + PAGE_SIZE)
  const heroDescription =
    'Browse brands and locations with business information from brand-verified profiles and publicly sourced data across the web.'
  const activeTabDescription = tabs.find((tab) => tab.id === activeTab)?.description ?? ''

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="pb-4 flex-1 flex flex-col">
        <div className="relative w-full bg-white">
          <nav className="my-4 container" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li className="flex items-center">
                <Link href="/" className="link-primary">
                  <span>Home</span>
                </Link>
                <span className="mx-2 text-[#767676]">/</span>
              </li>
              <li className="flex items-center">
                <span>All Brands</span>
              </li>
            </ol>
          </nav>
          <div className="container relative py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* All Brands Icon - Square with rounded border */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
                <SafeImage
                  src={IMAGES.all_brands}
                  alt="All Brands"
                  className="w-[50%] object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="mb-2 text-[32px] leading-[1] font-bold text-[#1c1d20] sm:text-[48px] sm:leading-[1.33]">
                  <span className="flex items-center gap-2 flex-wrap">
                    All Brands
                  </span>
                </h1>
                <p className="text-sm sm:text-base">{heroDescription}</p>
              </div>
            </div>

            {/* Banner - Below title, description, and image */}
            <div className="mt-6 w-full">
              <div className="bg-[white] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1 grid sm:flex items-start gap-4">
                  <SafeImage 
                    alt="Yext logo" 
                    src={IMAGES.logo} 
                    className="h-full shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-[#4a48e0] mb-1">
                      The Advantage of Brand-Verified Information
                    </h2>
                    <div>
                      <p className="text-base text-gray-700">
                        Brands that manage certified business facts through Yext see up to <span className="font-semibold">30% more traffic</span> compared to pages without brand-verified information.
                      </p>
                      <p className="text-sm text-[#5b5d60] italic mt-2">See how other brands do this at scale → <a href="https://www.yext.com/customers" target="_blank" rel="noopener noreferrer" className="link-primary">Customer stories</a></p>
                    </div>
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

        <div className="container pt-8">
          <div role="tablist" aria-label="Brand status tabs" className="flex flex-wrap items-center gap-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const isVerified = tab.id === 'claimed'
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    // Save current scroll position
                    scrollPositionRef.current = window.scrollY
                    const nextStatus = tab.id === 'claimed' ? 'claimed' : 'unclaimed'
                    router.push(`/brands?status=${nextStatus}`)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#f5f5f5] text-[#1c1d20]'
                      : 'text-[#767676] hover:text-[#1c1d20]'
                  }`}
                >
                  <SafeImage
                    alt=""
                    className="h-4 w-4"
                    src={tab.icon}
                    style={{
                      filter: isActive
                        ? 'brightness(0) saturate(100%) invert(11%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)'
                        : 'brightness(0) saturate(100%) invert(46%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)',
                    }}
                  />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-sm sm:text-base max-w-[672px]">{activeTabDescription}</p>

          <nav className="mt-6 flex items-center gap-x-2" aria-label="Pagination Navigation">
            {Array.from({ length: totalFilteredPages }, (_, index) => index + 1).map((pageNumber) => {
              if (pageNumber > 3 && pageNumber < totalFilteredPages) {
                if (pageNumber === 4) {
                  return (
                    <span key="ellipsis" className="px-1">
                      ...
                    </span>
                  )
                }
                return null
              }

              const isActive = pageNumber === currentPage
              const href =
                pageNumber === 1
                  ? `/brands?status=${activeTab}`
                  : `/brands?status=${activeTab}&page=${pageNumber}`

              return (
                <CustomLink
                  key={pageNumber}
                  href={href}
                  className={`link-primary--dark flex items-center justify-center px-2 py-1 border rounded-lg no-underline hover:no-underline hover:border-[#5A58F2] ${
                    isActive
                      ? 'border-[#5b5d60] bg-[#f7f7f7]'
                      : 'border-[#ededed]'
                  }`}
                >
                  {pageNumber}
                </CustomLink>
              )
            })}
            {currentPage < totalFilteredPages && (
              <CustomLink
                href={`/brands?status=${activeTab}&page=${currentPage + 1}`}
                className="link-primary--dark flex items-center justify-center px-2 py-1 border border-[#ededed] rounded-lg no-underline hover:no-underline hover:border-[#5A58F2]"
              >
                Next
              </CustomLink>
            )}
          </nav>
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          <ul className="block columns-1 sm:columns-2 lg:columns-4">
            {pageItems.map((brand) => {
              const isTacoBell = brand.toLowerCase() === 'taco bell'
              const href = isTacoBell ? '/categories/food-and-dining/taco-bell' : '#'

              return (
                <li key={brand} className="mb-6">
                  {isTacoBell ? (
                    <CustomLink href={href}>
                      {brand}
                    </CustomLink>
                  ) : (
                    <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">{brand}</span>
                  )}
                </li>
              )}
            )}
          </ul>
        </div>
      </div>

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
