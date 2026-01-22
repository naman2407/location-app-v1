'use client'

import React, { useState, useEffect } from 'react'

interface CategoryIconProps {
  src: string
  alt: string
  className?: string
}

export function CategoryIcon({ src, alt, className }: CategoryIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(text => {
        // Replace fill and stroke colors with currentColor so we can control it via CSS
        let modifiedSvg = text
          // Replace fill attributes
          .replace(/fill="[^"]*"/g, 'fill="currentColor"')
          .replace(/fill='[^']*'/g, "fill='currentColor'")
          .replace(/fill:\s*[^;]*;/g, 'fill: currentColor;')
          // Replace stroke attributes
          .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
          .replace(/stroke='[^']*'/g, "stroke='currentColor'")
          .replace(/stroke:\s*[^;]*;/g, 'stroke: currentColor;')
        
        // Also ensure SVG element itself uses currentColor
        if (!modifiedSvg.includes('fill=') && !modifiedSvg.includes('fill:')) {
          modifiedSvg = modifiedSvg.replace(/<svg/, '<svg fill="currentColor"')
        }
        
        setSvgContent(modifiedSvg)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [src])

  if (isLoading || !svgContent) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className}
      />
    )
  }

  return (
    <div 
      className={`${className} category-icon-display`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}

