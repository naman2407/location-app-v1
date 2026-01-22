import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

interface BrandCardProps {
  brand: {
    name: string
    locations: string
    category: string
    rating: number
    logo: string
  }
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <div className="bg-white card-border-normal flex flex-col gap-3 sm:gap-4 h-auto md:h-full md:min-h-[200px] w-full min-w-0 p-3 sm:p-4 md:p-5 lg:p-6 relative rounded-[8px] transition-all duration-200 group cursor-pointer">
      <div className="flex gap-3 sm:gap-4 items-start min-w-0 flex-1">
        <div className="relative shrink-0 w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] rounded-full overflow-hidden">
          <SafeImage alt={brand.name} className="block max-w-none w-full h-full object-cover rounded-full" src={brand.logo} />
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2 items-start leading-tight min-w-0 flex-1 text-black overflow-hidden">
          <p className="font-semibold text-base sm:text-lg transition-colors duration-200 group-hover:text-[#5A58F2] line-clamp-2">
            {brand.name}
          </p>
          <p className="font-normal text-sm sm:text-base line-clamp-2 text-[#5b5d60]">
            {brand.locations}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start mt-auto pt-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <div className="flex h-5 items-center shrink-0">
            <div className="overflow-hidden w-4 h-4">
              <SafeImage alt="Tag" className="block max-w-none w-full h-full" src={IMAGES.tag} />
            </div>
          </div>
          <p className="font-normal leading-tight text-[#5b5d60] text-xs sm:text-sm line-clamp-1">
            {brand.category}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-1.5 items-center">
            <p className="font-normal leading-tight text-xs sm:text-sm text-black">
              {brand.rating}
            </p>
            <div className="relative shrink-0 w-[70px] sm:w-[80px] md:w-[90px] h-3 sm:h-4">
              <SafeImage alt="Stars" className="block max-w-none w-full h-full" src={IMAGES.stars} />
            </div>
          </div>
          <p className="font-normal leading-tight text-xs sm:text-sm text-[#6f7074] line-clamp-1">
            Average rating
          </p>
        </div>
      </div>
    </div>
  )
}

