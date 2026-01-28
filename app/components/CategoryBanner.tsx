import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

/**
 * Reusable banner component for category pages
 * Displays information about brand-verified information benefits
 */
export function CategoryBanner() {
  return (
    <div className="lg:w-[420px] xl:w-[480px] shrink-0">
      <div className="bg-[#F2F2FA] rounded-2xl p-5 lg:p-6 flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-[#5A58F2]">
          The Advantage of Brand-Verified Information
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 text-[15px] text-[#1c1d20]">
            <SafeImage
              src={IMAGES.check}
              alt=""
              className="w-5 h-5 shrink-0 mt-0.5"
            />
            <p className="leading-relaxed">
              Brands that manage certified business facts through TX3Y see up to 30% more traffic compared to pages without brand-verified information.
            </p>
          </div>
          <div className="flex items-start gap-3 text-[15px] text-[#1c1d20]">
            <SafeImage
              src={IMAGES.arrow}
              alt=""
              className="w-5 h-5 shrink-0 mt-0.5"
            />
            <a
              href="https://www.yext.com/customers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1c1d20] underline hover:no-underline leading-relaxed"
            >
              Discover how other brands do this at scale
            </a>
          </div>
        </div>
        <a
          href="https://www.yext.com/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-6 py-3 rounded-full transition-colors w-fit mt-1 text-center"
        >
          Claim your competitive edge
        </a>
      </div>
    </div>
  )
}

