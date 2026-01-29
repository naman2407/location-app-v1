import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

export function VerifiedBusinessBanner() {
  return (
    <div className="w-full py-12 sm:py-16 lg:py-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${IMAGES.gradient})` }}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left side - Title, description, and CTA */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-white text-2xl sm:text-3xl font-normal mb-4">
              Verified businesses perform better.
            </h2>
            <p className="text-white/90 text-base leading-relaxed mb-6">
              See up to 30% more traffic when you verify your brand compared to businesses using publicly sourced data.
            </p>
            
            {/* CTA Button - Shows here on desktop, at bottom on mobile */}
            <div className="hidden lg:block">
              <a
                href="https://www.yext.com/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#6F42C1] hover:bg-[#5B2B99] text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Claim your competitive edge
              </a>
            </div>
          </div>

          {/* Right side - Benefits list */}
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="flex items-start gap-3">
              <SafeImage 
                src={IMAGES.check} 
                alt="" 
                className="w-6 h-6 shrink-0 mt-0.5 icon-green-filter"
              />
              <p className="text-white text-base">
                Control how your business is presented by AI
              </p>
            </div>
            <div className="flex items-start gap-3">
              <SafeImage 
                src={IMAGES.check} 
                alt="" 
                className="w-6 h-6 shrink-0 mt-0.5 icon-green-filter"
              />
              <p className="text-white text-base">
                See how your business stacks up to the competition
              </p>
            </div>
            <div className="flex items-start gap-3">
              <SafeImage 
                src={IMAGES.check} 
                alt="" 
                className="w-6 h-6 shrink-0 mt-0.5 icon-green-filter"
              />
              <p className="text-white text-base">
                Get deeper insights from real customer feedback
              </p>
            </div>
            <div className="flex items-start gap-3">
              <SafeImage 
                src={IMAGES.arrow} 
                alt="" 
                className="w-6 h-6 shrink-0 mt-0.5 icon-white-filter"
              />
              <a
                href="https://www.yext.com/customers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-base underline hover:no-underline"
              >
                Discover how other businesses are using TX3Y
              </a>
            </div>
          </div>
          
          {/* CTA Button - Shows at bottom on mobile/tablet only */}
          <div className="w-full lg:hidden pt-4">
            <a
              href="https://www.yext.com/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#6F42C1] hover:bg-[#5B2B99] text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Claim your competitive edge
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

