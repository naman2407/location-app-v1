'use client'

import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const SEARCH_DURATION = 3600
export const CTA_ONLY_DURATION = 2000
export const SEARCH_EMPTY_DELAY = 5000
export const GRID_DURATION = 10000
export const STACK_HOLD = 8200
export const FADE_OUT_DURATION = 700
const LOADER_TICK_MS = 1300
const LOADER_MAX_VISIBLE = 3
const LOADER_DONE_HOLD_MS = 1500
const LOADER_STEPS = [
  'Searching the web',
  'Gathering Information',
  'Comparing Sources',
  'Checking for Consistency',
]
const SEARCH_QUERY = 'What time does Galaxy Grill on 8th ave in NYC close on Wednesday?'

type Phase = 'search' | 'loading' | 'grid' | 'stack' | 'end'

type CardData = {
  id: string
  title?: string
  verified: boolean
  logoColor: string
  iconSrc?: string
}

type LoaderStep = { id: string; label: string }

const CARDS: CardData[] = [
  { id: 'u-1', verified: false, logoColor: '#F59E0B' },
  { id: 'location', title: 'Location.com', verified: true, logoColor: '#8B5CF6', iconSrc: '/images/demo/location.svg' },
  { id: 'u-2', verified: false, logoColor: '#64748B' },
  { id: 'u-3', verified: false, logoColor: '#F87171' },
  { id: 'google', title: 'Google', verified: true, logoColor: '#60A5FA', iconSrc: '/images/demo/google.svg' },
  { id: 'u-4', verified: false, logoColor: '#22C55E' },
  { id: 'u-5', verified: false, logoColor: '#A855F7' },
  { id: 'yelp', title: 'Yelp', verified: true, logoColor: '#F97316', iconSrc: '/images/demo/yelp.svg' },
  { id: 'u-6', verified: false, logoColor: '#06B6D4' },
  { id: 'publisher-central', title: 'Publisher Central', verified: true, logoColor: '#0EA5A4' },
  { id: 'u-7', verified: false, logoColor: '#EC4899' },
  { id: 'u-8', verified: false, logoColor: '#84CC16' },
  { id: 'maps-index', title: 'Maps Index', verified: true, logoColor: '#14B8A6' },
  { id: 'u-9', verified: false, logoColor: '#EAB308' },
  { id: 'u-10', verified: false, logoColor: '#4F46E5' },
  { id: 'u-11', verified: false, logoColor: '#10B981' },
  { id: 'u-12', verified: false, logoColor: '#F43F5E' },
  { id: 'u-13', verified: false, logoColor: '#0284C7' },
  { id: 'u-14', verified: false, logoColor: '#65A30D' },
  { id: 'u-15', verified: false, logoColor: '#D946EF' },
]

const transitions = {
  spring: { type: 'spring' as const, stiffness: 260, damping: 24 },
}

