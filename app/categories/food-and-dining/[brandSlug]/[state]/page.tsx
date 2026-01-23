'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../components/BrandHeader'
import { Footer } from '../../../../components/Footer'
import { SafeImage } from '../../../../components/SafeImage'
import { IMAGES } from '../../../../constants/images'
import { getBrandBySlug, getStateBySlug, countBrandLocations, countCityLocations } from '../../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string; state: string }
}

export default function BrandStatePage({ params }: PageProps) {
  const router = useRouter()
  const brand = getBrandBySlug(params.brandSlug)
  const state = getStateBySlug(params.brandSlug, params.state)

  if (!brand || !state) {
    router.push('/search?q=' + encodeURIComponent(params.brandSlug))
    return null
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: brand.category, href: brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#' },
    { label: brand.name, href: `/categories/food-and-dining/${brand.slug}` },
    { label: state.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Official, brand-verified information for ${brand.name} locations in ${state.name}, including hours, FAQs, and customer feedback, sourced from the Yext Knowledge Graph.`
    : `General business location information for ${brand.name} in ${state.name}.`

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader />

      <div className="pb-4 flex-1 flex flex-col">
        <div className="relative w-full bg-white">
          <nav className="my-4 container" aria-label="Breadcrumb">
            <ol className="flex flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label}>
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <Link href={crumb.href} className="link-primary">
                        <span>{crumb.label}</span>
                      </Link>
                      <span className="mx-2 text-[#767676]">/</span>
                    </>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="container relative py-8 sm:py-12">
            {/* Badge - Mobile: above image, Desktop: in content area */}
            <div className="mb-4 sm:mb-0 sm:hidden">
              {brand.claimed && (
                <span className="inline-flex w-fit items-center gap-2 px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#EEE8F7] text-[#6F42C1] shrink-0">
                  <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-4 h-4 shrink-0" />
                  Brand-Verified Information
                </span>
              )}
              {!brand.claimed && (
                <span className="inline-flex w-fit items-center gap-2 px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#FFCD39] shrink-0">
                  <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-4 h-4 shrink-0" />
                  Publicly Sourced Information
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Brand Image - Square with rounded border */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-lg border border-[#e0e0e0] flex items-center justify-center shrink-0 overflow-hidden bg-white">
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
                {/* Badge - Desktop only */}
                <div className="hidden sm:block mb-2">
                  {brand.claimed && (
                    <span className="inline-flex w-fit items-center gap-2 px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#EEE8F7] text-[#6F42C1] shrink-0">
                      <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-4 h-4 shrink-0" />
                      Brand-Verified Information
                    </span>
                  )}
                  {!brand.claimed && (
                    <span className="inline-flex w-fit items-center gap-2 px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#FFCD39] shrink-0">
                      <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-4 h-4 shrink-0" />
                      Publicly Sourced Information
                    </span>
                  )}
                </div>
                <h1 className="mb-2 ext-[32px] leading-[1] font-bold text-[#1c1d20] sm:text-[48px] sm:leading-[1.33]">
                  <span className="flex items-center gap-2 flex-wrap">
                    {brand.name} in {state.name}
                  </span>
                </h1>
                <p className="text-sm sm:text-base">{description}</p>
              </div>
            </div>

            {/* Unclaimed Brand Banner - Below title, description, and image */}
            {!brand.claimed && (
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
                      <p className="text-base text-gray-700">
                            Brands that manage certified business facts through Yext see up to <span className="font-semibold">30% more traffic</span> compared to pages without brand-verified information.
                          </p>
                          <p className="text-sm text-[#5b5d60] italic mt-2">See how other brands do this at scale → <a href="https://www.yext.com/customers" target="_blank" rel="noopener noreferrer" className="link-primary">Customer stories</a></p>
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
            )}
          </div>
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          <p className="text-base mb-6">
            Explore verified locations by city:
          </p>
          <ul className="block columns-1 sm:columns-2 lg:columns-4">
            {state.cities.map((city) => {
              const isClickable = city.slug === 'new-york' && state.slug === 'new-york'
              // Always use actual count for Taco Bell and Baskin-Robbins
              // For other brands, use actual count if available, otherwise generate random
              let locationCount = countCityLocations(city)
              
              // Generate random number for non-clickable cities if count is 0
              // This ensures Taco Bell and Baskin-Robbins always show actual counts
              if (!isClickable && locationCount === 0) {
                // Use city name as seed for consistent random number per city
                let hash = 0
                for (let i = 0; i < city.name.length; i++) {
                  hash = ((hash << 5) - hash) + city.name.charCodeAt(i)
                  hash = hash & hash // Convert to 32bit integer
                }
                // Generate number between 1 and 100
                locationCount = Math.abs(hash % 99) + 1
              }
              
              // Multiply by 1000 to show in thousands for Taco Bell and Baskin-Robbins only
              if (brand.slug === 'taco-bell' || brand.slug === 'baskin-robbins') {
                locationCount = locationCount * 1000
              }
              
              return (
                <li key={city.slug} className="mb-6">
                  {isClickable ? (
                    <Link href={`/categories/food-and-dining/${brand.slug}/${state.slug}/${city.slug}`} className="link-primary">
                      {city.name}
                    </Link>
                  ) : (
                    <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">
                      {city.name}
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
