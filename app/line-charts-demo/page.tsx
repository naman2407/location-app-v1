'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'

const CARD_SHADOW = '0 2px 8px rgba(0, 0, 0, 0.1)'
const SCENE_VARIANTS = {
  enter: { x: 220, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { opacity: 0 },
}

type OdometerNumberProps = {
  value: string | number
  startValue?: string | number
  extraCycles?: number
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  digitHeight?: number
  digitWidth?: number
  suffix?: string
  suffixClassName?: string
  suffixDelay?: number
  reduceMotion?: boolean
  startDelay?: number
}

function OdometerNumber({
  value,
  startValue = 0,
  extraCycles = 0,
  delay = 0,
  duration = 1,
  className,
  style,
  digitHeight = 32,
  digitWidth = 20,
  suffix,
  suffixClassName,
  suffixDelay,
  reduceMotion,
  startDelay = 0,
}: OdometerNumberProps) {
  const formatted = `${value}`
  const targetDigits = formatted.replace(/\D/g, '')
  const startDigitsRaw = `${startValue}`.replace(/\D/g, '')
  const startDigitsTrimmed = startDigitsRaw.slice(-targetDigits.length)
  const startDigitsPadded = startDigitsTrimmed.padStart(targetDigits.length, '0')
  const digits = useMemo(() => {
    const cycles = Math.max(0, extraCycles) + 1
    return Array.from({ length: cycles * 10 }, (_, i) => i % 10)
  }, [extraCycles])
  const effectiveDuration = duration + extraCycles * 0.8
  const ease = [0.16, 1, 0.3, 1] as const

  if (reduceMotion) {
    return (
      <span className={className}>
        {formatted}
        {suffix && <span className={suffixClassName}>{suffix}</span>}
      </span>
    )
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'baseline', ...style }}>
      {formatted.split('').map((char, index) => {
        if (!/^\d$/.test(char)) {
          return (
            <span key={`${char}-${index}`}>
              {char}
            </span>
          )
        }

        const digit = Number(char)
        const digitIndex = formatted.slice(0, index + 1).replace(/\D/g, '').length - 1
        const startDigit = Number(startDigitsPadded[digitIndex] ?? 0)
        const startOffset = startDigit + extraCycles * 10
        const digitDelay = startDelay + delay + index * 0.03

        return (
          <OdometerDigit
            key={`${char}-${index}`}
            digit={digit}
            startOffset={startOffset}
            digitHeight={digitHeight}
            digitWidth={digitWidth}
            duration={effectiveDuration}
            delay={digitDelay}
            ease={ease}
            digits={digits}
          />
        )
      })}
      {suffix && (
        <motion.span
          className={suffixClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.35,
            delay: startDelay + (suffixDelay ?? delay + duration * 0.8),
          }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  )
}

type OdometerDigitProps = {
  digit: number
  startOffset: number
  digitHeight: number
  digitWidth: number
  duration: number
  delay: number
  ease: [number, number, number, number]
  digits: number[]
}

function OdometerDigit({
  digit,
  startOffset,
  digitHeight,
  digitWidth,
  duration,
  delay,
  ease,
  digits,
}: OdometerDigitProps) {
  const controls = useAnimation()

  useEffect(() => {
    controls.set({ y: -digitHeight * startOffset })
    const raf = requestAnimationFrame(() => {
      controls.start({
        y: -digitHeight * digit,
        transition: { duration, delay, ease },
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [controls, digit, startOffset, digitHeight, duration, delay, ease])

  return (
    <span
      className="relative overflow-hidden"
      style={{
        height: `${digitHeight}px`,
        width: `${digitWidth}px`,
        lineHeight: `${digitHeight}px`,
      }}
    >
      <motion.span className="block" animate={controls} initial={false} style={{ display: 'block' }}>
        {digits.map((num, idx) => (
          <span
            key={`${num}-${idx}`}
            className="block"
            style={{
              height: `${digitHeight}px`,
              lineHeight: `${digitHeight}px`,
            }}
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

type KpiMetricProps = {
  label: string
  value: string
  valueSuffix?: string
  valueStart?: string | number
  delta: string
  deltaSuffix?: string
  deltaStart?: string | number
  iconSrc: string
  iconBg: string
  valueColor?: string
  deltaDirection?: 'up' | 'down'
  reduceMotion?: boolean
  startDelay?: number
  active?: boolean
}

function KpiMetric({
  label,
  value,
  valueSuffix,
  valueStart,
  delta,
  deltaSuffix,
  deltaStart,
  iconSrc,
  iconBg,
  valueColor,
  deltaDirection = 'up',
  reduceMotion,
  startDelay = 0,
  active = true,
}: KpiMetricProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <img src={iconSrc} alt="" className="w-4 h-4" />
        </div>
        <span className="text-md font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-baseline gap-4 min-h-[44px]">
        <div className="inline-flex w-fit">
          {active || reduceMotion ? (
            <OdometerNumber
              key={`${value}-${active ? 'on' : 'off'}`}
              value={value}
              startValue={valueStart}
              extraCycles={1}
              suffix={valueSuffix}
              delay={1.2}
              duration={1.1}
              startDelay={startDelay}
              digitHeight={34}
              digitWidth={22}
              className="text-[36px] font-medium tracking-tight leading-none tabular-nums"
              style={{
                color: valueColor ?? '#111827',
                justifyContent: 'flex-start',
              }}
              suffixClassName="text-xl font-medium text-gray-500 ml-1"
              suffixDelay={0}
              reduceMotion={reduceMotion}
            />
          ) : (
            <span className="text-[36px] font-medium tracking-tight leading-none tabular-nums opacity-0">
              {value}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          {active || reduceMotion ? <span>{deltaDirection === 'down' ? '↘' : '↗'}</span> : null}
          {active || reduceMotion ? (
            <OdometerNumber
              key={`${delta}-${active ? 'on' : 'off'}`}
              value={delta}
              startValue={deltaStart}
              extraCycles={1}
              suffix={deltaSuffix}
              delay={1.25}
              duration={1.0}
              startDelay={startDelay}
              digitHeight={18}
              digitWidth={10}
              className="text-sm font-medium text-emerald-600 tracking-tight"
              suffixClassName="text-sm font-medium text-emerald-600 ml-1"
              suffixDelay={0}
              reduceMotion={reduceMotion}
            />
          ) : (
            <span className="text-sm font-medium text-emerald-600 opacity-0">{delta}</span>
          )}
        </div>
      </div>
    </div>
  )
}

type ChartProps = {
  series: number[]
  comparison: number[]
  reduceMotion?: boolean
  showAxes?: boolean
  showLines?: boolean
  showLegend?: boolean
}

function LineChart({
  series,
  comparison,
  reduceMotion,
  showAxes = true,
  showLines = true,
  showLegend = true,
}: ChartProps) {
  const outerWidth = 896
  const padding = { top: 16, right: 0, bottom: 44, left: 0 }
  const axisGap = 20
  const chart = {
    width: outerWidth - padding.left - padding.right - axisGap,
    height: 200,
    padding,
  }

  const maxY = 5
  const minY = 1

  const totalWidth = outerWidth
  const totalHeight = chart.height + chart.padding.top + chart.padding.bottom

  const points = useMemo(() => {
    return series.map((value, index) => ({
      x: chart.padding.left + axisGap + (chart.width / (series.length - 1)) * index,
      y: chart.padding.top + ((maxY - value) / (maxY - minY)) * chart.height,
    }))
  }, [series])

  const comparisonPoints = useMemo(() => {
    return comparison.map((value, index) => ({
      x: chart.padding.left + axisGap + (chart.width / (comparison.length - 1)) * index,
      y: chart.padding.top + ((maxY - value) / (maxY - minY)) * chart.height,
    }))
  }, [comparison])

  const buildSmoothPath = (linePoints: { x: number; y: number }[]) => {
    if (linePoints.length === 0) {
      return ''
    }

    let path = `M ${linePoints[0].x} ${linePoints[0].y}`

    for (let i = 0; i < linePoints.length - 1; i += 1) {
      const p0 = linePoints[i - 1] ?? linePoints[i]
      const p1 = linePoints[i]
      const p2 = linePoints[i + 1]
      const p3 = linePoints[i + 2] ?? p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }

    return path
  }

  const bluePath = useMemo(() => buildSmoothPath(points), [points])
  const pinkPath = useMemo(() => buildSmoothPath(comparisonPoints), [comparisonPoints])

  const xLabels = [
    'Sept 1',
    'Sept 5',
    'Sept 9',
    'Sept 13',
    'Sept 17',
    'Sept 21',
    'Sept 25',
    'Sept 30',
  ]
  const labelStep = (series.length - 1) / (xLabels.length - 1)

  return (
    <div className="mt-6">
      <motion.svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={showAxes ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const y = chart.padding.top + (chart.height / 4) * index
          const labelValue = Math.round(maxY - (maxY - minY) * (index / 4))

          return (
            <g key={`grid-${index}`}>
              <line
                x1={chart.padding.left + axisGap}
                x2={chart.padding.left + axisGap + chart.width}
                y1={y}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={chart.padding.left}
                y={y + 4}
                fill="#9CA3AF"
                fontSize="12"
                textAnchor="start"
              >
                {labelValue}
              </text>
            </g>
          )
        })}

        {xLabels.map((label, labelIndex) => {
          const x = chart.padding.left + axisGap + (chart.width / (xLabels.length - 1)) * labelIndex
          const isFirst = labelIndex === 0
          const isLast = labelIndex === xLabels.length - 1
          const textAnchor = isFirst ? 'start' : isLast ? 'end' : 'middle'
          const xShift = isFirst ? 6 : isLast ? -6 : 0
          return (
            <text
              key={`label-${labelIndex}`}
              x={x + xShift}
              y={chart.padding.top + chart.height + 28}
              fill="#6B7280"
              fontSize="12"
              textAnchor={textAnchor}
            >
              {label}
            </text>
          )
        })}

        <motion.path
          d={bluePath}
          fill="none"
          stroke="#4F5BFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={showLines ? { pathLength: 1 } : { pathLength: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.path
          d={pinkPath}
          fill="none"
          stroke="#F472B6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 8"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={showLines ? { pathLength: 1 } : { pathLength: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.6, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.svg>

      <motion.div
        className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={showLegend ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F5BFF]" />
          <span>Your Average Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F472B6]" />
          <span>Industry Average</span>
        </div>
      </motion.div>
    </div>
  )
}

type GaugeCardProps = {
  title: string
  value: number
  delta: number
  accent: string
  track: string
  highlight?: boolean
  cardBg?: string
  borderColor?: string
  borderWidth?: number
  noShadow?: boolean
  reduceMotion?: boolean
  active?: boolean
  extraCycles?: number
  delay?: number
  className?: string
  showTitle?: boolean
  showBadge?: boolean
  showContent?: boolean
}

function GaugeCard({
  title,
  value,
  delta,
  accent,
  track,
  highlight,
  cardBg,
  borderColor,
  borderWidth = 1,
  noShadow,
  reduceMotion,
  active,
  extraCycles = 1,
  delay = 0,
  className,
  showTitle = true,
  showBadge = true,
  showContent = true,
}: GaugeCardProps) {
  const radius = 96
  const arcPath = `M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`
  const arcFillOffset = 1 - value / 100

  return (
    <motion.div
      className={`rounded-[8px] p-4 border flex flex-col ${className ?? ''}`}
      style={{
        backgroundColor: cardBg ?? '#FFFFFF',
        borderColor: borderColor ?? (highlight ? '#7C8BFF' : '#E6E9F2'),
        borderWidth,
        boxShadow: noShadow
          ? '0 0 0 rgba(15, 23, 42, 0)'
          : highlight
            ? '0 0 0 rgba(92, 104, 255, 0)'
            : '0 6px 14px rgba(15, 23, 42, 0.06)',
      }}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="flex items-center justify-between mb-3">
        {showTitle ? (
          <span className="text-[16px] font-semibold text-gray-900 whitespace-nowrap">{title}</span>
        ) : (
          <span className="text-[16px] font-semibold text-gray-900 opacity-0">Visibility score</span>
        )}
        {showBadge ? (
          <span
            className="text-[12px] font-medium px-2.5 py-0.5 whitespace-nowrap"
            style={{
              borderRadius: '6px',
              backgroundColor: '#E5F4EC',
              color: '#146C43',
              border: '1px solid #146C43',
            }}
          >
            Strong performance
          </span>
        ) : (
          <span className="text-[12px] font-medium px-2.5 py-0.5 opacity-0">Strong performance</span>
        )}
      </div>
      <div className="flex items-center justify-center flex-1">
        <div className="relative w-full max-w-[360px] h-[140px] flex items-center justify-center px-4">
          <svg width="360" height="140" viewBox="0 0 360 140">
            <g transform="translate(180 104)">
              <path
                d={arcPath}
                fill="none"
                stroke="#D9D9D9"
                strokeWidth="12"
                strokeLinecap="round"
                pathLength={1}
              />
              <motion.path
                d={arcPath}
                fill="none"
                stroke={accent}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                initial={
                  reduceMotion
                    ? { pathLength: value / 100, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                animate={
                  active && showContent
                    ? { pathLength: value / 100, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={reduceMotion ? { duration: 0 } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
            {showContent && (active || reduceMotion) ? (
              <OdometerNumber
                value={value}
                startValue={0}
                extraCycles={extraCycles}
                duration={1.1}
                delay={0.2}
                digitHeight={36}
                digitWidth={22}
                className="text-[36px] font-semibold text-gray-900"
                reduceMotion={reduceMotion}
              />
            ) : (
              <span className="text-[36px] font-semibold text-gray-900 opacity-0">{value}</span>
            )}
            <div className="mt-2 flex items-center gap-2 text-[13px]">
              {showContent && (active || reduceMotion) ? <span className="text-[#198754]">↗</span> : null}
              {showContent && (active || reduceMotion) ? (
                <OdometerNumber
                  value={delta}
                  startValue={0}
                  extraCycles={extraCycles}
                  duration={0.9}
                  delay={0.25}
                  digitHeight={16}
                  digitWidth={9}
                  className="text-[14px] font-medium text-[#198754] tracking-tight"
                  reduceMotion={reduceMotion}
                />
              ) : (
                <span className="opacity-0">{delta}</span>
              )}
              <span className="text-[14px] text-gray-800">since last scan</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[13px] text-gray-800">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
        <span>Your Score</span>
      </div>
    </motion.div>
  )
}

type MetricRowCardProps = {
  title: string
  value: string
  delta: string
  linkLabel: string
  scaleLeft: string
  scaleRight: string
  progress: number
  valueBlockWidth?: number
  reduceMotion?: boolean
  active?: boolean
  delay?: number
  showContent?: boolean
}

function MetricRowCard({
  title,
  value,
  delta,
  linkLabel,
  scaleLeft,
  scaleRight,
  progress,
  valueBlockWidth = 64,
  reduceMotion,
  active,
  delay = 0,
  showContent = true,
}: MetricRowCardProps) {
  return (
    <motion.div
      className="border border-[#DADCE0] rounded-[8px] p-3 bg-white min-h-[112px] flex flex-col"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className={`flex items-center justify-between text-[12px] font-medium text-gray-900 mb-2 ${showContent ? '' : 'opacity-0'}`}>
        <span>{title}</span>
        <span className="text-[11px] text-indigo-500">{linkLabel}</span>
      </div>
      <div className="flex items-center justify-between gap-5 mb-2 flex-1">
        <div className="flex items-baseline gap-1.5 justify-start" style={{ width: `${valueBlockWidth}px` }}>
          {showContent && (active || reduceMotion) ? (
            <OdometerNumber
              value={value}
              startValue={0}
              extraCycles={1}
              duration={0.9}
              digitHeight={18}
              digitWidth={11}
              className="text-[18px] font-medium text-gray-900"
              reduceMotion={reduceMotion}
            />
          ) : (
            <span className="text-[18px] font-medium text-gray-900 opacity-0">{value}</span>
          )}
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            {showContent && (active || reduceMotion) ? <span>↗</span> : null}
            {showContent && (active || reduceMotion) ? (
              <OdometerNumber
                value={delta}
                startValue={0}
                extraCycles={1}
                duration={0.8}
                digitHeight={12}
                digitWidth={7}
                className="text-[11px] font-medium text-emerald-600 tracking-tight"
                reduceMotion={reduceMotion}
              />
            ) : (
              <span className="opacity-0">{delta}</span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className={`flex items-center justify-between text-[10px] text-gray-500 mb-1 ${showContent ? '' : 'opacity-0'}`}>
            <span>{scaleLeft}</span>
            <span>{scaleRight}</span>
          </div>
          <div className="h-[5px] rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#8C8BF2]"
              initial={reduceMotion ? { width: `${progress * 100}%` } : { width: 0 }}
              animate={showContent && active ? { width: `${progress * 100}%` } : { width: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

type MiniLineChartProps = {
  reduceMotion?: boolean
  active?: boolean
  showLegend?: boolean
  shellVisible?: boolean
}

function MiniLineChart({ reduceMotion, active, showLegend, shellVisible = true }: MiniLineChartProps) {
  const chartWidth = 360
  const chartHeight = 230
  const padding = { top: 20, right: 12, bottom: 28, left: 28 }
  const totalWidth = chartWidth + padding.left + padding.right
  const totalHeight = chartHeight + padding.top + padding.bottom
  const linePoints = [
    76, 84, 85, 86, 90, 92, 88, 87, 89, 90, 87, 88, 92, 95,
  ]
  const bandLow = [
    65, 70, 73, 78, 79, 77, 76, 75, 76, 77, 78, 79, 80, 80,
  ]
  const bandHigh = [
    95, 88, 90, 95, 95, 97, 94, 92, 93, 94, 90, 91, 99, 96,
  ]
  const maxY = 100
  const minY = 25
  const points = linePoints.map((value, index) => ({
    x: padding.left + (chartWidth / (linePoints.length - 1)) * index,
    y: padding.top + ((maxY - value) / (maxY - minY)) * chartHeight,
  }))
  const upper = bandHigh.map((value, index) => ({
    x: padding.left + (chartWidth / (bandHigh.length - 1)) * index,
    y: padding.top + ((maxY - value) / (maxY - minY)) * chartHeight,
  }))
  const lower = bandLow.map((value, index) => ({
    x: padding.left + (chartWidth / (bandLow.length - 1)) * index,
    y: padding.top + ((maxY - value) / (maxY - minY)) * chartHeight,
  }))

  const buildPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) {
      return ''
    }
    let path = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i += 1) {
      const p0 = pts[i - 1] ?? pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] ?? p2
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return path
  }

  const linePath = buildPath(points)
  const bandPath = `${buildPath(upper)} L ${lower[lower.length - 1].x} ${lower[lower.length - 1].y} ${buildPath(
    lower.slice().reverse()
  ).replace('M', 'L')} Z`

  const xLabels = ['M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A']

  return (
    <motion.div
      className="border border-[#DADCE0] rounded-[8px] p-3 bg-white min-h-[360px] flex flex-col h-full"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      animate={shellVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-[12px] font-medium text-gray-900 mb-2">Visibility score over time</div>
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="flex-1 w-full"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {[100, 75, 50, 25].map((label, index) => {
          const y = padding.top + (chartHeight / 3) * index
          return (
            <g key={`mini-grid-${label}`}>
              <line
                x1={padding.left}
                x2={padding.left + chartWidth}
                y1={y}
                y2={y}
                stroke="#E6E9F2"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} fontSize="10" fill="#9CA3AF" textAnchor="end">
                {label}
              </text>
            </g>
          )
        })}
        {xLabels.map((label, idx) => {
          const x = padding.left + (chartWidth / (xLabels.length - 1)) * idx
          return (
            <text
              key={`mini-x-${label}-${idx}`}
              x={x}
              y={padding.top + chartHeight + 18}
              fontSize="10"
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {label}
            </text>
          )
        })}
        <motion.path
          d={bandPath}
          fill="#E9E9FF"
          opacity="0.7"
          initial={reduceMotion ? { opacity: 0.8 } : { opacity: 0 }}
          animate={active ? { opacity: 0.8 } : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#5B5CF6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.svg>
      <motion.div
        className="mt-2 flex items-center justify-center gap-3 text-[11px] text-gray-600"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={showLegend ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#E9E9FF]" />
          <span>Your locations range: 55–97</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-[#5B5CF6]" />
          <span>Your average: 96</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LineChartsDemoPage() {
  const [scale, setScale] = useState(1)
  const [showCard, setShowCard] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [scene, setScene] = useState<1 | 2>(1)
  const [showScene2Cards, setShowScene2Cards] = useState(false)
  const [showScene2Header, setShowScene2Header] = useState(false)
  const [showScene2Metrics, setShowScene2Metrics] = useState(false)
  const [showScene2Chart, setShowScene2Chart] = useState(false)
  const [showScene2Legend, setShowScene2Legend] = useState(false)
  const [showScene2Shells, setShowScene2Shells] = useState(false)
  const [showScene2GaugeContent, setShowScene2GaugeContent] = useState(false)
  const [showScene2Badges, setShowScene2Badges] = useState(false)
  const [showScene2CardContent, setShowScene2CardContent] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const runIdRef = useRef(0)
  const scene2RunIdRef = useRef(0)
  const scene2CompletedRef = useRef(false)
  const searchParams = useSearchParams()
  const showOverlay = process.env.NODE_ENV !== 'production' && searchParams?.get('overlay') === '1'
  const scene2Final = scene2CompletedRef.current
  const s2Shells = scene2Final || showScene2Shells
  const s2Header = scene2Final || showScene2Header
  const s2GaugeContent = scene2Final || showScene2GaugeContent
  const s2CardContent = scene2Final || showScene2CardContent
  const s2Metrics = scene2Final || showScene2Metrics
  const s2Chart = scene2Final || showScene2Chart
  const s2Legend = scene2Final || showScene2Legend
  const s2Badges = scene2Final || showScene2Badges

  const series = useMemo(
    () => [
      2.0, 1.7, 1.9, 2.6, 3.1, 3.3, 3.2, 2.6, 2.4, 2.3,
      2.1, 1.8, 2.0, 2.6, 3.2, 3.8, 3.9, 3.7, 3.3, 2.8,
      2.6, 2.7, 2.9, 3.3, 3.7, 3.6, 3.7, 3.9, 4.0, 4.2,
    ],
    []
  )

  const comparison = useMemo(
    () => [
      1.6, 1.4, 1.6, 2.0, 2.3, 2.5, 2.4, 2.0, 1.9, 1.8,
      1.7, 1.5, 1.6, 2.0, 2.4, 2.8, 2.9, 2.8, 2.5, 2.2,
      2.1, 2.2, 2.3, 2.6, 2.9, 2.8, 2.9, 3.0, 3.1, 3.4,
    ],
    []
  )

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) {
        return
      }

      const baseWidth = 1920
      const baseHeight = 1080
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const scaleX = viewportWidth / baseWidth
      const scaleY = viewportHeight / baseHeight
      const newScale = Math.min(scaleX, scaleY, 1)

      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  useEffect(() => {
    runIdRef.current += 1
    const runId = runIdRef.current
    if (reduceMotion) {
      setShowCard(true)
      setShowContent(true)
      setScene(2)
      setShowScene2Shells(true)
      setShowScene2Cards(true)
      setShowScene2Header(true)
      setShowScene2GaugeContent(true)
      setShowScene2CardContent(true)
      setShowScene2Metrics(true)
      setShowScene2Chart(true)
      setShowScene2Legend(true)
      setShowScene2Badges(true)
      setFadeOut(false)
      return
    }

    const timers: number[] = []
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (runIdRef.current !== runId) {
          return
        }
        fn()
      }, delay)
      timers.push(id)
    }
    schedule(() => setShowCard(true), 5000)
    schedule(() => setShowContent(true), 6200)
    schedule(() => setScene(2), 16200)
    schedule(() => setFadeOut(true), 16200 + 12100)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [reduceMotion])

  useEffect(() => {
    if (scene !== 2 || reduceMotion) {
      return
    }

    if (scene2CompletedRef.current) {
      return
    }

    scene2RunIdRef.current += 1
    const runId = scene2RunIdRef.current

    const timers: number[] = []
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (scene2RunIdRef.current !== runId) {
          return
        }
        fn()
      }, delay)
      timers.push(id)
    }

    schedule(() => setShowScene2Shells(true), 300)
    schedule(() => setShowScene2Cards(true), 450)
    schedule(() => setShowScene2Header(true), 700)
    schedule(() => setShowScene2GaugeContent(true), 1000)
    schedule(() => setShowScene2CardContent(true), 1300)
    schedule(() => {
      setShowScene2Metrics(true)
      setShowScene2Chart(true)
    }, 1650)
    schedule(() => {
      setShowScene2Legend(true)
      setShowScene2Badges(true)
      setShowScene2Shells(true)
      setShowScene2Cards(true)
      setShowScene2Header(true)
      setShowScene2GaugeContent(true)
      setShowScene2CardContent(true)
      setShowScene2Metrics(true)
      setShowScene2Chart(true)
      scene2CompletedRef.current = true
    }, 2100)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [scene, reduceMotion])

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
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          {showOverlay && (
            <img
              src="/public/demos/performance-metric.png"
              alt=""
              className="absolute inset-0 w-full h-full pointer-events-none z-50"
              style={{ opacity: 0.35 }}
            />
          )}
          <AnimatePresence initial={true}>
            {scene === 1 && (
              <motion.div
                key="scene-1"
                className="absolute inset-0 flex items-center justify-center"
                variants={SCENE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {showCard && (
                  <motion.div
                    className="bg-white"
                    style={{
                      width: '960px',
                      padding: '32px',
                      borderRadius: '16px',
                    }}
                    initial={
                      reduceMotion
                        ? { opacity: 1, scale: 1, boxShadow: CARD_SHADOW }
                        : { opacity: 0, scale: 0.95, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }
                    }
                    animate={{ opacity: 1, scale: 1, boxShadow: CARD_SHADOW }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.3 }}
                  >
                    <div className="relative pb-6">
                      <motion.div
                        className="grid grid-cols-4 gap-8 items-stretch"
                        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <KpiMetric
                          key={`kpi-rating-${showContent ? 'on' : 'off'}`}
                          label="Avg. Rating"
                          value="4.2"
                          valueSuffix=""
                          delta="2.4"
                          deltaSuffix="stars"
                          iconSrc="/images/demo/rating.svg"
                          iconBg="#FCD34D"
                          reduceMotion={reduceMotion}
                          startDelay={0}
                          active={showContent}
                        />
                        <KpiMetric
                          key={`kpi-volume-${showContent ? 'on' : 'off'}`}
                          label="Reviews Volume"
                          value="452"
                          delta="80"
                          deltaSuffix="%"
                          iconSrc="/images/demo/volume.svg"
                          iconBg="#FBCFE8"
                          valueColor="#6F7074"
                          reduceMotion={reduceMotion}
                          startDelay={0}
                          active={showContent}
                        />
                        <KpiMetric
                          key={`kpi-time-${showContent ? 'on' : 'off'}`}
                          label="Avg. Response Time"
                          value="20"
                          valueSuffix="hr"
                          valueStart={100}
                          delta="60"
                          deltaSuffix="hr"
                          deltaStart={120}
                          iconSrc="/images/demo/time.svg"
                          iconBg="#DDD6FE"
                          valueColor="#6F7074"
                          deltaDirection="down"
                          reduceMotion={reduceMotion}
                          startDelay={0}
                          active={showContent}
                        />
                        <KpiMetric
                          key={`kpi-rate-${showContent ? 'on' : 'off'}`}
                          label="Response Rate"
                          value="100"
                          valueSuffix="%"
                          delta="50"
                          deltaSuffix="%"
                          iconSrc="/images/demo/response.svg"
                          iconBg="#BBF7D0"
                          valueColor="#6F7074"
                          reduceMotion={reduceMotion}
                          startDelay={0}
                          active={showContent}
                        />
                      </motion.div>
                      <motion.div
                        className="absolute left-0 bottom-0 h-px bg-gray-200"
                        style={{ width: '100%' }}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={showContent ? { opacity: 1 } : { opacity: 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.div
                        className="absolute left-0 bottom-0 h-0.5 bg-[#4F5BFF]"
                        style={{ width: '25%' }}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scaleX: 0.7 }}
                        animate={showContent ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.7 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      />
                  </div>

                    <LineChart
                      series={series}
                      comparison={comparison}
                      reduceMotion={reduceMotion}
                      showAxes={showContent}
                      showLines={showContent}
                      showLegend={showContent}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {scene === 2 && (
              <motion.div
                key="scene-2"
                className="absolute inset-0 flex items-center justify-center"
                variants={SCENE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="bg-white rounded-[14px] border"
                  style={{ width: '1280px', padding: '14px', borderColor: '#DADCE0', boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)' }}
                >
                  <div className="grid grid-cols-[380px,1fr] gap-[16px] items-stretch">
                    <motion.div
                      className="w-[380px] flex flex-col gap-4"
                      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      animate={s2Shells ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <GaugeCard
                        className=""
                        title="Visibility score"
                        value={96}
                        delta={60}
                        accent="#63D6B5"
                        track="#D8EAE5"
                        highlight
                        cardBg="#F7F9FE"
                        borderColor="#5A58F2"
                        borderWidth={4}
                        reduceMotion={reduceMotion}
                        active={s2Shells}
                        showTitle={s2Header}
                        showContent={s2GaugeContent}
                        showBadge={s2Badges}
                        delay={0}
                      />
                      <GaugeCard
                        className=""
                        title="Optimization score"
                        value={90}
                        delta={40}
                        accent="#FF7A00"
                        track="#F5E1D2"
                        borderColor="#DADCE0"
                        borderWidth={1}
                        noShadow
                        reduceMotion={reduceMotion}
                        active={s2Shells}
                        showTitle={s2Header}
                        showContent={s2GaugeContent}
                        showBadge={s2Badges}
                        delay={0.1}
                      />
                    </motion.div>
                    <motion.div
                      className="bg-white rounded-[16px] p-5 border h-fit"
                      style={{ border: '4px solid #5A58F2', backgroundColor: '#F7F9FE', boxShadow: '0 0 0 rgba(79, 91, 255, 0)' }}
                      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      animate={s2Shells ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.div
                        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        animate={s2Header ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="flex items-center gap-2 pb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                            <img src="/images/demo/rocket.svg" alt="" className="w-3 h-3" />
                          </div>
                          <div className="text-[16px] font-semibold text-gray-900">Visibility Score</div>
                        </div>
                        {s2CardContent ? (
                          <div className="mt-2 text-[14px] font-semibold text-gray-700">
                            Your Visibility score of{' '}
                            <span className="px-2 py-0.5 rounded-full bg-[#E5F4EC] text-[#146C43] text-[14px] font-semibold inline-flex items-center">
                              <OdometerNumber
                                value={86}
                                startValue={0}
                                extraCycles={1}
                                duration={0.9}
                                delay={0.3}
                                digitHeight={16}
                                digitWidth={10}
                                className="text-[14px] font-semibold text-[#146C43] leading-none"
                                reduceMotion={reduceMotion}
                                startDelay={0}
                              />
                            </span>{' '}
                            is a weighted average of the following metrics:
                          </div>
                        ) : (
                          <div className="mt-2 text-[14px] font-semibold text-gray-700 opacity-0">
                            Your Visibility score of 86 is a weighted average of the following metrics:
                          </div>
                        )}
                      </motion.div>
                      <div className="mt-4 grid grid-cols-[1fr,1fr] gap-4 items-start">
                        <div className="flex flex-col gap-4">
                        <MetricRowCard
                          title="Google rank (lower is better)"
                          value="10"
                          delta="26"
                          linkLabel="Rank details →"
                          scaleLeft="40"
                          scaleRight="1"
                          progress={0.68}
                          valueBlockWidth={64}
                          reduceMotion={reduceMotion}
                          active={s2CardContent}
                          showContent={s2Metrics}
                          delay={0}
                        />
                        <MetricRowCard
                          title="AI rank (lower is better)"
                          value="2"
                          delta="8"
                          linkLabel="Rank details →"
                          scaleLeft="10"
                          scaleRight="1"
                          progress={0.78}
                          valueBlockWidth={64}
                          reduceMotion={reduceMotion}
                          active={s2CardContent}
                          showContent={s2Metrics}
                          delay={0.1}
                        />
                        <MetricRowCard
                          title="AI brand sentiment"
                          value="89%"
                          delta="20%"
                          linkLabel="Score details →"
                          scaleLeft="0"
                          scaleRight="100"
                          progress={0.82}
                          valueBlockWidth={88}
                          reduceMotion={reduceMotion}
                          active={s2CardContent}
                          showContent={s2Metrics}
                          delay={0.2}
                        />
                        </div>
                        <MiniLineChart
                          reduceMotion={reduceMotion}
                          active={s2Chart}
                          showLegend={s2Legend}
                          shellVisible={s2CardContent}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
