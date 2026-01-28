'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../components/BrandHeader'
import { Footer } from '../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../components/SafeImage'
import { IMAGES } from '../../../constants/images'
import { getBrandBySlug } from '../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string }
}

type TabType = 'united-states' | 'canada'

export default function BrandTopLevelPage({ params }: PageProps) {
  const router = useRouter()
  const brand = getBrandBySlug(params.brandSlug)
  const [activeTab, setActiveTab] = useState<TabType>('united-states')

  if (!brand) {
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
    { label: brand.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Official, brand-verified information for ${brand.name} locations, including hours, FAQs, and customer feedback, sourced from the TX3Y Knowledge Graph.`
    : `General business location information for ${brand.name}.`

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-[#FAFCFE]">
          <div className="container py-8 sm:py-12">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-x-2">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <li key={crumb.label} className="flex items-center">
                      {!isLast ? (
                        <>
                          {crumb.href !== '#' ? (
                            <Link href={crumb.href} className={`link-primary font-normal ${index === 0 ? 'flex items-center gap-1.5' : ''}`}>
                              {index === 0 && <SafeImage src={IMAGES.home} alt="" className="w-4 h-4" />}
                              <span>{crumb.label}</span>
                            </Link>
                          ) : (
                            <span className={`link-primary font-normal ${index === 0 ? 'flex items-center gap-1.5' : ''}`}>
                              {index === 0 && <SafeImage src={IMAGES.home} alt="" className="w-4 h-4" />}
                              <span>{crumb.label}</span>
                            </span>
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
                        const nameParts = brand.name.split(' ')
                        const lastWord = nameParts[nameParts.length - 1]
                        const restOfName = nameParts.slice(0, -1).join(' ')
                        
                        return (
                          <>
                            {restOfName && <span>{restOfName} </span>}
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

              {/* Right side: Banner (only for publicly sourced brands) */}
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
          {/* Tabs - only show if canadianProvinces exist */}
          {brand.canadianProvinces && brand.canadianProvinces.length > 0 && (
            <div className="flex justify-start md:justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab('united-states')}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors ${
                  activeTab === 'united-states'
                    ? 'bg-[#1c1d20] text-white'
                    : 'bg-white text-[#1c1d20] border border-[#e0e0e0] hover:border-[#1c1d20]'
                }`}
              >
                United States
              </button>
              <button
                onClick={() => setActiveTab('canada')}
                className={`px-6 py-2.5 rounded-full font-medium transition-colors ${
                  activeTab === 'canada'
                    ? 'bg-[#1c1d20] text-white'
                    : 'bg-white text-[#1c1d20] border border-[#e0e0e0] hover:border-[#1c1d20]'
                }`}
              >
                Canada
              </button>
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg font-medium text-[#1c1d20] mb-6">
            {activeTab === 'united-states' ? 'United States' : 'Canada'}
          </h2>

          {/* States Grid */}
          {(() => {
            const states = activeTab === 'united-states' ? brand.states : (brand.canadianProvinces || [])
            // Sort states alphabetically
            const sortedStates = [...states].sort((a, b) => a.name.localeCompare(b.name))
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedStates.map((state, index) => {
                  const isClickable = activeTab === 'united-states' && state.slug === 'new-york'
                  const href = isClickable ? `/categories/food-and-dining/${brand.slug}/${state.slug}` : '#'
                  const CardWrapper = isClickable ? Link : 'div'
                  
                  // Center align logic for last row
                  const isLastCard = index === sortedStates.length - 1
                  const lgRemainder = sortedStates.length % 5
                  const mdRemainder = sortedStates.length % 4
                  
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
                    <CardWrapper
                      key={state.slug}
                      href={href}
                      className={`card-border-normal bg-white p-6 flex items-center justify-center text-center min-h-[100px] ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      }${centerClasses}`}
                    >
                      <span className="text-[#1c1d20] font-medium">{state.name}</span>
                    </CardWrapper>
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
