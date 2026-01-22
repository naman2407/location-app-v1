import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Link({ href, children, className = '', onClick }: LinkProps) {
  const baseClasses = 'text-[#5A58F2] no-underline hover:underline active:no-underline transition-all duration-200'
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${className} bg-transparent border-none cursor-pointer`}
      >
        {children}
      </button>
    )
  }
  
  return (
    <a href={href} className={`${baseClasses} ${className}`}>
      {children}
    </a>
  )
}

