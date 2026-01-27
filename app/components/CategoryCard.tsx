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
      <div className="relative shrink-0 w-[32px] h-[32px] category-icon-wrapper text-black">
        <CategoryIcon
          src={category.icon}
          alt={category.name}
          className="block max-w-none w-full h-full"
        />
      </div>
      <div className="font-normal leading-[24px] min-w-full relative shrink-0 text-lg text-black text-center">
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

  const cardClasses = "card-border-normal flex flex-col gap-[12px] items-center justify-center overflow-hidden p-4 sm:p-6 md:p-[40px] relative h-[172px] transition-[border,background-color] duration-200 group cursor-pointer min-w-0 w-full"

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
