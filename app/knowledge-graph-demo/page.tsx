'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function KnowledgeGraphDemoPage() {
  const [showModal, setShowModal] = useState(false)
  const [highlightWednesday, setHighlightWednesday] = useState(false)
  const [wednesdayEndTime, setWednesdayEndTime] = useState('6:52 PM')
  const [otherRowsOpacity, setOtherRowsOpacity] = useState(1)
  const [saveButtonState, setSaveButtonState] = useState<'idle' | 'clicked' | 'loading' | 'success'>('idle')
  const [showProgress, setShowProgress] = useState(false)
  const [node1State, setNode1State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const [node2State, setNode2State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const [node3State, setNode3State] = useState<'inactive' | 'loading' | 'complete'>('inactive')
  const [lineProgress, setLineProgress] = useState(0)
  const [modalExitX, setModalExitX] = useState('-50%') // Modal position
  const [fadeOut, setFadeOut] = useState(false)
  const [scale, setScale] = useState(1)
  const [nodesPosition, setNodesPosition] = useState({ x: 0 }) // For centering nodes after animation
  const [lineTravelProgress, setLineTravelProgress] = useState(0) // For traveling line effect
  const [lineStage, setLineStage] = useState<'container' | 'nodes'>('container') // Track which stage of line animation
  const [line1Progress, setLine1Progress] = useState(0) // Line from left to node 1
  const [line2Progress, setLine2Progress] = useState(0) // Line from node 1 to node 2
  const [line3Progress, setLine3Progress] = useState(0) // Line from node 2 to node 3
  const [line4Progress, setLine4Progress] = useState(0) // Line from node 3 to end
  const [showLabels, setShowLabels] = useState(true) // Control visibility of node labels
  const [showCards, setShowCards] = useState(false) // Control visibility of publisher cards
  const [cardsPosition, setCardsPosition] = useState({ x: 0 }) // Position of cards container
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
      setSaveButtonState('clicked')
      await sleep(120)
      setCursorClicking(false)
      setSaveButtonState('loading')
      await sleep(1200) // Spinner rotation
      setSaveButtonState('success')
      await sleep(500) // Show success state
      setShowCursor(false)

      // Beat D: Animated path extends from container's right edge, container moves with the line, nodes center
      await sleep(200)
      
      // Remove highlight and blur when starting the path animation (after Update is clicked)
      setHighlightWednesday(false)
      setOtherRowsOpacity(1)
      
      // Stage 1: Line extends LEFT TO RIGHT from container's right edge (no labels visible)
      setShowProgress(true)
      setShowLabels(false) // Hide labels during first line animation
      setLineStage('container')
      setLineProgress(1) // Start drawing path from container's right edge going LEFT TO RIGHT
      setLineTravelProgress(1) // Traveling effect - dot moves along the line
      await sleep(600) // Line extends left to right
      
      // Stage 2: Hide container, everything disappears
      setShowModal(false) // Hide the container/modal
      await sleep(300) // Fade out container
      
      // Stage 3: Show line on next frame - extends left to right to first node/circle
      setLineStage('nodes')
      setLine1Progress(0) // Reset line 1
      setLine2Progress(0) // Reset line 2
      setLine3Progress(0) // Reset line 3
      setLine4Progress(0) // Reset line 4
      setLineTravelProgress(0) // Reset traveling dot
      await sleep(100) // Small pause
      setShowLabels(true) // Show labels now
      
      // Center the nodes container (remove the 20% offset)
      setNodesPosition({ x: 0 }) // Move nodes to center (0% = centered)
      
      // Line 1: Extends from left (0) to Node 1 (750px)
      setLine1Progress(1) // Draw line from left edge to first node (dot moves automatically with line)
      await sleep(600) // Line extends from left to first node
      
      // Node 1: Start loading, then complete
      setNode1State('loading')
      await sleep(900) // Processing time
      setNode1State('complete')
      await sleep(300) // Hold completed state
      
      // Line 2: Extends from Node 1 (464px) to Node 2 (960px)
      setLine2Progress(1) // Draw line from node 1 to node 2 (dot moves automatically with line)
      await sleep(600) // Line extends to second node
      
      // Node 2: Start loading, then complete
      setNode2State('loading')
      await sleep(900) // Processing time (equal to node 1 and node 3)
      setNode2State('complete')
      await sleep(300) // Hold completed state
      
      // Line 3: Extends from Node 2 (960px) to Node 3 (1456px)
      setLine3Progress(1) // Draw line from node 2 to node 3 (dot moves automatically with line)
      await sleep(600) // Line extends to third node
      
      // Node 3: Start loading, then complete
      setNode3State('loading')
      await sleep(900) // Processing time (equal to node 1 and node 2)
      setNode3State('complete')
      await sleep(300) // Hold completed state
      
      // Line 4: Extends from Node 3 (1250px) to end of frame (1920px)
      setLine4Progress(1) // Draw line from node 3 to end (dot moves automatically with line)
      await sleep(600) // Line extends to end
      
      // Move everything out of frame
      setNodesPosition({ x: -150 }) // Move nodes container completely out of frame
      setShowProgress(false) // Hide progress stepper
      await sleep(600) // Animation duration
      
      // Show publisher cards (centered, no container)
      setShowCards(true)
      setCardsPosition({ x: 0 }) // Cards appear centered
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
                className="bg-white shadow-lg relative"
                style={{
                  width: '520px',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                    <span className="text-xl font-semibold text-gray-900">
                      Knowledge Graph
                    </span>
                    <span className="text-lg text-gray-400">|</span>
                    <span className="text-xl font-semibold text-gray-900">
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
                        <div className="w-20 text-sm font-medium text-gray-700">
                          {item.day}:
                        </div>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          {/* Start time pill */}
                          <motion.div
                            className="px-3 py-1.5 rounded-lg text-sm"
                            style={{
                              background: isWednesday && isEditingStartTime ? '#FFFFFF' : '#F3F4F6',
                              color: '#374151',
                              minWidth: '90px',
                              textAlign: 'center',
                              border: isWednesday && isEditingStartTime ? '2px solid #5A5BFF' : '2px solid transparent',
                              boxShadow: isWednesday && isEditingStartTime ? '0 0 0 3px rgba(90, 91, 255, 0.1)' : 'none',
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.start}
                          </motion.div>
                          <span className="text-sm text-gray-500">to</span>
                          {/* End time pill */}
                          <motion.div
                            className="px-3 py-1.5 rounded-lg text-sm relative"
                            style={{
                              background: (isWednesday && isEditingEndTime) ? '#FFFFFF' : '#F3F4F6',
                              color: '#374151',
                              border: (isWednesday && isEditingEndTime) ? '2px solid #5A5BFF' : '2px solid transparent',
                              boxShadow: (isWednesday && isEditingEndTime) ? '0 0 0 3px rgba(90, 91, 255, 0.1)' : 'none',
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
                      background: saveButtonState === 'success' ? '#198754' : '#5A5BFF',
                      width: '100px',
                      height: '40px',
                    }}
                    animate={saveButtonState === 'clicked' ? { scale: 0.98 } : { scale: 1 }}
                    transition={{ duration: 0.12 }}
                    disabled
                  >
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
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      'Update'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Stepper - Full width path from container to nodes */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              className="absolute"
              style={{
                left: 0,
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '100%',
              }}
              initial={{ opacity: 0, x: '20%' }} // Start offset to the right
              animate={{ 
                opacity: 1,
                x: `${nodesPosition.x}%`, // Center nodes after line extends
              }}
              transition={{
                opacity: { duration: 0.3 },
                x: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.8 } // Move to center after line extends
              }}
            >
              <div className="flex items-center justify-between relative" style={{ width: '100%', paddingLeft: '432px', paddingRight: '432px' }}>
                {/* Stage 1: Line extending LEFT TO RIGHT from container's right edge (no labels) */}
                {lineStage === 'container' && showModal && (
                  <svg
                    className="absolute top-6"
                    style={{ 
                      left: '40%', // Start position (user confirmed correct)
                      width: '60%', // Extend to rightmost corner of main container (100% - 40% = 60%)
                      height: '2px',
                      overflow: 'visible',
                      zIndex: 0, // Behind container
                    }}
                  >
                    <motion.line
                      x1="0"
                      y1="1"
                      x2="100%"
                      y2="1"
                      stroke="#5A5BFF"
                      strokeWidth="2"
                      strokeLinecap="butt"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: lineProgress }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </svg>
                )}
                
                {/* Stage 2: Multiple lines extending from left to nodes and end */}
                {lineStage === 'nodes' && (
                  <svg
                    className="absolute top-6"
                    viewBox="0 0 1920 2"
                    preserveAspectRatio="none"
                    style={{ 
                      left: 0, // Start from extreme left (0%)
                      width: '100%', // Full width to accommodate all nodes
                      height: '2px',
                      overflow: 'visible',
                    }}
                  >
                    {/* Line 1: From left (0) to Node 1 center (464px) */}
                    <motion.line
                      x1="0"
                      y1="1"
                      x2="630"
                      y2="1"
                      stroke="#5A5BFF"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: line1Progress }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                    
                    {/* Line 2: From Node 1 center (464px) to Node 2 center (960px) */}
                    <motion.line
                      x1="630"
                      y1="1"
                      x2="960"
                      y2="1"
                      stroke="#5A5BFF"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: line2Progress }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                    
                    {/* Line 3: From Node 2 center (960px) to Node 3 center (1456px) */}
                    <motion.line
                      x1="960"
                      y1="1"
                      x2="1250"
                      y2="1"
                      stroke="#5A5BFF"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: line3Progress }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                    
                    {/* Line 4: From Node 3 center (1456px) to end (1920px) */}
                    <motion.line
                      x1="1250"
                      y1="1"
                      x2="1920"
                      y2="1"
                      stroke="#5A5BFF"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: line4Progress }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </svg>
                )}

                {/* Node 1 */}
                {showLabels && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: '#5A5BFF',
                        opacity: node1State === 'complete' || node1State === 'loading' ? 1 : 0.85,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                    {node1State === 'loading' && (
                      <motion.svg
                        className="w-6 h-6"
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
                    )}
                    {node1State === 'complete' && (
                      <motion.svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                  {showLabels && (
                    <div className="mt-3 text-gray-700 text-center font-semibold" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                      <div>Connecting to</div>
                      <div>200+ Publishers</div>
                    </div>
                  )}
                  </div>
                )}

                {/* Node 2 */}
                {showLabels && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: '#5A5BFF',
                        opacity: node2State === 'complete' || node2State === 'loading' ? 1 : 0.85,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      {node2State === 'loading' && (
                        <motion.svg
                          className="w-6 h-6"
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
                      )}
                      {node2State === 'complete' && (
                        <motion.svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                    {showLabels && (
                      <div className="mt-3 text-gray-700 text-center font-semibold" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                        <div>Syncing</div>
                        <div>Data</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Node 3 */}
                {showLabels && (
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: '#5A5BFF',
                        opacity: node3State === 'complete' ? 1 : node3State === 'loading' ? 1 : 0.85,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      {node3State === 'loading' && (
                        <motion.svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
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
                      )}
                      {node3State === 'complete' && (
                        <motion.svg
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25 }}
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                    {showLabels && (
                      <div className="mt-3 text-gray-700 text-center font-semibold" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                        <div>Updating</div>
                        <div>Listings</div>
                      </div>
                    )}
                  </div>
                )}
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
              <div className="flex items-center justify-center gap-6">
                {/* Location.com Card */}
                <motion.img
                  src="/images/demo/container-location.com.svg"
                  alt="Location.com"
                  style={{ 
                    width: '380px', 
                    height: 'auto', 
                    display: 'block',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
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
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
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
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
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

