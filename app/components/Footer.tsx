import { SafeImage } from './SafeImage'
import { Link } from './Link'
import { IMAGES } from '../constants/images'

export function Footer() {
  return (
    <div className="bg-black w-full">
      <div className="flex items-center justify-between overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] py-6 sm:py-8 md:py-[24px] relative w-full max-w-[1500px] mx-auto">
        <p className="font-normal leading-[16px] text-white text-sm">
          © 2025 TX3Y Inc.
        </p>
        <div className="flex gap-[16px] items-center">
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <SafeImage alt="Facebook" className="block max-w-none w-full h-full" src={IMAGES.facebook} />
          </div>
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <SafeImage alt="Instagram" className="block max-w-none w-full h-full" src={IMAGES.instagram} />
          </div>
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <SafeImage alt="Twitter" className="block max-w-none w-full h-full" src={IMAGES.twitter} />
          </div>
          <div className="relative shrink-0 w-[20px] h-[20px]">
            <SafeImage alt="LinkedIn" className="block max-w-none w-full h-full" src={IMAGES.linkedin} />
          </div>
          <div className="relative shrink-0 w-[25px] h-[25px]">
            <SafeImage alt="YouTube" className="block max-w-none w-full h-full" src={IMAGES.youtube} />
          </div>
        </div>
      </div>
    </div>
  )
}
