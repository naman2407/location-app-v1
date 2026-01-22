'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { CategoryCard } from './CategoryCard'
import { Link } from './Link'
import { categories } from '../constants/data'

export function CategoriesSection() {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [viewport, setViewport] = useState<'mobile' | 'lg' | 'xl'>('mobile')

  useEffect(() => {
    const compute = () => {
      if (window.innerWidth >= 1280) return setViewport('xl')
      if (window.innerWidth >= 1024) return setViewport('lg')
      return setViewport('mobile')
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const visibleCount = useMemo(() => {
    if (viewport === 'xl') return 10 // 5 per row, 2 rows
    if (viewport === 'lg') return 6 // 3 per row, 2 rows
    return 6 // mobile/tablet: 2 per row, 3 rows
  }, [viewport])

  const visibleCategories = categories.slice(0, visibleCount)
  const remainingCategories = categories.slice(visibleCount)

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-[32px] items-center justify-center relative w-full">
      <p className="font-semibold text-center relative shrink-0 text-2xl sm:text-3xl md:text-[32px] text-black">
        Categories
      </p>
      <div className="flex flex-col relative px-4 sm:px-0 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-[20px] justify-items-center">
          {visibleCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>

        {remainingCategories.length > 0 && (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-[20px] justify-items-center transition-all duration-500 ease-in-out categories-expandable ${
                showAllCategories ? 'categories-expanded' : 'categories-collapsed'
              }`}
            >
              {remainingCategories.map((category, index) => (
                <CategoryCard key={`more-${index}`} category={category} />
              ))}
            </div>

            <Link
              href="#"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="font-normal h-[30px] leading-[1.5] relative shrink-0 text-base text-center tracking-[-0.38px] w-full mt-4 sm:mt-6"
            >
              {showAllCategories ? 'Show Less' : 'Show More'}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

