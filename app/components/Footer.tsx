import { SafeImage } from './SafeImage'
import { Link } from './Link'
import { IMAGES } from '../constants/images'

export function Footer() {
  return (
    <div className="bg-black w-full">
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-[24px] items-center lg:items-start justify-center overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] py-6 sm:py-8 md:py-[24px] relative w-full max-w-[1440px] mx-auto text-center lg:text-left">
        <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-between gap-4 w-full">
          <div className="flex items-center lg:items-start justify-center lg:justify-start gap-4">
            <Link href="#" className="footer-link flex items-center justify-center px-2 py-0">
              <p className="font-medium leading-[22px] text-[14px] text-white">
                TX3Y for Businesses
              </p>
            </Link>
            <Link href="#" className="footer-link flex items-center justify-center px-2 py-0">
              <p className="font-medium leading-[22px] text-[14px] text-white">
               About
              </p>
            </Link>
          </div>
          <div className="flex gap-[16px] items-center justify-center lg:justify-start">
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
        <p className="font-normal leading-[16px] text-[#ccc] text-[12px] w-full text-center lg:text-left">
          © 2025 TX3Y Inc.
        </p>
      </div>
    </div>
  )
}
