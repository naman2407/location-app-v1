'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SafeImage } from '@/app/components/SafeImage'
import { IMAGES } from '@/app/constants/images'

export default function EcosystemDemoPage() {
  const [showCenterLogo, setShowCenterLogo] = useState(false)
  const [showRotatingLogos, setShowRotatingLogos] = useState(false)
  const [fadeOutLines, setFadeOutLines] = useState(false)
  const [fadeOutBrandLogos, setFadeOutBrandLogos] = useState(false)
  const [reverseLocationLogo, setReverseLocationLogo] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

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
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

    const runAnimation = async () => {
      // Start with 5 seconds of empty screen (just gradient)
      await sleep(5000)

      // Show center logo with animation
      setShowCenterLogo(true)
      
      // Wait for location logo animation to complete
      // Total animation time: bgDur(0.2) + lVerticalDur(0.3) + lHorizontalDur(0.3) + arrowDur(0.25) + dotDur(0.15) + LOCATION text(0.8) + purple dot(0.2) + .com text(0.7) + buffer
      // Delays: 0.2 + 0.1 + 0.3 + 0.1 + 0.3 + 0.1 + 0.25 + 0.1 + 0.15 + 0.1 + 0.8 + 0.05 + 0.2 + 0.05 + 0.7 = ~3.5s
      await sleep(3500)

      // Show rotating logos after location logo animation completes
      setShowRotatingLogos(true)
      await sleep(20000) // Rotate for 20 seconds

      // Start fade-out sequence
      // Step 1: Fade out lines
      setFadeOutLines(true)
      await sleep(500) // Wait for lines to fade out
      
      // Step 2: Fade out brand logos
      setFadeOutBrandLogos(true)
      await sleep(500) // Wait for brand logos to fade out
      
      // Step 3: Reverse location logo animation
      setReverseLocationLogo(true)
      await sleep(2000) // Wait for reverse animation to complete
    }

    runAnimation()
  }, [])

  // Logo positions around the circle (8 logos evenly spaced)
  const logoCount = 8
  const radius = 400 // Distance from center
  const logos = [
    { name: 'Google', image: '/images/brands/google.svg' },
    { name: 'Bing', image: '/images/brands/bing.svg' },
    { name: 'Perplexity', image: '/images/brands/perplexity.svg' },
    { name: 'Alexa', image: '/images/brands/alexa.svg' },
    { name: 'OpenAI', image: '/images/brands/openai.svg' },
    { name: 'Maps', image: '/images/brands/maps.png' },
    { name: 'Facebook', image: '/images/brands/fb.svg' },
    { name: 'Yelp', image: '/images/brands/yelp.svg' },
  ]

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
          {/* Center Logo with piece-by-piece animation */}
          <motion.div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0 }}
            animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-80 h-80 flex items-center justify-center">
              <svg width="179" height="131" viewBox="0 0 179 131" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Animation timing constants */}
                {(() => {
                  const bgDur = 0.2;
                  const lVerticalDur = 0.3;
                  const lHorizontalDur = 0.3;
                  const arrowDur = 0.25;
                  const dotDur = 0.15;
                  
                  return (
                    <>
                      {/* Purple Circle - First to appear, last to disappear */}
                      <motion.path
                        d="M123 33.5C123 14.9985 108.002 0 89.5 0C70.9985 0 56 14.9985 56 33.5C56 52.0015 70.9985 67 89.5 67C108.002 67 123 52.0015 123 33.5Z"
                        fill="#5A58F2"
                        initial={{ opacity: 0 }}
                        animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                        transition={{ 
                          duration: bgDur, 
                          delay: reverseLocationLogo ? 1.5 : 0,
                          ease: "easeOut" 
                        }}
                      />

                      <defs>
                        {/* Round mask for circle clipping */}
                        <mask
                          id="roundMask"
                          style={{ maskType: 'alpha' }}
                          maskUnits="userSpaceOnUse"
                          x="56"
                          y="0"
                          width="67"
                          height="67"
                        >
                          <path d="M89.5 67C108.002 67 123 52.0015 123 33.5C123 14.9985 108.002 0 89.5 0C70.9985 0 56 14.9985 56 33.5C56 52.0015 70.9985 67 89.5 67Z" fill="#5A58F2"/>
                        </mask>

                        {/* Reveal mask for L vertical part (top → bottom) */}
                        <mask
                          id="lVerticalRevealMask"
                          maskUnits="userSpaceOnUse"
                          x="65"
                          y="3"
                          width="9"
                          height="39"
                        >
                          <motion.rect
                            x="65"
                            y="3"
                            width="9"
                            height="0"
                            fill="white"
                            initial={{ height: 0 }}
                            animate={showCenterLogo && !reverseLocationLogo ? { height: 39 } : reverseLocationLogo ? { height: 0 } : {}}
                            transition={{
                              delay: reverseLocationLogo ? 1.2 : bgDur + 0.1,
                              duration: lVerticalDur,
                              ease: "easeInOut",
                            }}
                          />
                        </mask>

                        {/* Reveal mask for L horizontal part (left → right) */}
                        <mask
                          id="lHorizontalRevealMask"
                          maskUnits="userSpaceOnUse"
                          x="66"
                          y="33"
                          width="32"
                          height="9"
                        >
                          <motion.rect
                            x="66"
                            y="33"
                            width="0"
                            height="9"
                            fill="white"
                            initial={{ width: 0 }}
                            animate={showCenterLogo && !reverseLocationLogo ? { width: 32 } : reverseLocationLogo ? { width: 0 } : {}}
                            transition={{
                              delay: reverseLocationLogo ? 1.0 : bgDur + 0.1 + lVerticalDur + 0.1,
                              duration: lHorizontalDur,
                              ease: "easeInOut",
                            }}
                          />
                        </mask>
                      </defs>

                      {/* Everything clipped to circle */}
                      <g mask="url(#roundMask)">
                        {/* L vertical part - reveals from top to bottom */}
                        <motion.g 
                          mask="url(#lVerticalRevealMask)"
                          initial={{ opacity: 0 }}
                          animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{ 
                            opacity: { 
                              duration: 0.1, 
                              delay: reverseLocationLogo ? 1.2 : bgDur + 0.1 
                            } 
                          }}
                        >
                          <path d="M65 10.5L69 6.5L74 3.77206V34.3726V41.8001H65V10.5Z" fill="white"/>
                        </motion.g>

                        {/* L horizontal part - reveals from left to right */}
                        <motion.g 
                          mask="url(#lHorizontalRevealMask)"
                          initial={{ opacity: 0 }}
                          animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{ 
                            opacity: { 
                              duration: 0.1, 
                              delay: reverseLocationLogo ? 1.0 : bgDur + 0.1 + lVerticalDur + 0.1 
                            } 
                          }}
                        >
                          <path d="M66 33L70.5 33.05H74.5H75.52H97.43V41.8H66V33Z" fill="white"/>
                        </motion.g>

                        {/* Arrow - fades in */}
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                          transition={{ 
                            opacity: { 
                              duration: arrowDur, 
                              delay: reverseLocationLogo ? 0.8 : bgDur + 0.1 + lVerticalDur + 0.1 + lHorizontalDur + 0.1 
                            } 
                          }}
                        >
                          <path d="M103 37.5L94 45.7272L94 29.2728L103 37.5Z" fill="white"/>
                        </motion.g>

                        {/* White dot inside circle - appears after arrow with pop animation */}
                        <motion.path
                          d="M113.5 41.75C115.985 41.75 118 39.7912 118 37.375C118 34.9588 115.985 33 113.5 33C111.015 33 109 34.9588 109 37.375C109 39.7912 111.015 41.75 113.5 41.75Z"
                          fill="white"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={showCenterLogo && !reverseLocationLogo ? { scale: 1, opacity: 1 } : reverseLocationLogo ? { scale: 0, opacity: 0 } : {}}
                          transition={{
                            delay: reverseLocationLogo ? 0.6 : bgDur + 0.1 + lVerticalDur + 0.1 + lHorizontalDur + 0.1 + arrowDur + 0.1,
                            duration: dotDur,
                            ease: [0.34, 1.56, 0.64, 1], // Bounce effect for pop
                          }}
                          style={{
                            transformBox: "fill-box",
                            transformOrigin: "center",
                          }}
                        />
                      </g>
                    </>
                  );
                })()}

                {/* Text "LOCATION" - Typing animation using clip-path */}
                {(() => {
                  const textDelay = 0.2 + 0.1 + 0.3 + 0.1 + 0.3 + 0.1 + 0.25 + 0.1 + 0.15 + 0.1; // ~1.7s
                  return (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                      transition={{ duration: 0.2, delay: reverseLocationLogo ? 0.3 : textDelay }}
                    >
                      <motion.g
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={showCenterLogo && !reverseLocationLogo ? { clipPath: 'inset(0 0% 0 0)' } : reverseLocationLogo ? { clipPath: 'inset(0 100% 0 0)' } : {}}
                        transition={{ duration: 0.8, delay: reverseLocationLogo ? 0.3 : textDelay, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <path
                      d="M15.2169 86.44H18.4809V100H25.9929V103H15.2169V86.44ZM27.4368 96.832C27.4368 95.504 27.6928 94.352 28.2048 93.376C28.7168 92.4 29.4368 91.648 30.3648 91.12C31.2928 90.576 32.3888 90.304 33.6528 90.304C34.9168 90.304 36.0128 90.576 36.9408 91.12C37.8688 91.648 38.5888 92.4 39.1008 93.376C39.6128 94.352 39.8688 95.504 39.8688 96.832C39.8688 98.144 39.6128 99.296 39.1008 100.288C38.5888 101.264 37.8688 102.024 36.9408 102.568C36.0128 103.096 34.9168 103.36 33.6528 103.36C32.3888 103.36 31.2928 103.096 30.3648 102.568C29.4368 102.024 28.7168 101.264 28.2048 100.288C27.6928 99.296 27.4368 98.144 27.4368 96.832ZM36.6528 96.832C36.6528 95.648 36.3888 94.736 35.8608 94.096C35.3328 93.44 34.5968 93.112 33.6528 93.112C32.7088 93.112 31.9728 93.44 31.4448 94.096C30.9168 94.736 30.6528 95.648 30.6528 96.832C30.6528 98 30.9168 98.912 31.4448 99.568C31.9728 100.224 32.7088 100.552 33.6528 100.552C34.5968 100.552 35.3328 100.224 35.8608 99.568C36.3888 98.912 36.6528 98 36.6528 96.832ZM41.5068 96.832C41.5068 95.52 41.7548 94.376 42.2508 93.4C42.7468 92.424 43.4508 91.664 44.3628 91.12C45.2908 90.576 46.3868 90.304 47.6508 90.304C49.3308 90.304 50.6908 90.736 51.7308 91.6C52.7708 92.464 53.3468 93.664 53.4588 95.2H50.2668C50.1228 94.544 49.8508 94.032 49.4508 93.664C49.0508 93.296 48.4428 93.112 47.6268 93.112C46.7788 93.112 46.0828 93.424 45.5388 94.048C44.9948 94.672 44.7228 95.6 44.7228 96.832C44.7228 98.064 44.9868 98.992 45.5148 99.616C46.0428 100.24 46.7468 100.552 47.6268 100.552C48.4428 100.552 49.0508 100.376 49.4508 100.024C49.8508 99.656 50.1148 99.12 50.2428 98.416H53.4828C53.3228 99.984 52.7388 101.2 51.7308 102.064C50.7228 102.928 49.3628 103.36 47.6508 103.36C46.4028 103.36 45.3148 103.096 44.3868 102.568C43.4748 102.024 42.7628 101.264 42.2508 100.288C41.7548 99.296 41.5068 98.144 41.5068 96.832ZM55.0629 99.616C55.0629 98.48 55.5029 97.576 56.3829 96.904C57.2629 96.216 58.7429 95.8 60.8229 95.656L63.3909 95.464V95.128C63.3909 93.656 62.5829 92.92 60.9669 92.92C60.2309 92.92 59.6549 93.088 59.2389 93.424C58.8389 93.744 58.5989 94.16 58.5189 94.672H55.4949C55.6069 93.28 56.1749 92.208 57.1989 91.456C58.2229 90.688 59.5029 90.304 61.0389 90.304C62.8949 90.304 64.2549 90.736 65.1189 91.6C65.9989 92.448 66.4389 93.608 66.4389 95.08V103H63.6309L63.5589 101.296C63.0949 102 62.4949 102.52 61.7589 102.856C61.0229 103.192 60.2309 103.36 59.3829 103.36C57.9269 103.36 56.8389 103.024 56.1189 102.352C55.4149 101.664 55.0629 100.752 55.0629 99.616ZM58.3029 99.52C58.3029 99.904 58.4309 100.224 58.6869 100.48C58.9589 100.736 59.3749 100.864 59.9349 100.864C60.9909 100.864 61.8149 100.56 62.4069 99.952C62.9989 99.328 63.3269 98.6 63.3909 97.768L61.1109 97.936C60.0229 98.016 59.2789 98.192 58.8789 98.464C58.4949 98.736 58.3029 99.088 58.3029 99.52ZM70.2973 98.896V93.376H67.8733V90.712C68.7373 90.712 69.3773 90.648 69.7933 90.52C70.2093 90.376 70.4893 90.088 70.6333 89.656C70.7933 89.208 70.8813 88.536 70.8973 87.64H73.4173V90.664H76.7293V93.376H73.4173V98.2C73.4173 99.032 73.5533 99.624 73.8253 99.976C74.0973 100.328 74.5853 100.504 75.2893 100.504H76.5853V103.144H74.9053C73.3053 103.144 72.1373 102.8 71.4013 102.112C70.6653 101.408 70.2973 100.336 70.2973 98.896ZM78.8587 90.664H81.9787V103H78.8587V90.664ZM78.5707 87.448C78.5707 86.888 78.7307 86.448 79.0507 86.128C79.3867 85.808 79.8427 85.648 80.4187 85.648C80.9947 85.648 81.4427 85.808 81.7627 86.128C82.0987 86.448 82.2667 86.888 82.2667 87.448C82.2667 88.008 82.0987 88.448 81.7627 88.768C81.4427 89.088 80.9947 89.248 80.4187 89.248C79.8427 89.248 79.3867 89.088 79.0507 88.768C78.7307 88.448 78.5707 88.008 78.5707 87.448ZM84.3337 96.832C84.3337 95.504 84.5897 94.352 85.1017 93.376C85.6137 92.4 86.3337 91.648 87.2617 91.12C88.1897 90.576 89.2857 90.304 90.5497 90.304C91.8137 90.304 92.9097 90.576 93.8377 91.12C94.7657 91.648 95.4857 92.4 95.9977 93.376C96.5097 94.352 96.7657 95.504 96.7657 96.832C96.7657 98.144 96.5097 99.296 95.9977 100.288C95.4857 101.264 94.7657 102.024 93.8377 102.568C92.9097 103.096 91.8137 103.36 90.5497 103.36C89.2857 103.36 88.1897 103.096 87.2617 102.568C86.3337 102.024 85.6137 101.264 85.1017 100.288C84.5897 99.296 84.3337 98.144 84.3337 96.832ZM93.5497 96.832C93.5497 95.648 93.2857 94.736 92.7577 94.096C92.2297 93.44 91.4937 93.112 90.5497 93.112C89.6057 93.112 88.8697 93.44 88.3417 94.096C87.8137 94.736 87.5497 95.648 87.5497 96.832C87.5497 98 87.8137 98.912 88.3417 99.568C88.8697 100.224 89.6057 100.552 90.5497 100.552C91.4937 100.552 92.2297 100.224 92.7577 99.568C93.2857 98.912 93.5497 98 93.5497 96.832ZM99.1237 90.664H102.076L102.148 92.656C102.532 91.92 103.084 91.344 103.804 90.928C104.524 90.512 105.34 90.304 106.252 90.304C107.628 90.304 108.692 90.728 109.444 91.576C110.196 92.408 110.572 93.584 110.572 95.104V103H107.452V95.728C107.452 94.016 106.724 93.16 105.268 93.16C104.708 93.16 104.196 93.312 103.732 93.616C103.268 93.92 102.9 94.328 102.628 94.84C102.372 95.352 102.244 95.936 102.244 96.592V103H99.1237V90.664ZM119.097 96.928C119.097 95.632 119.321 94.512 119.769 93.568C120.233 92.608 120.873 91.864 121.689 91.336C122.505 90.808 123.465 90.544 124.569 90.544C126.057 90.544 127.249 90.928 128.145 91.696C129.041 92.464 129.553 93.56 129.681 94.984H128.217C127.945 92.92 126.729 91.888 124.569 91.888C123.337 91.888 122.361 92.336 121.641 93.232C120.937 94.128 120.585 95.36 120.585 96.928C120.585 98.496 120.945 99.728 121.665 100.624C122.401 101.52 123.401 101.968 124.665 101.968C126.633 101.968 127.809 100.928 128.193 98.848H129.681C129.201 101.824 127.529 103.312 124.665 103.312C123.529 103.312 122.545 103.056 121.713 102.544C120.881 102.016 120.233 101.272 119.769 100.312C119.321 99.352 119.097 98.224 119.097 96.928ZM131.808 96.928C131.808 95.616 132.04 94.488 132.504 93.544C132.968 92.584 133.616 91.848 134.448 91.336C135.28 90.808 136.248 90.544 137.352 90.544C138.456 90.544 139.424 90.808 140.256 91.336C141.088 91.848 141.736 92.584 142.2 93.544C142.664 94.488 142.896 95.616 142.896 96.928C142.896 98.224 142.664 99.352 142.2 100.312C141.736 101.272 141.088 102.016 140.256 102.544C139.424 103.056 138.456 103.312 137.352 103.312C136.248 103.312 135.28 103.056 134.448 102.544C133.616 102.016 132.968 101.272 132.504 100.312C132.04 99.352 131.808 98.224 131.808 96.928ZM134.4 93.208C133.664 94.088 133.296 95.328 133.296 96.928C133.296 98.528 133.664 99.768 134.4 100.648C135.136 101.528 136.12 101.968 137.352 101.968C138.584 101.968 139.568 101.528 140.304 100.648C141.04 99.768 141.408 98.528 141.408 96.928C141.408 95.328 141.04 94.088 140.304 93.208C139.568 92.328 138.584 91.888 137.352 91.888C136.12 91.888 135.136 92.328 134.4 93.208ZM145.873 90.856H147.145L147.241 93.472C147.561 92.576 148.105 91.864 148.873 91.336C149.641 90.808 150.481 90.544 151.393 90.544C152.449 90.544 153.321 90.8 154.009 91.312C154.697 91.824 155.153 92.552 155.377 93.496C155.713 92.616 156.273 91.904 157.057 91.36C157.841 90.816 158.705 90.544 159.649 90.544C160.977 90.544 162.001 90.936 162.721 91.72C163.457 92.488 163.825 93.576 163.825 94.984V103H162.385V95.272C162.385 93.016 161.417 91.888 159.481 91.888C158.697 91.888 158.009 92.088 157.417 92.488C156.825 92.888 156.361 93.432 156.025 94.12C155.705 94.792 155.545 95.552 155.545 96.4V103H154.105V95.272C154.105 93.016 153.145 91.888 151.225 91.888C150.457 91.888 149.777 92.088 149.185 92.488C148.593 92.888 148.129 93.432 147.793 94.12C147.473 94.792 147.313 95.552 147.313 96.4V103H145.873V90.856Z"
                      fill="#1C1D20"
                    />
                      </motion.g>
                    </motion.g>
                  );
                })()}
                
                {/* Purple dot - appears after LOCATION text finishes */}
                {(() => {
                  const textDelay = 0.2 + 0.1 + 0.3 + 0.1 + 0.3 + 0.1 + 0.25 + 0.1 + 0.15 + 0.1; // ~1.7s
                  const locationTextDur = 0.8;
                  const purpleDotDelay = textDelay + locationTextDur + 0.05; // ~2.55s
                  return (
                    <motion.circle
                      cx="114.917"
                      cy="101.344"
                      r="2.5"
                      fill="#5A58F2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={showCenterLogo && !reverseLocationLogo ? { scale: 1, opacity: 1 } : reverseLocationLogo ? { scale: 0, opacity: 0 } : {}}
                      transition={{ 
                        scale: { duration: 0.2, delay: reverseLocationLogo ? 0.1 : purpleDotDelay, ease: [0.34, 1.56, 0.64, 1] },
                        opacity: { duration: 0.2, delay: reverseLocationLogo ? 0.1 : purpleDotDelay }
                      }}
                    />
                  );
                })()}
                
                {/* Text ".com" - Typing animation after purple dot */}
                {(() => {
                  const textDelay = 0.2 + 0.1 + 0.3 + 0.1 + 0.3 + 0.1 + 0.25 + 0.1 + 0.15 + 0.1; // ~1.7s
                  const locationTextDur = 0.8;
                  const purpleDotDelay = textDelay + locationTextDur + 0.05; // ~2.55s
                  const purpleDotDur = 0.2;
                  const comTextDelay = purpleDotDelay + purpleDotDur + 0.05; // ~2.8s
                  return (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={showCenterLogo && !reverseLocationLogo ? { opacity: 1 } : reverseLocationLogo ? { opacity: 0 } : {}}
                      transition={{ duration: 0.2, delay: reverseLocationLogo ? 0 : comTextDelay }}
                    >
                      <motion.g
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={showCenterLogo && !reverseLocationLogo ? { clipPath: 'inset(0 0% 0 0)' } : reverseLocationLogo ? { clipPath: 'inset(0 100% 0 0)' } : {}}
                        transition={{ duration: 0.7, delay: reverseLocationLogo ? 0 : comTextDelay, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <path
                      d="M40.1359 114.34H43.4959C44.6346 114.34 45.5119 114.601 46.1279 115.124C46.7532 115.647 47.0659 116.389 47.0659 117.35C47.0659 118.339 46.7626 119.091 46.1559 119.604C45.5492 120.108 44.6626 120.36 43.4959 120.36H41.0179V124H40.1359V114.34ZM46.1559 117.35C46.1559 115.894 45.2692 115.166 43.4959 115.166H41.0179V119.534H43.4959C44.4199 119.534 45.0919 119.361 45.5119 119.016C45.9412 118.671 46.1559 118.115 46.1559 117.35ZM48.0085 120.458C48.0085 119.693 48.1438 119.035 48.4145 118.484C48.6852 117.924 49.0632 117.495 49.5485 117.196C50.0338 116.888 50.5985 116.734 51.2425 116.734C51.8865 116.734 52.4512 116.888 52.9365 117.196C53.4218 117.495 53.7998 117.924 54.0705 118.484C54.3412 119.035 54.4765 119.693 54.4765 120.458C54.4765 121.214 54.3412 121.872 54.0705 122.432C53.7998 122.992 53.4218 123.426 52.9365 123.734C52.4512 124.033 51.8865 124.182 51.2425 124.182C50.5985 124.182 50.0338 124.033 49.5485 123.734C49.0632 123.426 48.6852 122.992 48.4145 122.432C48.1438 121.872 48.0085 121.214 48.0085 120.458ZM49.5205 118.288C49.0912 118.801 48.8765 119.525 48.8765 120.458C48.8765 121.391 49.0912 122.115 49.5205 122.628C49.9498 123.141 50.5238 123.398 51.2425 123.398C51.9612 123.398 52.5352 123.141 52.9645 122.628C53.3938 122.115 53.6085 121.391 53.6085 120.458C53.6085 119.525 53.3938 118.801 52.9645 118.288C52.5352 117.775 51.9612 117.518 51.2425 117.518C50.5238 117.518 49.9498 117.775 49.5205 118.288ZM57.9191 123.188L59.9631 116.916H60.8311L62.8051 123.23L64.4431 116.916H65.2971L63.3231 124H62.2871L60.3831 117.882L58.3811 124H57.3451L55.3711 116.916H56.3091L57.9191 123.188ZM66.2013 120.458C66.2013 119.693 66.3319 119.035 66.5933 118.484C66.8546 117.924 67.2233 117.495 67.6993 117.196C68.1846 116.888 68.7493 116.734 69.3933 116.734C70.3453 116.734 71.0919 117.042 71.6333 117.658C72.1746 118.265 72.4453 119.105 72.4453 120.178V120.71H67.0553C67.0926 121.587 67.3119 122.255 67.7133 122.712C68.1146 123.169 68.6839 123.398 69.4213 123.398C70.5226 123.398 71.2039 122.969 71.4653 122.11H72.3333C71.9786 123.491 71.0079 124.182 69.4213 124.182C68.4133 124.182 67.6246 123.851 67.0553 123.188C66.4859 122.525 66.2013 121.615 66.2013 120.458ZM67.7693 118.162C67.3679 118.591 67.1346 119.203 67.0693 119.996H71.5773C71.5399 119.193 71.3346 118.577 70.9613 118.148C70.5879 117.719 70.0606 117.504 69.3793 117.504C68.7073 117.504 68.1706 117.723 67.7693 118.162ZM74.1118 116.916H74.8538L74.9098 118.596C75.0778 118.045 75.3532 117.616 75.7358 117.308C76.1278 116.991 76.5292 116.832 76.9398 116.832H77.5418V117.644H76.8838C76.5198 117.644 76.1885 117.756 75.8898 117.98C75.6005 118.195 75.3718 118.503 75.2038 118.904C75.0358 119.296 74.9518 119.758 74.9518 120.29V124H74.1118V116.916ZM78.1459 120.458C78.1459 119.693 78.2766 119.035 78.5379 118.484C78.7993 117.924 79.1679 117.495 79.6439 117.196C80.1293 116.888 80.6939 116.734 81.3379 116.734C82.2899 116.734 83.0366 117.042 83.5779 117.658C84.1193 118.265 84.3899 119.105 84.3899 120.178V120.71H78.9999C79.0373 121.587 79.2566 122.255 79.6579 122.712C80.0593 123.169 80.6286 123.398 81.3659 123.398C82.4673 123.398 83.1486 122.969 83.4099 122.11H84.2779C83.9233 123.491 82.9526 124.182 81.3659 124.182C80.3579 124.182 79.5693 123.851 78.9999 123.188C78.4306 122.525 78.1459 121.615 78.1459 120.458ZM79.7139 118.162C79.3126 118.591 79.0793 119.203 79.0139 119.996H83.5219C83.4846 119.193 83.2793 118.577 82.9059 118.148C82.5326 117.719 82.0053 117.504 81.3239 117.504C80.6519 117.504 80.1153 117.723 79.7139 118.162ZM85.6225 120.458C85.6225 119.693 85.7485 119.035 86.0005 118.484C86.2525 117.924 86.6118 117.495 87.0785 117.196C87.5545 116.888 88.1098 116.734 88.7445 116.734C89.3045 116.734 89.8085 116.883 90.2565 117.182C90.7045 117.481 91.0265 117.873 91.2225 118.358V113.99H92.0625V124H91.3205L91.2645 122.488C91.0965 122.992 90.7745 123.403 90.2985 123.72C89.8225 124.028 89.2858 124.182 88.6885 124.182C88.0632 124.182 87.5172 124.033 87.0505 123.734C86.5932 123.426 86.2385 122.992 85.9865 122.432C85.7438 121.872 85.6225 121.214 85.6225 120.458ZM87.0925 118.288C86.6912 118.792 86.4905 119.515 86.4905 120.458C86.4905 121.391 86.6958 122.115 87.1065 122.628C87.5172 123.141 88.1005 123.398 88.8565 123.398C89.5752 123.398 90.1492 123.132 90.5785 122.6C91.0078 122.059 91.2225 121.345 91.2225 120.458C91.2225 119.571 91.0078 118.862 90.5785 118.33C90.1492 117.789 89.5752 117.518 88.8565 117.518C88.0912 117.518 87.5032 117.775 87.0925 118.288ZM96.8938 113.99H97.7338V118.358C97.9298 117.873 98.2564 117.481 98.7138 117.182C99.1711 116.883 99.6891 116.734 100.268 116.734C100.902 116.734 101.448 116.888 101.906 117.196C102.363 117.495 102.713 117.924 102.956 118.484C103.208 119.035 103.334 119.693 103.334 120.458C103.334 121.214 103.208 121.872 102.956 122.432C102.704 122.992 102.344 123.426 101.878 123.734C101.411 124.033 100.856 124.182 100.212 124.182C99.6238 124.182 99.0964 124.023 98.6298 123.706C98.1724 123.389 97.8598 122.978 97.6918 122.474L97.6358 124H96.8938V113.99ZM97.7338 120.458C97.7338 121.345 97.9484 122.059 98.3778 122.6C98.8071 123.132 99.3811 123.398 100.1 123.398C100.846 123.398 101.425 123.151 101.836 122.656C102.256 122.161 102.466 121.429 102.466 120.458C102.466 119.487 102.256 118.755 101.836 118.26C101.416 117.765 100.837 117.518 100.1 117.518C99.3811 117.518 98.8071 117.789 98.3778 118.33C97.9484 118.862 97.7338 119.571 97.7338 120.458ZM104.598 126.128H105.018C105.307 126.128 105.55 126.086 105.746 126.002C105.942 125.918 106.11 125.769 106.25 125.554C106.399 125.349 106.548 125.055 106.698 124.672L106.908 124.14L103.954 116.916H104.92L107.356 123.076L109.75 116.916H110.646L107.468 124.882C107.262 125.395 107.052 125.797 106.838 126.086C106.632 126.375 106.39 126.576 106.11 126.688C105.83 126.809 105.48 126.87 105.06 126.87H104.598V126.128ZM117.545 120.15L113.821 114.34H114.871L118.021 119.324L121.185 114.34H122.151L118.427 120.15V124H117.545V120.15ZM121.62 120.458C121.62 119.693 121.751 119.035 122.012 118.484C122.274 117.924 122.642 117.495 123.118 117.196C123.604 116.888 124.168 116.734 124.812 116.734C125.764 116.734 126.511 117.042 127.052 117.658C127.594 118.265 127.864 119.105 127.864 120.178V120.71H122.474C122.512 121.587 122.731 122.255 123.132 122.712C123.534 123.169 124.103 123.398 124.84 123.398C125.942 123.398 126.623 122.969 126.884 122.11H127.752C127.398 123.491 126.427 124.182 124.84 124.182C123.832 124.182 123.044 123.851 122.474 123.188C121.905 122.525 121.62 121.615 121.62 120.458ZM123.188 118.162C122.787 118.591 122.554 119.203 122.488 119.996H126.996C126.959 119.193 126.754 118.577 126.38 118.148C126.007 117.719 125.48 117.504 124.798 117.504C124.126 117.504 123.59 117.723 123.188 118.162ZM129.369 124H128.389L131.035 120.304L128.641 116.916H129.649L131.595 119.646L133.513 116.916H134.465L132.071 120.234L134.731 124H133.709L131.525 120.892L129.369 124ZM136.43 121.648V117.672H135.044V116.958C135.51 116.958 135.851 116.921 136.066 116.846C136.29 116.762 136.434 116.589 136.5 116.328C136.565 116.067 136.598 115.665 136.598 115.124H137.27V116.916H139.622V117.672H137.27V121.536C137.27 122.189 137.382 122.651 137.606 122.922C137.83 123.193 138.212 123.328 138.754 123.328H139.538V124.07H138.614C137.158 124.07 136.43 123.263 136.43 121.648Z"
                      fill="#6F7074"
                    />
                      </motion.g>
                    </motion.g>
                  );
                })()}
              </svg>
            </div>
          </motion.div>

          {/* Rotating Logos Around Center */}
          {showRotatingLogos && (
            <motion.div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: '1px',
                height: '1px',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: 60, // Slower rotation - 60 seconds for full rotation
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {/* Dashed lines connecting logos - animate sequentially */}
              <svg
                className="absolute"
                style={{
                  width: radius * 2 + 240,
                  height: radius * 2 + 240,
                  left: -radius - 120,
                  top: -radius - 120,
                  pointerEvents: 'none',
                }}
              >
                {logos.map((logo, index) => {
                  const angle1 = (index * 360) / logoCount
                  const angle2 = ((index + 1) % logoCount * 360) / logoCount
                  const x1 = Math.cos((angle1 * Math.PI) / 180) * radius
                  const y1 = Math.sin((angle1 * Math.PI) / 180) * radius
                  const x2 = Math.cos((angle2 * Math.PI) / 180) * radius
                  const y2 = Math.sin((angle2 * Math.PI) / 180) * radius
                  
                  // Convert to SVG coordinates (center is at radius + 120)
                  const svgX1 = radius + 120 + x1
                  const svgY1 = radius + 120 + y1
                  const svgX2 = radius + 120 + x2
                  const svgY2 = radius + 120 + y2
                  
                  // Calculate line length for dash animation
                  const dashLength = 6
                  const gapLength = 6
                  const lineLength = Math.sqrt(Math.pow(svgX2 - svgX1, 2) + Math.pow(svgY2 - svgY1, 2))

                  return (
                    <motion.line
                      key={`line-${index}`}
                      x1={svgX1}
                      y1={svgY1}
                      x2={svgX2}
                      y2={svgY2}
                      stroke="rgba(0, 0, 0, 0.5)"
                      strokeWidth="1"
                      strokeDasharray={`${dashLength},${gapLength}`}
                      initial={{ 
                        strokeDashoffset: lineLength,
                        opacity: 0 
                      }}
                      animate={{ 
                        strokeDashoffset: fadeOutLines ? lineLength : 0,
                        opacity: fadeOutLines ? 0 : 1 
                      }}
                      transition={{
                        strokeDashoffset: {
                          duration: 0.8,
                          delay: fadeOutLines ? 0 : index * 0.25, // Sequential animation - each line appears after the previous
                          ease: 'easeOut',
                        },
                        opacity: {
                          duration: 0.4,
                          delay: fadeOutLines ? 0 : index * 0.25,
                        },
                      }}
                    />
                  )
                })}
              </svg>

              {/* Logos - rotate with circle but stay upright */}
              {logos.map((logo, index) => {
                const angle = (index * 360) / logoCount
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <motion.div
                    key={logo.name}
                    className="absolute"
                    style={{
                      width: '120px',
                      height: '120px',
                      left: x - 60,
                      top: y - 60,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: fadeOutBrandLogos ? 0 : 1,
                      scale: fadeOutBrandLogos ? 0 : 1,
                      rotate: -360, // Counter-rotate to keep logos upright
                    }}
                    transition={{
                      opacity: { duration: 0.5, delay: fadeOutBrandLogos ? 0 : index * 0.1 },
                      scale: { duration: 0.5, delay: fadeOutBrandLogos ? 0 : index * 0.1 },
                      rotate: {
                        duration: 60,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full bg-white flex items-center justify-center"
                      style={{
                        border: '1px solid rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <SafeImage 
                        src={logo.image} 
                        alt={logo.name} 
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

