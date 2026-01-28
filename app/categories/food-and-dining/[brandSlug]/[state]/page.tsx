'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../components/BrandHeader'
import { Footer } from '../../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../../components/SafeImage'
import { IMAGES } from '../../../../constants/images'
import { getBrandBySlug, getStateBySlug } from '../../../../constants/brandData'

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

  // For Taco Bell and Baskin-Robbins, show "All Brands" instead of category
  const isSpecialBrand = params.brandSlug === 'taco-bell' || params.brandSlug === 'baskin-robbins'
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { 
      label: isSpecialBrand ? 'All Brands' : brand.category, 
      href: isSpecialBrand ? '/brands' : (brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#') 
    },
    { label: brand.name, href: `/categories/food-and-dining/${brand.slug}` },
    { label: state.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Official, brand-verified information for ${brand.name} locations in ${state.name}, including hours, FAQs, and customer feedback, sourced from the TX3Y Knowledge Graph.`
    : `General business location information for ${brand.name} in ${state.name}.`

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader dynamicTitle={state.name} />

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

          {/* Cities Grid */}
          {(() => {
            // Sort cities alphabetically
            const sortedCities = [...state.cities].sort((a, b) => a.name.localeCompare(b.name))
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedCities.map((city, index) => {
                  const href = `/categories/food-and-dining/${brand.slug}/${state.slug}/${city.slug}`
                  
                  // Center align logic for last row
                  const isLastCard = index === sortedCities.length - 1
                  const lgRemainder = sortedCities.length % 5
                  const mdRemainder = sortedCities.length % 4
                  
                  let centerClasses = ''
                  if (isLastCard) {
                    // For lg (5 columns): center if only 1 card in last row
                    if (lgRemainder === 1) {
                      centerClasses += ' lg:col-start-3'
                    }
                    // For md (4 columns): center if only 1 card in last row
                    if (mdRemainder === 1) {
                      centerClasses += ' md:col-start-2'
                    }
                  }

                  return (
                    <Link
                      key={city.slug}
                      href={href}
                      className={`card-border-normal bg-white p-6 flex items-center justify-center text-center min-h-[100px] cursor-pointer hover:bg-[#f5f5f5] transition-colors${centerClasses}`}
                    >
                      <span className="text-[#1c1d20] font-medium">{city.name}</span>
                    </Link>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>

      <VerifiedBusinessBanner />
      <Footer />
    </div>
  )
}
