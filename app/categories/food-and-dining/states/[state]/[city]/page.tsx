'use client'

import { useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../../components/BrandHeader'
import { Footer } from '../../../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../../../components/SafeImage'
import { IMAGES } from '../../../../../constants/images'
import { tacoBellData, baskinRobbinsData, type BrandLocation } from '../../../../../constants/brandData'
import { mockNYCRestaurants, mockAlbanyRestaurants } from '../../../../../constants/mockRestaurants'
import { CategoryBanner } from '../../../../../components/CategoryBanner'
import { Breadcrumbs } from '../../../../../components/Breadcrumbs'

interface PageProps {
  params: { state: string; city: string }
}

const PAGE_SIZE = 30

function CategoryCityContent({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  if (params.state !== 'new-york') {
    router.push('/categories/food-and-dining')
    return null
  }

  // Get state and city names
  const stateNameMap: Record<string, string> = {
    'new-york': 'New York',
  }
  const stateName = stateNameMap[params.state] || params.state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  const cityNameMap: Record<string, string> = {
    'new-york': 'New York City',
    'albany': 'Albany',
  }
  const cityName = cityNameMap[params.city] || params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  // Get all locations from Taco Bell and Baskin-Robbins for this city
  const allLocations = useMemo(() => {
    const locations: (BrandLocation & { brandName: string })[] = []
    
    // Get Taco Bell locations
    const tacoBellNYState = tacoBellData.states.find(s => s.slug === 'new-york')
    if (tacoBellNYState) {
      const tacoBellCity = tacoBellNYState.cities.find(c => c.slug === params.city)
      if (tacoBellCity) {
        tacoBellCity.locations.forEach(loc => {
          locations.push({
            ...loc,
            brandName: 'Taco Bell',
          })
        })
      }
    }
    
    // Get Baskin-Robbins locations
    const baskinNYState = baskinRobbinsData.states.find(s => s.slug === 'new-york')
    if (baskinNYState) {
      const baskinCity = baskinNYState.cities.find(c => c.slug === params.city)
      if (baskinCity) {
        baskinCity.locations.forEach(loc => {
          locations.push({
            ...loc,
            brandName: 'Baskin-Robbins',
          })
        })
      }
    }
    
    // Add mock other restaurants only for NYC and Albany
    if (params.city === 'new-york') {
      locations.push(...mockNYCRestaurants)
    } else if (params.city === 'albany') {
      locations.push(...mockAlbanyRestaurants)
    }
    
    return locations
  }, [params.city])

  const pageParam = Number(searchParams?.get('page') || '1')
  const totalPages = Math.max(1, Math.ceil(allLocations.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalPages) : 1
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageLocations = allLocations.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (newPage: number) => {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages)
    const qp = new URLSearchParams()
    qp.set('page', nextPage.toString())
    router.push(`/categories/food-and-dining/states/${params.state}/${params.city}?${qp.toString()}`)
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Food & Dining', href: '/categories/food-and-dining' },
    { label: stateName, href: `/categories/food-and-dining/states/${params.state}` },
    { label: cityName, href: `/categories/food-and-dining/states/${params.state}/${params.city}` },
  ]

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-[#FAFCFE]">
          <div className="container py-8 sm:py-12">
            <Breadcrumbs items={breadcrumbs.slice(1)} />

            {/* Hero Content - Horizontal Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
              {/* Left side: Icon, Title, Description */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Category Icon - Square with rounded border */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
                    <SafeImage
                      src={IMAGES.categories[9]}
                      alt="Food & Dining"
                      className="w-[50%] object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="mb-3 text-[32px] sm:text-[40px] leading-[1.1] font-semibold text-[#1c1d20]">
                      Food & Dining in {cityName}
                    </h1>
                    <p className="text-base text-[#1c1d20] leading-relaxed">
                      Discover the best in Food & Dining, from top-rated restaurants to local gems. Listings includes business details, location information, and customer reviews to help you decide where to eat. Browse a range of options across different cuisines and neighborhoods.
                    </p>
                  </div>
                </div>
              </div>

              <CategoryBanner />
            </div>
          </div>
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          {/* Location cards grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-10">
            {pageLocations.map((location) => {
              // Only Taco Bell and Baskin-Robbins are clickable
              const isClickable = location.brandName === 'Taco Bell' || location.brandName === 'Baskin-Robbins'
              const href = isClickable ? `/business/${location.slug}` : '#'
              const CardWrapper = isClickable ? Link : 'div'
              
              return (
                <li key={location.id}>
                  <CardWrapper
                    href={href}
                    className={`card-border-normal bg-white p-4 flex flex-col gap-3 h-full ${
                      isClickable ? 'cursor-pointer hover:bg-[#f5f5f5] transition-colors' : 'cursor-default'
                    }`}
                  >
                    <h3 className="font-medium text-[16px] text-black leading-snug">
                      {location.name}
                    </h3>
                    <div className="text-[14px] leading-relaxed flex flex-col gap-1 flex-1 text-[#767676]">
                      <div>{location.address}</div>
                      {location.phone && <div>{location.phone}</div>}
                      <div className="flex items-center gap-1.5">
                        <span>{location.rating.toFixed(1)}</span>
                        <div className="relative shrink-0 w-[80px] sm:w-[90px] h-4">
                          <SafeImage alt="Stars" className="block max-w-none w-full h-full" src={IMAGES.stars} />
                        </div>
                        <span>({location.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </CardWrapper>
                </li>
              )
            })}
          </ul>

          {/* Pagination - Bottom Center */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2 mt-6 lg:mt-7 px-4 sm:px-0">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                  currentPage === 1
                    ? 'border-[#DADCE0] cursor-not-allowed'
                    : 'border-[#1c1d20] hover:bg-[#f5f5f5]'
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
                    : 'border-[#1c1d20] hover:bg-[#f5f5f5]'
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

      <VerifiedBusinessBanner />
      <Footer />
    </div>
  )
}

export default function CategoryCityPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen w-full flex flex-col">
          <BrandHeader />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#5b5d60]">Loading...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <CategoryCityContent params={params} />
    </Suspense>
  )
}

