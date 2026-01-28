'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { mockBusinesses } from '../mocks/mockBusinesses'
import { HoursCard } from './business/HoursCard'
import { RatingHistogram } from './business/RatingHistogram'
import { ReviewCard } from './business/ReviewCard'
import { FaqAccordion } from './business/FaqAccordion'
import { SafeImage } from '../../app/components/SafeImage'
import { IMAGES } from '../../app/constants/images'
import { findLocationBySlug } from '../../app/constants/brandData'
import { UnclaimedBusinessBanner } from '../../app/components/UnclaimedBusinessBanner'

type Params = { slug?: string }

interface BusinessProfilePageProps {
  params?: Params
}

export default function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const slug = params?.slug || ''
  const business = mockBusinesses.find((b) => b.slug === slug)

  const [showMoreDetails, setShowMoreDetails] = useState(false)
  const categories = useMemo(
    () => business?.descriptor.split('·').map((item) => item.trim()).filter(Boolean) ?? [],
    [business]
  )

  // Generate dynamic breadcrumbs matching the brand/category flow
  const breadcrumbs = useMemo(() => {
    if (!business) return []
    
    const crumbs = [{ label: 'Home', href: '/' }]
    
    // Try to find location in brand data structure
    const locationInfo = findLocationBySlug(business.slug)
    
    if (locationInfo) {
      const { brand, state, city, relatedBusiness } = locationInfo
      
      // Add category
      const categorySlug = brand.category === 'Food & Dining' ? 'food-and-dining' : brand.category.toLowerCase().replace(/\s+/g, '-')
      crumbs.push({ 
        label: brand.category, 
        href: `/categories/${categorySlug}` 
      })
      
      // Add brand
      crumbs.push({ 
        label: brand.name, 
        href: `/categories/${categorySlug}/${brand.slug}` 
      })
      
      // Add state
      crumbs.push({ 
        label: state.name, 
        href: `/categories/${categorySlug}/${brand.slug}/${state.slug}` 
      })
      
      // Add city (links to category city restaurants page)
      crumbs.push({ 
        label: city.name, 
        href: `/categories/${categorySlug}/states/${state.slug}/${city.slug}` 
      })
    } else {
      // Fallback to old breadcrumb logic for businesses not in brand data
    let primaryCategory = categories[0] || 'Food & Dining'
    
    const categoryMap: Record<string, string> = {
      'Fast Food': 'Food & Dining',
      'Mexican': 'Food & Dining',
      'Restaurant': 'Food & Dining',
      'Coffee': 'Food & Dining',
      'Cafe': 'Food & Dining',
        'Ice Cream': 'Food & Dining',
        'Desserts': 'Food & Dining',
        'Frozen Treats': 'Food & Dining',
      'Agriculture & Industry': 'Agriculture & Industry',
    }
    
    if (categoryMap[primaryCategory]) {
      primaryCategory = categoryMap[primaryCategory]
    }
    
      const categorySlug = primaryCategory === 'Food & Dining' ? 'food-and-dining' : primaryCategory.toLowerCase().replace(/\s+/g, '-')
    crumbs.push({ 
      label: primaryCategory, 
        href: `/categories/${categorySlug}` 
    })
    }
    
    // Add business name (non-clickable, current page)
    crumbs.push({ label: business.name, href: '#' })
    
    return crumbs
  }, [business, categories])

  if (!business) {
    return (
      <div className="page">
        <div className="container">
          <h2>Business not found</h2>
          <a href="/" className="link-primary">Go home</a>
        </div>
      </div>
    )
  }

  const primaryDetails = business.detailsPrimary
  const moreDetails = business.detailsMore
  const detailsToShow = showMoreDetails ? [...primaryDetails, ...moreDetails] : primaryDetails

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="relative w-full bg-white">
          <div className="container py-8 sm:py-12">
            <nav aria-label="Breadcrumb" className="mb-6">
              <div className="flex flex-wrap items-center gap-x-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-[#DADCE0]">/</span>}
              {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium">{crumb.label}</span>
              ) : (
                    <Link href={crumb.href} className={`link-primary font-normal ${index === 0 ? 'flex items-center gap-1.5' : ''}`}>
                      {index === 0 && <SafeImage src={IMAGES.home} alt="" className="w-4 h-4" />}
                      {crumb.label}
                    </Link>
              )}
            </span>
          ))}
              </div>
        </nav>

      <div>
        <SafeImage
          alt=""
          className="biz-hero-image biz-hero-image-desktop"
          src={IMAGES.heroBackground}
        />
        
        <SafeImage
          alt=""
          className="biz-hero-image biz-hero-image-mobile"
          src={business.imageUrl || IMAGES.heroBackground}
        />
      </div>

      <div className="biz-main-grid">
        <div className="biz-main-col">
          <section className="biz-title-block">
      {business.claimed === false && (
              <UnclaimedBusinessBanner variant="mobile" />
            )}
            {business.claimed && (
                <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#EEE8F7] text-[#6F42C1] shrink-0 mb-2">
                  Brand-Verified Information
                </span>
            )}
            {!business.claimed && (
              <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-[6px] text-sm font-medium bg-[#FFCD39] shrink-0">
                Publicly Sourced Information
              </span>
      )}
        <div className="flex items-center gap-3 flex-wrap">
              <h1 className="heading heading-lead inline-block">
                {(() => {
                  const nameParts = business.name.split(' ')
                  const lastWord = nameParts[nameParts.length - 1]
                  const restOfName = nameParts.slice(0, -1).join(' ')
                  
                  return (
                    <>
                      {restOfName && <span>{restOfName} </span>}
                      <span className="whitespace-nowrap inline-flex items-center">
                        {lastWord}
          {business.claimed && (
                          <SafeImage alt="Verified" src={IMAGES.verified_icon} className="w-5 h-5 inline-block align-middle ml-3" />
                        )}
                        {!business.claimed && (
                          <SafeImage alt="Warning" src={IMAGES.warning_icon} className="w-5 h-5 inline-block align-middle ml-3" />
                        )}
                      </span>
                    </>
                  )
                })()}
              </h1>
        </div>
        <div className="biz-rating">
          <span className="biz-rating-score">{business.rating.toFixed(1)}</span>
          <div className="biz-rating-stars">
            <SafeImage alt="Stars" className="block max-w-none h-full" src={IMAGES.stars} />
          </div>
          <span className="biz-rating-count">{business.reviewCount} reviews</span>
        </div>
        <div className="biz-status">
          <span className="biz-status-text">{business.statusText}</span>
          <span className="biz-status-dot" />
          <span className="biz-status-time">Closes at {business.closesAt}</span>
        </div>
        <div className="biz-cta">
          <a href={`https://maps.google.com?q=${business.address.line1}`} className="button button-primary" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.965 5.07495C10.1325 4.67745 10.2 4.38495 10.2 4.19995C10.2 2.98495 9.215 1.99995 8 1.99995C6.785 1.99995 5.8 2.98495 5.8 4.19995C5.8 4.38495 5.8675 4.67495 6.035 5.07495C6.1975 5.45995 6.4275 5.88495 6.695 6.31745C7.1225 7.01245 7.6175 7.68495 8 8.17745C8.3825 7.68495 8.8775 7.01245 9.305 6.31745C9.5725 5.88495 9.8025 5.45995 9.965 5.07495ZM8.37 8.99995C8.1775 9.23995 7.82 9.23995 7.63 8.99995C6.8275 7.99745 5 5.56495 5 4.19995C5 2.54245 6.3425 1.19995 8 1.19995C9.6575 1.19995 11 2.54245 11 4.19995C11 5.56495 9.1725 7.99745 8.37 8.99995ZM10.9475 6.77245C10.9275 6.77995 10.905 6.78745 10.885 6.79245C11.09 6.43745 11.2775 6.07495 11.43 5.71995L14.3775 4.53995C14.7725 4.38245 15.2 4.67245 15.2 5.09745V11.8675C15.2 12.1125 15.05 12.3325 14.8225 12.425L10.9475 13.975C10.865 14.0075 10.775 14.0125 10.69 13.9875L5.2225 12.4225L1.6225 13.8625C1.2275 14.02 0.800003 13.73 0.800003 13.305V6.53495C0.800003 6.28995 0.950003 6.06995 1.1775 5.97745L4.2575 4.74495C4.31 5.00495 4.3925 5.26495 4.4875 5.51495L1.6 6.66995V13.0075L4.8 11.7275V8.79995C4.8 8.57995 4.98 8.39995 5.2 8.39995C5.42 8.39995 5.6 8.57995 5.6 8.79995V11.6975L10.4 13.07V8.79995C10.4 8.57995 10.58 8.39995 10.8 8.39995C11.02 8.39995 11.2 8.57995 11.2 8.79995V13.01L14.4 11.73V5.39245L10.9475 6.77245ZM8 3.39995C8.0788 3.39995 8.15682 3.41547 8.22961 3.44562C8.30241 3.47578 8.36855 3.51997 8.42427 3.57569C8.47998 3.6314 8.52418 3.69755 8.55433 3.77034C8.58448 3.84314 8.6 3.92116 8.6 3.99995C8.6 4.07874 8.58448 4.15677 8.55433 4.22956C8.52418 4.30236 8.47998 4.3685 8.42427 4.42422C8.36855 4.47993 8.30241 4.52413 8.22961 4.55428C8.15682 4.58443 8.0788 4.59995 8 4.59995C7.92121 4.59995 7.84319 4.58443 7.77039 4.55428C7.6976 4.52413 7.63145 4.47993 7.57574 4.42422C7.52002 4.3685 7.47583 4.30236 7.44568 4.22956C7.41552 4.15677 7.4 4.07874 7.4 3.99995C7.4 3.92116 7.41552 3.84314 7.44568 3.77034C7.47583 3.69755 7.52002 3.6314 7.57574 3.57569C7.63145 3.51997 7.6976 3.47578 7.77039 3.44562C7.84319 3.41547 7.92121 3.39995 8 3.39995Z" fill="currentColor"/>
            </svg>
            <span>Get Directions</span>
          </a>
          <a href={`tel:${business.phone}`} className="button button-secondary">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.495 8.48006C11.085 8.30506 10.61 8.42006 10.3275 8.76506L9.49751 9.78006C8.34751 9.11256 7.38751 8.15256 6.72001 7.00256L7.73251 6.17506C8.07751 5.89256 8.19501 5.41756 8.01751 5.00756L6.81751 2.20756C6.63001 1.76756 6.15751 1.52256 5.69001 1.62256L2.89001 2.22256C2.43001 2.32006 2.10001 2.72756 2.10001 3.20006C2.10001 9.11756 6.68751 13.9626 12.5 14.3726C12.6125 14.3801 12.7275 14.3876 12.8425 14.3926C12.8425 14.3926 12.8425 14.3926 12.845 14.3926C12.9975 14.3976 13.1475 14.4026 13.3025 14.4026C13.775 14.4026 14.1825 14.0726 14.28 13.6126L14.88 10.8126C14.98 10.3451 14.735 9.87256 14.295 9.68506L11.495 8.48506V8.48006ZM13.2925 13.6001C7.55251 13.5951 2.90001 8.94256 2.90001 3.20006C2.90001 3.10506 2.96501 3.02506 3.05751 3.00506L5.85751 2.40506C5.95001 2.38506 6.04501 2.43506 6.08251 2.52256L7.28251 5.32256C7.31751 5.40506 7.29501 5.50006 7.22501 5.55506L6.21001 6.38506C5.90751 6.63256 5.82751 7.06506 6.02501 7.40506C6.76251 8.67756 7.82251 9.73756 9.09251 10.4726C9.43251 10.6701 9.86501 10.5901 10.1125 10.2876L10.9425 9.27256C11 9.20256 11.095 9.18006 11.175 9.21506L13.975 10.4151C14.0625 10.4526 14.1125 10.5476 14.0925 10.6401L13.4925 13.4401C13.4725 13.5326 13.39 13.5976 13.2975 13.5976C13.295 13.5976 13.2925 13.5976 13.29 13.5976L13.2925 13.6001Z" fill="currentColor"/>
            </svg>
            <span>Call</span>
          </a>
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="button button-secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.6001C9.78001 1.6001 9.60001 1.7801 9.60001 2.0001C9.60001 2.2201 9.78001 2.4001 10 2.4001H13.035L6.91751 8.5176C6.76251 8.6726 6.76251 8.9276 6.91751 9.0826C7.07251 9.2376 7.32751 9.2376 7.48251 9.0826L13.6 2.9651V6.0001C13.6 6.2201 13.78 6.4001 14 6.4001C14.22 6.4001 14.4 6.2201 14.4 6.0001V2.0001C14.4 1.7801 14.22 1.6001 14 1.6001H10ZM3.20001 2.4001C2.31751 2.4001 1.60001 3.1176 1.60001 4.0001V12.8001C1.60001 13.6826 2.31751 14.4001 3.20001 14.4001H12C12.8825 14.4001 13.6 13.6826 13.6 12.8001V9.2001C13.6 8.9801 13.42 8.8001 13.2 8.8001C12.98 8.8001 12.8 8.9801 12.8 9.2001V12.8001C12.8 13.2426 12.4425 13.6001 12 13.6001H3.20001C2.75751 13.6001 2.40001 13.2426 2.40001 12.8001V4.0001C2.40001 3.5576 2.75751 3.2001 3.20001 3.2001H6.80001C7.02001 3.2001 7.20001 3.0201 7.20001 2.8001C7.20001 2.5801 7.02001 2.4001 6.80001 2.4001H3.20001Z" fill="currentColor"/>
            </svg>
            <span>Website</span>
          </a>
        </div>
          </section>
          <section className="biz-section">
            <h2 className="heading heading-sub">Business Details</h2>
            <div className="biz-details-list">
              <div className="biz-details-row items-start">
                <SafeImage alt="Location" src={IMAGES.location} className="biz-details-icon mt-1" />
                <a className="link-primary" href={`https://maps.google.com?q=${business.address.line1}`} target="_blank" rel="noopener noreferrer">
                  <div className="address-line">
                    {business.address.line1}, {business.address.city}, <abbr title={business.address.state}>{business.address.state}</abbr>
                  </div>
                  <div className="address-line">{business.address.postalCode}, United States</div>
                </a>
              </div>
              <div className="biz-details-row items-center">
                <SafeImage alt="Phone" src={IMAGES.phone} className="biz-details-icon" />
                <a className="link-primary" href={`tel:${business.phone}`}>{business.phone}</a>
              </div>
              <div className="biz-details-row items-center">
                <SafeImage alt="Website" src={IMAGES.external} className="biz-details-icon" />
                <a className="link-primary biz-details-link" href={business.website} target="_blank" rel="noopener noreferrer">
                  {business.website}
                </a>
              </div>
              <div className="biz-details-row items-center">
                <SafeImage alt="Link" src={IMAGES.link} className="biz-details-icon" />
                <div className="flex flex-wrap gap-2">
              <a href="#" className="button button-social" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15.8444 6.43317H15.2V6.39997H8.00001V9.59995H12.5212C11.8616 11.4627 10.0892 12.7999 8.00001 12.7999C5.34922 12.7999 3.20003 10.6507 3.20003 7.99996C3.20003 5.34917 5.34922 3.19998 8.00001 3.19998C9.2236 3.19998 10.3368 3.66158 11.1844 4.41558L13.4472 2.15279C12.0184 0.821196 10.1072 0 8.00001 0C3.58203 0 4.57764e-05 3.58198 4.57764e-05 7.99996C4.57764e-05 12.4179 3.58203 15.9999 8.00001 15.9999C12.418 15.9999 16 12.4179 16 7.99996C16 7.46356 15.9448 6.93997 15.8444 6.43317Z" fill="#FFC107"/>
                  <path d="M0.922302 4.27638L3.55069 6.20397C4.26189 4.44318 5.98428 3.19998 7.99987 3.19998C9.22346 3.19998 10.3367 3.66158 11.1843 4.41558L13.447 2.15279C12.0182 0.821196 10.1071 0 7.99987 0C4.92708 0 2.2623 1.73479 0.922302 4.27638Z" fill="#FF3D00"/>
                  <path d="M8.00009 15.9999C10.0665 15.9999 11.9441 15.2092 13.3637 13.9232L10.8877 11.828C10.0575 12.4593 9.04307 12.8008 8.00009 12.8C5.9193 12.8 4.15251 11.4732 3.48691 9.62158L0.878128 11.6316C2.20212 14.2224 4.89091 15.9999 8.00009 15.9999Z" fill="#4CAF50"/>
                  <path d="M15.8444 6.4331H15.2V6.3999H8.00005V9.59989H12.5212C12.2057 10.4864 11.6374 11.2611 10.8864 11.8283L10.8876 11.8275L13.3636 13.9227C13.1884 14.0819 16 11.9999 16 7.99989C16 7.4635 15.9448 6.9399 15.8444 6.4331Z" fill="#1976D2"/>
                </svg>
                <span>Google</span>
              </a>
              <a href="#" className="button button-social" target="_blank" rel="noopener noreferrer">
                <SafeImage alt="Facebook" src={IMAGES.facebook_color} className="biz-social-icon" />
                <span>Facebook</span>
              </a>
              <a href="#" className="button button-social" target="_blank" rel="noopener noreferrer">
                <SafeImage alt="Instagram" src={IMAGES.instagram_color} className="biz-social-icon" />
                <span>Instagram</span>
              </a>
                </div>
              </div>
            </div>
          </section>

          <section className="biz-section">
            <h2 className="heading heading-sub">About</h2>
            {categories.length > 0 && (
              <div>
              <div className="biz-category-row">
                {categories.map((category, idx) => (
                  <span key={`${category}-${idx}`} className="biz-category-item">
                    {idx === 0 && <SafeImage alt="Tag" src={IMAGES.tag} className="w-4 h-4" />}
                    {category}
                    {idx < categories.length - 1 && <span className="biz-category-dot" />}
                  </span>
                ))}
              </div>
              <p className="biz-paragraph mt-2.5">{business.about}</p>
              </div>
            )}
          </section>

          <section className="biz-section">
            <h2 className="heading heading-sub">Details</h2>
            <ul className="biz-feature-list">
              {detailsToShow.map((item) => (
                <li key={item} className="biz-feature-item">
                  <svg className="biz-feature-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M15.8339 0.166108C16.0554 0.387587 16.0554 0.751954 15.8339 0.973432L6.11744 10.6899C5.89596 10.9114 5.53159 10.9114 5.31011 10.6899L0.166108 5.54588C-0.0553695 5.3244 -0.0553695 4.96004 0.166108 4.73856C0.387587 4.51708 0.751954 4.51708 0.973432 4.73856L5.71378 9.4789L15.0266 0.166108C15.248 -0.0553695 15.6124 -0.0553695 15.8339 0.166108Z" fill="currentColor"/>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {business.detailsMore.length > 0 && (
              <button onClick={() => setShowMoreDetails((prev) => !prev)} className="button button-secondary no-focus-ring">
                {showMoreDetails ? 'Show Less' : `Show ${business.detailsMore.length} More`}
              </button>
            )}
          </section>

          <section className="biz-section">
            <h2 className="heading heading-sub">Location</h2>
            <div className="biz-location-row">
              <SafeImage
                alt="Location map"
                src={IMAGES.google_location}
                className="biz-map-image sm:w-[400px] sm:basis-[400px]"
              />
              <div className="biz-location-details">
                <div className="biz-location-name">{business.name}</div>
                <div className="biz-location-address">
                  <div className="address-line">
                    {business.address.line1}, {business.address.city}, <abbr title={business.address.state}>{business.address.state}</abbr>
                  </div>
                  <div className="address-line">{business.address.postalCode}, United States</div>
                </div>
                <a href={`https://maps.google.com?q=${business.address.line1}`} className="link-primary" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className={`biz-hours-col ${business.claimed ? 'biz-hours-col-right-align' : ''}`}>
          {business.claimed ? (
            <div className="biz-hero-banner biz-hero-banner-desktop biz-hero-banner-spacer" aria-hidden="true">
              <div className="biz-claim-banner">
                <div className="biz-claim-banner-header">
                  <div className="biz-claim-banner-title">Your Brand, as Customers See It</div>
                </div>
                <div className="text-base text-gray-700">
                  <p>This page shows publicly sourced business information that customers may encounter across search and digital platforms.</p>
                  <p className='font-semibold'>Brands using TX3Y see up to ~30% more online visibility and gain:</p>
                  <ul className="list-disc pl-5 mt-2 mb-2">
                    <li>Deeper insight into customer feedback across locations</li>
                    <li>Clear performance summaries across key platforms</li>
                    <li>Clear performance summaries across key platforms</li>
                    <li>Tools to manage and optimize digital presence at scale</li>
                  </ul>
                </div>
                <span className="biz-claim-banner-cta">Get in touch</span>
              </div>
            </div>
          ) : (
            <UnclaimedBusinessBanner variant="desktop" />
          )}
          <HoursCard hours={business.hours} statusText={business.statusText} closesAt={business.closesAt} />
        </div>
      </div>
      <div className="biz-reviews-section">
        <div className="biz-reviews relative">
          <h2 className="heading heading-sub">Reviews</h2>
          <div className={!business.claimed ? 'reviews-blurred' : ''}>
          <div className="biz-review-summary">
            <div className="biz-review-score">
              <div className="biz-review-score-row">
                <span className="heading heading-head">{business.rating.toFixed(1)}</span>
                <SafeImage alt="" className="biz-review-score-star" src={IMAGES.star_single} />
              </div>
              <div className="biz-review-count-row">
                <span className="biz-review-count-inline">{business.reviewCount} reviews</span>
              </div>
            </div>
            <RatingHistogram rating={{ ratingHistogram: business.ratingHistogram }} />
          </div>
          <div className="biz-ai-card">
            <div className="biz-ai-title">What are people saying?</div>
            <div className="biz-ai-card-header">
              <SafeImage alt="Sparkle" src={IMAGES.sparkle} className="w-4 h-4" />
              <span>AI-generated from recent customer reviews</span>
            </div>
            <div className="biz-ai-text">{business.aiSummary}</div>
          </div>
          <div className="biz-review-list">
            {business.reviews.map((review) => (
              <ReviewCard key={review.author + review.date} review={review} />
            ))}
          </div>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="link-primary">
            Read more reviews on Google
          </a>
          </div>
          {!business.claimed && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl">
              <SafeImage 
                alt="Lock icon" 
                src={IMAGES.lock} 
                className="h-8 w-auto mb-4"
              />
              <h2 className="text-lg font-semibold text-center mb-2">
              Access Performance Data with TX3Y
              </h2>
              <p className="text-base text-gray-700 text-center mb-4 max-w-md">
                Verify your business profile to access detailed performance data and deeper insights.
              </p>
              <a
                href="https://www.yext.com/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5A58F2] hover:bg-[#4a48e0] text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                Get in touch
              </a>
            </div>
          )}
        </div>
      </div>
      {business.claimed && (
      <div className="biz-faq-section">
        <FaqAccordion faqs={business.faqs} businessName={business.name} />
      </div>
       )}
          </div>
        </div>
      </div>
    </div>

  )
}
