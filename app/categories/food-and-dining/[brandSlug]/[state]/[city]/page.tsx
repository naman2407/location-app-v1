'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../../components/BrandHeader'
import { Footer } from '../../../../../components/Footer'
import { SafeImage } from '../../../../../components/SafeImage'
import { IMAGES } from '../../../../../constants/images'
import { ClaimedTooltip } from '../../../../../components/ClaimedTooltip'
import { getBrandBySlug, getStateBySlug, getCityBySlug, countBrandLocations } from '../../../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string; state: string; city: string }
}

export default function BrandCityPage({ params }: PageProps) {
  const router = useRouter()
  const brand = getBrandBySlug(params.brandSlug)
  const state = getStateBySlug(params.brandSlug, params.state)
  const city = getCityBySlug(params.brandSlug, params.state, params.city)

  if (!brand || !state || !city) {
    router.push('/search?q=' + encodeURIComponent(params.brandSlug))
    return null
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: brand.category, href: brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#' },
    { label: brand.name, href: `/categories/food-and-dining/${brand.slug}` },
    { label: state.name, href: `/categories/food-and-dining/${brand.slug}/${state.slug}` },
    { label: city.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Quickly find the nearest ${brand.name} locations in ${city.name}, check whether it's open, and get accurate information like hours, reviews, and FAQs. This verified, up-to-date information about ${brand.name} locations comes straight from the Yext Knowledge Graph.`
    : `Quickly find the nearest ${brand.name} locations in ${city.name}, check whether it's open, and get accurate information like hours, reviews, and FAQs.`

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader />

      <div className="pb-4 flex-1 flex flex-col">
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

        <div className="relative w-full bg-cover bg-center bg-[#f7f7f7]">
          <div className="container relative py-12 sm:py-[74px]">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-x-8 gap-y-4">
              <div className="max-w-[672px]">
                <h1 className="mb-4 flex flex-col text-[32px] leading-[1] font-bold text-[#1c1d20] sm:text-[48px] sm:leading-[1.33]">
                  <span className="flex items-center gap-2 flex-wrap">
                    {brand.name}
                    {brand.claimed ? (
                      <ClaimedTooltip tooltipText="This brand profile has been claimed by the business owner or an authorized representative.">
                        <SafeImage
                          alt="Claimed"
                          className="shrink-0 w-5 h-5 sm:w-6 sm:h-6"
                          src={IMAGES.claimed}
                        />
                      </ClaimedTooltip>
                    ) : (
                      <ClaimedTooltip tooltipText="This brand profile has not yet been claimed by the business owner or an authorized representative.">
                        <SafeImage
                          alt="Unclaimed"
                          className="shrink-0 w-5 h-5 sm:w-6 sm:h-6"
                          src={IMAGES.unclaimed}
                        />
                      </ClaimedTooltip>
                    )}
                  </span>
                  <span>in {city.name}</span>
                </h1>
                <p className="text-sm sm:text-base">{description}</p>
              </div>
              <div className="md:ml-auto h-40 w-40 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white">
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
            </div>

            {/* Unclaimed Brand Banner - Below title, description, and image */}
            {!brand.claimed && (
              <div className="mt-6">
                <div className="brand-unclaimed-banner">
                  <div className="px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 sm:gap-4">
                      <SafeImage alt="Yext logo" src={IMAGES.yext_logo} />
                        <div className="flex-1">
                          <p className="text-sm sm:text-base font-semibold text-white">
                            Turn Your Brand Visibility into a Differentiator™
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-white/90 leading-relaxed">
                            With <span className="font-bold">{countBrandLocations(brand)} locations</span>, managing your digital presence takes more than the basics. Yext helps brands stay accurate, visible, and in control everywhere customers search.
                          </p>
                          <p className="mt-2 text-xs sm:text-sm text-white/90">
                            See how other brands do this at scale →{' '}
                            <a
                              href="https://www.yext.com/customers"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                            >
                              Customer stories
                            </a>
                          </p>
                        </div>
                      </div>
                      <a
                        href="https://www.yext.com/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-unclaimed-cta inline-flex items-center justify-center rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 whitespace-nowrap shrink-0"
                      >
                        Get in touch
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container pt-8 pb-12 sm:pb-[100px]">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6">
            {city.locations.map((location) => {
              const [line1, ...restParts] = location.address.split(',')
              const line2 = restParts.join(',').trim()
              const query = new URLSearchParams({
                brand: brand.name,
                category: brand.category,
                location: `${city.name}, ${state.name}`,
              }).toString()

              return (
                <li key={location.id} className="h-full">
                  <Link
                    href={`/business/${location.slug}?${query}`}
                    className="group bg-white card-border-normal flex flex-col gap-3 sm:gap-4 h-full w-full min-w-0 p-3 sm:p-4 md:p-5 lg:p-6 relative rounded-[8px] transition-all duration-200"
                  >
                    <div className="flex flex-col gap-1.5 sm:gap-2 items-start leading-tight min-w-0 flex-1 text-black overflow-hidden">
                      <div className="flex items-center gap-1 flex-wrap">
                        <p className="font-semibold text-base sm:text-lg transition-colors duration-200 group-hover:text-[#5A58F2] line-clamp-2">
                          {location.name}
                        </p>
                      </div>
                      <div className="w-fit flex items-center gap-x-2 text-sm text-[#1c1d20]">
                        <span>{location.rating.toFixed(1)}</span>
                        <SafeImage alt="Stars" className="h-3 w-[64px]" src={IMAGES.stars} />
                        <span className="text-sm text-[#5b5d60]">({location.reviewCount} reviews)</span>
                      </div>
                      <div className="line-clamp-2 text-sm text-[#1c1d20]">
                        <div className="address-line">{line1?.trim()}</div>
                        {line2 && <div className="address-line">{line2}</div>}
                      </div>
                      {location.phone && <div className="text-sm text-[#5b5d60]">{location.phone}</div>}
                    </div>
                  </Link>
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
