'use client'

import { Suspense, useMemo, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SafeImage } from '../components/SafeImage'
import { IMAGES } from '../constants/images'
import { Footer } from '../components/Footer'
import { BrandHeader } from '../components/BrandHeader'
import Link from 'next/link'
import { brands, locations, filterBrands, filterLocations } from '../constants/searchData'
import { getBrandPageUrl, getBusinessPageUrl } from '../constants/brandNavigation'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchTerm = searchParams?.get('q') || ''
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

  // Filter brands and locations based on search term
  const allResults = useMemo(() => {
    if (!searchTerm.trim()) return { brands: [], locations: [] }
    
    const filteredBrands = filterBrands(searchTerm)
    const filteredLocations = filterLocations(searchTerm)
    
    return { brands: filteredBrands, locations: filteredLocations }
  }, [searchTerm])

  // Filter results by tab (claimed/unclaimed)
  const filteredResults = useMemo(() => {
    const { brands: allBrands, locations: allLocations } = allResults
    
    if (activeTab === 'claimed') {
      return {
        brands: allBrands.filter(b => b.claimed === true),
        locations: allLocations.filter(loc => {
          const brand = brands.find(b => b.name === loc.brandName)
          return brand?.claimed === true
        }),
      }
    } else {
      return {
        brands: allBrands.filter(b => b.claimed === false),
        locations: allLocations.filter(loc => {
          const brand = brands.find(b => b.name === loc.brandName)
          return brand?.claimed === false
        }),
      }
    }
  }, [allResults, activeTab])

  // Restore scroll position after tab change
  useEffect(() => {
    if (scrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current)
        scrollPositionRef.current = 0
      })
    }
  }, [activeTab])

  const activeTabDescription = tabs.find((tab) => tab.id === activeTab)?.description ?? ''
  const heroDescription = 'Browse brands and locations with business information from brand-verified profiles and publicly sourced data across the web.'
  
  // Check if search term contains "hardware" (case-insensitive)
  const isHardwareSearch = searchTerm.toLowerCase().includes('hardware')

  // If not a hardware search, show simple empty results page
  if (!isHardwareSearch) {
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

  // Full results page for hardware searches
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
                <span>Search Results</span>
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
                    Search Results For {searchTerm ? `"${searchTerm}"` : ''}
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
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    scrollPositionRef.current = window.scrollY
                    const nextStatus = tab.id === 'claimed' ? 'claimed' : 'unclaimed'
                    const params = new URLSearchParams()
                    params.set('q', searchTerm)
                    params.set('status', nextStatus)
                    router.push(`/search?${params.toString()}`)
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

          {/* Results Section */}
          <div className="mt-8">
            {/* Brand-Verified Tab: Show no results */}
            {activeTab === 'claimed' && (
              <div className="flex flex-col items-center justify-center py-12">
                <SafeImage alt="No results" className="mb-7" src={IMAGES.noResult} />
                <h2 className="text-lg font-semibold text-center mb-2">
                  No results found for "{searchTerm}"
                </h2>
                <p className="text-sm font-normal text-[#5C5D60] text-center mb-[28px]">
                  Try adjusting your search, or contact our team for help adding or updating a business listing.
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
            )}

            {/* Publicly Sourced Tab: Show hardware stores as links */}
            {activeTab === 'unclaimed' && (
              <div className="pt-8 pb-12 sm:pb-[100px]">
                <ul className="block columns-1 sm:columns-2 lg:columns-4">
                  {filteredResults.brands.map((brand) => {
                    const brandUrl = getBrandPageUrl(brand.name)
                    return (
                      <li key={brand.id} className="mb-6">
                        {brandUrl ? (
                          <Link href={brandUrl} className="link-primary">
                            {brand.name}
                          </Link>
                        ) : (
                          <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">{brand.name}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
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
