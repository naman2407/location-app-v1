'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const DEMO_SHADOW = '0 10px 24px rgba(15, 23, 42, 0.12)'
const DEMO_DROP_SHADOW = 'drop-shadow(0 10px 24px rgba(15, 23, 42, 0.12))'

export default function KnowledgeGraphDemoPage() {
  const [showModal, setShowModal] = useState(false)
  const [highlightWednesday, setHighlightWednesday] = useState(false)
  const [wednesdayEndTime, setWednesdayEndTime] = useState('6:52 PM')
  const [otherRowsOpacity, setOtherRowsOpacity] = useState(1)
  const [saveButtonState, setSaveButtonState] = useState<'idle' | 'clicked' | 'loading' | 'success'>('idle')
  const [saveRippleKey, setSaveRippleKey] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [node1State, setNode1State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const [node2State, setNode2State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const [node3State, setNode3State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const modalExitX = '-50%' // Modal position
  const [fadeOut, setFadeOut] = useState(false)
  const [scale, setScale] = useState(1)
  const [showCards, setShowCards] = useState(false) // Control visibility of publisher cards
  const [showCursor, setShowCursor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [cursorClicking, setCursorClicking] = useState(false)
  const [wednesdayStartTime, setWednesdayStartTime] = useState('10:57 AM')
  const [isEditingStartTime, setIsEditingStartTime] = useState(false)
  const [isEditingEndTime, setIsEditingEndTime] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Odometer-style animation helper
  const animateTime = async (setter: (val: string) => void, from: string, to: string, duration: number = 800) => {
    const fromParts = from.match(/(\d+):(\d+)\s*(AM|PM)/)
    const toParts = to.match(/(\d+):(\d+)\s*(AM|PM)/)

    if (!fromParts || !toParts) {
      setter(to)
      return
    }

    const fromHour = parseInt(fromParts[1])
    const fromMin = parseInt(fromParts[2])
    const fromPeriod = fromParts[3]
    const toHour = parseInt(toParts[1])
    const toMin = parseInt(toParts[2])
    const toPeriod = toParts[3]

    // Convert to 24-hour for easier calculation
    const fromHour24 = fromPeriod === 'PM' && fromHour !== 12 ? fromHour + 12 : fromPeriod === 'AM' && fromHour === 12 ? 0 : fromHour
    const toHour24 = toPeriod === 'PM' && toHour !== 12 ? toHour + 12 : toPeriod === 'AM' && toHour === 12 ? 0 : toHour

    const fromTotalMin = fromHour24 * 60 + fromMin
    const toTotalMin = toHour24 * 60 + toMin

    const steps = 20
    const stepDuration = duration / steps

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress

      const currentTotalMin = Math.round(fromTotalMin + (toTotalMin - fromTotalMin) * easeProgress)
      const currentHour24 = Math.floor(currentTotalMin / 60) % 24
      const currentMin = currentTotalMin % 60

      const currentHour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24
      const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM'

      const formattedTime = `${currentHour12}:${currentMin.toString().padStart(2, '0')} ${currentPeriod}`
      setter(formattedTime)
      await sleep(stepDuration)
    }
  }

  // Calculate scale based on viewport size
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const baseWidth = 1920
        const baseHeight = 1080
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Calculate scale to fit viewport while maintaining aspect ratio
        const scaleX = viewportWidth / baseWidth
        const scaleY = viewportHeight / baseHeight
        const newScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 1

        setScale(newScale)
      }
    }

    if (typeof window !== 'undefined') {
      calculateScale()
      window.addEventListener('resize', calculateScale)
      return () => window.removeEventListener('resize', calculateScale)
    }
  }, [])

  useEffect(() => {
    const runAnimation = async () => {
      // Start with 5 seconds of empty screen (just gradient)
      await sleep(5000)

      // Beat A: Modal enters (0s-1.2s)
      await sleep(100)
      setShowModal(true)
      await sleep(500) // Fade in + slide up
      await sleep(300) // Hold

      // Show cursor and move to Wednesday start time field
      setShowCursor(true)
      // Position cursor at Wednesday start time field
      // Modal is centered: left edge at (1920 - 520) / 2 = 700px = 36.46%
      // Day column: 80px = 4.17%, gap: 12px = 0.625%
      // Start time pill center is approximately 45px into the time container
      // Time container starts at: 36.46% + 4.17% + 0.625% = 41.25%
      // Start time center: 41.25% + (45/1920)*100 = 41.25% + 2.34% = 43.6%
      // Wednesday row: header ~90px, 2 rows ~100px, row spacing ~12px = ~202px from modal top
      // Modal top: (1080 - 450) / 2 = 315px = 29.17%
      // Wednesday row center: 29.17% + (202/1080)*100 + (40/1080)*100 = 29.17% + 18.7% + 3.7% = 51.6%
      setCursorPosition({ x: 52, y: 45.5 })
      await sleep(500) // Cursor animation

      // First click - activate edit mode for start time only and blur other rows
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)
      setIsEditingStartTime(true)
      setHighlightWednesday(true) // Highlight Wednesday row (white background) and blur others
      await sleep(250) // Highlight animation
      setOtherRowsOpacity(0.4) // Blur other rows
      await sleep(50)
      await sleep(300) // Show edit mode

      // Second click - start odometer animation (keep edit mode active during animation)
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)

      // Animate start time from 10:57 AM to 11:00 AM (keep edit mode during animation)
      await animateTime(setWednesdayStartTime, '10:57 AM', '11:00 AM', 600)
      // Remove edit mode but keep highlight and blur active for smooth transition to end time
      setIsEditingStartTime(false)
      // Keep highlightWednesday and otherRowsOpacity active - Wednesday should stay highlighted
      // highlightWednesday and otherRowsOpacity remain true/0.4 from initial click
      await sleep(200)

      // Move cursor to end time field
      // End time field: start time ends ~90px, "to" ~20px, gap ~8px, end time center ~45px
      // From start time center (43.6%): + (90/1920)*100 + (20/1920)*100 + (8/1920)*100 + (45/1920)*100
      // = 43.6% + 4.69% + 1.04% + 0.42% + 2.34% = 52.1%
      setCursorPosition({ x: 60, y: 45.5 })
      await sleep(500)

      // First click - activate edit mode
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)
      setIsEditingEndTime(true)
      setHighlightWednesday(true)
      await sleep(250) // Highlight animation
      setOtherRowsOpacity(0.4)
      await sleep(50)
      await sleep(300) // Show edit mode

      // Second click - start odometer animation (keep edit mode active during animation)
      setCursorClicking(true)
      await sleep(150)
      setCursorClicking(false)
      await sleep(100)

      // Animate end time from 6:52 PM to 10:00 PM (keep edit mode during animation)
      await animateTime(setWednesdayEndTime, '6:52 PM', '10:00 PM', 600)
      // Remove edit mode but keep highlight and blur active until Update is clicked
      setIsEditingEndTime(false)
      // Keep highlightWednesday and otherRowsOpacity active - Wednesday should stay highlighted
      // highlightWednesday and otherRowsOpacity remain true/0.4
      await sleep(700) // Hold with Wednesday highlighted and others blurred before clicking update

      // Move cursor to Save button
      // Save button: modal right edge - 20px margin - button center offset
      // Modal right: 36.46% + 27.08% = 63.54%
      // Button center from right: ~50px, so: 63.54% - (50/1920)*100 = 63.54% - 2.6% = 60.9%
      // Vertical: modal top (29.17%) + modal height (450px = 41.67%) - button center (~20px = 1.85%) = 29.17% + 41.67% - 1.85% = 69%
      setCursorPosition({ x: 61, y: 69 })
      await sleep(500)

      // Beat C: Update click + loading (3.2s-5.2s)
      setCursorClicking(true)
      setSaveRippleKey(prev => prev + 1)
      setSaveButtonState('clicked')
      await sleep(120)
      setCursorClicking(false)
      setSaveButtonState('loading')
      await sleep(1200) // Spinner rotation
      setSaveButtonState('success')
      await sleep(500) // Show success state
      setShowCursor(false)

      // Beat D: Replace node/line stepper with 3 loader cards
      await sleep(200)
      setHighlightWednesday(false)
      setOtherRowsOpacity(1)
      setShowModal(false)
      await sleep(300)

      setShowProgress(true)
      setNode1State('loading')
      setNode2State('inactive')
      setNode3State('inactive')
      await sleep(1900)
      setNode1State('complete')
      await sleep(250)

      setNode2State('loading')
      await sleep(1900)
      setNode2State('complete')
      await sleep(250)

      setNode3State('loading')
      await sleep(1900)
      setNode3State('complete')
      await sleep(450)

      setShowProgress(false)
      await sleep(300)

      // Show publisher cards (centered, no container)
      setShowCards(true)
      await sleep(10000) // Show cards for 10 seconds

      // Fade out everything
      setFadeOut(true)
      await sleep(600)
    }

    runAnimation()
  }, [])

  const days = [
    { day: 'Monday', start: '11:00 AM', end: '10:00 PM' },
    { day: 'Tuesday', start: '11:00 AM', end: '10:00 PM' },
    { day: 'Wednesday', start: wednesdayStartTime, end: wednesdayEndTime },
    { day: 'Thursday', start: '11:00 AM', end: '10:00 PM' },
    { day: 'Friday', start: '11:00 AM', end: '11:00 PM' },
    { day: 'Saturday', start: '11:00 AM', end: '11:00 PM' },
    { day: 'Sunday', start: '12:00 PM', end: '9:00 PM' },
  ]

  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #FFFFFF 0%, #F7F9FE 100%)',
        width: '100vw',
        height: '100vh',
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
        {/* Fixed artboard container */}
        <div
          className="relative"
          style={{
            width: '1920px',
            height: '1080px',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.6s ease-out',
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
              initial={{ opacity: 0 }}
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

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                zIndex: 10, // Above the line
              }}
              initial={{ opacity: 0, x: '-50%', y: 'calc(-50% + 12px)' }}
              animate={{
                opacity: 1, // Container stays visible
                x: modalExitX,
                y: '-50%',
                transition: {
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1] // Match line animation timing so container moves with the line
                }
              }}
              exit={{
                opacity: 0,
                x: '-200%',
                y: '-50%',
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }
              }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
            >
              <div
                className="bg-white relative"
                style={{
                  width: '520px',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: DEMO_SHADOW,
                }}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/demo/kg.svg"
                      alt="KG"
                      className="w-6 h-6"
                    />
                    <span className="text-xl font-semibold" style={{ color: '#101827' }}>
                      Knowledge Graph
                    </span>
                    <span className="text-lg" style={{ color: '#101827' }}>|</span>
                    <span className="text-xl font-semibold" style={{ color: '#101827' }}>
                      Business Hours
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-3 mb-6">
                  {days.map((item) => {
                    const isWednesday = item.day === 'Wednesday'
                    const isEditing = isWednesday && (isEditingStartTime || isEditingEndTime)
                    // Wednesday should stay highlighted when highlightWednesday is true OR when editing
                    const isWednesdayHighlighted = isWednesday && (highlightWednesday || isEditing)

                    return (
                      <motion.div
                        key={item.day}
                        className="flex items-center gap-3"
                        style={{
                          opacity: isWednesdayHighlighted ? 1 : otherRowsOpacity, // Wednesday always in focus when highlighted or editing, others blurred
                        }}
                      >
                        <div className="w-20 text-sm font-medium" style={{ color: '#101827' }}>
                          {item.day}:
                        </div>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          {/* Start time pill */}
                          <motion.div
                            className="px-3 py-1.5 rounded-lg text-sm"
                            style={{
                              background: isWednesday && isEditingStartTime ? '#FFFFFF' : '#F3F4F6',
                              color: '#101827',
                              minWidth: '90px',
                              textAlign: 'center',
                              border: isWednesday && isEditingStartTime ? '2px solid #5A58F2' : '2px solid transparent',
                              boxShadow: isWednesday && isEditingStartTime ? '0 0 0 3px rgba(90, 88, 242, 0.1)' : 'none',
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.start}
                          </motion.div>
                          <span className="text-sm" style={{ color: '#101827' }}>to</span>
                          {/* End time pill */}
                          <motion.div
                            className="px-3 py-1.5 rounded-lg text-sm relative"
                            style={{
                              background: (isWednesday && isEditingEndTime) ? '#FFFFFF' : '#F3F4F6',
                              color: '#101827',
                              border: (isWednesday && isEditingEndTime) ? '2px solid #5A58F2' : '2px solid transparent',
                              boxShadow: (isWednesday && isEditingEndTime) ? '0 0 0 3px rgba(90, 88, 242, 0.1)' : 'none',
                              minWidth: '90px',
                              textAlign: 'center',
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.end}
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <motion.button
                    className="px-6 py-2.5 rounded-full text-white font-medium text-base flex items-center justify-center gap-2"
                    style={{
                      background: saveButtonState === 'success' ? '#198754' : '#5A58F2',
                      width: '100px',
                      height: '40px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    animate={saveButtonState === 'clicked' ? { scale: 0.98 } : { scale: 1 }}
                    transition={{ duration: 0.12 }}
                    disabled
                  >
                    {saveButtonState !== 'loading' && saveButtonState !== 'success' && (
                      <AnimatePresence>
                        <motion.span
                          key={saveRippleKey}
                          className="absolute pointer-events-none"
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 5, opacity: [0.5, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </AnimatePresence>
                    )}
                    {saveButtonState === 'loading' ? (
                      <motion.svg
                        className="w-4 h-4"
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
                    ) : saveButtonState === 'success' ? (
                      <motion.svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <motion.path
                          d="M6 12L10 16L18 8"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </motion.svg>
                    ) : (
                      'Update'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-step Loader Cards */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 'min(92vw, 600px)',
                  height: 430,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                }}
              >
                <motion.div
                  animate={{
                    y:
                      node3State !== 'inactive'
                        ? -(2 * (112 + 22)) + (1 * (112 + 22))
                        : node2State !== 'inactive'
                          ? -(1 * (112 + 22)) + (1 * (112 + 22))
                          : 1 * (112 + 22),
                  }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22 }}
                >
                  {[
                    { key: 'n1', state: node1State, label: 'Connecting to 200+ Publishers' },
                    { key: 'n2', state: node2State, label: 'Syncing Data' },
                    { key: 'n3', state: node3State, label: 'Updating Listings' },
                  ].map((item, idx) => {
                    const activeIdx = node3State !== 'inactive' ? 2 : node2State !== 'inactive' ? 1 : 0
                    const distance = Math.abs(idx - activeIdx)
                    const opacity = Math.max(1 - distance * 0.28, 0.22)

                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        style={{
                          width: '100%',
                          height: 112,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '20px 24px',
                          borderRadius: 14,
                          border: '1px solid rgba(107, 114, 128, 0.35)',
                          background: 'rgba(255, 255, 255, 0.82)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          color: '#101827',
                          fontSize: 18,
                          lineHeight: 1.2,
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: '50%',
                            background: 'rgba(88, 88, 242, 0.95)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            opacity: item.state === 'inactive' ? 0.75 : item.state === 'complete' ? 0.88 : 1,
                          }}
                        >
                          <span style={{ width: 24, height: 24, position: 'relative', display: 'inline-block' }}>
                            <motion.div
                              style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
                              animate={{ opacity: item.state === 'complete' ? 0 : 1 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              <motion.div
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  border: '2.8px solid rgba(255,255,255,0.35)',
                                  borderTopColor: '#FFFFFF',
                                  borderRightColor: '#FFFFFF',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              />
                            </motion.div>
                            <motion.svg
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                              initial={false}
                              animate={{ opacity: item.state === 'complete' ? 1 : 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              <motion.path
                                d="M6 12L10 16L18 8"
                                stroke="#FFFFFF"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={false}
                                animate={{ pathLength: item.state === 'complete' ? 1 : 0 }}
                                transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
                              />
                            </motion.svg>
                          </span>
                        </span>
                        <span>{item.label}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Publisher Cards - Centered, no container */}
        <AnimatePresence>
          {showCards && (
            <motion.div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.5 }
              }}
            >
              <div className="flex items-center justify-center gap-10">
                {/* Location.com Card */}
                <motion.img
                  src="/images/demo/container-location.com.svg"
                  alt="Location.com"
                  style={{
                    width: '380px',
                    height: 'auto',
                    display: 'block',
                    filter: DEMO_DROP_SHADOW,
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Google Card */}
                <motion.img
                  src="/images/demo/container-google.svg"
                  alt="Google"
                  style={{
                    width: '380px',
                    height: 'auto',
                    display: 'block',
                    filter: DEMO_DROP_SHADOW,
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Yelp Card */}
                <motion.img
                  src="/images/demo/container-yelp.svg"
                  alt="Yelp"
                  style={{
                    width: '380px',
                    height: 'auto',
                    display: 'block',
                    filter: DEMO_DROP_SHADOW,
                  }}
                  initial={{ opacity: 0, scale: 0.6, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
