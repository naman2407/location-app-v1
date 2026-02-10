'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

type Scene = 0 | 1 | 2 | 3 | 4 | 5

type AnswerMode = 'idle' | 'guess' | 'skip' | 'final'

type SourceCardData = {
  id: string
  sourceName: string
  name: string
  address: string
  phone: string
  hours: string
  canonicalHours: string
}

const DURATIONS = {
  sendToRetrieval: 1600,
  retrievalToSort: 3600,
  sortToOutcome: 3600,
  guessDuration: 1000,
  skipHold: 1800,
  panelToReconcile: 2300,
  reconcileToFinal: 2200,
} as const

const SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
}

const QUERY = 'Sunrise Dental hours'
const CANONICAL_HOURS = '9:00 AM - 5:00 PM'
const CONFLICT_HOURS = '10:00 AM - 6:00 PM'

const SOURCE_CARDS: SourceCardData[] = [
  {
    id: 'directory-a',
    sourceName: 'Directory A',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CANONICAL_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'maps-b',
    sourceName: 'Maps B',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CANONICAL_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'social-c',
    sourceName: 'Social C',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CANONICAL_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'review-d',
    sourceName: 'Review D',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CANONICAL_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'listing-e',
    sourceName: 'Listing E',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CANONICAL_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'directory-f',
    sourceName: 'Directory F',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CONFLICT_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'maps-g',
    sourceName: 'Maps G',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CONFLICT_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
  {
    id: 'social-h',
    sourceName: 'Social H',
    name: 'Sunrise Dental',
    address: '120 Market St, San Francisco, CA',
    phone: '(415) 555-0132',
    hours: CONFLICT_HOURS,
    canonicalHours: CANONICAL_HOURS,
  },
]

function SearchBar({
  query,
  scene,
  onSend,
}: {
  query: string
  scene: Scene
  onSend: () => void
}) {
  return (
    <motion.div
      layout
      transition={SPRING}
      animate={{ y: scene >= 1 ? -34 : 0, opacity: 1 }}
      style={{
        width: 'min(90vw, 760px)',
        borderRadius: 999,
        border: '1px solid rgba(18, 24, 40, 0.12)',
        background: '#fff',
        boxShadow: '0 16px 30px rgba(17, 24, 39, 0.09)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px 12px 20px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, color: '#111827', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {query}
        </div>
        <AnimatePresence>
          {scene >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12, color: '#4b5563' }}
            >
              <span>Searching</span>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {[0, 1, 2].map(idx => (
                  <motion.span
                    key={idx}
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: idx * 0.14 }}
                    style={{ width: 4, height: 4, borderRadius: '50%', background: '#6b7280' }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSend}
        disabled={scene !== 0}
        style={{
          border: 'none',
          borderRadius: 999,
          width: 46,
          height: 46,
          background: scene === 0 ? '#111827' : '#9ca3af',
          color: '#fff',
          fontWeight: 700,
          cursor: scene === 0 ? 'pointer' : 'default',
        }}
      >
        Go
      </motion.button>
    </motion.div>
  )
}

function SourceCard({
  card,
  inConflict,
  resolved,
  scene,
  index,
  stacked,
}: {
  card: SourceCardData
  inConflict: boolean
  resolved: boolean
  scene: Scene
  index: number
  stacked?: boolean
}) {
  const hours = resolved ? card.canonicalHours : card.hours

  return (
    <motion.div
      layout
      layoutId={`source-card-${card.id}`}
      initial={{ opacity: 0, scale: 0.8, y: 26 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...SPRING, delay: scene === 2 ? index * 0.06 : 0 }}
      style={{
        width: '100%',
        maxWidth: 290,
        borderRadius: 14,
        background: '#ffffff',
        border: `1px solid ${inConflict && !resolved ? 'rgba(245, 158, 11, 0.55)' : 'rgba(17, 24, 39, 0.1)'}`,
        boxShadow: '0 10px 24px rgba(17, 24, 39, 0.08)',
        padding: '10px 11px',
        position: 'relative',
        marginTop: stacked && index > 0 ? -78 : 0,
        zIndex: stacked ? 100 - index : 1,
        opacity: inConflict && scene >= 3 && !resolved ? 0.66 : 1,
      }}
    >
      {scene >= 3 && (
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            width: 20,
            height: 20,
            borderRadius: 999,
            background: inConflict && !resolved ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.16)',
            color: inConflict && !resolved ? '#b45309' : '#047857',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {inConflict && !resolved ? '!' : '✓'}
        </div>
      )}

      <div style={{ fontSize: 12, color: '#374151', fontWeight: 700, marginBottom: 8 }}>{card.sourceName}</div>

      <InfoRow label="Name" value={card.name} />
      <InfoRow label="Address" value={card.address} />
      <InfoRow label="Phone" value={card.phone} />
      <InfoRow label="Hours" value={hours} highlight={inConflict && scene >= 3 && !resolved} />
    </motion.div>
  )
}

function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '58px 1fr',
        gap: 8,
        marginBottom: 5,
        fontSize: 11,
        borderRadius: 6,
        padding: highlight ? '3px 4px' : 0,
        background: highlight ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
      }}
    >
      <span style={{ color: '#6b7280', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function StackPile({
  title,
  cards,
  conflictIds,
  scene,
  resolved,
  stacked,
}: {
  title: string
  cards: SourceCardData[]
  conflictIds: Set<string>
  scene: Scene
  resolved: boolean
  stacked?: boolean
}) {
  return (
    <motion.div layout transition={SPRING} style={{ width: '100%' }}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 10, fontSize: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: stacked ? 0 : 10 }}>
        {cards.map((card, idx) => (
          <SourceCard
            key={card.id}
            card={card}
            inConflict={conflictIds.has(card.id)}
            resolved={resolved}
            scene={scene}
            index={idx}
            stacked={stacked}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#374151', fontWeight: 600 }}>
        <span>Confidence</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: 'rgba(17, 24, 39, 0.12)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #2563eb 0%, #16a34a 100%)' }}
        />
      </div>
    </div>
  )
}

function AnswerCard({
  mode,
  scene,
  guessText,
}: {
  mode: AnswerMode
  scene: Scene
  guessText: string
}) {
  const isGuess = mode === 'guess'
  const isSkip = mode === 'skip'
  const isFinal = mode === 'final'

  return (
    <motion.div
      layout
      layoutId="ai-answer-card"
      transition={SPRING}
      style={{
        width: 'min(92vw, 500px)',
        borderRadius: 16,
        border: '1px solid rgba(17, 24, 39, 0.11)',
        background: isSkip ? 'rgba(229, 231, 235, 0.85)' : '#ffffff',
        filter: isSkip ? 'blur(0.4px) saturate(0.8)' : 'none',
        color: '#111827',
        boxShadow: '0 14px 30px rgba(17, 24, 39, 0.09)',
        padding: 16,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: scene >= 4 ? 1 : 0, y: scene >= 4 ? 0 : 16 }}
    >
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: '#6b7280', fontWeight: 700 }}>AI Answer</div>

      <AnimatePresence mode="wait">
        {isGuess && (
          <motion.div
            key="guess"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginTop: 10 }}
          >
            <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 6 }}>Random guess</div>
            <motion.div
              animate={{ x: [0, -2, 2, -1, 1, 0], opacity: [1, 0.45, 1, 0.5, 1] }}
              transition={{ duration: 0.34, repeat: Infinity }}
              style={{ fontSize: 18, fontWeight: 700, color: '#1d4ed8' }}
            >
              {guessText}
            </motion.div>
          </motion.div>
        )}

        {isSkip && (
          <motion.div key="skip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>Not confident enough to answer.</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#9ca3af' }}>Needs stronger source agreement before publishing.</div>
          </motion.div>
        )}

        {isFinal && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Sunrise Dental hours: {CANONICAL_HOURS}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#6b7280' }}>Cited from 8 trusted sources</div>
            <motion.button
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                marginTop: 12,
                border: 'none',
                borderRadius: 999,
                padding: '10px 16px',
                fontWeight: 700,
                color: '#ffffff',
                background: '#111827',
                cursor: 'pointer',
              }}
            >
              Take control
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SourceOfTruthPanel({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 220, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 220, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            width: 'min(94vw, 620px)',
            borderRadius: 18,
            border: '1px solid rgba(37, 99, 235, 0.25)',
            background: 'linear-gradient(180deg, rgba(239,246,255,0.98) 0%, rgba(255,255,255,0.98) 100%)',
            padding: 16,
            boxShadow: '0 14px 28px rgba(30, 64, 175, 0.16)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#1d4ed8' }}>
            Source of Truth
          </div>
          <div style={{ marginTop: 8, display: 'grid', gap: 6, fontSize: 13 }}>
            <div><strong>Name:</strong> Sunrise Dental</div>
            <div><strong>Address:</strong> 120 Market St, San Francisco, CA</div>
            <div><strong>Phone:</strong> (415) 555-0132</div>
            <div><strong>Canonical Hours:</strong> {CANONICAL_HOURS}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function AISearchTrustAnimation() {
  const [scene, setScene] = useState<Scene>(0)
  const [answerMode, setAnswerMode] = useState<AnswerMode>('idle')
  const [resolved, setResolved] = useState(false)
  const [guessFlip, setGuessFlip] = useState(false)
  const [scale, setScale] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<number[]>([])

  const conflictIds = useMemo(() => new Set(SOURCE_CARDS.slice(5).map(card => card.id)), [])

  const clearTimers = () => {
    timersRef.current.forEach(timer => window.clearTimeout(timer))
    timersRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }

  const startTimeline = () => {
    clearTimers()
    setAnswerMode('idle')
    setResolved(false)
    setGuessFlip(false)
    setScene(1)
  }

  const replay = () => {
    clearTimers()
    setAnswerMode('idle')
    setResolved(false)
    setGuessFlip(false)
    setScene(0)
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
    if (scene === 0) return

    if (scene === 1) {
      schedule(() => setScene(2), DURATIONS.sendToRetrieval)
    }

    if (scene === 2) {
      schedule(() => setScene(3), DURATIONS.retrievalToSort)
    }

    if (scene === 3) {
      schedule(() => setScene(4), DURATIONS.sortToOutcome)
    }

    if (scene === 4) {
      setAnswerMode('guess')
      schedule(() => setAnswerMode('skip'), DURATIONS.guessDuration)
      schedule(() => setScene(5), DURATIONS.guessDuration + DURATIONS.skipHold)
    }

    if (scene === 5) {
      schedule(() => setResolved(true), DURATIONS.panelToReconcile)
      schedule(() => setAnswerMode('final'), DURATIONS.panelToReconcile + DURATIONS.reconcileToFinal)
    }
  }, [scene])

  useEffect(() => {
    if (scene !== 4 || answerMode !== 'guess') {
      setGuessFlip(false)
      return
    }

    const interval = window.setInterval(() => {
      setGuessFlip(prev => !prev)
    }, 180)

    return () => window.clearInterval(interval)
  }, [scene, answerMode])

  useEffect(() => () => clearTimers(), [])

  const trustedCards = useMemo(() => {
    if (scene < 3) return [] as SourceCardData[]
    return resolved ? SOURCE_CARDS : SOURCE_CARDS.slice(0, 5)
  }, [scene, resolved])

  const conflictingCards = useMemo(() => {
    if (scene < 3) return [] as SourceCardData[]
    return resolved ? [] : SOURCE_CARDS.slice(5)
  }, [scene, resolved])

  const confidence = useMemo(() => {
    if (scene < 3) return 0
    if (scene === 3) return 62
    if (scene === 4) return 45
    if (scene === 5 && !resolved) return 68
    return 100
  }, [scene, resolved])

  const guessText = guessFlip ? CONFLICT_HOURS : CANONICAL_HOURS

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
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <LayoutGroup>
          <div style={{ width: 1920, height: 1080, padding: 44, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 22, right: 28, zIndex: 20 }}>
              <button
                onClick={replay}
                style={{
                  border: '1px solid rgba(17, 24, 39, 0.16)',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 999,
                  padding: '10px 16px',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: 'pointer',
                }}
              >
                Replay
              </button>
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: 120,
                gap: 20,
              }}
            >
              <SearchBar query={QUERY} scene={scene} onSend={startTimeline} />

              <AnimatePresence>
                {scene >= 2 && (
                  <motion.div
                    key="work-surface"
                    layout
                    transition={SPRING}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    style={{
                      width: 'min(94vw, 1480px)',
                      minHeight: 610,
                      borderRadius: 24,
                      border: '1px solid rgba(17, 24, 39, 0.08)',
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(8px)',
                      padding: '20px 24px 22px',
                      position: 'relative',
                    }}
                  >
                    {scene === 2 && (
                      <motion.div
                        initial={{ x: '-120%', opacity: 0 }}
                        animate={{ x: '120%', opacity: [0, 0.35, 0] }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '34%',
                          pointerEvents: 'none',
                          background: 'linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.22) 50%, rgba(59,130,246,0) 100%)',
                        }}
                      />
                    )}

                    {scene === 2 && (
                      <motion.div
                        layout
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: 12,
                          alignItems: 'start',
                        }}
                      >
                        {SOURCE_CARDS.map((card, idx) => (
                          <SourceCard
                            key={card.id}
                            card={card}
                            inConflict={conflictIds.has(card.id)}
                            resolved={resolved}
                            scene={scene}
                            index={idx}
                          />
                        ))}
                      </motion.div>
                    )}

                    {scene >= 3 && (
                      <motion.div
                        layout
                        transition={SPRING}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 18,
                          alignItems: 'start',
                        }}
                      >
                        <StackPile
                          title={`Trusted Sources (${trustedCards.length})`}
                          cards={trustedCards}
                          conflictIds={conflictIds}
                          scene={scene}
                          resolved={resolved}
                          stacked
                        />

                        <StackPile
                          title={`Conflicts (${conflictingCards.length})`}
                          cards={conflictingCards}
                          conflictIds={conflictIds}
                          scene={scene}
                          resolved={resolved}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {scene >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={SPRING}
                    style={{
                      width: 'min(92vw, 1040px)',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <AnswerCard mode={answerMode} scene={scene} guessText={guessText} />
                    <div style={{ width: 'min(92vw, 320px)', background: '#fff', borderRadius: 16, border: '1px solid rgba(17,24,39,0.1)', padding: 14 }}>
                      <div style={{ fontSize: 12, textTransform: 'uppercase', color: '#6b7280', fontWeight: 700 }}>Model Trust</div>
                      <ConfidenceMeter value={confidence} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <SourceOfTruthPanel visible={scene === 5} />
          </div>
        </LayoutGroup>
      </div>
    </div>
  )
}
