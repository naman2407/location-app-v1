import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

/**
 * Reusable breadcrumb component
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2">
        <li className="flex items-center">
          <Link href="/" className="link-primary flex items-center gap-1.5 font-normal">
            <SafeImage src={IMAGES.home} alt="" className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="mx-2 text-[#DADCE0]">/</span>
        </li>
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1
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
                <>
                  {crumb.href !== '#' ? (
                    <Link href={crumb.href} className="link-primary font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium">{crumb.label}</span>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

