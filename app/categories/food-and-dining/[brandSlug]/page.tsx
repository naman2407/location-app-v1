'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../components/BrandHeader'
import { Footer } from '../../../components/Footer'
import { SafeImage } from '../../../components/SafeImage'
import { IMAGES } from '../../../constants/images'
import { ClaimedTooltip } from '../../../components/ClaimedTooltip'
import { getBrandBySlug, countBrandLocations } from '../../../constants/brandData'

interface PageProps {
  params: { brandSlug: string }
}

export default function BrandTopLevelPage({ params }: PageProps) {
  const router = useRouter()
  const brand = getBrandBySlug(params.brandSlug)

  if (!brand) {
    router.push('/search?q=' + encodeURIComponent(params.brandSlug))
    return null
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: brand.category, href: brand.category === 'Food & Dining' ? '/categories/food-and-dining' : '#' },
    { label: brand.name, href: '#' },
  ]

  const description = brand.claimed
    ? `Quickly find the nearest ${brand.name} locations, check whether it's open, and get accurate information like hours, reviews, and FAQs. This verified, up-to-date information about ${brand.name} locations comes straight from the Yext Knowledge Graph.`
    : `Quickly find the nearest ${brand.name} locations, check whether it's open, and get accurate information like hours, reviews, and FAQs.`

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
          <ul className="block columns-1 sm:columns-2 lg:columns-4">
            {brand.states.map((state) => {
              const isClickable = state.slug === 'new-york'
              return (
                <li key={state.slug} className="mb-6">
                  {isClickable ? (
                    <Link href={`/categories/food-and-dining/${brand.slug}/${state.slug}`} className="link-primary">
                      {state.name}
                    </Link>
                  ) : (
                    <span className="text-[#5A58F2] font-medium cursor-default pointer-events-none">{state.name}</span>
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
