'use client'

import { useState, useRef, useEffect } from 'react'

interface PageSizeDropdownProps {
  value: number
  options: number[]
  onChange: (value: number) => void
}

export function PageSizeDropdown({ value, options, onChange }: PageSizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Check if dropdown should open upward or downward
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (buttonRef.current && menuRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect()
          const menuRect = menuRef.current.getBoundingClientRect()
          const spaceBelow = window.innerHeight - buttonRect.bottom
          const spaceAbove = buttonRect.top
          const dropdownHeight = menuRect.height || (options.length * 45 + 20) // Actual or estimated height
          const margin = 8 // Margin for spacing
          
          // Open upward if there's not enough space below but enough space above
          // Otherwise open downward
          setOpenUpward(spaceBelow < dropdownHeight + margin && spaceAbove > dropdownHeight + margin)
        } else if (buttonRef.current) {
          // Fallback if menu not yet rendered - estimate based on options
          const buttonRect = buttonRef.current.getBoundingClientRect()
          const spaceBelow = window.innerHeight - buttonRect.bottom
          const spaceAbove = buttonRect.top
          const estimatedHeight = options.length * 45 + 20
          const margin = 8
          
          setOpenUpward(spaceBelow < estimatedHeight + margin && spaceAbove > estimatedHeight + margin)
        }
      })
    }
  }, [isOpen, options.length])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (option: number) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 border border-[#ededed] rounded-full text-sm text-[#1c1d20] bg-white focus:outline-none focus:border-[#5A58F2] appearance-none cursor-pointer flex items-center gap-2 relative"
        style={{
          paddingRight: '32px',
        }}
      >
        {value}
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className={`absolute left-0 bg-white border border-[#ededed] rounded-lg shadow-lg z-50 min-w-[80px] p-2.5 flex flex-col gap-1.5 ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors rounded-[8px] ${
                option === value 
                  ? 'bg-[#EEE8F7]' 
                  : 'hover:bg-[#f5f5f5]'
              }`}
            >
              {option === value ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div className="w-[14px] shrink-0" />
              )}
              <span className={option === value ? 'font-medium text-black' : 'text-black'}>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

