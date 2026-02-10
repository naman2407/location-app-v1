'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { SafeImage } from '../components/SafeImage'

const DEMO_SHADOW = '0 10px 24px rgba(15, 23, 42, 0.12)'

export default function HoursDemoPage() {
  const [showBrowser, setShowBrowser] = useState(false)
  const [urlText, setUrlText] = useState('')
  const [showChatInterface, setShowChatInterface] = useState(false)
  const [showTypingBar, setShowTypingBar] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showUserQuestion, setShowUserQuestion] = useState(false)
  const [showSearching, setShowSearching] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [showSources, setShowSources] = useState(false)
  const [showLocationBrowser, setShowLocationBrowser] = useState(false)
  const [showLocationImage, setShowLocationImage] = useState(false)
  const [locationImageLoaded, setLocationImageLoaded] = useState(false)
  const [showGoogleBrowser, setShowGoogleBrowser] = useState(false)
  const [showGoogleImage, setShowGoogleImage] = useState(false)
  const [googleImageLoaded, setGoogleImageLoaded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [hoverLocationLink, setHoverLocationLink] = useState(false)
  const [googleUrlText, setGoogleUrlText] = useState('')
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scale, setScale] = useState(1)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [cursorClicking, setCursorClicking] = useState(false)
  const [sendButtonClicked, setSendButtonClicked] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const content1Ref = useRef<HTMLDivElement>(null)
  const browser1Controls = useAnimation()
  const content1Controls = useAnimation()
  const browser2Controls = useAnimation()

  const question = "What time does Galaxy Grill on 8th ave in NYC close on Wednesday?"
  const url = "www.ai-search.com"
  const fullAnswer = `On Wednesday, Galaxy Grill on 8th Ave in New York City closes at 6:52 PM.

Hours for Galaxy Grill by day:

Monday: 11:00 AM – 10:00 PM
Tuesday: 11:00 AM – 10:00 PM
Wednesday: 10:57 AM – 6:52 PM
Thursday: 11:00 AM – 10:00 PM
Friday: 11:00 AM – 11:00 PM
Saturday: 11:00 AM – 11:00 PM
Sunday: 12:00 PM – 9:00 PM

Would you like the restaurant's phone number, directions, or menu?`

  // Calculate scale based on viewport size
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current
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

      // Show browser first
      setShowBrowser(true)
      await sleep(300)

      // Show cursor
      await sleep(500)
      setShowCursor(true)
      setCursorPosition({ x: 50, y: 50 })
      await sleep(300)

      // Move cursor to URL bar
      // Browser: 1400px × 800px, centered at 50% horizontal, 50% vertical
      // Browser top: (1080 - 800) / 2 = 140px = 12.96% from top
      // Address bar height: 48px, center at 24px from browser top
      // Address bar center Y: 140px + 24px = 164px = 15.19% of 1080px
      // URL bar is centered horizontally in the browser
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

      // Load website (show ChatGPT interface)
      setShowChatInterface(true)
      await sleep(800)

      // Show typing bar at bottom
      setShowTypingBar(true)
      await sleep(500)

      // Move cursor to typing bar at bottom
      // Browser bottom: 50% + (800px/2)/1080px*100 = 50% + 37.04% = 87.04%
      // Typing bar is at bottom, input field center is approximately 87% - 2% = 85%
      setCursorPosition({ x: 50, y: 85 })
      await sleep(500)

      // Type question in input field
      for (let i = 0; i <= question.length; i++) {
        await sleep(30)
        setInputText(question.substring(0, i))
      }

      await sleep(500)

      // Move cursor to CTA button (send button on the right side of input)
      // Browser: 1400px wide, centered at 50% (960px)
      // Typing bar container: max-w-5xl (1024px) centered, with px-6 (24px padding)
      // Container right: 960px + 512px = 1472px
      // Send button: 48px wide, positioned at container right - padding - button width/2
      // Send button center X: 1472px - 24px - 24px = 1424px = 74.17%
      // Typing bar: at bottom of browser (800px tall), with py-4 (16px padding)
      // Typing bar center Y: 540px + 400px - 16px - 24px = 900px = 83.33%
      setCursorPosition({ x: 83, y: 83.3 })
      await sleep(500)

      // Click CTA button with visible click effect
      setCursorClicking(true)
      setSendButtonClicked(true) // Visual feedback on button
      await sleep(200) // Longer click animation
      setCursorClicking(false)
      await sleep(100)

      // Clear input field first (question goes out from typing bar)
      setInputText('')
      await sleep(200)

      // Show question in chat (right side) - slides up from typing bar
      setShowUserQuestion(true)
      await sleep(300)

      // Reset button state and hide cursor after question appears
      setSendButtonClicked(false)
      setShowCursor(false)
      await sleep(200)

      // Show "Searching the web..." animation immediately after user message
      setShowSearching(true)
      await sleep(2500) // Slightly longer to make it more visible

      // Hide searching, show answer on left
      setShowSearching(false)
      setShowAnswer(true)

      // Type answer
      for (let i = 0; i <= fullAnswer.length; i++) {
        await sleep(15)
        setAnswerText(fullAnswer.substring(0, i))
      }

      // Show sources immediately after answer completes
      setShowSources(true)
      await sleep(1000)

      // Move cursor to Location.com in sources
      // Sources are in the answer section on the left
      // Location.com link is approximately at: 50% horizontal (center), but shifted left for answer section
      // Answer section starts around 10% from left, Location.com link is around 15-20% from left
      // Vertical: answer section is in the middle, sources are at bottom of answer, approximately 70-75% vertical
      setShowCursor(true)
      setCursorPosition({ x: 25, y: 64 })
      await sleep(500)

      // Click Location.com
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)

      // Hide chat interface and show location browser
      setShowChatInterface(false)
      setShowBrowser(false)
      setShowCursor(false)
      await sleep(300)

      // Show browser (already loaded, no typing)
      setShowLocationBrowser(true)
      setLocationImageLoaded(false) // Reset loaded state for fade-in
      setShowLocationImage(true)
      await sleep(500)

      // Scroll down smoothly to show hours section
      const scrollDuration = 2000
      const startTime = Date.now()
      const startScroll = 0
      const targetScroll = 750

      const scrollInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / scrollDuration, 1)
        // Smoother easing - ease-in-out cubic
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        
        const currentScroll = startScroll + (targetScroll - startScroll) * easeProgress
        setScrollPosition(currentScroll)
        
        if (content1Ref.current) {
          content1Ref.current.scrollTop = currentScroll
        }
        
        if (progress >= 1) {
          clearInterval(scrollInterval)
        }
      }, 16)

      await sleep(scrollDuration)

      // Pause after scrolling before zooming
      await sleep(800)

      // Zoom to hours section - smoother animation
      await content1Controls.start({
        scale: 1.6,
        x: '-15%',
        transition: { duration: 3, ease: [0.2, 0, 0.2, 1] }
      })

      await sleep(1500)

      // Split screen - move location browser to left, show Google browser on right
      await browser1Controls.start({
        left: '25%',
        x: '-50%',
        y: '-50%',
        scale: 0.75,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
      })

      await sleep(300)

      // Show Google browser on right (empty, no image yet)
      setShowGoogleBrowser(true)
      await sleep(100) // Small delay to ensure component is mounted
      await browser2Controls.start({
        left: '75%',
        top: '50%',
        x: '-50%',
        y: '-45%',
        scale: 0.75,
        opacity: 1,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
      })
      await sleep(500)

      // Show cursor and move to URL bar
      setShowCursor(true)
      // Browser 2 is at 75% horizontal, slightly lower (y: -45%)
      // URL bar center: approximately 75% horizontal, 15.2% vertical (same as first browser)
      setCursorPosition({ x: 75, y: 30 })
      await sleep(500)

      // Click URL bar
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)

      // Type URL
      const googleUrl = 'www.google.com/galaxy-grill'
      for (let i = 0; i <= googleUrl.length; i++) {
        await sleep(60)
        setGoogleUrlText(googleUrl.substring(0, i))
      }

      await sleep(500)

      // Load Google page with smooth fade-in
      setGoogleImageLoaded(false) // Reset loaded state for fade-in
      setShowGoogleImage(true)
      await sleep(800) // Wait for fade-in animation to complete

      // Scroll Google page to 30%
      const content2Element = document.querySelector('#content2') as HTMLDivElement
      if (content2Element) {
        const scrollDuration = 1000
        const startTime = Date.now()
        const startScroll = 0
        const targetScroll = content2Element.scrollHeight * 0.3
        
        const scrollInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / scrollDuration, 1)
          const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress
          
          const currentScroll = startScroll + (targetScroll - startScroll) * easeProgress
          content2Element.scrollTop = currentScroll
          
          if (progress >= 1) {
            clearInterval(scrollInterval)
          }
        }, 16)
        
        await sleep(scrollDuration)
      }

      // Move cursor to "More hours" link
      setShowCursor(true)
      setCursorPosition({ x: 92, y: 61.5 })
      await sleep(500)

      // Click effect
      setCursorClicking(true)
      await sleep(200)
      setCursorClicking(false)
      await sleep(100)

      // Show modal
      setShowModal(true)
      await sleep(7000)

      // Fade out browsers
      await Promise.all([
        browser1Controls.start({
          left: '-18%',
          x: '-50%',
          opacity: 0,
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        }),
        browser2Controls.start({
          left: '118%',
          x: '-50%',
          opacity: 0,
          transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        })
      ])
      setShowCursor(false)
      
      // Brief pause with modal still visible
      await sleep(500)
      
      // Then fade out modal
      setShowModal(false)
    }

    runAnimation()
  }, [])

  const handleLocationClick = async () => {
    // This is now handled automatically in the animation sequence
    // Keeping the function for potential manual clicks
  }

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
        className="absolute inset-0 overflow-hidden flex items-center justify-center"
      >
        <div
          className="relative"
          style={{
            width: '1920px',
            height: '1080px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
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

            {/* Browser with ChatGPT Interface */}
            <AnimatePresence>
              {showBrowser && (
                <motion.div
                  className="absolute bg-white rounded-xl overflow-hidden"
                  style={{
                    width: '1400px',
                    height: '800px',
                    left: '50%',
                    top: '50%',
                    x: '-50%',
                    y: '-50%',
                    boxShadow: DEMO_SHADOW,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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

                {/* ChatGPT Content */}
                <AnimatePresence>
                  {showChatInterface && (
                    <motion.div
                      className="h-[calc(100%-48px)] bg-[#343541] overflow-y-auto relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="max-w-5xl mx-auto py-8 px-6 pb-32">
                        {/* User Question on Right - Shows first */}
                        {showUserQuestion && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                          >
                            <div className="flex items-start gap-4 justify-end">
                              <div className="max-w-2xl bg-[#40414F] rounded-lg border border-[#565869] px-4 py-3">
                                <div className="text-[#ECECF1] text-base">
                                  {question}
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-[#19C37D] flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-xs font-semibold">U</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Searching Animation - Shows immediately after user message, before answer */}
                        {showSearching && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8"
                          >
                            <div className="flex items-center gap-3">
                              <svg 
                                className="w-5 h-5 text-[#10A37F]" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                              </svg>
                              <span className="text-[#ECECF1]">Searching the web</span>
                              <div className="flex gap-1.5 items-center">
                                <motion.span
                                  animate={{ 
                                    opacity: [0.4, 1, 0.4],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    delay: 0,
                                    ease: "easeInOut"
                                  }}
                                  className="w-2 h-2 bg-[#10A37F] rounded-full"
                                />
                                <motion.span
                                  animate={{ 
                                    opacity: [0.4, 1, 0.4],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    delay: 0.3,
                                    ease: "easeInOut"
                                  }}
                                  className="w-2 h-2 bg-[#10A37F] rounded-full"
                                />
                                <motion.span
                                  animate={{ 
                                    opacity: [0.4, 1, 0.4],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    delay: 0.6,
                                    ease: "easeInOut"
                                  }}
                                  className="w-2 h-2 bg-[#10A37F] rounded-full"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Answer on Left - Shows below question after searching */}
                        {showAnswer && (
                          <div className="mb-8">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-[#AB68FF] flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <div className="flex-1 pt-1">
                                {/* Answer Text */}
                                <div className="text-[#ECECF1] text-base leading-relaxed whitespace-pre-wrap">
                                  {answerText}
                                  {answerText.length < fullAnswer.length && (
                                    <span className="inline-block w-0.5 h-4 bg-[#ECECF1] ml-1 animate-pulse"></span>
                                  )}
                                </div>

                                {/* Sources - Clickable */}
                                {showSources && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 pt-4 border-t border-[#565869] flex items-center gap-3 flex-wrap"
                                  >
                                    <span className="text-[#8E8EA0] text-sm">Sources:</span>
                                    <button
                                      onClick={handleLocationClick}
                                      className={`text-sm font-medium transition-colors ${
                                        hoverLocationLink 
                                          ? 'text-[#0D8A6A] underline' 
                                          : 'text-[#10A37F] hover:text-[#0D8A6A] hover:underline'
                                      }`}
                                    >
                                      Location.com
                                    </button>
                                    <span className="text-[#565869]">·</span>
                                    <button
                                      onClick={handleLocationClick}
                                      className="text-[#10A37F] hover:text-[#0D8A6A] text-sm font-medium hover:underline transition-colors"
                                    >
                                      Google
                                    </button>
                                    <span className="text-[#565869]">·</span>
                                    <button
                                      onClick={handleLocationClick}
                                      className="text-[#10A37F] hover:text-[#0D8A6A] text-sm font-medium hover:underline transition-colors"
                                    >
                                      Yelp
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Typing Bar at Bottom - Always visible */}
                        {showTypingBar && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-0 left-0 right-0 bg-[#343541] border-t border-[#565869]"
                            style={{ zIndex: 10 }}
                          >
                            <div className="max-w-5xl mx-auto px-6 py-4">
                              <div className="relative">
                                <div className="flex-1 bg-[#40414F] rounded-[30px] border border-[#565869] px-4 py-3 min-h-[48px] flex items-center pr-14">
                                  <div className="text-[#ECECF1] text-base flex-1">
                                    {inputText}
                                    {inputText.length < question.length && (
                                      <span className="inline-block w-0.5 h-4 bg-[#ECECF1] ml-1 animate-pulse"></span>
                                    )}
                                  </div>
                                  <motion.button
                                    disabled={!inputText || inputText.length === 0}
                                    className={`absolute right-2 w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                      inputText && inputText.length > 0
                                        ? 'bg-[#10A37F] hover:bg-[#0D8A6A] cursor-pointer'
                                        : 'bg-[#6B7280] cursor-not-allowed opacity-50'
                                    }`}
                                    animate={{
                                      scale: sendButtonClicked ? 0.9 : 1,
                                    }}
                                    transition={{ duration: 0.1 }}
                                  >
                                    <img 
                                      src="/images/demo/arrow.svg" 
                                      alt="Arrow" 
                                      className="w-4 h-4"
                                    />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

            {/* Browser: Location Page */}
            <AnimatePresence>
              {showLocationBrowser && (
                <motion.div
                  className="absolute bg-white rounded-xl overflow-hidden"
                  style={{
                    width: '1200px',
                    height: '700px',
                    left: '50%',
                    top: '50%',
                    boxShadow: DEMO_SHADOW,
                  }}
                  animate={browser1Controls}
                  initial={{
                    x: '-50%',
                    y: '-50%',
                    scale: 1,
                    opacity: 1,
                  }}
                >
                {/* Browser Topbar */}
                <div className="h-12 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
                  <div className="flex-1 h-8 bg-white border border-[#D0D0D0] rounded-md px-3 flex items-center mx-2">
                    <span className="text-sm text-[#333] font-mono">www.location.com/galaxy-grill</span>
                  </div>
                </div>

                {/* Browser Content */}
                <div 
                  ref={content1Ref}
                  className="relative w-full h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden bg-white"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <motion.div
                    className="w-full"
                    animate={content1Controls}
                    initial={{ scale: 1, x: 0 }}
                    style={{ transformOrigin: 'right center' }}
                  >
                    <AnimatePresence>
                      {showLocationImage && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: locationImageLoaded ? 1 : 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <SafeImage
                            src="/images/demo/location.png"
                            alt="Location Page"
                            className="w-full h-auto block"
                            onLoad={() => setLocationImageLoaded(true)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            {/* Browser: Google Search */}
            <AnimatePresence>
              {showGoogleBrowser && (
                <motion.div
                  className="absolute bg-white rounded-xl overflow-hidden"
                  style={{
                    width: '1200px',
                    height: '700px',
                    boxShadow: DEMO_SHADOW,
                  }}
                  animate={browser2Controls}
                  initial={{
                    left: '118%',
                    top: '50%',
                    x: '-50%',
                    y: '-45%',
                    scale: 0.75,
                    opacity: 0,
                  }}
                >
                {/* Browser Topbar */}
                <div className="h-12 bg-[#F5F5F5] border-b border-[#E0E0E0] flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42]"></div>
                  <div className="flex-1 h-8 bg-white border border-[#D0D0D0] rounded-md px-3 flex items-center mx-2">
                    <span className="text-sm text-[#333] font-mono">
                      {googleUrlText}
                      {googleUrlText.length < 'www.google.com/galaxy-grill'.length && (
                        <span className="w-0.5 h-4 bg-[#333] ml-1 animate-pulse"></span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Browser Content */}
                <div 
                  id="content2"
                  className="relative w-full h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden bg-white"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <AnimatePresence mode="wait">
                    {showGoogleImage && (
                      <motion.div
                        className="w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: googleImageLoaded ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <SafeImage
                          src="/images/demo/google.png"
                          alt="Google Search"
                          className="w-full h-auto block"
                          onLoad={() => setGoogleImageLoaded(true)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal Overlay */}
                <AnimatePresence>
                  {showModal && (
                    <motion.div
                      className="absolute bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        top: '48px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <motion.div
                        className="relative w-[90%] max-w-[500px] bg-[#2D2D2D] rounded-lg overflow-hidden shadow-2xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="p-6">
                          <h2 className="text-2xl font-semibold text-white mb-4">Hours</h2>
                          <div className="h-px bg-[#404040] mb-4"></div>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg text-white font-medium">Galaxy Grill</h3>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </div>
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Monday</span>
                              <span className="text-sm">11:00 AM – 10:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Tuesday</span>
                              <span className="text-sm">11:00 AM – 10:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm font-semibold">Wednesday</span>
                              <span className="text-sm font-semibold">10:57 AM – 6:52 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Thursday</span>
                              <span className="text-sm">11:00 AM – 10:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Friday</span>
                              <span className="text-sm">11:00 AM – 11:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Saturday</span>
                              <span className="text-sm">11:00 AM – 11:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span className="text-sm">Sunday</span>
                              <span className="text-sm">12:00 PM – 9:00 PM</span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-[#404040]">
                            <a href="#" className="text-blue-500 hover:text-blue-400 text-sm">
                              Suggest new hours
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
