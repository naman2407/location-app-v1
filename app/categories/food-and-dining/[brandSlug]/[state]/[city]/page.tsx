'use client'

import { useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../../components/BrandHeader'
import { Footer } from '../../../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../../../components/SafeImage'
import { IMAGES } from '../../../../../constants/images'
import { getBrandBySlug, getStateBySlug, getCityBySlug, type BrandLocation } from '../../../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string; state: string; city: string }
}

const PAGE_SIZE = 30

function BrandCityContent({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const brand = getBrandBySlug(params.brandSlug)
  const state = getStateBySlug(params.brandSlug, params.state)
  const city = getCityBySlug(params.brandSlug, params.state, params.city)

  if (!brand || !state || !city) {
    router.push('/search?q=' + encodeURIComponent(params.brandSlug))
    return null
  }

  // Get locations from the city
  const cityLocations = useMemo(() => {
    return city.locations.map(loc => ({
      ...loc,
      cityName: city.name,
      citySlug: city.slug
    } as BrandLocation & { cityName: string; citySlug: string }))
  }, [city])

  const pageParam = Number(searchParams?.get('page') || '1')
  const totalPages = Math.max(1, Math.ceil(cityLocations.length / PAGE_SIZE))
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalPages) : 1
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageLocations = cityLocations.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (newPage: number) => {
    const nextPage = Math.min(Math.max(newPage, 1), totalPages)
    const qp = new URLSearchParams()
    qp.set('page', nextPage.toString())
    router.push(`/categories/food-and-dining/${brand.slug}/${state.slug}/${city.slug}?${qp.toString()}`)
  }

  // For Taco Bell and Baskin-Robbins, show "All Brands" instead of category
  const isSpecialBrand = params.brandSlug === 'taco-bell' || params.brandSlug === 'baskin-robbins'
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { 
      label: isSpecialBrand ? 'All Brands' : brand.category, 
      href: isSpecialBrand ? '/brands' : (brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#') 
    },
    { label: brand.name, href: `/categories/food-and-dining/${brand.slug}` },
    { label: state.name, href: `/categories/food-and-dining/${brand.slug}/${state.slug}` },
    { label: city.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Official, brand-verified information for ${brand.name} locations in ${city.name}, ${state.name}, including hours, FAQs, and customer feedback, sourced from the TX3Y Knowledge Graph.`
    : `General business location information for ${brand.name} in ${city.name}, ${state.name}.`

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader dynamicTitle={city.name} />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-[#FAFCFE]">
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
                {breadcrumbs.slice(1).map((crumb, index) => {
                  const isLast = index === breadcrumbs.slice(1).length - 1
                  return (
                    <li key={crumb.label} className="flex items-center">
                      {!isLast ? (
                        <>
                          {crumb.href !== '#' ? (
                            <Link href={crumb.href} className="link-primary font-normal">
                              {crumb.label}
                            </Link>
                          ) : (
                            <span className="link-primary font-normal">{crumb.label}</span>
                          )}
                          <span className="mx-2 text-[#DADCE0]">/</span>
                        </>
                      ) : (
                        <span className="font-medium">{crumb.label}</span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>

            {/* Hero Content - Horizontal Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
              {/* Left side: Icon, Title, Badge, Description */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Brand Image - Square with rounded border */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
                    <SafeImage 
                      alt={`${brand.name} logo`} 
                      className="w-full h-full object-contain p-2" 
                      src={
                        brand.slug === 'taco-bell' 
                          ? IMAGES.brands.tacoBell 
                          : brand.slug === 'baskin-robbins'
                          ? IMAGES.brands.baskinRobbins
                          : IMAGES.brands.all
                      } 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Title with icon inline */}
                    <h1 className="text-[32px] sm:text-[40px] leading-[1.1] font-semibold text-[#1c1d20] mb-3">
                      {(() => {
                        const fullTitle = `${brand.name} in ${city.name}`
                        const titleParts = fullTitle.split(' ')
                        const lastWord = titleParts[titleParts.length - 1]
                        const restOfTitle = titleParts.slice(0, -1).join(' ')
                        
                        return (
                          <>
                            {restOfTitle && <span>{restOfTitle} </span>}
                            <span className="whitespace-nowrap inline-flex items-center">
                              {lastWord}
                              {brand.claimed && (
                                <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-5 h-5 inline-block align-middle ml-3" />
                              )}
                              {!brand.claimed && (
                                <SafeImage 
                                  alt="Warning" 
                                  src={IMAGES.warning_icon} 
                                  className="w-5 h-5 inline-block align-middle ml-3"
                                />
                              )}
                            </span>
                          </>
                        )
                      })()}
                    </h1>
                    {/* Badge without icon below title */}
                    <div className="mb-3">
                      {brand.claimed && (
                        <span className="inline-flex w-fit px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#EEE8F7] text-[#6F42C1]">
                          Brand-Verified Information
                        </span>
                      )}
                      {!brand.claimed && (
                        <span className="inline-flex w-fit px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#FFCD39]">
                          Publicly Sourced Information
                        </span>
                      )}
                    </div>
                    <p className="text-base text-[#1c1d20] leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>

              {/* Right side: Banner (only for unclaimed brands) */}
              {!brand.claimed && (
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
              )}
              {/* Empty space for verified brands to maintain 50/50 split */}
              {brand.claimed && (
                <div className="lg:w-[420px] xl:w-[480px] shrink-0"></div>
              )}
            </div>
          </div>
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          {/* Location cards grid */}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-10">
            {pageLocations.map((location: any) => (
              <li key={location.id}>
                <Link
                  href={`/business/${location.slug}`}
                  className="card-border-normal bg-white p-4 flex flex-col gap-3 h-full"
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
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination - Bottom Center (always visible; disabled when single page) */}
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
                        <span
                          key="ellipsis-mobile"
                          className="md:hidden flex items-center justify-center w-12 h-12 text-[#1c1d20]"
                        >
                          ...
                        </span>
                      )
                    }

                    // Desktop: show intermediate pages (up to 8), then ellipsis
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

                      pages.push(
                        <span
                          key="ellipsis-desktop"
                          className="hidden md:flex items-center justify-center w-12 h-12 text-[#1c1d20]"
                        >
                          ...
                        </span>
                      )
                    } else {
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

                    // Always show last page (if > 1)
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

export default function BrandCityPage({ params }: PageProps) {
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
      <BrandCityContent params={params} />
    </Suspense>
  )
}


