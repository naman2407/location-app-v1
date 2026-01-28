'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BrandHeader } from '../../../../components/BrandHeader'
import { Footer } from '../../../../components/Footer'
import { VerifiedBusinessBanner } from '../../../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../../../components/SafeImage'
import { IMAGES } from '../../../../constants/images'
import { tacoBellData, baskinRobbinsData } from '../../../../constants/brandData'
import { CategoryBanner } from '../../../../components/CategoryBanner'
import { Breadcrumbs } from '../../../../components/Breadcrumbs'
import { additionalNYCities } from '../../../../constants/locations'
import { getCenterAlignmentClasses } from '../../../../utils/gridUtils'

interface PageProps {
  params: { state: string }
}

export default function CategoryStateCitiesPage({ params }: PageProps) {
  const router = useRouter()
  
  // Get state name from slug
  const stateNameMap: Record<string, string> = {
    'new-york': 'New York',
  }
  
  const stateName = stateNameMap[params.state] || params.state.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  if (params.state !== 'new-york') {
    router.push('/categories/food-and-dining')
    return null
  }

  // Aggregate cities from all Food & Dining brands for New York
  const allCities = new Map<string, { name: string; slug: string }>()
  
  // Add cities from Taco Bell
  const tacoBellNYState = tacoBellData.states.find(s => s.slug === 'new-york')
  if (tacoBellNYState) {
    tacoBellNYState.cities.forEach(city => {
      if (!allCities.has(city.slug)) {
        allCities.set(city.slug, { name: city.name, slug: city.slug })
      }
    })
  }
  
  // Add cities from Baskin-Robbins
  const baskinNYState = baskinRobbinsData.states.find(s => s.slug === 'new-york')
  if (baskinNYState) {
    baskinNYState.cities.forEach(city => {
      if (!allCities.has(city.slug)) {
        allCities.set(city.slug, { name: city.name, slug: city.slug })
      }
    })
  }
  
  additionalNYCities.forEach(city => {
    if (!allCities.has(city.slug)) {
      allCities.set(city.slug, city)
    }
  })
  
  const sortedCities = Array.from(allCities.values()).sort((a, b) => a.name.localeCompare(b.name))
  
  // Only Albany and NYC are clickable
  const clickableCitySlugs = ['albany', 'new-york']

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-[#FAFCFE]">
          <div className="container py-8 sm:py-12">
            <Breadcrumbs items={[
              { label: 'Food & Dining', href: '/categories/food-and-dining' },
              { label: stateName, href: `/categories/food-and-dining/states/${params.state}` },
            ]} />

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
                      Food & Dining in {stateName}
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
          {/* Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedCities.map((city, index) => {
              const isClickable = clickableCitySlugs.includes(city.slug)
              const href = isClickable ? `/categories/food-and-dining/states/${params.state}/${city.slug}` : '#'
              const CardWrapper = isClickable ? Link : 'div'
              
              const centerClasses = getCenterAlignmentClasses(index, sortedCities.length)

              return (
                <CardWrapper
                  key={city.slug}
                  href={href}
                  className={`card-border-normal bg-white p-6 flex items-center justify-center text-center min-h-[100px] ${
                    isClickable ? 'cursor-pointer hover:bg-[#f5f5f5] transition-colors' : 'cursor-default'
                  }${centerClasses}`}
                >
                  <span className="text-[#1c1d20] font-medium">{city.name}</span>
                </CardWrapper>
              )
            })}
          </div>
        </div>
      </div>

      <VerifiedBusinessBanner />
      <Footer />
    </div>
  )
}

