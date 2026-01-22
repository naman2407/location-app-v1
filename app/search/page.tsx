'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { searchResults, categoryResults, SearchResult } from '../constants/searchResults'
import { SafeImage } from '../components/SafeImage'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from '../components/HeroSearchBar'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Link as CustomLink } from '../components/Link'
import { ClaimedTooltip } from '../components/ClaimedTooltip'

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent').then((mod) => ({ default: mod.MapComponent })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-[20px] flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const brand = searchParams?.get('brand') || null
  const category = searchParams?.get('category') || null
  const location = searchParams?.get('location') || null

  // Filters
  const [openNow, setOpenNow] = useState(false)
  const [ratingFilter, setRatingFilter] = useState('any')
  const [claimStatus, setClaimStatus] = useState('all')
  const [sortBy, setSortBy] = useState('highest-rated')
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false)
  const [claimStatusDropdownOpen, setClaimStatusDropdownOpen] = useState(false)
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false)
  const ratingDropdownRef = useRef<HTMLDivElement>(null)
  const claimStatusDropdownRef = useRef<HTMLDivElement>(null)
  const sortByDropdownRef = useRef<HTMLDivElement>(null)
  const cardsListRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLAnchorElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target as Node)) {
        setRatingDropdownOpen(false)
      }
      if (claimStatusDropdownRef.current && !claimStatusDropdownRef.current.contains(event.target as Node)) {
        setClaimStatusDropdownOpen(false)
      }
      if (sortByDropdownRef.current && !sortByDropdownRef.current.contains(event.target as Node)) {
        setSortByDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get initial results based on search type - brand is required
  const initialResults = useMemo(() => {
    if (brand && brand.toLowerCase().includes('taco bell')) {
      return searchResults.filter((r) => r.name.toLowerCase() === 'taco bell')
    }
    if (category) {
      const decodedCategory = decodeURIComponent(category)
      return categoryResults[decodedCategory] || []
    }
    // Return empty array if no brand is provided
    return []
  }, [brand, category])

  // Apply filters and sorting
  const filteredResults = useMemo(() => {
    let results = [...initialResults]

    if (openNow) {
      results = results.filter((r) => r.isOpen)
    }

    if (ratingFilter !== 'any') {
      const minRating = parseFloat(ratingFilter)
      results = results.filter((r) => r.rating >= minRating)
    }

    if (claimStatus === 'claimed') {
      results = results.filter((r) => r.claimed)
    } else if (claimStatus === 'unclaimed') {
      results = results.filter((r) => !r.claimed)
    }

    // Apply sorting
    switch (sortBy) {
      case 'highest-rated':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest-rated':
        results.sort((a, b) => a.rating - b.rating)
        break
      case 'most-reviewed':
        results.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'least-reviewed':
        results.sort((a, b) => a.reviewCount - b.reviewCount)
        break
    }

    return results
  }, [initialResults, openNow, ratingFilter, claimStatus, sortBy])

  // Determine title and breadcrumbs
  const pageTitle = useMemo(() => {
    if (brand) {
      if (location && location.toLowerCase().includes('current location')) {
        return `${brand} locations near you`
      } else if (location) {
        return `${brand} locations in ${location}`
      }
      return `${brand} Locations`
    }
    if (category) {
      const decodedCategory = decodeURIComponent(category)
      return `${decodedCategory} Services`
    }
    return 'Search Results'
  }, [brand, category, location])

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const paginatedResults = filteredResults.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [openNow, ratingFilter, claimStatus, sortBy, filteredResults.length])

  // Scroll to first result when page changes
  useEffect(() => {
    if (firstCardRef.current) {
      firstCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentPage])

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', href: '/' }]
    
    // Determine category - default to "Food & Dining" for brand searches
    let categoryLabel = 'Food & Dining'
    if (category) {
      categoryLabel = decodeURIComponent(category)
    }
    
    if (brand) {
      // For brand searches: Home / Category / Brand Name
      crumbs.push({ label: categoryLabel, href: `/search?category=${encodeURIComponent(categoryLabel)}` })
      crumbs.push({ label: brand, href: `#` })
    } else if (category) {
      // For category-only searches: Home / Category Name
      crumbs.push({ label: categoryLabel, href: `#` })
    }
    
    return crumbs
  }, [brand, category])

  const handleLocationClick = (slug: string) => {
    setSelectedLocationSlug(slug)
    // Scroll to the clicked location card
    const element = document.getElementById(`location-${slug}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Get rating filter label
  const getRatingLabel = () => {
    if (ratingFilter === 'any') return 'Rating'
    return `Rating: ${ratingFilter}+`
  }

  // Get claim status label
  const getClaimStatusLabel = () => {
    if (claimStatus === 'all') return 'Claim Status'
    return `Status: ${claimStatus.charAt(0).toUpperCase() + claimStatus.slice(1)}`
  }

  // Get sort by label
  const getSortByLabel = () => {
    const labels: Record<string, string> = {
      'highest-rated': 'Highest Rated',
      'lowest-rated': 'Lowest Rated',
      'most-reviewed': 'Most Reviewed',
      'least-reviewed': 'Least Reviewed',
    }
    return labels[sortBy] || 'Highest Rated'
  }

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      {/* Header Section - Fixed height */}
      <div className="flex flex-col items-start relative w-full flex-shrink-0 flex-none">
        {/* Custom Header with Search Bar - Matches Header component exactly */}
        <div className="bg-white relative w-full">
          <div className="relative flex items-center justify-center md:justify-between overflow-hidden px-4 sm:px-8 lg:px-8 xl:px-[150px] h-[96px] w-full max-w-[1440px] mx-auto">
            {/* Mobile/Tablet hamburger button */}
            <button
              className="absolute left-4 sm:left-8 lg:left-8 xl:left-[150px] flex items-center md:hidden text-sm font-medium text-black z-10"
            aria-label="Menu"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          </button>

          {/* Logo - centered on mobile/tablet, left on desktop */}
          <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
            <a href="/" aria-label="Home">
              <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
        </a>
      </div>

          {/* Search Bar in Middle - Hidden on mobile/tablet, shown on desktop (md+) */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
            <HeroSearchBar 
              initialBrand={brand || ''}
              initialCategory={category || 'All'}
              initialLocation={location || ''}
            />
          </div>

          {/* Desktop link on right */}
          <div className="hidden md:flex items-center justify-center">
            <CustomLink href="#" className="font-medium leading-[24px] text-sm sm:text-[16px] text-center">
              ABCD for Businesses
            </CustomLink>
          </div>
          </div>
        </div>

        {/* Mobile/Tablet Search Bar - Below header */}
        <div className="md:hidden w-full px-4 sm:px-8 lg:px-8 xl:px-[150px] pb-4">
          <HeroSearchBar 
            initialBrand={brand || ''}
            initialCategory={category || 'All'}
            initialLocation={location || ''}
          />
        </div>
      </div>

      {/* Main Content - Grows to fill remaining space */}
      <div className="w-full px-4 sm:px-8 lg:px-8 xl:px-[150px] py-6 lg:py-8 flex-1 flex flex-col max-w-[1440px] mx-auto min-h-0">
        {/* Breadcrumbs */}
        <nav className="breadcrumb-container flex items-center mb-4 flex-none">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <span className="breadcrumb-separator mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <a href={crumb.href} className="hover:underline">
                  {crumb.label}
                </a>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-[#1c1d20] mb-4 flex-none">
          {filteredResults.length === 0 
            ? `No results found for ${brand || category || 'your search'}` 
            : pageTitle}
        </h1>

        {/* No Results State */}
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-0">
            <div className="flex flex-col items-center text-center max-w-[420px] w-full">
              {/* Illustration */}
              <SafeImage
                alt="No results"
                className="mb-7"
                src={IMAGES.noResult}
              />
              
              {/* Title */}
              <h2 className="text-lg font-semibold text-center mb-2">
                Can't find what you're looking for?
              </h2>
              
              {/* Description */}
              <p className="text-sm font-normal text-[#5C5D60] text-center mb-[28px]">
                No results were found. Try adjusting your search, or contact our team for help adding or updating a business listing.
              </p>
              
              {/* CTA Button */}
              <button 
                className="my-2 px-[14px] py-2 bg-[#5A58F2] text-white text-base font-normal rounded-full hover:opacity-90 transition-opacity"
              >
                Get in touch
              </button>
            </div>
          </div>
        ) : (
          /* Main Content: 50% Cards, 50% Map - Filters aligned horizontally */
          <>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch overflow-visible">
          {/* Left Side - Cards (50%) */}
          <aside className="w-full lg:w-[50%] flex flex-col gap-3 lg:h-[800px] overflow-visible">

            {/* Filters Row - Line 1 */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {/* Filters Label */}
              <span className="text-sm text-[#5C5D60] font-normal w-[55px] shrink-0">Filters:</span>
              
              {/* Filters Container - Ensures consistent left alignment on mobile */}
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                {/* Quick Filter - Open Now */}
                <button
                  onClick={() => setOpenNow(!openNow)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-regular rounded-full border transition-all flex items-center gap-2 ${
                    openNow
                      ? 'bg-[#E8E7FF] text-[#1c1d20] border-[#5a58f2]'
                      : 'bg-white text-[#1c1d20] border-[#ededed] hover:bg-[#F6F6F6]'
                  }`}
                >
                  {openNow && (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Open Now
                </button>

                {/* Rating Filter Pill with Dropdown */}
                <div className="relative" ref={ratingDropdownRef}>
                <button
                  onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-normal rounded-full border transition-all flex items-center gap-2 min-w-0 max-w-[140px] ${
                    ratingFilter !== 'any'
                      ? 'bg-white text-[#1c1d20] border-[#5a58f2]'
                      : 'bg-white text-[#1c1d20] border-[#ededed] hover:bg-[#F6F6F6]'
                  }`}
                >
                  <span className="truncate min-w-0 flex-1">{getRatingLabel()}</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${ratingDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {ratingDropdownOpen && typeof document !== 'undefined' && createPortal(
                  <div 
                    className="fixed bg-white border border-[#ededed] rounded-lg shadow-lg min-w-[160px]"
                    style={{ 
                      zIndex: 9999,
                      top: ratingDropdownRef.current ? ratingDropdownRef.current.getBoundingClientRect().bottom + 4 + window.scrollY : 0,
                      left: ratingDropdownRef.current ? ratingDropdownRef.current.getBoundingClientRect().left + window.scrollX : 0,
                    }}
                  >
                    <div className="p-1.5 flex flex-col gap-0.5">
                      <button
                        onClick={() => { setRatingFilter('any'); setRatingDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          ratingFilter === 'any' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        Any
                      </button>
                      <button
                        onClick={() => { setRatingFilter('3.5'); setRatingDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          ratingFilter === '3.5' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        3.5+
                      </button>
                      <button
                        onClick={() => { setRatingFilter('4.0'); setRatingDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          ratingFilter === '4.0' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        4.0+
                      </button>
                      <button
                        onClick={() => { setRatingFilter('4.5'); setRatingDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          ratingFilter === '4.5' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        4.5+
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Claim Status Filter Pill with Dropdown */}
              <div className="relative" ref={claimStatusDropdownRef}>
                <button
                  onClick={() => setClaimStatusDropdownOpen(!claimStatusDropdownOpen)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-normal rounded-full border transition-all flex items-center gap-2 min-w-0 max-w-[160px] ${
                    claimStatus !== 'all'
                      ? 'bg-white text-[#1c1d20] border-[#5a58f2]'
                      : 'bg-white text-[#1c1d20] border-[#ededed] hover:bg-[#F6F6F6]'
                  }`}
                >
                  <span className="truncate min-w-0 flex-1">{getClaimStatusLabel()}</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${claimStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {claimStatusDropdownOpen && typeof document !== 'undefined' && createPortal(
                  <div 
                    className="fixed bg-white border border-[#ededed] rounded-lg shadow-lg min-w-[180px]"
                    style={{ 
                      zIndex: 9999,
                      top: claimStatusDropdownRef.current ? claimStatusDropdownRef.current.getBoundingClientRect().bottom + 4 + window.scrollY : 0,
                      left: claimStatusDropdownRef.current ? claimStatusDropdownRef.current.getBoundingClientRect().left + window.scrollX : 0,
                    }}
                  >
                    <div className="p-1.5 flex flex-col gap-0.5">
                      <button
                        onClick={() => { setClaimStatus('all'); setClaimStatusDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          claimStatus === 'all' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => { setClaimStatus('claimed'); setClaimStatusDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          claimStatus === 'claimed' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        Claimed
                      </button>
                      <button
                        onClick={() => { setClaimStatus('unclaimed'); setClaimStatusDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                          claimStatus === 'unclaimed' 
                            ? 'bg-[#F5EFFF] text-[#000000]' 
                            : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                        }`}
                      >
                        Unclaimed
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
              </div>
                  </div>

            {/* Meta Row - Line 2 */}
            <div className="flex items-center gap-2 mb-4">
              {/* Sort By - Static Label + Pill */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#5C5D60] font-normal w-[55px]">Sort By:</span>
                <div className="relative" ref={sortByDropdownRef}>
                  <button
                    onClick={() => setSortByDropdownOpen(!sortByDropdownOpen)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-normal rounded-full border border-[#ededed] bg-white text-[#1c1d20] hover:bg-[#F6F6F6] transition-all flex items-center gap-2 min-w-0 max-w-[160px]"
                  >
                    <span className="truncate min-w-0 flex-1">{getSortByLabel()}</span>
                    <svg className={`w-4 h-4 shrink-0 transition-transform ${sortByDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {sortByDropdownOpen && typeof document !== 'undefined' && createPortal(
                    <div 
                      className="fixed bg-white border border-[#ededed] rounded-lg shadow-lg min-w-[180px]"
                      style={{ 
                        zIndex: 9999,
                        top: sortByDropdownRef.current ? sortByDropdownRef.current.getBoundingClientRect().bottom + 4 + window.scrollY : 0,
                        left: sortByDropdownRef.current ? sortByDropdownRef.current.getBoundingClientRect().left + window.scrollX : 0,
                      }}
                    >
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <button
                          onClick={() => { setSortBy('highest-rated'); setSortByDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                            sortBy === 'highest-rated' 
                              ? 'bg-[#F5EFFF] text-[#000000]' 
                              : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                          }`}
                        >
                          Highest Rated
                        </button>
                        <button
                          onClick={() => { setSortBy('lowest-rated'); setSortByDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                            sortBy === 'lowest-rated' 
                              ? 'bg-[#F5EFFF] text-[#000000]' 
                              : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                          }`}
                        >
                          Lowest Rated
                        </button>
                        <button
                          onClick={() => { setSortBy('most-reviewed'); setSortByDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                            sortBy === 'most-reviewed' 
                              ? 'bg-[#F5EFFF] text-[#000000]' 
                              : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                          }`}
                        >
                          Most Reviewed
                        </button>
                        <button
                          onClick={() => { setSortBy('least-reviewed'); setSortByDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm font-normal transition-colors rounded-md ${
                            sortBy === 'least-reviewed' 
                              ? 'bg-[#F5EFFF] text-[#000000]' 
                              : 'text-[#1c1d20] hover:bg-gray-100 hover:text-[#000000]'
                          }`}
                        >
                          Least Reviewed
                        </button>
                  </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
                {/* Separator Dot */}
                <span className="w-1 h-1 rounded-full bg-[#5C5D60]"></span>
                {/* Result Count */}
                <span className="text-sm text-[#5C5D60] font-regular">{filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}</span>

            </div>
            {/* Cards List - Scrollable - Limited to 5 cards height */}
            <div ref={cardsListRef} className="flex flex-col gap-3 overflow-y-auto lg:max-h-[700px] hide-scrollbar">
              {paginatedResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No locations found matching your filters.</p>
                </div>
              ) : (
                paginatedResults.map((result, index) => {
                  const cardNumber = startIndex + index + 1
                  const isFirstCard = index === 0
                  const isOpen = result.isOpen
                  const statusColor = isOpen ? '#39852e' : '#d53e3c'
                  const statusText = isOpen ? 'Open Now' : 'Closed'
                  
                  // Parse hours from openText - extract time after "Closes" or "Opens"
                  let hours = ''
                  if (result.openText.includes('Closes')) {
                    const match = result.openText.match(/Closes (.+)/)
                    hours = match ? match[1] : ''
                  } else if (result.openText.includes('Opens')) {
                    const match = result.openText.match(/Opens (.+)/)
                    hours = match ? match[1] : ''
                  } else if (result.openText.includes('24 hours')) {
                    hours = '24 hours'
                  }
                  
                  // Use hours field if available, otherwise use parsed value
                  const displayHours = result.hours || hours
                  
                  // Determine image source: 
                  // - If business has imageUrl, use it (matches hero image)
                  // - If unclaimed and no imageUrl, use stores.svg for card only
                  // - Otherwise use image or fallback
                  const cardImage = result.imageUrl 
                    ? result.imageUrl 
                    : (!result.claimed && !result.imageUrl && !result.image)
                      ? '/images/illustrations/stores.svg'
                      : (result.image || IMAGES.heroBackground)
                  
                  return (
                    <Link
                      ref={isFirstCard ? firstCardRef : null}
                      key={result.slug}
                      id={`location-${result.slug}`}
                      href={`/business/${result.slug}${category || location ? `?${new URLSearchParams({
                        ...(category && category !== 'All' ? { category } : {}),
                        ...(location ? { location } : {})
                      }).toString()}` : ''}`}
                      onClick={() => setSelectedLocationSlug(result.slug)}
                      className={`card-border-normal block rounded-[8px] border-2 ${
                        selectedLocationSlug === result.slug
                          ? 'border-[#5A58F2]'
                          : 'border-transparent'
                      } bg-white p-4 transition-all cursor-pointer`}
                    >
                      {/* Desktop/Tablet: Number | Image | Content (all in one row, content wraps indented with image) */}
                      {/* Mobile: Number + Image on first row, content on second row indented with image */}
                      <div className="flex flex-col md:flex-row items-start gap-3">
                        {/* Mobile: Number + Image on first row */}
                        <div className="flex items-start gap-3 md:hidden w-full">
                          {/* Number Circle */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5a58f2] text-white flex items-center justify-center font-semibold text-sm">
                            {cardNumber}
                          </div>
                          
                          {/* Image */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-[#ededed] bg-gray-100">
                            <SafeImage
                              alt={result.name}
                              className="w-full h-full object-cover"
                              src={cardImage}
                            />
                          </div>
                        </div>
                        
                        {/* Desktop/Tablet: Number | Image | Content in one row */}
                        <div className="hidden md:flex items-start gap-3 flex-1 min-w-0">
                          {/* Number Circle */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5a58f2] text-white flex items-center justify-center font-semibold text-sm">
                            {cardNumber}
                          </div>
                          
                          {/* Image */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-[#ededed] bg-gray-100">
                            <SafeImage
                              alt={result.name}
                              className="w-full h-full object-cover"
                              src={cardImage}
                            />
                          </div>
                          
                          {/* Content - wraps and aligns with image */}
                          <div className="flex-1 min-w-0">
                            {/* Title */}
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-base font-semibold text-[#1c1d20]">{result.name}</p>
                              {result.claimed === true && (
                                <ClaimedTooltip tooltipText="This profile has been claimed by the business owner or representative.">
                                  <SafeImage
                                    alt="Claimed"
                                    className="shrink-0 w-[24px] h-[24px]"
                                    src={IMAGES.claimed}
                                  />
                                </ClaimedTooltip>
                              )}
                            </div>
                            
                            {/* Address */}
                            <p className="text-sm text-[#6b6d71] mb-2">{result.address}</p>
                            
                            {/* Rating Number + Stars + Review Count */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-[#1c1d20]">{result.rating.toFixed(1)}</span>
                              <SafeImage
                                alt="Stars"
                                className="w-20 h-4"
                                src={IMAGES.stars}
                              />
                              <span className="text-xs text-[#6b6d71]">({result.reviewCount})</span>
                            </div>
                            
                            {/* Status, Hours, Phone */}
                            <div className="flex items-center gap-2 flex-wrap text-xs mb-2">
                              <span className={`font-semibold ${isOpen ? 'status-open' : 'status-closed'}`}>{statusText}</span>
                              {displayHours && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-[#5C5D60]"></span>
                                  <span className="text-[#5C5D60] font-normal">{displayHours}</span>
                                </>
                              )}
                              {result.phone && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-[#5C5D60]"></span>
                                  <span 
                                    className="text-[#5A58F2] hover:underline cursor-pointer font-normal"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      e.preventDefault()
                                      window.location.href = `tel:${result.phone}`
                                    }}
                                  >
                                    {result.phone}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* Category Tag - Moved after status/phone/hours */}
                            <div className="flex items-center gap-1.5">
                              <SafeImage
                                alt="Tag"
                                className="w-4 h-4"
                                src={IMAGES.tag}
                              />
                              <span className="text-xs text-[#6b6d71] font-regular">{result.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mobile: Content on second row - indented to align with image */}
                        <div className="flex-1 min-w-0 md:hidden ml-[44px]">
                          {/* Title */}
                          <div className="flex items-center gap-1 mb-1">
                            <p className="text-base font-semibold text-[#1c1d20]">{result.name}</p>
                            {result.claimed === true && (
                              <ClaimedTooltip 
                                tooltipText="This profile has been claimed by the business owner or representative."
                                scrollableContainer={cardsListRef.current}
                              >
                                <SafeImage
                                  alt="Claimed"
                                  className="shrink-0 w-[24px] h-[24px]"
                                  src={IMAGES.claimed}
                                />
                              </ClaimedTooltip>
                            )}
          </div>
                          
                          {/* Address */}
                          <p className="text-sm text-[#6b6d71] mb-2">{result.address}</p>
                          
                          {/* Rating Number + Stars + Review Count */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-[#1c1d20]">{result.rating.toFixed(1)}</span>
                            <SafeImage
                              alt="Stars"
                              className="w-20 h-4"
                              src={IMAGES.stars}
                            />
                            <span className="text-xs text-[#6b6d71]">({result.reviewCount})</span>
                          </div>
                          
                          {/* Status, Hours, Phone */}
                          <div className="flex items-center gap-2 flex-wrap text-xs mb-2">
                            <span className={`font-semibold ${isOpen ? 'status-open' : 'status-closed'}`}>{statusText}</span>
                            {displayHours && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[#5C5D60]"></span>
                                <span className="text-[#5C5D60] font-normal">{displayHours}</span>
                              </>
                            )}
                            {result.phone && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[#5C5D60]"></span>
                                <span 
                                  className="text-[#5A58F2] hover:underline cursor-pointer font-normal"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    window.location.href = `tel:${result.phone}`
                                  }}
                                >
                                  {result.phone}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {/* Category Tag - Moved after status/phone/hours */}
                          <div className="flex items-center gap-1.5">
                            <SafeImage
                              alt="Tag"
                              className="w-4 h-4"
                              src={IMAGES.tag}
                            />
                            <span className="text-xs text-[#6b6d71] font-regular">{result.category}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Pagination - Yext UI Kit Style */}
            {filteredResults.length > 0 && (
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full border border-[#ededed] bg-white text-[#1c1d20] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#5A58F2] transition-colors flex items-center justify-center"
                  aria-label="Previous page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                <span className="text-sm text-[#767676]">
                  Page {currentPage} of {totalPages}
              </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-full border border-[#ededed] bg-white text-[#1c1d20] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#5A58F2] transition-colors flex items-center justify-center"
                  aria-label="Next page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
            </button>
          </div>
            )}
          </aside>

          {/* Right Side - Map (50%) */}
          <section className="hidden lg:flex w-full lg:w-[50%] flex-col lg:h-[800px]">
            <MapComponent
              locations={paginatedResults.map((r, index) => ({
                slug: r.slug,
                name: r.name,
                lat: r.lat,
                lng: r.lng,
                address: r.address,
                rating: r.rating,
                reviewCount: r.reviewCount,
                number: startIndex + index + 1,
              }))}
              selectedLocation={selectedLocationSlug}
              onLocationClick={handleLocationClick}
            />
          </section>
          </div>
          </>
        )}
      </div>
      
      {/* Footer - Fixed at bottom */}
      <Footer />
    </div>
  )
}
