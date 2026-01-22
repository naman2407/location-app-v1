'use client'

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

interface ClaimedTooltipProps {
  children: React.ReactNode
  tooltipText: string
}

type Placement = 'top' | 'right' | 'bottom' | 'left'

export function ClaimedTooltip({ children, tooltipText }: ClaimedTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'top' as Placement })
  const [isMounted, setIsMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !isMounted) return

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!triggerRef.current) return

      // Use getBoundingClientRect() which returns viewport coordinates
      // Since tooltip uses position: fixed, we use viewport coordinates directly (no scroll offsets)
      const rect = triggerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Approximate tooltip dimensions
      const tooltipWidth = 280 // max-w-[280px]
      const tooltipHeight = 60 // approximate height
      const offset = 8 // 8px distance requirement
      
      // Calculate available space in each direction
      const spaceAbove = rect.top
      const spaceBelow = viewportHeight - rect.bottom
      const spaceLeft = rect.left
      const spaceRight = viewportWidth - rect.right
      
      // Check each direction and pick the best one
      // Use viewport coordinates directly (no scroll offsets) since tooltip is position: fixed
      const placements = [
        {
          dir: 'top' as Placement,
          space: spaceAbove,
          top: rect.top - offset, // 8px above the icon (viewport coordinate)
          left: rect.left + rect.width / 2, // Centered horizontally (viewport coordinate)
        },
        {
          dir: 'bottom' as Placement,
          space: spaceBelow,
          top: rect.bottom + offset, // 8px below the icon (viewport coordinate)
          left: rect.left + rect.width / 2, // Centered horizontally (viewport coordinate)
        },
        {
          dir: 'right' as Placement,
          space: spaceRight,
          top: rect.top + rect.height / 2, // Centered vertically (viewport coordinate)
          left: rect.right + offset, // 8px to the right of the icon (viewport coordinate)
        },
        {
          dir: 'left' as Placement,
          space: spaceLeft,
          top: rect.top + rect.height / 2, // Centered vertically (viewport coordinate)
          left: rect.left - offset, // 8px to the left of the icon (viewport coordinate)
        },
      ]
      
      // Sort by available space and pick the best
      const bestPlacement = placements
        .filter(p => {
          if (p.dir === 'top' || p.dir === 'bottom') {
            return p.space >= tooltipHeight + offset
          } else {
            return p.space >= tooltipWidth + offset
          }
        })
        .sort((a, b) => b.space - a.space)[0] || placements[0]
      
      setTooltipPosition({
        top: bestPlacement.top,
        left: bestPlacement.left,
        placement: bestPlacement.dir,
      })
    })
  }, [isMounted])

  // Use useLayoutEffect + double rAF to ensure correct positioning after layout
  useLayoutEffect(() => {
    if (isHovered && triggerRef.current) {
      // First rAF: wait for layout
      requestAnimationFrame(() => {
        // Second rAF: ensure fonts/images are loaded and layout is stable
        requestAnimationFrame(() => {
          calculatePosition()
        })
      })
    } else {
      // Cancel animation frame when not hovered
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isHovered, calculatePosition])

  // Set up ResizeObserver and scroll listeners
  useEffect(() => {
    if (isHovered && triggerRef.current) {
      // Recalculate on scroll and resize
      const handleScroll = () => {
        if (triggerRef.current) {
          calculatePosition()
        }
      }
      const handleResize = () => {
        if (triggerRef.current) {
          calculatePosition()
        }
      }
      
      // Listen to window scroll and resize
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      // Use ResizeObserver to detect layout changes
      if (typeof ResizeObserver !== 'undefined' && triggerRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          if (triggerRef.current) {
            calculatePosition()
          }
        })
        
        resizeObserverRef.current.observe(triggerRef.current)
      }
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect()
          resizeObserverRef.current = null
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }
  }, [isHovered, calculatePosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  if (!isMounted) {
    return <div ref={triggerRef}>{children}</div>
  }

  const getArrowStyle = (placement: Placement) => {
    const baseStyle = {
      width: 0,
      height: 0,
    }
    
    switch (placement) {
      case 'top':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #1C1D20',
        }
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid #1C1D20',
        }
      case 'right':
        return {
          ...baseStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '6px solid #1C1D20',
        }
      case 'left':
        return {
          ...baseStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '6px solid #1C1D20',
        }
    }
  }

  const getTransform = (placement: Placement) => {
    switch (placement) {
      case 'top':
        return 'translate(-50%, -100%)'
      case 'bottom':
        return 'translate(-50%, 0)'
      case 'right':
        return 'translate(0, -50%)'
      case 'left':
        return 'translate(-100%, -50%)'
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>
      {isHovered &&
        createPortal(
          <div
            ref={tooltipRef}
            className="claimed-tooltip-portal"
            style={{
              position: 'fixed',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: getTransform(tooltipPosition.placement),
              zIndex: 9990,
              pointerEvents: 'none',
            }}
          >
            <div className="bg-[#1C1D20] text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-[280px] whitespace-normal break-words">
              {tooltipText}
            </div>
            <div
              className="absolute"
              style={getArrowStyle(tooltipPosition.placement)}
            />
          </div>,
          document.body
        )}
    </>
  )
}
