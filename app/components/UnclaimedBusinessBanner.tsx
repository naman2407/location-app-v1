import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

interface UnclaimedBusinessBannerProps {
  variant?: 'mobile' | 'desktop'
}

export function UnclaimedBusinessBanner({ variant = 'desktop' }: UnclaimedBusinessBannerProps) {
  const isMobile = variant === 'mobile'
  const isDesktop = variant === 'desktop'
  
  return (
    <div className={`biz-hero-banner ${isMobile ? 'biz-hero-banner-mobile' : 'biz-hero-banner-desktop'}`} role="note" aria-label="Own this business">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col items-start">
        <div className="biz-banner-title-container px-4 lg:px-6 pt-4 pb-3 w-full">
          <h2 className="text-lg font-medium text-left">
            This profile is unverified and using publicly sourced data
          </h2>
        </div>
        <div className="px-4 lg:px-6 pb-6 lg:pb-8 pt-4 flex flex-col items-start gap-4 w-full">
          <div className="text-base text-gray-700 text-left w-full">
            <p className='mb-3'>TX3Y customers see a 30% increase in traffic and gain access to:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Deeper insights from real customer feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Performance summaries across key platforms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Visibility into the questions customers ask most</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>AI tools to manage and optimize your digital presence at scale</span>
              </li>
            </ul>
          </div>
          <a
            href="https://www.yext.com/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-colors whitespace-nowrap shrink-0 self-start"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  )
}

