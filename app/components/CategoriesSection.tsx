'use client'

import { useEffect, useMemo, useState } from 'react'
import { CategoryCard } from './CategoryCard'
import { Link } from './Link'
import { categories } from '../constants/data'

const getCategoryLabel = (category: { name: string; name2?: string }) =>
  category.name2 ? `${category.name} ${category.name2}` : category.name

const getCategoryHref = (categoryName: string) =>
  categoryName === 'Food & Dining' ? '/categories/food-and-dining' : undefined

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
    if (viewport === 'xl' || viewport === 'lg') return 10 // 5 per row, 2 rows on lg+
    return 6 // mobile/tablet: 1 per row on mobile, 3 per row on tablet
  }, [viewport])

  const visibleCategories = categories.slice(0, visibleCount)
  const remainingCategories = categories.slice(visibleCount)

  return (
    <div className="bg-white flex flex-col gap-6 sm:gap-8 md:gap-[32px] items-center justify-center relative w-full">
      <p className="text-2xl sm:text-3xl font-medium text-[#1c1d20]">
        Categories
      </p>
      <div className="flex flex-col relative w-full max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-[20px] justify-items-center">
          {visibleCategories.map((category) => {
            const categoryName = getCategoryLabel(category)
            const href = getCategoryHref(categoryName)
            return <CategoryCard key={categoryName} category={category} href={href} />
          })}
        </div>

        {remainingCategories.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-[20px] justify-items-center transition-all duration-500 ease-in-out categories-expandable mt-4 sm:mt-5 md:mt-[20px] ${
                showAllCategories ? 'categories-expanded' : 'categories-collapsed'
              }`}
            >
              {remainingCategories.map((category) => {
                const categoryName = getCategoryLabel(category)
                const href = getCategoryHref(categoryName)
                return <CategoryCard key={`more-${categoryName}`} category={category} href={href} />
              })}
            </div>

            <Link
              href="#"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="no-focus-ring font-medium h-[30px] leading-[1.5] relative shrink-0 text-base text-center tracking-[-0.38px] w-full mt-4 sm:mt-6"
            >
              {showAllCategories ? 'Show Less' : 'Show More'}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
