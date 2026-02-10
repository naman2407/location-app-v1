'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SafeImage } from '../components/SafeImage'

const DEMO_SHADOW = '0 10px 24px rgba(15, 23, 42, 0.12)'

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
      await sleep(200)
      setCursorClicking(false)
      await sleep(100)

      // Hide cursor
      setShowCursor(false)

      // Fade out location.png
      setShowLocationImage(false)
      await sleep(400)

      // Fade in verification screen
      setShowVerificationScreen(true)
      setVerificationStatus('verifying')
      await sleep(200)

      // Show spinner with "Verifying Brand Information" for 3 seconds
      await sleep(3000)

      // Change to checkmark with "Brand Verified"
      setVerificationStatus('verified')
      await sleep(3000)

      // Hide verification screen and show location-verified.png
      setShowVerificationScreen(false)
      setVerifiedImageLoaded(false)
      setShowVerifiedImage(true)
      
      await sleep(300) // Wait for image to load

      // Phase 2: Show location-verified.png for 10 seconds
      await sleep(10000)

      // Phase 3: Push location-verified and browser out together from left
      // Trigger the slide-out animation
      setShowLogo(true) // This triggers browser slide-out
      await sleep(1200) // Wait for slide-out animation to complete
      // Hide image and browser after they've slid out
      setShowVerifiedImage(false)
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
                  x: showLogo ? '-200%' : '-50%',
                }}
                exit={{ opacity: 0, scale: 0.95, x: '-200%' }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
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
                    {/* Verification Screen */}
                    {showVerificationScreen && (
                      <motion.div
                        key="verification"
                        className="absolute inset-0 bg-white flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="flex flex-col items-center justify-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Spinner or Checkmark */}
                          <AnimatePresence mode="wait">
                            {verificationStatus === 'verifying' ? (
                              <motion.div
                                key="spinner"
                                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                                style={{
                                  background: '#5A58F2',
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.svg
                                  className="w-10 h-10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="31.416"
                                    strokeDashoffset="23.562"
                                  />
                                </motion.svg>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="checkmark"
                                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                                style={{
                                  background: '#5A58F2',
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.5,
                                  ease: [0.34, 1.56, 0.64, 1]
                                }}
                              >
                                <svg
                                  className="w-10 h-10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                            <motion.path
                                d="M6 12L10 16L18 8"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            />
                                </svg>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Label */}
                          <motion.p
                            key={verificationStatus}
                            className="text-xl font-semibold text-gray-900"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {verificationStatus === 'verifying'
                              ? 'Verifying Brand Information'
                              : 'Brand Verified'}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Location.png - Unverified page */}
                    {showLocationImage && !showVerifiedImage && !showVerificationScreen && (
                      <motion.div
                        key="location"
                        className="w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: locationImageLoaded ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
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

                    {/* Location-verified.png - Verified page */}
                    {showVerifiedImage && !showVerificationScreen && (
                      <motion.div
                        key="verified"
                        className="w-full"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: verifiedImageLoaded ? 1 : 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <SafeImage
                          src="/images/demo/location-verified.png"
                          alt="Location Verified Page"
                          className="w-full h-auto block"
                          onLoad={() => setVerifiedImageLoaded(true)}
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
