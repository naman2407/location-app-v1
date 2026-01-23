'use client'

import Link from 'next/link'
import { CategoryIcon } from './CategoryIcon'

interface CategoryCardProps {
  category: {
    name: string
    name2?: string
    icon: string
  }
  href?: string
}

export function CategoryCard({ category, href }: CategoryCardProps) {
  const content = (
    <>
      <div className="relative shrink-0 w-[32px] h-[32px] category-icon-wrapper text-black group-hover:text-[#5A58F2] transition-colors duration-200">
        <CategoryIcon
          src={category.icon}
          alt={category.name}
          className="block max-w-none w-full h-full"
        />
      </div>
      <div className="font-normal leading-[24px] min-w-full relative shrink-0 text-lg text-black text-center transition-colors duration-200 group-hover:text-[#5A58F2]">
        {category.name2 ? (
          <>
            <p className="mb-0">{category.name}</p>
            <p>{category.name2}</p>
          </>
        ) : (
          <p>{category.name}</p>
        )}
      </div>
    </>
  )

  const cardClasses = "card-border-normal flex flex-col gap-[12px] items-center justify-center overflow-hidden p-4 sm:p-6 md:p-[40px] relative rounded-[8px] h-[172px] transition-all duration-200 group cursor-pointer min-w-0 w-full"

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  )
}
