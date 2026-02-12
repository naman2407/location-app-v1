"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  autoplayMode?: "loop" | "once";
  disableInteractions?: boolean;
  lineOffsetTopPx?: number;
  lineOffsetBottomPx?: number;
  autoplayStartDelayMs?: number;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 0,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  autoplayMode = "loop",
  disableInteractions = false,
  lineOffsetTopPx = 0,
  lineOffsetBottomPx = 0,
  autoplayStartDelayMs = 0,
}: CompareProps) => {
  const sliderXPercent = useMotionValue(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const autoplayDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineFadeDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineFadeControlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const sliderLeft = useTransform(sliderXPercent, (v) => `${v}%`);
  const rightInset = useTransform(sliderXPercent, (v) => `${100 - v}%`);
  const clipPath = useMotionTemplate`inset(0 ${rightInset} 0 0)`;
  const lineOpacity = useMotionValue(1);

  const stopAutoplay = useCallback(() => {
    if (autoplayDelayRef.current) {
      clearTimeout(autoplayDelayRef.current);
      autoplayDelayRef.current = null;
    }
    if (lineFadeDelayRef.current) {
      clearTimeout(lineFadeDelayRef.current);
      lineFadeDelayRef.current = null;
    }
    if (autoplayControlsRef.current) {
      autoplayControlsRef.current.stop();
      autoplayControlsRef.current = null;
    }
    if (lineFadeControlsRef.current) {
      lineFadeControlsRef.current.stop();
      lineFadeControlsRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    stopAutoplay();

    const start = () => {
      lineOpacity.set(1);
      if (autoplayMode === "once") {
        autoplayControlsRef.current = animate(sliderXPercent, 100, {
          duration: autoplayDuration / 1000,
          ease: "linear",
        });

        const fadeLeadMs = 260;
        const fadeDelay = Math.max(0, autoplayDuration - fadeLeadMs);
        lineFadeDelayRef.current = setTimeout(() => {
          lineFadeControlsRef.current = animate(lineOpacity, 0, {
            duration: 0.26,
            ease: "easeOut",
          });
        }, fadeDelay);
        return;
      }

      lineOpacity.set(1);
      autoplayControlsRef.current = animate(sliderXPercent, 100, {
        duration: autoplayDuration / 1000,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      });
    };

    if (autoplayStartDelayMs > 0) {
      autoplayDelayRef.current = setTimeout(start, autoplayStartDelayMs);
      return;
    }

    start();
  }, [autoplay, autoplayDuration, autoplayMode, autoplayStartDelayMs, sliderXPercent, stopAutoplay]);

  useEffect(() => {
    sliderXPercent.set(initialSliderPercentage);
    startAutoplay();
    return () => stopAutoplay();
  }, [initialSliderPercentage, sliderXPercent, startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    if (slideMode === "hover") {
      sliderXPercent.set(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    () => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          sliderXPercent.set(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging, sliderXPercent]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => handleStart(),
    [handleStart]
  );
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleStart();
      }
      handleMove(e.touches[0].clientX);
    },
    [handleMove, handleStart, autoplay]
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("overflow-hidden", className)}
      style={{
        position: "relative",
        cursor: disableInteractions ? "default" : slideMode === "drag" ? "grab" : "col-resize",
      }}
      onMouseMove={disableInteractions ? undefined : handleMouseMove}
      onMouseLeave={disableInteractions ? undefined : mouseLeaveHandler}
      onMouseEnter={disableInteractions ? undefined : mouseEnterHandler}
      onMouseDown={disableInteractions ? undefined : handleMouseDown}
      onMouseUp={disableInteractions ? undefined : handleMouseUp}
      onTouchStart={disableInteractions ? undefined : handleTouchStart}
      onTouchEnd={disableInteractions ? undefined : handleTouchEnd}
      onTouchMove={disableInteractions ? undefined : handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-[2px] absolute top-0 m-auto z-30"
          style={{
            left: sliderLeft,
            top: `${-lineOffsetTopPx}px`,
            height: `calc(100% + ${lineOffsetTopPx + lineOffsetBottomPx}px)`,
            zIndex: 40,
            background:
              "linear-gradient(to bottom, rgba(90,88,242,0), rgba(90,88,242,1), rgba(90,88,242,0))",
            boxShadow: "0 0 0 1px rgba(90, 88, 242, 0.2), 0 0 16px rgba(90, 88, 242, 0.42)",
            willChange: "left",
            opacity: lineOpacity,
          }}
          transition={{ duration: 0 }}
        >
          <div className="w-44 h-full [mask-image:radial-gradient(120px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 z-20 opacity-70 bg-[linear-gradient(to_right,rgba(90,88,242,0.55),rgba(90,88,242,0))]" />
          <div className="w-16 h-3/5 [mask-image:radial-gradient(64px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 z-10 opacity-100 bg-[linear-gradient(to_right,rgba(162,159,248,0.95),rgba(162,159,248,0))]" />
          {showHandlebar && (
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <div className="h-3 w-0.5 bg-black/60" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        <AnimatePresence initial={false}>
          {firstImage ? (
            <motion.img
              className={cn(
                "absolute top-0 left-0 z-[19] w-full select-none",
                firstImageClassName
              )}
              style={{ transform: "translateZ(0)" }}
              alt="first image"
              src={firstImage}
              draggable={false}
            />
          ) : null}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {secondImage ? (
            <motion.div
              className="absolute top-0 left-0 right-0 z-20 w-full h-full select-none overflow-hidden"
              style={{ clipPath, willChange: "clip-path" }}
              transition={{ duration: 0 }}
            >
              <motion.img
                className={cn(
                  "absolute top-0 left-0 z-20 w-full select-none",
                  secondImageClassname
                )}
                style={{ transform: "translateZ(0)" }}
                alt="second image"
                src={secondImage}
                draggable={false}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
