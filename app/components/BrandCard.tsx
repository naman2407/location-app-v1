import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

interface BrandCardProps {
  brand: {
    name: string
    locations: string
    category: string
    rating: number
    logo: string
    claimed?: boolean
  }
  href?: string
  showClaimedBadge?: boolean
}

export function BrandCard({ brand, href, showClaimedBadge = false }: BrandCardProps) {
  // Extract number from locations string (e.g., "13,445 locations" -> "13,445")
  const locationCount = brand.locations.split(' ')[0]
  
  const cardContent = (
    <div className="bg-white card-border-normal flex flex-col h-full w-full min-w-0 relative rounded-xl overflow-hidden transition-all duration-200 group cursor-pointer">
      {/* White upper section */}
      <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 min-w-0 flex-1">
        {/* Logo - Square with rounded corners */}
        <div className="relative shrink-0 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-lg overflow-hidden bg-white border border-[#e0e0e0] flex items-center justify-center">
          <SafeImage alt={brand.name} className="block max-w-none w-full h-full object-contain p-2" src={brand.logo} />
        </div>
        
        {/* Business info */}
        <div className="flex flex-col gap-1.5 sm:gap-2 items-start leading-tight min-w-0 flex-1 text-black overflow-hidden">
          <p className="font-bold text-lg sm:text-xl transition-colors duration-200 group-hover:text-[#5A58F2] line-clamp-2">
            {brand.name}
          </p>
          <p className="font-normal text-[14px] text-black">
            {locationCount} locations
          </p>
          <div className="flex gap-1.5 items-center mt-1">
            <p className="font-normal text-[14px] text-black">
              {brand.rating.toFixed(1)}
            </p>
            <div className="relative shrink-0 w-[80px] sm:w-[90px] h-4">
              <SafeImage alt="Stars" className="block max-w-none w-full h-full" src={IMAGES.stars} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Light purple bottom section with verification badge */}
      {showClaimedBadge && brand.claimed && (
        <div className="bg-[#EEE8F7] px-4 sm:px-5 md:px-6 py-1 flex items-center justify-center gap-2 mt-auto">
          <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-4 h-4 shrink-0" />
          <span className="text-[14px] font-medium text-[#6F42C1]">
            Brand-Verified
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block w-full h-full no-underline">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}


