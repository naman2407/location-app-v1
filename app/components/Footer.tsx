import { SafeImage } from './SafeImage'
import { Link } from './Link'
import { IMAGES } from '../constants/images'

export function Footer() {
  return (
    <div className="bg-black w-full">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 px-4 sm:px-8 lg:px-8 xl:px-[150px] py-6 sm:py-8 md:py-[24px] relative w-full max-w-[1500px] mx-auto">
        <p className="font-normal text-white text-sm leading-none text-center md:text-left">
          © 2025 TX3Y Inc.
        </p>
        <div className="flex gap-4 items-center justify-center">
          <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
            <SafeImage alt="Facebook" className="block max-w-none w-full h-full" src={IMAGES.facebook} />
          </div>
          <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
              <SafeImage alt="Instagram" className="block max-w-none w-full h-full" src={IMAGES.instagram} />
            </div>
          <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
              <SafeImage alt="Twitter" className="block max-w-none w-full h-full" src={IMAGES.twitter} />
            </div>
          <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
              <SafeImage alt="LinkedIn" className="block max-w-none w-full h-full" src={IMAGES.linkedin} />
            </div>
          <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
              <SafeImage alt="YouTube" className="block max-w-none w-full h-full" src={IMAGES.youtube} />
          </div>
        </div>
      </div>
    </div>
  )
}
