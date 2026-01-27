'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../components/BrandHeader'
import { Footer } from '../../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../../components/SafeImage'
import { IMAGES } from '../../../../constants/images'
import { PageSizeDropdown } from '../../../../components/PageSizeDropdown'
import { CityDropdown } from '../../../../components/CityDropdown'
import { RelatedBusinessDropdown } from '../../../../components/RelatedBusinessDropdown'
import { getBrandBySlug, getStateBySlug, type BrandLocation } from '../../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string; state: string }
}

const DEFAULT_PAGE_SIZE = 21
const PAGE_SIZE_OPTIONS = [10, 20, 21, 42]

export default function BrandStatePage({ params }: PageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const brand = getBrandBySlug(params.brandSlug)
  const state = getStateBySlug(params.brandSlug, params.state)

  const pageParam = Number(searchParams?.get('page') || '1')
  const pageSizeParam = Number(searchParams?.get('pageSize') || DEFAULT_PAGE_SIZE)
  // Only use filters from URL if they exist (coming from breadcrumb), otherwise default to 'all'
  const cityFilter = searchParams?.has('city') ? (searchParams.get('city') || 'all') : 'all'
  const relatedBusinessFilter = searchParams?.has('relatedBusiness') ? (searchParams.get('relatedBusiness') || 'all') : 'all'
  
  const [pageSize, setPageSize] = useState(pageSizeParam)
  const [selectedCity, setSelectedCity] = useState(cityFilter)
  const [selectedRelatedBusiness, setSelectedRelatedBusiness] = useState(relatedBusinessFilter)

  // Responsive page size based on screen width
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth
      let newSize = 21 // desktop default (3x7 = 21)
      
      if (width < 768) {
        // mobile (1 column)
        newSize = 10
      } else if (width < 1024) {
        // tablet (2 columns)
        newSize = 20
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

  if (!brand || !state) {
    router.push('/search?q=' + encodeURIComponent(params.brandSlug))
    return null
  }

  // Get all locations from all cities
  const allLocations = useMemo(() => {
    const locations: BrandLocation[] = []
    state.cities.forEach(city => {
      city.locations.forEach(location => {
        locations.push({
          ...location,
          cityName: city.name,
          citySlug: city.slug
        } as BrandLocation & { cityName: string; citySlug: string })
      })
    })
    return locations
  }, [state.cities])

  // Get locations from related businesses if filter is active
  const relatedBusinessLocations = useMemo(() => {
    if (!brand.relatedBusinesses || selectedRelatedBusiness === 'all') {
      return []
    }
    
    // Special case: "Taco Bell" related business shows regular Taco Bell locations
    if (selectedRelatedBusiness === 'taco-bell') {
      return allLocations
    }
    
    const selectedRB = brand.relatedBusinesses.find(rb => rb.slug === selectedRelatedBusiness)
    return selectedRB ? selectedRB.locations : []
  }, [brand.relatedBusinesses, selectedRelatedBusiness, allLocations])

  // Filter locations by selected city and related business
  const filteredLocations = useMemo(() => {
    // If related business is selected, show only those locations
    if (selectedRelatedBusiness !== 'all' && relatedBusinessLocations.length > 0) {
      // Filter by city if city filter is also active
      if (selectedCity !== 'all') {
        return relatedBusinessLocations.filter(loc => (loc as any).citySlug === selectedCity)
      }
      return relatedBusinessLocations
    }
    
    // Otherwise, filter regular locations by city
    if (selectedCity === 'all') {
      return allLocations
    }
    return allLocations.filter(loc => (loc as any).citySlug === selectedCity)
  }, [allLocations, selectedCity, selectedRelatedBusiness, relatedBusinessLocations])

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / pageSize))
  const currentPage = Number.isFinite(pageParam) ? Math.min(Math.max(pageParam, 1), totalPages) : 1
  const startIndex = (currentPage - 1) * pageSize
  const pageLocations = filteredLocations.slice(startIndex, startIndex + pageSize)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: brand.category, href: brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#' },
    { label: brand.name, href: `/categories/food-and-dining/${brand.slug}` },
    { label: state.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Official, brand-verified information for ${brand.name} locations in ${state.name}, including hours, FAQs, and customer feedback, sourced from the TX3Y Knowledge Graph.`
    : `General business location information for ${brand.name} in ${state.name}.`

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('pageSize', newSize.toString())
    if (selectedCity !== 'all') {
      params.set('city', selectedCity)
    }
    if (selectedRelatedBusiness !== 'all') {
      params.set('relatedBusiness', selectedRelatedBusiness)
    }
    router.push(`/categories/food-and-dining/${brand.slug}/${state.slug}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', pageSize.toString())
    }
    if (selectedCity !== 'all') {
      params.set('city', selectedCity)
    }
    if (selectedRelatedBusiness !== 'all') {
      params.set('relatedBusiness', selectedRelatedBusiness)
    }
    router.push(`/categories/food-and-dining/${brand.slug}/${state.slug}?${params.toString()}`)
  }

  const handleCityChange = (citySlug: string) => {
    setSelectedCity(citySlug)
    const params = new URLSearchParams()
    params.set('page', '1')
    if (citySlug !== 'all') {
      params.set('city', citySlug)
    }
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', pageSize.toString())
    }
    if (selectedRelatedBusiness !== 'all') {
      params.set('relatedBusiness', selectedRelatedBusiness)
    }
    router.push(`/categories/food-and-dining/${brand.slug}/${state.slug}?${params.toString()}`)
  }

  const handleRelatedBusinessChange = (relatedBusinessSlug: string) => {
    setSelectedRelatedBusiness(relatedBusinessSlug)
    const params = new URLSearchParams()
    params.set('page', '1')
    if (selectedCity !== 'all') {
      params.set('city', selectedCity)
    }
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', pageSize.toString())
    }
    if (relatedBusinessSlug !== 'all') {
      params.set('relatedBusiness', relatedBusinessSlug)
    }
    router.push(`/categories/food-and-dining/${brand.slug}/${state.slug}?${params.toString()}`)
  }

  // Get filtered related businesses for bottom section (show one location from each related business, filtered by city)
  const filteredRelatedBusinesses = useMemo(() => {
    if (!brand.relatedBusinesses || brand.relatedBusinesses.length === 0) {
      return []
    }
    
    // Show one location from each related business (so users see different business names)
    // Filter by city if city filter is active
    const locations: BrandLocation[] = []
    brand.relatedBusinesses.forEach(rb => {
      // Filter locations by city if city filter is active
      let availableLocations = rb.locations
      if (selectedCity !== 'all') {
        availableLocations = rb.locations.filter(loc => (loc as any).citySlug === selectedCity)
      }
      
      if (availableLocations.length > 0) {
        // Pick the first location from each business to show different names
        locations.push(availableLocations[0])
      }
    })
    return locations.slice(0, 3) // Show max 3
  }, [brand.relatedBusinesses, selectedCity])

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader />

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
                {breadcrumbs.slice(1).map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center">
                    {index < breadcrumbs.length - 2 ? (
                      <>
                        <Link href={crumb.href} className="link-primary font-normal">
                          {crumb.label}
                        </Link>
                        <span className="mx-2 text-[#DADCE0]">/</span>
                      </>
                    ) : (
                      <span className="font-medium">{crumb.label}</span>
                    )}
                  </li>
                ))}
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
                        const fullTitle = `${brand.name} in ${state.name}`
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
          {/* Filter and Show controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Filter section - Left side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Filter icon and text (no background) */}
              <div className="flex items-center gap-2">
                <SafeImage src={IMAGES.filter} alt="" className="w-4 h-4 shrink-0 opacity-60" />
                <span className="text-sm text-[#767676] whitespace-nowrap">Filter</span>
              </div>
              
              {/* By City dropdown */}
              <CityDropdown
                value={selectedCity}
                options={[
                  { slug: 'all', name: 'All Cities' },
                  ...state.cities.map(city => ({ slug: city.slug, name: city.name }))
                ]}
                onChange={handleCityChange}
              />

              {/* Related Businesses dropdown - only show if brand has related businesses */}
              {brand.relatedBusinesses && brand.relatedBusinesses.length > 0 && (
                <RelatedBusinessDropdown
                  value={selectedRelatedBusiness}
                  options={[
                    { slug: 'all', name: 'All Related Businesses' },
                    ...brand.relatedBusinesses.map(rb => ({ slug: rb.slug, name: rb.name }))
                  ]}
                  onChange={handleRelatedBusinessChange}
                />
              )}
            </div>

            {/* Show section - Right side on desktop, left on mobile */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="text-sm text-[#767676]">Show</span>
              <PageSizeDropdown
                value={pageSize}
                options={PAGE_SIZE_OPTIONS}
                onChange={handlePageSizeChange}
              />
            </div>
          </div>

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

          {/* Pagination */}
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
                  
                  // Ellipsis on mobile
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
                    
                    if (totalPages > 9) {
                      pages.push(
                        <span key="ellipsis-desktop" className="hidden md:flex items-center justify-center w-12 h-12 text-[#1c1d20]">
                          ...
                        </span>
                      )
                    }
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
                  
                  // Last page
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
              >
                <SafeImage 
                  src={IMAGES.chevron} 
                  alt="Next" 
                  className={`w-4 h-4 ${currentPage === totalPages ? 'opacity-30' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Related Businesses Section - Only show when no related business filter is active */}
          {brand.relatedBusinesses && brand.relatedBusinesses.length > 0 && filteredRelatedBusinesses.length > 0 && selectedRelatedBusiness === 'all' && (
            <>
              <hr className="mt-8 lg:mt-10 mb-6 border-[#e0e0e0]" />
              <h2 className="text-lg font-medium text-[#1c1d20] mb-6">Related Businesses</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRelatedBusinesses.map((location: BrandLocation) => (
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
            </>
          )}
        </div>
      </div>

      <VerifiedBusinessBanner />
      <Footer />
    </div>
  )
}
