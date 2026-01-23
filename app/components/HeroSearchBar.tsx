'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { brands, locations, filterBrands, filterLocations } from '../constants/searchData'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { getBrandPageUrl, getBusinessPageUrl } from '../constants/brandNavigation'

interface HeroSearchBarProps {
  initialQuery?: string
  variant?: 'inline' | 'headerMobile' | 'overlay' | 'mobileHeader'
  onSearchIconClick?: () => void
}

type SuggestionType = 'brand' | 'location'

interface Suggestion {
  type: SuggestionType
  id: string
  brandName: string
  address?: string
  image?: string
}

export function HeroSearchBar({ initialQuery = '', variant = 'inline', onSearchIconClick }: HeroSearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter brands and locations based on query
  const filteredBrands = React.useMemo(() => {
    if (!query.trim()) return []
    return filterBrands(query).slice(0, 3) // Max 3 brand suggestions
  }, [query])

  const filteredLocations = React.useMemo(() => {
    if (!query.trim()) return []
    // Only include locations that have business pages
    const allLocations = filterLocations(query)
    return allLocations
      .filter(location => {
        if (!location.address) return false
        const businessUrl = getBusinessPageUrl(location.address)
        return businessUrl !== null
      })
      .slice(0, 3) // Exactly 3 location suggestions
  }, [query])

  // Combine suggestions: brands first, then locations
  const suggestions = React.useMemo(() => {
    const result: Suggestion[] = []
    
    // Add brand suggestions
    filteredBrands.forEach(brand => {
      result.push({
        type: 'brand',
        id: brand.id,
        brandName: brand.name,
        image: brand.image,
      })
    })
    
    // Add location suggestions
    filteredLocations.forEach(location => {
      result.push({
        type: 'location',
        id: location.id,
        brandName: location.brandName,
        address: location.address,
      })
    })
    
    return result
  }, [filteredBrands, filteredLocations])

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    return () => document.removeEventListener('click', handleClickOutside, true)
  }, [])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setHighlightedIndex(-1)
    
    // Show dropdown if there's a query
    if (value.trim()) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true)
    if (query.trim()) {
      setShowDropdown(true)
    }
  }

  // Autofocus for overlay variant
  useEffect(() => {
    if (variant === 'overlay' && inputRef.current) {
      // Small delay to ensure overlay is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [variant])

  // Handle input blur (with delay to allow clicks)
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }, 200)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Escape') {
        setShowDropdown(false)
        inputRef.current?.blur()
      } else if (e.key === 'Enter' && query.trim()) {
        // If Enter is pressed with no dropdown, trigger search
        e.preventDefault()
        handleSearch(e as any)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        selectSuggestion(suggestions[highlightedIndex])
      } else if (query.trim()) {
        // If Enter is pressed with dropdown open but no selection, trigger search
        handleSearch(e as any)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: Suggestion) => {
    if (suggestion.type === 'brand') {
      // Navigate to brand page if available
      const brandUrl = getBrandPageUrl(suggestion.brandName)
      if (brandUrl) {
        // Check if we're already on this page
        if (pathname === brandUrl) {
          // Refresh the page and clear search
          router.refresh()
          setQuery('')
          setShowDropdown(false)
          setHighlightedIndex(-1)
          inputRef.current?.blur()
          return
        }
        router.push(brandUrl)
        setShowDropdown(false)
        setHighlightedIndex(-1)
        return
      }
      // Fallback: populate input
      setQuery(suggestion.brandName)
    } else {
      // For locations: navigate to business page if available
      if (suggestion.address) {
        const businessUrl = getBusinessPageUrl(suggestion.address)
        if (businessUrl) {
          // Check if we're already on this page
          if (pathname === businessUrl) {
            // Refresh the page and clear search
            router.refresh()
            setQuery('')
            setShowDropdown(false)
            setHighlightedIndex(-1)
            inputRef.current?.blur()
            return
          }
          router.push(businessUrl)
          setShowDropdown(false)
          setHighlightedIndex(-1)
          return
        }
      }
      // Fallback: populate input
      setQuery(`${suggestion.brandName} — ${suggestion.address}`)
    }
    setShowDropdown(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }, [router, pathname])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [highlightedIndex])

  // Handle clear button click
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setQuery('')
    setShowDropdown(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  // Handle search button click
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      inputRef.current?.focus()
      return
    }
    
    // Close dropdown
    setShowDropdown(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
    
    // Navigate to search page with query parameter
    const params = new URLSearchParams()
    params.set('q', query.trim())
    router.push(`/search?${params.toString()}`)
  }

  const hasSuggestions = suggestions.length > 0
  const showBrands = filteredBrands.length > 0
  const showLocations = filteredLocations.length > 0
  const hasQuery = query.trim().length > 0

  // Mobile header icon variant
  if (variant === 'headerMobile') {
    return (
      <button
        onClick={onSearchIconClick}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#F6F6F6] active:bg-[#EBEBEB] transition-colors"
        aria-label="Open search"
      >
        <SafeImage 
          alt="Search" 
          className="w-5 h-5 brightness-0" 
          src={IMAGES.search} 
        />
      </button>
    )
  }

  // Sleeker styling for tablet/desktop (all variants except headerMobile)
  const isSleek = variant === 'inline' || variant === 'overlay'
  const isMobileHeader = variant === 'mobileHeader'
  const containerClasses = isMobileHeader
    ? "relative w-full bg-white rounded-full border border-[#e0e0e0] search-bar-container flex items-center"
    : "relative w-full max-w-[850px] bg-white rounded-full border-2 border-[#e0e0e0] search-bar-container flex items-center"
  
  // Mobile header: smaller padding, tablet/desktop: sleeker padding
  const inputPadding = isMobileHeader ? "px-3 py-2" : (isSleek ? "px-5 py-3" : "px-6 py-4")
  const buttonSize = isMobileHeader ? "w-6 h-6 m-1" : (isSleek ? "w-8 h-8 m-1.5" : "m-2")

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
    >
      <div className="flex items-center relative flex-1">
        {/* Unified Input Field */}
          <input
          ref={inputRef}
            type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={variant === 'overlay' ? "Search brands or locations" : "Search brands or locations"}
          className={`flex-1 outline-none text-sm text-[#222222] placeholder:text-[#717171] bg-transparent w-full font-normal border-0 p-0 m-0 appearance-none search-input-reset ${inputPadding}`}
          aria-expanded={showDropdown}
            aria-autocomplete="list"
          aria-controls="unified-search-dropdown"
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
        />
      </div>

      {/* Clear (X) Button - Only show when input is filled */}
      {hasQuery && (
        <>
        <button
          type="button"
            onClick={handleClear}
            className={`flex items-center justify-center rounded-full hover:bg-[#F6F6F6] transition-colors flex-shrink-0 ${isMobileHeader ? 'w-6 h-6' : 'w-10 h-10'}`}
            aria-label="Clear search"
          >
            <svg 
              className={`text-[#717171] ${isMobileHeader ? 'w-4 h-4' : 'w-5 h-5'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
          
          {/* Divider */}
          <div className={`w-px bg-[#e0e0e0] mx-1 flex-shrink-0 ${isMobileHeader ? 'h-4' : 'h-6'}`} />
        </>
      )}

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className={`bg-[#5A58F2] hover:bg-[#4a48e0] active:bg-[#3d3bc7] text-white flex items-center justify-center transition-colors duration-200 rounded-full flex-shrink-0 search-button-size ${buttonSize}`}
        aria-label="Search"
      >
        <SafeImage 
          alt="Search" 
          className={isMobileHeader ? "w-4 h-4" : "w-5 h-5"} 
          src={IMAGES.search} 
        />
        </button>

      {/* Dropdown Suggestions */}
      {showDropdown && hasSuggestions && (
          <div
          ref={dropdownRef}
          id="unified-search-dropdown"
            role="listbox"
          className={`absolute bg-white rounded-2xl ${variant === 'overlay' ? 'z-[999999]' : 'z-[99999]'} max-h-[400px] overflow-y-auto w-full mt-2 shadow-lg border border-[#e0e0e0] top-full left-0`}
        >
          {/* Brand Suggestions */}
          {showBrands && (
            <>
              {filteredBrands.map((brand, index) => {
                const suggestionIndex = index
                const isHighlighted = highlightedIndex === suggestionIndex
              return (
                <div
                    key={brand.id}
                    id={`suggestion-${suggestionIndex}`}
                  role="option"
                    aria-selected={isHighlighted}
                    onClick={() => selectSuggestion({
                      type: 'brand',
                      id: brand.id,
                      brandName: brand.name,
                      image: brand.image,
                    })}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-[#F6F6F6]' : 'hover:bg-[#F6F6F6]'
                    } ${index < filteredBrands.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}
                  >
                    {/* Brand Image Placeholder */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#f0f0f0] rounded overflow-hidden">
                      <SafeImage 
                        alt={brand.name} 
                        className="w-full h-full object-contain" 
                        src={brand.image || '/images/brands/mcd.png'} 
                      />
                    </div>
                    {/* Brand Name and Badge (Mobile) */}
                    <div className="flex flex-col gap-2 flex-1 md:flex-row md:items-center md:gap-0 md:justify-between">
                      <span className="text-sm text-[#000000] font-semibold flex-1">
                        {brand.name}
                      </span>
                      {/* Badge - Mobile: under brand name, Tablet+: extreme right */}
                      {brand.claimed !== undefined && (
                        <div>
                          {brand.claimed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[#EEE8F7] text-[#6F42C1] shrink-0">
                              <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-3 h-3 shrink-0" />
                              Brand Verified
                            </span>
                          ) : (
                            <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-[6px] text-xs font-medium bg-[#FFCD39] shrink-0">
                              <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-3 h-3 shrink-0" />
                              Publicly Sourced
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                </div>
              )
            })}
              
              {/* Divider between brands and locations */}
              {showLocations && (
                <div className="h-px bg-[#ebebeb] w-full" />
              )}
            </>
          )}

          {/* Location Suggestions */}
          {showLocations && (
            <>
              {filteredLocations.map((location, index) => {
                const suggestionIndex = filteredBrands.length + index
                const isHighlighted = highlightedIndex === suggestionIndex
                return (
                  <div
                    key={location.id}
                    id={`suggestion-${suggestionIndex}`}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => selectSuggestion({
                      type: 'location',
                      id: location.id,
                      brandName: location.brandName,
                      address: location.address,
                    })}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-[#F6F6F6]' : 'hover:bg-[#F6F6F6]'
                    } ${index < filteredLocations.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}
                  >
                    {/* Location Icon */}
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <SafeImage 
                        alt="Location" 
                        className="w-5 h-5" 
                        src={IMAGES.location} 
                      />
                    </div>
                    {/* Brand Name and Address */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-[#000000] font-normal block">
                        {location.brandName}
                      </span>
                      <span className="text-sm text-[#5C5D60] font-normal block">
                        {location.address}
                      </span>
          </div>
                </div>
              )
            })}
            </>
          )}
          </div>
        )}

    </div>
  )
}
