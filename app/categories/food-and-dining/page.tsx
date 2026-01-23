'use client'

import { useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../components/BrandHeader'
import { Footer } from '../../components/Footer'
import { SafeImage } from '../../components/SafeImage'
import { IMAGES } from '../../constants/images'
import { foodAndDiningBrands, isClaimedFoodBrand } from '../../constants/foodAndDiningBrands'
import { getBrandPageUrl } from '../../constants/brandNavigation'
import { getBrandBySlug, countBrandLocations } from '../../constants/brandData'

const PAGE_SIZE = 40

function FoodAndDiningContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = Number(searchParams?.get('page') || '1')
  const statusParam = searchParams?.get('status')
  const activeTab = statusParam === 'unclaimed' ? 'unclaimed' : 'claimed'
  const scrollPositionRef = useRef<number>(0)

  const tabs = useMemo(
    () => [
      {
        id: 'claimed' as const,
        label: 'Brand-Verified',
        icon: IMAGES.verified_icon,
        description:
          'Business information provided and managed by the brand through TX3Y, ensuring consistent, up-to-date details across locations and platforms.',
      },
      {
        id: 'unclaimed' as const,
        label: 'Publicly Sourced',
        icon: IMAGES.warning_icon,
        description: (
          <>
            Business profiles generated from publicly available sources, reflecting information aggregated across the web. Interested in verifying your brand with TX3Y?{' '}
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
    const filtered = foodAndDiningBrands.filter((name) => (activeTab === 'claimed' ? isClaimedFoodBrand(name) : !isClaimedFoodBrand(name)))
    // Sort alphabetically
    return [...filtered].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [activeTab])

  const totalFilteredPages = Math.max(1, Math.ceil(filteredBrands.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? Math.min(Math.max(pageParam, 1), totalFilteredPages) : 1
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
    'Explore businesses across this category, with listings that include key details such as business information and location data. Browse options across different specialties and areas to support informed decisions.'
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
                <span>Food & Dining</span>
              </li>
            </ol>
          </nav>
          <div className="container relative py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Category Icon - Square with rounded border */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
                <SafeImage
                  src={IMAGES.categories[9]}
                  alt="Food & Dining"
                  className="w-[50%] object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="mb-2 text-[32px] leading-[1] font-bold text-[#1c1d20] sm:text-[48px] sm:leading-[1.33]">
                  <span className="flex items-center gap-2 flex-wrap">
                    Food & Dining
                  </span>
                </h1>
                <p className="text-sm sm:text-base">{heroDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container pt-8">
          <div role="tablist" aria-label="Brand status tabs" className="flex flex-wrap items-center gap-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
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
                    // Reset to page 1 when switching tabs
                    router.push(`/categories/food-and-dining?status=${nextStatus}`)
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

          {totalFilteredPages > 1 && (
          <nav className="mt-6 flex items-center gap-x-2" aria-label="Pagination Navigation">
            {currentPage > 1 && (
              <Link
                href={currentPage === 2 
                  ? `/categories/food-and-dining?status=${activeTab}`
                  : `/categories/food-and-dining?status=${activeTab}&page=${currentPage - 1}`}
                className="flex items-center justify-center px-2 py-1 border border-[#ededed] rounded-lg no-underline hover:no-underline hover:border-[#5A58F2] text-black"
              >
                Prev
              </Link>
            )}
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
                  ? `/categories/food-and-dining?status=${activeTab}`
                  : `/categories/food-and-dining?status=${activeTab}&page=${pageNumber}`

              return (
                <Link
                  key={pageNumber}
                  href={href}
                  className={`flex items-center justify-center px-2 py-1 border rounded-lg no-underline hover:no-underline hover:border-[#5A58F2] text-black ${
                    isActive
                      ? 'border-[#5b5d60] bg-[#f7f7f7]'
                      : 'border-[#ededed]'
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}
            {currentPage < totalFilteredPages && (
              <Link
                href={`/categories/food-and-dining?status=${activeTab}&page=${currentPage + 1}`}
                className="flex items-center justify-center px-2 py-1 border border-[#ededed] rounded-lg no-underline hover:no-underline hover:border-[#5A58F2] text-black"
              >
                Next
              </Link>
            )}
          </nav>
          )}
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          <ul className="block columns-1 sm:columns-2 lg:columns-4">
            {pageItems.map((brand) => {
              const brandUrl = getBrandPageUrl(brand)
              const isClickable = brandUrl !== null
              
              // Get location count for the brand
              let locationCount = 0
              if (brandUrl) {
                // Extract slug from URL (format: /categories/food-and-dining/taco-bell)
                const urlParts = brandUrl.split('/')
                const slug = urlParts[urlParts.length - 1]
                if (slug) {
                  const brandData = getBrandBySlug(slug)
                  if (brandData) {
                    locationCount = countBrandLocations(brandData)
                    // Multiply by 1000 to show in thousands for Taco Bell and Baskin-Robbins only
                    if (slug === 'taco-bell' || slug === 'baskin-robbins') {
                      locationCount = locationCount * 1000
                    }
                  }
                }
              }
              
              // Generate a random number for non-clickable brands or brands without location data
              if (locationCount === 0) {
                // Use brand name as seed for consistent random number per brand
                let hash = 0
                for (let i = 0; i < brand.length; i++) {
                  hash = ((hash << 5) - hash) + brand.charCodeAt(i)
                  hash = hash & hash // Convert to 32bit integer
                }
                // Generate number between 10 and 5000
                locationCount = Math.abs(hash % 4990) + 10
              }

              return (
                <li key={brand} className="mb-6">
                  {isClickable ? (
                    <Link href={brandUrl} className="link-primary">
                      {brand}
                    </Link>
                  ) : (
                    <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">
                      {brand}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function FoodAndDiningPage() {
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
      <FoodAndDiningContent />
    </Suspense>
  )
}
