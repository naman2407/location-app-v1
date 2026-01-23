'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { IMAGES } from '../constants/images'
import { HeroSearchBar } from './HeroSearchBar'
import { Link as CustomLink } from './Link'
import { SearchOverlay } from './SearchOverlay'

interface BrandHeaderProps {
  showSearch?: boolean
  fullWidth?: boolean
}

export function BrandHeader({ showSearch = true, fullWidth = false }: BrandHeaderProps) {
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)

  return (
    <>
      <header className={`sticky top-0 bg-white z-50 sm:relative ${fullWidth ? 'w-full' : ''}`}>
        {/* Mobile: Search icon left, Logo center, Hamburger right */}
        <div className={`md:hidden relative flex items-center ${fullWidth ? 'px-4' : 'px-4'} py-4`}>
          {/* Search icon - extreme left */}
          {showSearch ? (
            <div className="flex-shrink-0 w-10">
              <HeroSearchBar variant="headerMobile" onSearchIconClick={() => setSearchOverlayOpen(true)} />
            </div>
          ) : (
            <div className="flex-shrink-0 w-10" />
          )}

          {/* Logo - center (flex-1 to push to center) */}
          <div className="flex-1 flex justify-center">
            <div className="overflow-hidden relative shrink-0 w-[48px] h-[48px]">
              <Link href="/" aria-label="Home">
                <SafeImage alt="Logo" className="block max-w-none w-full h-full" src={IMAGES.logo} />
              </Link>
            </div>
          </div>

          {/* Hamburger - right (same width as search icon for balance) */}
          <div className="flex-shrink-0 w-10 flex justify-end">
            <button className="flex sm:hidden items-center justify-center" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 4.5C3 4.225 3.225 4 3.5 4H16.5C16.775 4 17 4.225 17 4.5C17 4.775 16.775 5 16.5 5H3.5C3.225 5 3 4.775 3 4.5ZM3 9.5C3 9.225 3.225 9 3.5 9H16.5C16.775 9 17 9.225 17 9.5C17 9.775 16.775 10 16.5 10H3.5C3.225 10 3 9.775 3 9.5ZM17 14.5C17 14.775 16.775 15 16.5 15H3.5C3.225 15 3 14.775 3 14.5C3 14.225 3.225 14 3.5 14H16.5C16.775 14 17 14.225 17 14.5Z"
                  fill="#5B5D60"
                />
              </svg>
              <span className="sr-only">Toggle Header Menu</span>
            </button>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className={`hidden md:flex relative h-[96px] items-center justify-between gap-x-4 ${fullWidth ? 'w-full px-4 sm:px-8 lg:px-8 xl:px-[150px] max-w-[1440px] mx-auto' : 'container'}`}>
              <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:transform-none">
                <Link href="/" aria-label="Home">
                  <SafeImage alt="Logo" className="h-[28px] w-[28px] sm:h-12 sm:w-12" src={IMAGES.logo} />
                </Link>
              </div>

          {showSearch && (
            <div className="hidden md:flex flex-1 justify-center px-6">
              <div className="w-full max-w-[520px]">
                <HeroSearchBar />
              </div>
            </div>
          )}

              <nav className="hidden sm:flex">
                <CustomLink href="#" className="leading-[24px] text-sm sm:text-[16px] text-center">
                  TX3Y for Businesses
                </CustomLink>
              </nav>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && <SearchOverlay isOpen={searchOverlayOpen} onClose={() => setSearchOverlayOpen(false)} />}
    </>
  )
}
