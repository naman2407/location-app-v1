'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SafeImage } from '../components/SafeImage'
import { Compare } from '@/components/ui/compare'

const DEMO_SHADOW = '0 6px 14px rgba(15, 23, 42, 0.08)'

export default function VerifyDemoPage() {
  const [showBrowser, setShowBrowser] = useState(false)
  const [urlText, setUrlText] = useState('')
  const [showLocationImage, setShowLocationImage] = useState(false)
  const [showVerifiedImage, setShowVerifiedImage] = useState(false)
  const [locationImageLoaded, setLocationImageLoaded] = useState(false)
  const [verifiedImageLoaded, setVerifiedImageLoaded] = useState(false)
  const [scale, setScale] = useState(1)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [cursorClicking, setCursorClicking] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'complete'>('idle')
  const [showVerificationScreen, setShowVerificationScreen] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'verified'>('verifying')
  const [showLogo, setShowLogo] = useState(false)
  const [showLogoAnimation, setShowLogoAnimation] = useState(false)
  const [reverseLocationLogo, setReverseLocationLogo] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [hideLocationLayer, setHideLocationLayer] = useState(false)
  const [showCtaRipple, setShowCtaRipple] = useState(false)
  const [ctaRippleKey, setCtaRippleKey] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const url = 'www.location.com/galaxy-grill'
  const logoGap = 18
  const logoTextSvg = { width: 150, height: 42 }
  const logoTextHeight = 80
  const logoTextWidth = (logoTextSvg.width / logoTextSvg.height) * logoTextHeight
  const logoTiming = {
    bgDur: 0.2,
    gap: 0.1,
    lVerticalDur: 0.3,
    lHorizontalDur: 0.3,
    arrowDur: 0.25,
    dotDur: 0.15,
    locationTextDur: 0.8,
    purpleDotDur: 0.2,
  }
  const logoCoreDur =
    logoTiming.bgDur +
    logoTiming.gap +
    logoTiming.lVerticalDur +
    logoTiming.gap +
    logoTiming.lHorizontalDur +
    logoTiming.gap +
    logoTiming.arrowDur +
    logoTiming.gap +
    logoTiming.dotDur
  const moveLeftDur = 0.45
  const moveLeftDelay = logoCoreDur
  const totalMoveDur = moveLeftDelay + moveLeftDur
  const logoTextDelay = totalMoveDur + 0.05
  const purpleDotDelay = logoTextDelay + logoTiming.locationTextDur + 0.05
  const comTextDelay = purpleDotDelay + logoTiming.purpleDotDur + 0.05
  const subTextDelay = comTextDelay + 1.0

  // logoTextWidth is derived from the SVG viewBox ratio to avoid layout jitter

  // Preload images (for performance, but don't set loaded state)
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image()
      img.src = src
      // Don't set loaded state here - let SafeImage onLoad handle it for smooth fade-in
      return img
    }

    // Preload both images early for better performance
    preloadImage('/images/demo/location.png')
    preloadImage('/images/demo/location-verified.png')
  }, [])

  // Calculate scale based on viewport size
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const baseWidth = 1920
        const baseHeight = 1080
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const scaleX = viewportWidth / baseWidth
        const scaleY = viewportHeight / baseHeight
        const newScale = Math.min(scaleX, scaleY, 1)

        setScale(newScale)
      }
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  useEffect(() => {
    const runAnimation = async () => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
      const smoothScrollToTop = async (duration: number = 700) => {
        if (!contentRef.current) return
        const startScroll = contentRef.current.scrollTop
        const startTime = performance.now()

        await new Promise<void>((resolve) => {
          const tick = () => {
            if (!contentRef.current) {
              resolve()
              return
            }
            const elapsed = performance.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const ease = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2
            contentRef.current.scrollTop = startScroll * (1 - ease)
            if (progress < 1) {
              requestAnimationFrame(tick)
            } else {
              resolve()
            }
          }
          requestAnimationFrame(tick)
        })
      }

      // Start with 5 seconds of empty screen (just gradient)
      await sleep(5000)

      // Show browser
      setShowBrowser(true)
      await sleep(300)

      // Show cursor and move to URL bar
      setShowCursor(true)
      setCursorPosition({ x: 50, y: 15.2 })
      await sleep(500)

      // Click URL bar
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)

      // Type URL
      for (let i = 0; i <= url.length; i++) {
        await sleep(60)
        setUrlText(url.substring(0, i))
      }

      await sleep(500)

      // Show location.png - reset loaded state for smooth fade-in
      setLocationImageLoaded(false) // Reset loaded state for fade-in
      setHideLocationLayer(false)
      setShowLocationImage(true)
      await sleep(500) // Wait for fade-in animation

      // Scroll down a bit
      if (contentRef.current) {
        const scrollDuration = 1500
        const startTime = Date.now()
        const startScroll = 0
        const targetScroll = 400

        const scrollInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / scrollDuration, 1)
          const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2

          const currentScroll = startScroll + (targetScroll - startScroll) * easeProgress
          if (contentRef.current) {
            contentRef.current.scrollTop = currentScroll
          }

          if (progress >= 1) {
            clearInterval(scrollInterval)
          }
        }, 16)

        await sleep(scrollDuration)
      }

      await sleep(500)

      // Move cursor to "Verify your brand" CTA
      setCursorPosition({ x: 72, y: 65.5 })
      await sleep(500)

      // Click CTA - Start high-impact transformation
      setCursorClicking(true)
      setCtaRippleKey(prev => prev + 1)
      setShowCtaRipple(true)
      await sleep(200)
      setCursorClicking(false)
      await sleep(100)
      await sleep(220)
      setShowCtaRipple(false)

      // Hide cursor
      setShowCursor(false)

      // Compare transition from unverified to verified
      await smoothScrollToTop(800)
      await sleep(1000)
      setShowCompare(true)
      await sleep(340) // Let compare layer settle in before fading old layer
      setHideLocationLayer(true)
      await sleep(2600)

      // Phase 2: Keep verified state visible for 6 seconds
      await sleep(6000)

      // Phase 3: Fade browser out in place
      setShowLogo(true) // Trigger in-place browser fade-out
      await sleep(900) // Wait for fade-out animation to complete
      // Hide image and browser after fade
      setShowBrowser(false)

      // Phase 4: Empty screen with just background for 1.5 seconds
      await sleep(1500)

      // Phase 5: Show logo animation
      setShowLogoAnimation(true)
      await sleep(3500) // Wait for logo animation to complete
    }

    runAnimation()
  }, [url])

  const logoShift = (logoTextWidth + logoGap) / 2

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FE 100%)',
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-visible flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="relative overflow-visible"
          style={{
            width: '1920px',
            height: '1080px',
          }}
        >
          {/* Cursor */}
          <AnimatePresence>
            {showCursor && (
              <motion.div
                className="absolute pointer-events-none z-50"
                style={{
                  width: '28px',
                  height: '28px',
                }}
                initial={{ opacity: 0, left: '50%', top: '50%' }}
                animate={{
                  opacity: 1,
                  left: `${cursorPosition.x}%`,
                  top: `${cursorPosition.y}%`,
                  scale: cursorClicking ? 0.85 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  left: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  top: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.1 },
                  opacity: { duration: 0.2 }
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#333" stroke="#fff" strokeWidth="1.5"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCtaRipple && (
              <motion.div
                key={`cta-ripple-${ctaRippleKey}`}
                className="absolute pointer-events-none z-40"
                style={{
                  left: '72%',
                  top: '65.5%',
                  width: 14,
                  height: 14,
                  borderRadius: '999px',
                  border: '2px solid rgba(90, 88, 242, 0.55)',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 6.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>



          {/* Browser - Container stays the same, only inner content changes */}
          <AnimatePresence>
            {showBrowser && (
              <motion.div
                className="absolute bg-white rounded-xl overflow-hidden"
                style={{
                  width: '1400px',
                  height: '800px',
                  left: '50%',
                  top: '50%',
                  y: '-50%',
                  boxShadow: DEMO_SHADOW,
                }}
                initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
                animate={{
                  opacity: showLogo ? 0 : 1,
                  scale: showLogo ? 0.95 : 1,
                  x: '-50%',
                }}
                exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >

                {/* Browser Topbar */}
                <div className="h-12 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
                  <div className="flex-1 h-8 bg-white border border-[#D0D0D0] rounded-md px-3 flex items-center mx-2">
                    <span className="text-sm text-[#333] font-mono">
                      {urlText}
                      {urlText.length < url.length && (
                        <span className="w-0.5 h-4 bg-[#333] ml-1 animate-pulse"></span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Browser Content */}
                <div
                  ref={contentRef}
                  className="relative w-full h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden bg-white"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <AnimatePresence mode="wait">
                    {/* Compare transition */}
                    {showCompare && (
                      <motion.div
                        key="compare"
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="relative w-full h-full overflow-hidden">
                          <Compare
                            firstImage="/images/demo/location.png"
                            secondImage="/images/demo/location-verified.png"
                            firstImageClassName="w-full h-auto block"
                            secondImageClassname="w-full h-auto block"
                            className="w-full h-full pointer-events-none"
                            slideMode="hover"
                            autoplay={true}
                            autoplayMode="once"
                            autoplayDuration={3200}
                            autoplayStartDelayMs={220}
                            initialSliderPercentage={0}
                            showHandlebar={true}
                            disableInteractions={true}
                            lineOffsetTopPx={48}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Location.png - Unverified page */}
                    {showLocationImage && !showVerifiedImage && !showVerificationScreen && (
                      <motion.div
                        key="location"
                        className="w-full"
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{
                          opacity: hideLocationLayer ? 0 : (locationImageLoaded ? 1 : 0),
                          filter: hideLocationLayer
                            ? 'blur(2px)'
                            : (locationImageLoaded ? 'blur(0px)' : 'blur(4px)'),
                        }}
                        exit={{ opacity: 0, filter: 'blur(2px)' }}
                        transition={{
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <SafeImage
                          src="/images/demo/location.png"
                          alt="Location Page"
                          className="w-full h-auto block"
                          onLoad={() => {
                            setLocationImageLoaded(true)
                          }}
                        />
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Logo with animation - Starts centered, moves left, then text appears */}
          <AnimatePresence>
            {showLogo && showLogoAnimation && (
              <motion.div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                initial={{ opacity: 0, x: '-50%', y: '-50%' }}
                animate={showLogo && showLogoAnimation && !reverseLocationLogo ? {
                  opacity: 1,
                  x: ['-50%', '-50%', '-60%'], // Start centered, then slide left after logo animation
                  y: '-50%',
                } : reverseLocationLogo ? { opacity: 0, x: '-50%', y: '-50%' } : {}}
                transition={{
                  opacity: { duration: 0.2 },
                  x: {
                    duration: totalMoveDur,
                    times: [0, moveLeftDelay / totalMoveDur, 1],
                    delay: 0,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
              >
                <div className="relative flex flex-col items-center gap-6">
                  {/* Logo and text container - horizontal layout */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      className="inline-flex items-center gap-[18px]"
                      initial={{ x: logoShift }}
                      animate={
                        showLogo && showLogoAnimation && !reverseLocationLogo
                          ? { x: [logoShift, logoShift, 0] }
                          : reverseLocationLogo
                            ? { x: logoShift }
                            : {}
                      }
                      transition={{
                        duration: totalMoveDur,
                        times: [0, moveLeftDelay / totalMoveDur, 1],
                        delay: 0,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      {/* Logo mark */}
                      <svg
                        width="67"
                        height="67"
                        viewBox="0 0 67 67"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-28 h-28"
                      >
                      <motion.rect
                        width="67"
                        height="67"
                        rx="33.5"
                        fill="#5A58F2"
                        initial={{ opacity: 0 }}
                        animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                        transition={{
                          duration: logoTiming.bgDur,
                          delay: reverseLocationLogo ? 0.4 : 0,
                          ease: 'easeOut',
                        }}
                      />
                      <defs>
                        <mask id="mask0_2544_5494_verify" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="67" height="67">
                          <circle cx="33.5" cy="33.5" r="33.5" fill="#5A58F2" />
                        </mask>
                        <mask
                          id="lVerticalRevealMaskVerify"
                          maskUnits="userSpaceOnUse"
                          x="11"
                          y="1"
                          width="9"
                          height="39"
                        >
                          <motion.rect
                            x="11"
                            y="1"
                            width="9"
                            height="0"
                            fill="white"
                            initial={{ height: 0 }}
                            animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { height: 39 } : reverseLocationLogo ? { height: 0 } : {}}
                            transition={{
                              delay: reverseLocationLogo ? 1.2 : logoTiming.bgDur + logoTiming.gap,
                              duration: logoTiming.lVerticalDur,
                              ease: 'easeInOut',
                            }}
                          />
                        </mask>
                        <mask
                          id="lHorizontalRevealMaskVerify"
                          maskUnits="userSpaceOnUse"
                          x="11"
                          y="33"
                          width="32"
                          height="9"
                        >
                          <motion.rect
                            x="11"
                            y="33"
                            width="0"
                            height="9"
                            fill="white"
                            initial={{ width: 0 }}
                            animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { width: 32 } : reverseLocationLogo ? { width: 0 } : {}}
                            transition={{
                              delay:
                                reverseLocationLogo
                                  ? 1.0
                                  : logoTiming.bgDur + logoTiming.gap + logoTiming.lVerticalDur + logoTiming.gap,
                              duration: logoTiming.lHorizontalDur,
                              ease: 'easeInOut',
                            }}
                          />
                        </mask>
                      </defs>
                      <g mask="url(#mask0_2544_5494_verify)">
                        <motion.ellipse
                          cx="57.5"
                          cy="37.375"
                          rx="4.5"
                          ry="4.375"
                          fill="white"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { scale: 1, opacity: 1 } : reverseLocationLogo ? { scale: 0, opacity: 0 } : {}}
                          transition={{
                            delay:
                              reverseLocationLogo
                                ? 0.6
                                : logoTiming.bgDur +
                                  logoTiming.gap +
                                  logoTiming.lVerticalDur +
                                  logoTiming.gap +
                                  logoTiming.lHorizontalDur +
                                  logoTiming.gap +
                                  logoTiming.arrowDur +
                                  logoTiming.gap,
                            duration: logoTiming.dotDur,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                          style={{
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                          }}
                        />
                        <motion.path
                          d="M51 37.5L42 45.7272L42 29.2728L51 37.5Z"
                          fill="white"
                          initial={{ opacity: 0 }}
                          animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{
                            opacity: {
                              duration: logoTiming.arrowDur,
                              delay:
                                reverseLocationLogo
                                  ? 0.8
                                  : logoTiming.bgDur +
                                    logoTiming.gap +
                                    logoTiming.lVerticalDur +
                                    logoTiming.gap +
                                    logoTiming.lHorizontalDur +
                                    logoTiming.gap,
                            },
                          }}
                        />
                        <motion.g
                          mask="url(#lVerticalRevealMaskVerify)"
                          initial={{ opacity: 0 }}
                          animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{
                            opacity: {
                              duration: 0.1,
                              delay: reverseLocationLogo ? 1.2 : logoTiming.bgDur + logoTiming.gap,
                            },
                          }}
                        >
                          <path d="M11 8.21391L15 4.21387L20 1.48592V32.0864V39.514H11V8.21391Z" fill="white" />
                        </motion.g>
                        <motion.g
                          mask="url(#lHorizontalRevealMaskVerify)"
                          initial={{ opacity: 0 }}
                          animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{
                            opacity: {
                              duration: 0.1,
                              delay:
                                reverseLocationLogo
                                  ? 1.0
                                  : logoTiming.bgDur + logoTiming.gap + logoTiming.lVerticalDur + logoTiming.gap,
                            },
                          }}
                        >
                          <path d="M11 33.1001L15.5 33.1501H19.5H20.52H42.43V41.9001H11V33.1001Z" fill="white" />
                        </motion.g>
                      </g>
                      </svg>
                      {/* Logo text */}
                      <motion.div
                        className="overflow-hidden"
                        style={{ height: '80px' }}
                        initial={{ opacity: 0 }}
                        animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                        transition={{ duration: 0.2, delay: reverseLocationLogo ? 0 : logoTextDelay }}
                      >
                        <motion.img
                          src="/images/demo/location-logo-h1.svg"
                          alt="Location logo text"
                          className="h-[80px] w-auto"
                          initial={{ clipPath: 'inset(0 100% 0 0)' }}
                          animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { clipPath: 'inset(0 0% 0 0)' } : reverseLocationLogo ? { clipPath: 'inset(0 100% 0 0)' } : {}}
                          transition={{
                            duration: logoTiming.locationTextDur,
                            delay: reverseLocationLogo ? 0 : logoTextDelay,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Text below logo and text - appears last */}
                  <motion.p
                    className="text-2xl text-gray-600 font-medium mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={showLogo && showLogoAnimation && !reverseLocationLogo ? { opacity: 1, y: 0 } : reverseLocationLogo ? { opacity: 0, y: 10 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: reverseLocationLogo ? 0 : subTextDelay,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    Find out more at Yext.com
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
