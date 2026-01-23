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
        label: 'Claimed Businesses',
        icon: IMAGES.claimed_tab,
        description:
          'A claimed business has verified ownership of its profile, allowing it to manage information, respond to reviews, and control how it appears across platforms.',
      },
      {
        id: 'unclaimed' as const,
        label: 'Unclaimed Businesses',
        icon: IMAGES.unclaimed_tab,
        description: (
          <>
            An unclaimed business profile is auto-generated and unmanaged, with limited accuracy and no ability to engage or update details. Interested in claiming your brand?{' '}
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
    'Discover the best in Food & Dining, from top-rated restaurants to local gems. Listings includes business details, location information, and customer reviews to help you decide where to eat. Browse a range of options across different cuisines and neighborhoods.'
  const activeTabDescription = tabs.find((tab) => tab.id === activeTab)?.description ?? ''

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="pb-4 flex-1 flex flex-col">
        <nav className="my-4 container" aria-label="Breadcrumb">
          <ol className="flex flex-wrap">
            <li>
              <Link href="/" className="link-primary">
                <span>Home</span>
              </Link>
              <span className="mx-2 text-[#767676]">/</span>
            </li>
            <li>
              <span>Food & Dining</span>
            </li>
          </ol>
        </nav>

        <div className="category-hero">
          <div className="category-hero-overlay" />
          <div className="container relative py-12 sm:py-[74px]">
            <div className="max-w-[672px]">
              <h1 className="mb-4 flex flex-col text-[32px] leading-[1] font-bold text-[#1c1d20] sm:text-[48px] sm:leading-[1.33]">
                <span>Food & Dining</span>
              </h1>
              <p className="text-sm sm:text-base">{heroDescription}</p>
            </div>
          </div>
        </div>

        <div className="container pt-8">
          <div role="tablist" aria-label="Brand status tabs" className="flex flex-wrap items-center gap-4 border-b border-[#ededed]">
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
                  className={`relative -mb-px flex items-center gap-2 px-2 pb-3 text-sm font-semibold transition-colors ${
                    isActive ? 'text-[#1c1d20]' : 'text-[#5b5d60] hover:text-[#1c1d20]'
                  }`}
                >
                  <SafeImage
                    alt=""
                    className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                    src={tab.icon}
                  />
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#5a58f2]" />}
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

              return (
                <li key={brand} className="mb-6">
                  {isClickable ? (
                    <Link href={brandUrl} className="link-primary">
                      {brand}
                    </Link>
                  ) : (
                    <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">{brand}</span>
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
