import { BrandCard } from './BrandCard'
import { Link } from './Link'
import { brands } from '../constants/data'

export function BrandsSection() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-[32px] items-center relative w-full max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-[8px] items-center leading-[1.5] relative w-full">
        <p className="font-semibold text-center relative shrink-0 text-2xl sm:text-3xl md:text-[32px] text-black">
          Brands
        </p>
        <p className="font-normal min-w-full relative shrink-0 text-base text-[#5b5d60] text-center tracking-[-0.38px] px-4">
          Explore all brands and locations
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-[24px] items-center relative w-full">
        {/* Brand Cards Grid - Responsive: 1 col mobile, 2 col tablet, 3 col large/xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full items-stretch">
          {brands.map((brand, index) => {
            // Only Taco Bell is clickable for the prototype
            const href = brand.name.toLowerCase() === 'taco bell' 
              ? '/categories/food-and-dining/taco-bell'
              : undefined
            
            return (
              <div key={index} className={index === 8 ? 'block md:hidden lg:block' : ''}>
                <BrandCard brand={brand} href={href} showClaimedBadge={true} />
              </div>
            )
          })}
        </div>
        
        {/* View All Brands Link */}
        <Link
          href="/brands"
          className="no-focus-ring font-medium h-[30px] leading-[1.5] relative shrink-0 text-base text-center tracking-[-0.38px] w-full"
        >
          View All Brands
        </Link>
      </div>
    </div>
  )
}