function SearchLanding({
  sending,
}: {
  sending: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; r: number; color: string }>>([])
  const rafRef = useRef<number | null>(null)
  const [dissolving, setDissolving] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!sending || startedRef.current) return

    const canvas = canvasRef.current
    const wrap = inputWrapRef.current
    if (!canvas) return
    if (!wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = Math.max(300, Math.floor(wrap.clientWidth))
    const height = Math.max(40, Math.floor(wrap.clientHeight))
    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#101827'
    ctx.font = '400 16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(SEARCH_QUERY, 24, height / 2)

    const image = ctx.getImageData(0, 0, width, height)
    const data = image.data
    const particles: Array<{ x: number; y: number; r: number; color: string }> = []

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4
        const a = data[i + 3]
        if (a > 0) {
          particles.push({
            x,
            y,
            r: 1.2,
            color: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${a / 255})`,
          })
        }
      }
    }
    if (particles.length === 0) return

    startedRef.current = true
    particlesRef.current = particles
    setDissolving(true)

    const maxX = particles.reduce((prev, cur) => (cur.x > prev ? cur.x : prev), 0)

    const animateFrame = (cutoff: number) => {
      rafRef.current = requestAnimationFrame(() => {
        const next: Array<{ x: number; y: number; r: number; color: string }> = []
        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < particlesRef.current.length; i += 1) {
          const p = particlesRef.current[i]
          if (p.x < cutoff) {
            next.push(p)
            continue
          }

          if (p.r <= 0) continue
          p.x += Math.random() > 0.5 ? 1 : -1
          p.y += Math.random() > 0.5 ? 1 : -1
          p.r -= 0.05 * Math.random()
          if (p.r > 0) next.push(p)
        }

        particlesRef.current = next
        particlesRef.current.forEach(p => {
          if (p.x > cutoff) {
            ctx.beginPath()
            ctx.rect(p.x, p.y, p.r, p.r)
            ctx.fillStyle = p.color
            ctx.fill()
          }
        })

        if (particlesRef.current.length > 0) {
          animateFrame(cutoff - 9)
        }
      })
    }

    animateFrame(maxX)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [sending])

  useEffect(() => {
    if (!sending) {
      startedRef.current = false
      setDissolving(false)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [sending])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        width: 'min(92vw, 980px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 75,
        position: 'relative',
      }}
    >
      <div
        style={{
          color: '#5A58F2',
          fontSize: 48,
          lineHeight: 1.05,
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: -0.8,
        }}
      >
        Ask AI Search Anything
      </div>
      <div
        ref={inputWrapRef}
        style={{
          width: '100%',
          height: 62,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 56px 12px 16px',
          borderRadius: 30,
          background: '#FFFFFF',
          border: '1px solid #D1D5DB',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: dissolving ? 1 : 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <motion.span
          style={{
            color: '#101827',
            fontSize: 16,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
          }}
          animate={sending ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {SEARCH_QUERY}
        </motion.span>
        <motion.button
          disabled={sending}
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: '#5A58F2',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            opacity: sending ? 0.9 : 1,
            right: 8,
            top: 12,
            position: 'absolute',
          }}
          animate={{ scale: sending ? [0.92, 1] : 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], times: [0, 1] }}
        >
          <img
            src="/images/demo/arrow.svg"
            alt="Arrow"
            style={{ width: 16, height: 16 }}
          />
        </motion.button>
      </div>
    </motion.div>
  )
}

function UltraModernStagedLoader({ onComplete }: { onComplete?: () => void }) {
  const steps: LoaderStep[] = LOADER_STEPS.map((label, i) => ({ id: `step-${i}`, label }))
  const [activeIndex, setActiveIndex] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const [stepMode, setStepMode] = useState<'processing' | 'doneHold'>('processing')
  const CARD_HEIGHT = 112
  const CARD_GAP = 22
  const ROW_PITCH = CARD_HEIGHT + CARD_GAP
  const CENTER_SLOT = 1

  useEffect(() => {
    if (allDone) {
      const doneTimer = window.setTimeout(() => onComplete?.(), 1500)
      return () => window.clearTimeout(doneTimer)
    }

    const timer = window.setTimeout(() => {
      if (stepMode === 'processing') {
        setStepMode('doneHold')
        return
      }

      setActiveIndex(prev => {
        if (prev >= steps.length - 1) {
          setAllDone(true)
          return prev
        }
        return prev + 1
      })
      setStepMode('processing')
    }, stepMode === 'processing' ? LOADER_TICK_MS : LOADER_DONE_HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [activeIndex, allDone, onComplete, stepMode, steps.length])

  const start = Math.max(0, Math.min(activeIndex - 1, steps.length - LOADER_MAX_VISIBLE))
  const offsetY = -(activeIndex * ROW_PITCH) + CENTER_SLOT * ROW_PITCH

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
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
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <motion.div
        animate={{ y: offsetY }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: CARD_GAP }}
      >
        {steps.map((step, idx) => {
          const status: 'pending' | 'active' | 'done' = allDone
            ? 'done'
            : idx < activeIndex
              ? 'done'
              : idx === activeIndex && stepMode === 'processing'
                ? 'active'
                : idx === activeIndex && stepMode === 'doneHold'
                  ? 'done'
                  : 'pending'
          const distance = Math.abs(idx - activeIndex)
          const opacity = allDone ? 1 : Math.max(1 - distance * 0.22, 0.18)

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.24, ease: 'easeOut' },
              }}
              style={{
                width: '100%',
                height: CARD_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '20px 24px',
                borderRadius: 14,
                border: '1px solid rgba(107, 114, 128, 0.35)',
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: 'none',
                transform: 'translateY(0) scale(1)',
                color: '#101827',
                fontSize: 18,
                lineHeight: 1.2,
                fontWeight: 500,
                opacity,
                position: 'relative',
                cursor: 'default',
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
                  opacity: status === 'pending' ? 0.75 : status === 'done' ? 0.88 : 1,
                }}
              >
                <span style={{ width: 24, height: 24, position: 'relative', display: 'inline-block' }}>
                  <motion.div
                    style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
                    animate={{ opacity: status === 'done' ? 0 : 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <motion.div
                      style={{
                        width: 24,
                        height: 24,
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
                    animate={{ opacity: status === 'done' ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <motion.path
                      d="M5.5 12.5L10 17L18.5 8.5"
                      stroke="#ffffff"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: status === 'done' ? 1 : 0 }}
                      transition={{ duration: 0.34, ease: 'easeOut' }}
                    />
                  </motion.svg>
                </span>
              </span>
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

function SourceCard({
  card,
  showVerifiedOnly,
  order,
  checked,
}: {
  card: CardData
  showVerifiedOnly: boolean
  order: number
  checked: boolean
}) {
  const maskedTitle = !card.title || card.id === 'maps-index' || card.id === 'publisher-central'

  return (
    <motion.div
      layout
      transition={transitions.spring}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.45, ease: 'easeInOut' },
      }}
      style={{
        borderRadius: 10,
        border: '1px solid rgba(148, 163, 184, 0.45)',
        background: '#ffffff',
        padding: '14px 14px 12px',
        minHeight: 108,
        position: 'relative',
        zIndex: 1,
        width: '100%',
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      {card.verified && !showVerifiedOnly && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            padding: 1,
            background:
              'linear-gradient(90deg, rgba(90,88,242,0) 0%, rgba(90,88,242,0) 28%, rgba(90,88,242,1) 50%, rgba(90,88,242,0) 72%, rgba(90,88,242,0) 100%)',
            backgroundSize: '280% 100%',
            pointerEvents: 'none',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            opacity: showVerifiedOnly ? 1 : 0.96,
          }}
          initial={{ backgroundPosition: `${-180 + (order * 13) % 90}% 0%` }}
          animate={{ backgroundPosition: `${220 + (order * 13) % 90}% 0%` }}
          transition={{ duration: 3.6, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 6 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, marginTop: 4 }}>
        <motion.span
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1,
            borderStyle: 'solid',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          animate={{
            backgroundColor: checked ? '#5A58F2' : '#FFFFFF',
            borderColor: checked ? '#5A58F2' : 'rgba(148, 163, 184, 0.7)',
            scale: checked ? 1.02 : 1,
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg viewBox="0 0 24 24" fill="none" width="12" height="12" initial={false} animate={{ opacity: checked ? 1 : 0 }}>
            <motion.path
              d="M5.5 12.5L10 17L18.5 8.5"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.svg>
        </motion.span>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            background: card.iconSrc && card.id !== 'location' ? '#FFFFFF' : card.logoColor,
            border: card.iconSrc && card.id !== 'location' ? '1px solid rgba(148, 163, 184, 0.5)' : '1px solid transparent',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            opacity: 0.95,
          }}
        >
          {card.iconSrc && (
            <img
              src={card.iconSrc}
              alt=""
              aria-hidden
              style={{ width: card.id === 'location' ? 24 : 13, height: card.id === 'location' ? 24 : 13, display: 'block' }}
            />
          )}
        </div>
        {!maskedTitle ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div
              style={{
              fontSize: 16,
              fontWeight: 500,
              color: '#101827',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.title}
            </div>
            {card.verified && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#198754',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="10" height="10">
                  <path d="M5.5 12.5L10 17L18.5 8.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 12, borderRadius: 5, background: '#E5E7EB', width: 98 }} />
            {card.verified && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#198754',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="10" height="10">
                  <path d="M5.5 12.5L10 17L18.5 8.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 6, marginLeft: 30 }}>
        <div style={{ height: 10, borderRadius: 5, background: '#E5E7EB', width: '82%' }} />
      </div>
      </div>
    </motion.div>
  )
}

function SelectionHeader({ done }: { done: boolean }) {
  const words = ['multiple sources', 'verified data', 'trusted signals', 'consistent information']
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length)
    }, 1800)
    return () => window.clearInterval(id)
  }, [done, words.length])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 64,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          lineHeight: 1,
          fontWeight: 600,
          letterSpacing: -0.8,
          color: '#101827',
          textAlign: 'center',
          gap: 12,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="done-heading"
              initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: '#5A58F2',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M6 12L10 16L18 8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                </svg>
              </motion.span>
              <span>5 Verified Sources Selected</span>
            </motion.span>
          ) : (
            <motion.span
              key="flip-heading"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}
            >
              <span>AI answers are built from</span>
              <span
                style={{
                  height: 72,
                  borderRadius: 12,
                  border: '1px solid rgba(90, 88, 242, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px 20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  overflow: 'hidden',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  width: 560,
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={wordIndex}
                    initial={{ y: -34, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 34, opacity: 0 }}
                    transition={{ duration: 0.42, ease: 'easeOut' }}
                    style={{ whiteSpace: 'nowrap', display: 'inline-block', width: '100%', textAlign: 'left' }}
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function CardsGrid({
  cards,
  phase,
  selectedVerifiedCount,
}: {
  cards: CardData[]
  phase: Phase
  selectedVerifiedCount: number
}) {
  const showVerifiedOnly = phase === 'stack' || phase === 'end'
  const visibleCards = showVerifiedOnly ? cards.filter(card => card.verified) : cards
  const verifiedOrder = cards.filter(card => card.verified).reduce<Record<string, number>>((acc, card, idx) => {
    acc[card.id] = idx
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'end' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase === 'end' ? FADE_OUT_DURATION / 1000 : 0.45, ease: 'easeOut' }}
      style={{
        width: 'min(95vw, 1540px)',
        minHeight: 680,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 150,
      }}
    >
      <SelectionHeader done={showVerifiedOnly} />

      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 140, damping: 24, mass: 0.9 }}
        style={{
          width: '100%',
          display: 'grid',
          gap: 20,
          gridTemplateColumns: showVerifiedOnly
            ? 'repeat(5, minmax(240px, 1fr))'
            : 'repeat(5, minmax(240px, 1fr))',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="sync">
          {visibleCards.map((card, idx) => (
            <SourceCard
              key={card.id}
              card={card}
              showVerifiedOnly={showVerifiedOnly}
              order={idx}
              checked={
                card.verified &&
                (showVerifiedOnly || (verifiedOrder[card.id] !== undefined && verifiedOrder[card.id] < selectedVerifiedCount))
              }
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function HoursDemoAISearchAnimation() {
  const [phase, setPhase] = useState<Phase>('search')
  const [showSearchCTA, setShowSearchCTA] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedVerifiedCount, setSelectedVerifiedCount] = useState(0)
  const [showCursor, setShowCursor] = useState(false)
  const [cursorClicking, setCursorClicking] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 16, y: 18 })
  const [scale, setScale] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<number[]>([])
  const pulseIntervalRef = useRef<number | null>(null)

  const clearAllTimers = () => {
    timelineRef.current.forEach(timer => window.clearTimeout(timer))
    timelineRef.current = []

    if (pulseIntervalRef.current) {
      window.clearInterval(pulseIntervalRef.current)
      pulseIntervalRef.current = null
    }
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timelineRef.current.push(id)
  }

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return
      const baseWidth = 1920
      const baseHeight = 1080
      const scaleX = window.innerWidth / baseWidth
      const scaleY = window.innerHeight / baseHeight
      setScale(Math.min(scaleX, scaleY, 1))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  useEffect(() => {
    clearAllTimers()

    if (phase === 'search') {
      setSelectedVerifiedCount(0)
      setShowSearchCTA(false)
      setShowCursor(false)
      setCursorClicking(false)
      setCursorPosition({ x: 16, y: 18 })
      schedule(() => setShowSearchCTA(true), SEARCH_EMPTY_DELAY)
      schedule(() => setShowCursor(true), SEARCH_EMPTY_DELAY + CTA_ONLY_DURATION)
      // Move to scene-1 input send button (right side)
      schedule(() => setCursorPosition({ x: 82, y: 55 }), SEARCH_EMPTY_DELAY + CTA_ONLY_DURATION + 180)
      schedule(() => {
        setCursorClicking(true)
        setSending(true)
      }, SEARCH_EMPTY_DELAY + Math.max(SEARCH_DURATION - 700, 0))
      schedule(() => setCursorClicking(false), SEARCH_EMPTY_DELAY + Math.max(SEARCH_DURATION - 520, 0))
      schedule(() => {
        setShowCursor(false)
        setShowSearchCTA(false)
        setSending(false)
        setPhase('loading')
      }, SEARCH_EMPTY_DELAY + SEARCH_DURATION + 420)
    }

    if (phase === 'grid') {
      const verifiedCount = CARDS.filter(card => card.verified).length
      const selectStepMs = Math.floor(GRID_DURATION / (verifiedCount + 2))
      for (let i = 1; i <= verifiedCount; i += 1) {
        schedule(() => setSelectedVerifiedCount(i), i * selectStepMs)
      }
      schedule(() => {
        setPhase('stack')
      }, GRID_DURATION)
    }

    if (phase === 'stack') {
      schedule(() => setPhase('end'), STACK_HOLD)
    }

    return () => {
      if (pulseIntervalRef.current) {
        window.clearInterval(pulseIntervalRef.current)
        pulseIntervalRef.current = null
      }
    }
  }, [phase])

  useEffect(() => () => clearAllTimers(), [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F7F9FE 100%)',
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-visible flex items-center justify-center"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <LayoutGroup>
          <div
            style={{
              width: 1920,
              height: 1080,
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
              padding: 24,
            }}
          >
          <AnimatePresence mode="wait">
            {phase === 'search' && (
              <motion.div key="search" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                <AnimatePresence>
                  {showSearchCTA && (
                    <SearchLanding sending={sending} />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {phase === 'loading' && (
              <motion.div key="loading" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
                <UltraModernStagedLoader onComplete={() => setPhase('grid')} />
              </motion.div>
            )}

            {(phase === 'grid' || phase === 'stack' || phase === 'end') && (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'end' ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: phase === 'end' ? FADE_OUT_DURATION / 1000 : 0.4, ease: 'easeOut' }}
                style={{ width: '100%', display: 'grid', placeItems: 'center' }}
              >
                <CardsGrid cards={CARDS} phase={phase} selectedVerifiedCount={selectedVerifiedCount} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showCursor && (
              <motion.div
                className="absolute pointer-events-none z-50"
                style={{
                  width: '28px',
                  height: '28px',
                }}
                initial={{ opacity: 0, scale: 0.75, left: `${cursorPosition.x}%`, top: `${cursorPosition.y}%` }}
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
                  scale: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#333" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  )
}
