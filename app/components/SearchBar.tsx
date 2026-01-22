'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '../constants/data'
import { filterBrands, filterLocations } from '../constants/searchData'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'

export function SearchBar() {
  const router = useRouter()
  const [brandQuery, setBrandQuery] = useState('')
  const [categoryValue, setCategoryValue] = useState('All')
  const [locationQuery, setLocationQuery] = useState('')
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)

  const brandRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const brandResults = filterBrands(brandQuery)
  const locationResults = filterLocations(locationQuery)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandQuery(e.target.value)
    setShowBrandDropdown(true)
    setActiveField('brand')
  }

  const handleCategoryClick = () => {
    setShowCategoryDropdown(!showCategoryDropdown)
    setActiveField('category')
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value)
    setShowLocationDropdown(true)
    setActiveField('location')
  }

  const handleBrandSelect = (brand: { name: string; address: string; rating: number }) => {
    setBrandQuery(brand.name)
    setShowBrandDropdown(false)
  }

  const handleCategorySelect = (category: string) => {
    setCategoryValue(category)
    setShowCategoryDropdown(false)
  }

  const handleLocationSelect = (location: string) => {
    setLocationQuery(location)
    setShowLocationDropdown(false)
  }

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (brandQuery.trim()) params.set('brand', brandQuery.trim())
    if (categoryValue.trim() && categoryValue !== 'All') params.set('category', categoryValue.trim())
    if (locationQuery.trim()) params.set('location', locationQuery.trim())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch relative w-full max-w-[850px] bg-white rounded-[12px] shadow-lg overflow-hidden border border-[#ededed]">
      {/* Brand Field */}
      <div ref={brandRef} className="flex-1 relative border-r border-[#ededed] hover:bg-[#f9fafb] transition-colors">
        <div className="flex flex-col p-4 cursor-pointer min-h-[64px] justify-center" onClick={() => setActiveField('brand')}>
          <label className="text-xs font-medium text-[#5b5d60] mb-1">Brand</label>
          <input
            type="text"
            value={brandQuery}
            onChange={handleBrandChange}
            onFocus={() => {
              setShowBrandDropdown(true)
              setActiveField('brand')
            }}
            placeholder="Search brands..."
            className="outline-none text-base text-black placeholder:text-[#9ca3af] bg-transparent w-full"
          />
        </div>
        {showBrandDropdown && brandResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-[#ededed] rounded-b-[8px] shadow-lg z-50 max-h-[300px] overflow-y-auto mt-1">
            {brandResults.map((brand, index) => (
              <div
                key={index}
                onClick={() => handleBrandSelect(brand)}
                className="flex items-center justify-between p-4 hover:bg-[#f9fafb] cursor-pointer border-b border-[#ededed] last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-base text-black mb-1">{brand.name}</p>
                  <p className="text-sm text-[#6f7074]">{brand.address}</p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <span className="text-sm text-black">{brand.rating}</span>
                  <div className="w-[60px] h-[12px]">
                    <SafeImage alt="Stars" className="w-full h-full" src={IMAGES.stars} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Field */}
      <div ref={categoryRef} className="flex-1 relative border-r border-[#ededed] hover:bg-[#f9fafb] transition-colors">
        <div className="flex flex-col p-4 cursor-pointer min-h-[64px] justify-center" onClick={handleCategoryClick}>
          <label className="text-xs font-medium text-[#5b5d60] mb-1">Category</label>
          <div className="flex items-center justify-between">
            <span className="text-base text-black">{categoryValue}</span>
            <svg className="w-4 h-4 text-[#5b5d60]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {showCategoryDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white border border-[#ededed] rounded-b-[8px] shadow-lg z-50 max-h-[300px] overflow-y-auto mt-1">
            <div
              onClick={() => handleCategorySelect('All')}
              className={`p-4 hover:bg-[#f9fafb] cursor-pointer border-b border-[#ededed] ${categoryValue === 'All' ? 'bg-[#f0f0ff]' : ''}`}
            >
              <p className="text-base text-black">All</p>
            </div>
            {categories.map((category, index) => {
              const categoryName = category.name2 ? `${category.name} ${category.name2}` : category.name
              return (
                <div
                  key={index}
                  onClick={() => handleCategorySelect(categoryName)}
                  className={`p-4 hover:bg-[#f9fafb] cursor-pointer border-b border-[#ededed] last:border-b-0 ${categoryValue === categoryName ? 'bg-[#f0f0ff]' : ''}`}
                >
                  <p className="text-base text-black">{categoryName}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Location Field */}
      <div ref={locationRef} className="flex-1 relative border-r border-[#ededed] hover:bg-[#f9fafb] transition-colors">
        <div className="flex flex-col p-4 cursor-pointer min-h-[64px] justify-center" onClick={() => setActiveField('location')}>
          <label className="text-xs font-medium text-[#5b5d60] mb-1">Location</label>
          <input
            type="text"
            value={locationQuery}
            onChange={handleLocationChange}
            onFocus={() => {
              setShowLocationDropdown(true)
              setActiveField('location')
            }}
            placeholder="City, State or Zip Code"
            className="outline-none text-base text-black placeholder:text-[#9ca3af] bg-transparent w-full"
          />
        </div>
        {showLocationDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white border border-[#ededed] rounded-b-[8px] shadow-lg z-50 max-h-[300px] overflow-y-auto mt-1">
            {locationQuery.trim() === '' && (
              <div
                onClick={() => handleLocationSelect('Current location')}
                className="flex items-center gap-2 p-4 hover:bg-[#f9fafb] cursor-pointer border-b border-[#ededed]"
              >
                <svg className="w-5 h-5 text-[#5A58F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-base text-[#5A58F2] font-medium">Current location</p>
              </div>
            )}
            {locationResults.map((location, index) => (
              <div
                key={index}
                onClick={() => handleLocationSelect(location.full)}
                className="p-4 hover:bg-[#f9fafb] cursor-pointer border-b border-[#ededed] last:border-b-0"
              >
                <p className="text-base text-black">{location.full}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[#5A58F2] hover:bg-[#4a48e0] active:bg-[#3d3bc7] text-white px-6 py-4 flex items-center justify-center transition-colors duration-200 min-h-[64px]"
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}
