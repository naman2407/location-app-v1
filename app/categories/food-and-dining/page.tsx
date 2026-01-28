'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { BrandHeader } from '../../components/BrandHeader'
import { Footer } from '../../components/Footer'
import { VerifiedBusinessBanner } from '../../components/VerifiedBusinessBanner'
import { SafeImage } from '../../components/SafeImage'
import { IMAGES } from '../../constants/images'
import { allUSStates, allCanadianProvinces } from '../../constants/locations'
import { CategoryBanner } from '../../components/CategoryBanner'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { getCenterAlignmentClasses } from '../../utils/gridUtils'

type TabType = 'united-states' | 'canada'

function FoodAndDiningContent() {
  const [activeTab, setActiveTab] = useState<TabType>('united-states')

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} />

      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-[#FAFCFE]">
          <div className="container py-8 sm:py-12">
            <Breadcrumbs items={[{ label: 'Food & Dining', href: '#' }]} />

            {/* Hero Content - Horizontal Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
              {/* Left side: Icon, Title, Badge, Description */}
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
                      Food & Dining
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
          {/* Tabs */}
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

          {/* Title */}
          <h2 className="text-lg font-medium text-[#1c1d20] mb-6">
            {activeTab === 'united-states' ? 'United States' : 'Canada'}
          </h2>

          {/* States Grid */}
          {(() => {
            const states = activeTab === 'united-states' ? allUSStates : allCanadianProvinces
            // Sort states alphabetically
            const sortedStates = [...states].sort((a, b) => a.name.localeCompare(b.name))
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedStates.map((state, index) => {
                  // Only New York is clickable
                  const isClickable = state.slug === 'new-york'
                  const href = isClickable ? `/categories/food-and-dining/states/${state.slug}` : '#'
                  const CardWrapper = isClickable ? Link : 'div'
                  
                  const centerClasses = getCenterAlignmentClasses(index, sortedStates.length)

                  return (
                    <CardWrapper
                      key={state.slug}
                      href={href}
                      className={`card-border-normal bg-white p-6 flex items-center justify-center text-center min-h-[100px] ${
                        isClickable ? 'cursor-pointer hover:bg-[#f5f5f5] transition-colors' : 'cursor-default'
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

export default function FoodAndDiningPage() {
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
      <FoodAndDiningContent />
    </Suspense>
  )
}
