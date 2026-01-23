import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Link({ href, children, className = '', onClick }: LinkProps) {
  const baseClasses = 'link-primary no-underline hover:underline active:no-underline transition-all duration-200 font-medium'
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${className} link-button`}
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
