'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { filterBrands, filterLocations } from '../constants/searchData'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { getBrandPageUrl, getBusinessPageUrl } from '../constants/brandNavigation'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type SuggestionType = 'brand' | 'location'

interface Suggestion {
  type: SuggestionType
  id: string
  brandName: string
  address?: string
  image?: string
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // Filter brands and locations
  const filteredBrands = query.trim() ? filterBrands(query).slice(0, 3) : []

  const filteredLocations = query.trim() ? filterLocations(query)
    .filter(location => {
      if (!location.address) return false
      const businessUrl = getBusinessPageUrl(location.address)
      return businessUrl !== null
    })
    .slice(0, 3) : []

  const suggestions: Suggestion[] = [
    ...filteredBrands.map(brand => ({
      type: 'brand' as const,
      id: brand.id,
      brandName: brand.name,
      image: brand.image,
    })),
    ...filteredLocations.map(location => ({
      type: 'location' as const,
      id: location.id,
      brandName: location.brandName,
      address: location.address,
    })),
  ]

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  // Autofocus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    } else {
      setQuery('')
      setHighlightedIndex(-1)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        // Navigate to search page
        const params = new URLSearchParams()
        params.set('q', query.trim())
        router.push(`/search?${params.toString()}`)
        onClose()
      }
    }
  }

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: Suggestion) => {
    if (suggestion.type === 'brand') {
      const brandUrl = getBrandPageUrl(suggestion.brandName)
      if (brandUrl) {
        if (pathname === brandUrl) {
          router.refresh()
        } else {
          router.push(brandUrl)
        }
        onClose()
        return
      }
    } else {
      if (suggestion.address) {
        const businessUrl = getBusinessPageUrl(suggestion.address)
        if (businessUrl) {
          if (pathname === businessUrl) {
            router.refresh()
          } else {
            router.push(businessUrl)
          }
          onClose()
          return
        }
      }
    }
  }, [router, pathname, onClose])

  // Handle search button click
  const handleSearch = () => {
    if (!query.trim()) return
    const params = new URLSearchParams()
    params.set('q', query.trim())
    router.push(`/search?${params.toString()}`)
    onClose()
  }

  const hasSuggestions = suggestions.length > 0
  const showBrands = filteredBrands.length > 0
  const showLocations = filteredLocations.length > 0
  const hasQuery = query.trim().length > 0

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/20 backdrop-blur-sm">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-white flex flex-col"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-end px-4 pt-4 pb-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F6F6F6] transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-4 h-4 text-[#717171]"
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
        </div>

        {/* Search input */}
        <div className="px-4 pb-4">
          <div className="relative w-full bg-white rounded-full border border-[#e0e0e0] shadow-sm flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlightedIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search brands or locations"
              className="flex-1 outline-none text-base text-[#222222] placeholder:text-[#717171] bg-transparent w-full font-normal border-0 p-0 m-0 appearance-none px-5 py-3.5"
            />
            {hasQuery && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setHighlightedIndex(-1)
                    inputRef.current?.focus()
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#F6F6F6] transition-colors flex-shrink-0 mr-1"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4 text-[#717171]"
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
                <div className="w-px h-5 bg-[#e0e0e0] mx-1.5 flex-shrink-0" />
              </>
            )}
            <button
              type="button"
              onClick={handleSearch}
              className="bg-[#5A58F2] hover:bg-[#4a48e0] active:bg-[#3d3bc7] text-white flex items-center justify-center transition-colors duration-200 rounded-full w-8 h-8 m-1.5 flex-shrink-0"
              aria-label="Search"
            >
              <SafeImage
                alt="Search"
                className="w-4 h-4 brightness-0 invert"
                src={IMAGES.search}
              />
            </button>
          </div>
        </div>

        {/* Results as full width rows */}
        {hasQuery && hasSuggestions && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
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
                      className={`w-full flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors ${
                        isHighlighted ? 'bg-[#F6F6F6]' : 'hover:bg-[#F6F6F6]'
                      } ${index < filteredBrands.length - 1 || !showLocations ? 'border-b border-[#ebebeb]' : ''}`}
                    >
                      {/* Brand Image */}
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#f0f0f0] rounded overflow-hidden">
                        <SafeImage
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          src={brand.image || '/images/brands/mcd.png'}
                        />
                      </div>
                      {/* Brand Name and Badge (Mobile) */}
                      <div className="flex flex-col gap-2 flex-1 md:flex-row md:items-center md:gap-0 md:justify-between">
                        <span className="text-base text-[#000000] font-semibold flex-1">
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
              </>
            )}

            {/* Divider between brands and locations - only show if both exist */}
            {showBrands && showLocations && (
              <div className="h-px bg-[#ebebeb] w-full" />
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
                      className={`w-full flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors border-b border-[#ebebeb] ${
                        isHighlighted ? 'bg-[#F6F6F6]' : 'hover:bg-[#F6F6F6]'
                      }`}
                    >
                      {/* Location Icon */}
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <SafeImage
                          alt="Location"
                          className="w-6 h-6"
                          src={IMAGES.location}
                        />
                      </div>
                      {/* Brand Name and Address */}
                      <div className="flex-1 min-w-0">
                        <span className="text-base text-[#000000] font-normal block">
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
    </div>,
    document.body
  )
}

