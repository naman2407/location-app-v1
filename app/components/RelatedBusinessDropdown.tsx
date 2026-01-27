'use client'

import { useState, useRef, useEffect } from 'react'

interface RelatedBusinessOption {
  slug: string
  name: string
}

interface RelatedBusinessDropdownProps {
  value: string
  options: RelatedBusinessOption[]
  onChange: (value: string) => void
}

export function RelatedBusinessDropdown({ value, options, onChange }: RelatedBusinessDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Check if dropdown should open upward or downward
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      requestAnimationFrame(() => {
        if (buttonRef.current && menuRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect()
          const menuRect = menuRef.current.getBoundingClientRect()
          const spaceBelow = window.innerHeight - buttonRect.bottom
          const spaceAbove = buttonRect.top
          const dropdownHeight = menuRect.height || (options.length * 45 + 20)
          const margin = 8
          
          setOpenUpward(spaceBelow < dropdownHeight + margin && spaceAbove > dropdownHeight + margin)
        } else if (buttonRef.current) {
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

  const handleSelect = (optionSlug: string) => {
    onChange(optionSlug)
    setIsOpen(false)
    setSearchQuery('')
  }

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const selectedOption = options.find(opt => opt.slug === value)
  // Show "Related Businesses" when "All" is selected, otherwise show just the business name
  const displayText = (!selectedOption || selectedOption.slug === 'all') ? 'Related Businesses' : selectedOption.name

  // Filter and sort options
  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Sort alphabetically, but keep "All" first
  const sortedOptions = filteredOptions.sort((a, b) => {
    if (a.slug === 'all') return -1
    if (b.slug === 'all') return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 sm:px-4 py-2 sm:py-2.5 pr-8 rounded-full text-sm text-[#1c1d20] bg-[#E9EBEF] focus:outline-none appearance-none cursor-pointer flex items-center gap-2 relative whitespace-nowrap"
      >
        {displayText}
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className={`absolute left-0 bg-white border border-[#ededed] rounded-lg shadow-lg z-50 w-max min-w-[200px] max-w-[300px] flex flex-col ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {/* Search Input */}
          <div className="p-2.5 border-b border-[#ededed]">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search related businesses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-[240px] px-4 py-2 text-sm border border-[#ededed] rounded-full focus:outline-none focus:border-[#5A58F2]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="p-2.5 flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
            {sortedOptions.length > 0 ? (
              sortedOptions.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => handleSelect(option.slug)}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors rounded-[8px] whitespace-nowrap ${
                    option.slug === value 
                      ? 'bg-[#EEE8F7]' 
                      : 'hover:bg-[#f5f5f5]'
                  }`}
                >
                  {option.slug === value ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <div className="w-[14px] shrink-0" />
                  )}
                  <span className={option.slug === value ? 'font-medium text-black' : 'text-black'}>{option.name}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2.5 text-sm text-[#767676] text-center">
                No related businesses found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
