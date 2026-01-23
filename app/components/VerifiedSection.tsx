import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

export function VerifiedSection() {
  return (
    <div className="flex gap-8 sm:gap-12 md:gap-[80px] items-center relative w-full flex-col lg:flex-row px-4 sm:px-0 max-w-[1440px] mx-auto">
      <div className="h-[220px] sm:h-[270px] md:h-[300px] relative shrink-0 w-full lg:w-[380px]">
        <SafeImage alt="Verified Business Information" className="block max-w-none w-full h-full object-contain" src={IMAGES.emptyDone} />
      </div>
      <div className="flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-0 relative">
        <div className="flex flex-col gap-[6px] items-start relative shrink-0 w-full">
          <p className="font-normal leading-[24px] relative shrink-0 text-[#767676] text-base w-full">
            Powered by TX3Y
          </p>
          <div className="font-semibold text-[32px] leading-normal relative shrink-0 text-black w-full">
            <p>Verified Business Information from Trusted Brands</p>
          </div>
        </div>
        <p className="font-normal leading-[1.5] relative shrink-0 text-[20px] text-black tracking-[-0.38px] w-full">
          The TX3Y Directory brings together accurate, up-to-date information about businesses spanning industries and regions across the web. Powered by direct data from the source, find what you need quickly and reliably, whether you're searching for a local shop or a national brand.
        </p>
      </div>
    </div>
  )
}

