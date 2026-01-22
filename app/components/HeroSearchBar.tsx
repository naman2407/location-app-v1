'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '../constants/data'
import { brandSuggestions, locationSuggestions } from '../constants/searchData'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

interface Brand {
  id: string
  name: string
  address: string
  rating: number
}

interface Location {
  id: string
  city: string
  state: string
  full: string
}

interface HeroSearchBarProps {
  initialBrand?: string
  initialCategory?: string
  initialLocation?: string
}

export function HeroSearchBar({ initialBrand = '', initialCategory = 'All', initialLocation = '' }: HeroSearchBarProps) {
  const router = useRouter()
  // State
  const [brandQuery, setBrandQuery] = useState(initialBrand)
  const [categoryValue, setCategoryValue] = useState(initialCategory)
  const [locationQuery, setLocationQuery] = useState(initialLocation)
  
  // Update state when initial values change (for URL persistence)
  useEffect(() => {
    if (initialBrand !== undefined) setBrandQuery(initialBrand)
    if (initialCategory !== undefined) setCategoryValue(initialCategory)
    if (initialLocation !== undefined) setLocationQuery(initialLocation)
  }, [initialBrand, initialCategory, initialLocation])
  
  // Dropdown visibility - only one open at a time
  const [openDropdown, setOpenDropdown] = useState<'brand' | 'category' | 'location' | null>(null)
  
  // Keyboard navigation
  const [brandHighlightedIndex, setBrandHighlightedIndex] = useState(-1)
  const [categoryHighlightedIndex, setCategoryHighlightedIndex] = useState(-1)
  const [locationHighlightedIndex, setLocationHighlightedIndex] = useState(-1)
  
  // Focus state
  const [focusedField, setFocusedField] = useState<'brand' | 'category' | 'location' | null>(null)
  
  // Refs
  const brandInputRef = useRef<HTMLInputElement>(null)
  const categoryButtonRef = useRef<HTMLButtonElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const brandDropdownRef = useRef<HTMLDivElement>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtered results - for "taco bell" show only Taco Bell locations
  const brandResults = React.useMemo(() => {
    const lowerQuery = brandQuery.toLowerCase().trim()
    
    // Typeahead: Only show results when user types something
    if (!lowerQuery) return []
    
    // If searching for "taco bell" or "ta" etc, show only Taco Bell locations
    if (lowerQuery.includes('taco bell') || lowerQuery.includes('taco') || lowerQuery.includes('bell')) {
      return brandSuggestions.filter(brand => 
        brand.name.toLowerCase() === 'taco bell'
      )
    }
    
    // Otherwise filter normally
    return brandSuggestions.filter(brand => 
      brand.name.toLowerCase().includes(lowerQuery)
    )
  }, [brandQuery])

  const locationResults = React.useMemo(() => {
    const lowerQuery = locationQuery.toLowerCase().trim()
    // Typeahead: Only show filtered results when user types
    if (!lowerQuery) return []
    return locationSuggestions.filter(location => 
      location.city.toLowerCase().includes(lowerQuery) ||
      location.state.toLowerCase().includes(lowerQuery) ||
      location.full.toLowerCase().includes(lowerQuery)
    )
  }, [locationQuery])

  // Close other dropdowns when opening one
  const openDropdownHandler = (dropdown: 'brand' | 'category' | 'location') => {
    setOpenDropdown(dropdown)
    setFocusedField(dropdown)
  }

  // Click outside handler - use click instead of mousedown to avoid conflicts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      // Don't close if clicking on category button or its children (it toggles)
      if (categoryButtonRef.current?.contains(target)) {
        return
      }
      // Don't close if clicking inside any dropdown
      if (brandDropdownRef.current?.contains(target) || 
          categoryDropdownRef.current?.contains(target) || 
          locationDropdownRef.current?.contains(target)) {
        return
      }
      // Don't close if clicking on inputs
      if (brandInputRef.current?.contains(target) ||
          locationInputRef.current?.contains(target)) {
        return
      }
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpenDropdown(null)
        setFocusedField(null)
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    return () => document.removeEventListener('click', handleClickOutside, true)
  }, [])

  // Brand handlers
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandQuery(e.target.value)
    // Only open dropdown if user is typing (typeahead)
    if (e.target.value.trim()) {
      openDropdownHandler('brand')
    } else {
      setOpenDropdown(null)
    }
    setBrandHighlightedIndex(-1)
  }

  const handleBrandFocus = () => {
    setFocusedField('brand')
    setBrandHighlightedIndex(-1)
    // Only open dropdown if there's a query (typeahead)
    if (brandQuery.trim()) {
      openDropdownHandler('brand')
    }
  }

  const handleBrandClick = () => {
    setFocusedField('brand')
    // Only open dropdown if there's a query (typeahead)
    if (brandQuery.trim()) {
      openDropdownHandler('brand')
    }
  }

  const handleBrandBlur = () => {
    setTimeout(() => {
      if (!brandDropdownRef.current?.contains(document.activeElement)) {
        setOpenDropdown(null)
        if (focusedField === 'brand') setFocusedField(null)
      }
    }, 200)
  }

  const selectBrand = useCallback((brand: Brand) => {
    setBrandQuery(brand.name)
    setOpenDropdown(null)
    setBrandHighlightedIndex(-1)
    brandInputRef.current?.blur()
    
    // Extract city and state from address and update location
    // Address format: "123 Main St, Los Angeles, CA 90001"
    // We want to extract "Los Angeles, CA"
    const addressParts = brand.address.split(',')
    if (addressParts.length >= 2) {
      // Get the city (second to last part) and state (last part, before zip)
      const city = addressParts[addressParts.length - 2].trim()
      const stateAndZip = addressParts[addressParts.length - 1].trim()
      // Extract state (2-letter code before zip code)
      const stateMatch = stateAndZip.match(/^([A-Z]{2})\s*\d+/)
      if (stateMatch) {
        const state = stateMatch[1]
        setLocationQuery(`${city}, ${state}`)
      }
    }
  }, [])

  // Category handlers
  const handleCategoryClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (openDropdown === 'category') {
      setOpenDropdown(null)
      setFocusedField(null)
    } else {
      openDropdownHandler('category')
      setCategoryHighlightedIndex(-1)
    }
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCategoryClick()
    } else if (e.key === 'ArrowDown' && openDropdown === 'category') {
      e.preventDefault()
      const maxIndex = categories.length
      setCategoryHighlightedIndex(prev => Math.min(prev + 1, maxIndex))
    } else if (e.key === 'ArrowUp' && openDropdown === 'category') {
      e.preventDefault()
      setCategoryHighlightedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setOpenDropdown(null)
      categoryButtonRef.current?.blur()
    }
  }

  const selectCategory = useCallback((categoryName: string) => {
    setCategoryValue(categoryName)
    setOpenDropdown(null)
    setCategoryHighlightedIndex(-1)
    categoryButtonRef.current?.blur()
  }, [])

  // Location handlers
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value)
    // Always open dropdown when typing (typeahead)
    openDropdownHandler('location')
    setLocationHighlightedIndex(-1)
  }

  const handleLocationFocus = () => {
    // Always show dropdown on focus (shows "Current location" when empty)
    openDropdownHandler('location')
    setLocationHighlightedIndex(-1)
  }

  const handleLocationClick = () => {
    // Always show dropdown on click (shows "Current location" when empty)
    openDropdownHandler('location')
  }

  const handleLocationBlur = () => {
    setTimeout(() => {
      if (!locationDropdownRef.current?.contains(document.activeElement)) {
        setOpenDropdown(null)
        if (focusedField === 'location') setFocusedField(null)
      }
    }, 200)
  }

  const selectLocation = useCallback((location: string) => {
    setLocationQuery(location)
    setOpenDropdown(null)
    setLocationHighlightedIndex(-1)
    locationInputRef.current?.blur()
  }, [])

  // Brand keyboard navigation
  const handleBrandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (openDropdown !== 'brand' || brandResults.length === 0) {
      if (e.key === 'Tab') {
        setOpenDropdown(null)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setBrandHighlightedIndex(prev => Math.min(prev + 1, brandResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setBrandHighlightedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (brandHighlightedIndex >= 0 && brandHighlightedIndex < brandResults.length) {
        selectBrand(brandResults[brandHighlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setOpenDropdown(null)
      brandInputRef.current?.blur()
    }
  }

  // Location keyboard navigation
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // "Current location" is always first option, then filtered results
    const totalOptions = locationResults.length + 1

    if (openDropdown !== 'location' || totalOptions === 0) {
      if (e.key === 'Tab') {
        setOpenDropdown(null)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setLocationHighlightedIndex(prev => Math.min(prev + 1, totalOptions - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setLocationHighlightedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (locationHighlightedIndex === 0) {
        selectLocation('Current location')
      } else if (locationHighlightedIndex > 0 && locationHighlightedIndex - 1 < locationResults.length) {
        selectLocation(locationResults[locationHighlightedIndex - 1].full)
      }
    } else if (e.key === 'Escape') {
      setOpenDropdown(null)
      locationInputRef.current?.blur()
    }
  }

  // Category keyboard navigation
  useEffect(() => {
    if (openDropdown !== 'category') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && categoryHighlightedIndex >= 0) {
        e.preventDefault()
        if (categoryHighlightedIndex === 0) {
          selectCategory('All')
        } else {
          const category = categories[categoryHighlightedIndex - 1]
          const categoryName = category.name2 ? `${category.name} ${category.name2}` : category.name
          selectCategory(categoryName)
        }
      } else if (e.key === 'Escape') {
        setOpenDropdown(null)
        categoryButtonRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openDropdown, categoryHighlightedIndex, selectCategory])

  // Search handler - brand is required
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    // Brand is required
    if (!brandQuery.trim()) {
      // Focus on brand input if empty
      brandInputRef.current?.focus()
      return
    }
    
    const finalLocation = locationQuery.trim() || 'New York, NY'
    if (!locationQuery.trim()) {
      setLocationQuery('New York, NY')
    }
    const params = new URLSearchParams()
    params.set('brand', brandQuery.trim())
    if (categoryValue.trim() && categoryValue !== 'All') params.set('category', categoryValue.trim())
    if (finalLocation.trim()) params.set('location', finalLocation.trim())
    router.push(`/search?${params.toString()}`)
  }

  // Scroll highlighted item into view
  useEffect(() => {
    if (brandHighlightedIndex >= 0 && brandDropdownRef.current) {
      const item = brandDropdownRef.current.children[brandHighlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [brandHighlightedIndex])

  useEffect(() => {
    if (locationHighlightedIndex >= 0 && locationDropdownRef.current) {
      const item = locationDropdownRef.current.children[locationHighlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [locationHighlightedIndex])

  useEffect(() => {
    if (categoryHighlightedIndex >= 0 && categoryDropdownRef.current) {
      const item = categoryDropdownRef.current.children[categoryHighlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [categoryHighlightedIndex])

  const isFocused = focusedField !== null
  const categoryName = categoryValue

  return (
    <div 
      ref={containerRef}
      className="flex flex-col sm:flex-row items-stretch relative w-full max-w-[850px] bg-white rounded-full border border-[#e0e0e0] search-bar-container"
    >
      {/* Brand Field */}
      <div 
        className={`flex-1 relative search-field-wrapper ${
          focusedField === 'brand' ? 'bg-white' : ''
        }`}
      >
        <div className="flex flex-col px-6 py-3 min-h-[64px] justify-center search-field-inner">
          <label htmlFor="brand-input" className="text-[10px] font-semibold text-[#717171] mb-1 uppercase tracking-wide">
            Brand
          </label>
          <input
            id="brand-input"
            ref={brandInputRef}
            type="text"
            value={brandQuery}
            onChange={handleBrandChange}
            onFocus={handleBrandFocus}
            onClick={handleBrandClick}
            onBlur={handleBrandBlur}
            onKeyDown={handleBrandKeyDown}
            placeholder="Search By Brands"
            className="outline-none text-sm text-[#222222] placeholder:text-[#717171] bg-transparent w-full font-normal border-0 p-0 m-0 appearance-none search-input-reset"
            aria-expanded={openDropdown === 'brand'}
            aria-autocomplete="list"
            aria-controls="brand-dropdown"
            aria-activedescendant={brandHighlightedIndex >= 0 ? `brand-option-${brandHighlightedIndex}` : undefined}
          />
        </div>
        {openDropdown === 'brand' && brandResults.length > 0 && (
          <div
            ref={brandDropdownRef}
            id="brand-dropdown"
            role="listbox"
            className="absolute bg-white rounded-2xl z-[9999] max-h-[400px] overflow-y-auto search-dropdown search-dropdown-brand"
          >
            {brandResults.map((brand, index) => (
              <div
                key={brand.id}
                id={`brand-option-${index}`}
                role="option"
                aria-selected={brandHighlightedIndex === index}
                onClick={() => selectBrand(brand)}
                className={`flex items-center justify-between px-5 py-4 cursor-pointer border-b border-[#ebebeb] last:border-b-0 transition-colors ${
                  brandHighlightedIndex === index ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-medium text-sm text-[#222222] mb-1">{brand.name}</p>
                  <p className="text-xs text-[#717171] break-words">{brand.address}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-sm text-[#222222] font-medium">{brand.rating}</span>
                  <div className="w-[12px] h-[12px]">
                    <SafeImage alt="Stars" className="w-full h-full" src={IMAGES.star_single} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Field */}
      <div 
        className={`flex-1 relative transition-colors duration-150 search-field-wrapper ${
          focusedField === 'category' ? 'bg-white' : 'hover:bg-[#f7f7f7]'
        }`}
      >
        <button
          ref={categoryButtonRef}
          type="button"
          onClick={handleCategoryClick}
          onKeyDown={handleCategoryKeyDown}
          className="flex flex-col px-6 py-3 cursor-pointer min-h-[64px] justify-center w-full text-left"
          aria-expanded={openDropdown === 'category'}
          aria-haspopup="listbox"
          aria-controls="category-dropdown"
        >
          <label className="text-[10px] font-semibold text-[#717171] mb-1 uppercase tracking-wide">Category</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#222222] font-normal truncate">{categoryName}</span>
            <svg 
              className={`w-4 h-4 text-[#717171] flex-shrink-0 ml-2 transition-transform duration-200 ${
                openDropdown === 'category' ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {openDropdown === 'category' && (
          <div
            ref={categoryDropdownRef}
            id="category-dropdown"
            role="listbox"
            className="absolute bg-white rounded-2xl z-[9999] max-h-[400px] overflow-y-auto search-dropdown w-full"
          >
            <div
              role="option"
              aria-selected={categoryHighlightedIndex === 0}
              onClick={() => selectCategory('All')}
              className={`px-5 py-4 cursor-pointer border-b border-[#ebebeb] transition-colors ${
                categoryValue === 'All' ? 'bg-[#f7f7f7] font-medium' : ''
              } ${
                categoryHighlightedIndex === 0 ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'
              }`}
            >
              <p className="text-sm text-[#222222]">All</p>
            </div>
            {categories.map((category, index) => {
              const catName = category.name2 ? `${category.name} ${category.name2}` : category.name
              const optionIndex = index + 1
              return (
                <div
                  key={index}
                  role="option"
                  aria-selected={categoryHighlightedIndex === optionIndex}
                  onClick={() => selectCategory(catName)}
                  className={`px-5 py-4 cursor-pointer border-b border-[#ebebeb] last:border-b-0 transition-colors ${
                    categoryValue === catName ? 'bg-[#f7f7f7] font-medium' : ''
                  } ${
                    categoryHighlightedIndex === optionIndex ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'
                  }`}
                >
                  <p className="text-sm text-[#222222]">{catName}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Location Field */}
      <div 
        className={`flex-1 relative ${
          focusedField === 'location' ? 'bg-white' : ''
        }`}
      >
        <div className="flex flex-col px-6 py-3 min-h-[64px] justify-center search-field-inner">
          <label htmlFor="location-input" className="text-[10px] font-semibold text-[#717171] mb-1 uppercase tracking-wide">
            Location
          </label>
          <div className="relative flex items-center">
            {locationQuery === 'Current location' && (
              <svg 
                className="w-5 h-5 text-[#5A58F2] flex-shrink-0 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <input
              id="location-input"
              ref={locationInputRef}
              type="text"
              value={locationQuery}
              onChange={handleLocationChange}
              onFocus={handleLocationFocus}
              onClick={handleLocationClick}
              onBlur={handleLocationBlur}
              onKeyDown={handleLocationKeyDown}
              placeholder="City, State or Zip Code"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              data-form-type="other"
              className={`outline-none text-sm font-normal border-0 p-0 m-0 appearance-none w-full search-input-reset ${
                locationQuery === 'Current location' 
                  ? 'text-[#5A58F2]' 
                  : 'text-[#222222] placeholder:text-[#717171]'
              }`}
              aria-expanded={openDropdown === 'location'}
              aria-autocomplete="list"
              aria-controls="location-dropdown"
              aria-activedescendant={locationHighlightedIndex >= 0 ? `location-option-${locationHighlightedIndex}` : undefined}
            />
          </div>
        </div>
        {openDropdown === 'location' && (
          <div
            ref={locationDropdownRef}
            id="location-dropdown"
            role="listbox"
            className="absolute bg-white rounded-2xl z-[9999] max-h-[400px] overflow-y-auto search-dropdown w-full"
          >
            {/* Show "Current location" only when query is empty */}
            {locationQuery.trim() === '' && (
              <div
                id="location-option-0"
                role="option"
                aria-selected={locationHighlightedIndex === 0}
                onClick={() => selectLocation('Current location')}
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-[#ebebeb] transition-colors ${
                  locationHighlightedIndex === 0 ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'
                }`}
              >
                <svg className="w-5 h-5 text-[#5A58F2] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-[#5A58F2] font-medium">Current location</p>
              </div>
            )}
            {/* Show filtered location results */}
            {locationResults.map((location, index) => {
              const optionIndex = locationQuery.trim() === '' ? index + 1 : index
              return (
                <div
                  key={location.id}
                  id={`location-option-${optionIndex}`}
                  role="option"
                  aria-selected={locationHighlightedIndex === optionIndex}
                  onClick={() => selectLocation(location.full)}
                  className={`px-5 py-4 cursor-pointer border-b border-[#ebebeb] last:border-b-0 transition-colors ${
                    locationHighlightedIndex === optionIndex ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'
                  }`}
                >
                  <p className="text-sm text-[#222222]">{location.full}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Search Button - Circular/Round */}
      <button
        onClick={handleSearch}
        type="button"
        className="bg-[#5A58F2] hover:bg-[#4a48e0] active:bg-[#3d3bc7] text-white flex items-center justify-center transition-colors duration-200 rounded-full m-2 flex-shrink-0 search-button-size"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}
