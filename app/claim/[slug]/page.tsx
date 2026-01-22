'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { SafeImage } from '../../components/SafeImage'
import { IMAGES } from '../../constants/images'
import { searchResults } from '../../constants/searchResults'
import { mockBusinesses } from '../../../src/mocks/mockBusinesses'

export default function ClaimBusinessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug as string
  
  // Find the business from search results first, then mock businesses
  const searchResult = searchResults.find((b) => b.slug === slug)
  const mockBusiness = mockBusinesses.find((b) => b.slug === slug)
  
  const businessName = searchResult?.name || mockBusiness?.name || ''
  const businessAddress = searchResult?.address || 
    (mockBusiness ? `${mockBusiness.address.line1}, ${mockBusiness.address.city}, ${mockBusiness.address.state} ${mockBusiness.address.postalCode}` : '')
  const businessCategory = searchResult?.category || 
    (mockBusiness ? mockBusiness.descriptor.split('·')[0]?.trim() || 'Business' : '')
  
  const hasBusiness = !!searchResult || !!mockBusiness
  
  // Initialize form data from URL params if available (for returning users)
  const [formData, setFormData] = useState({
    name: searchParams?.get('name') || '',
    phone: searchParams?.get('phone') || '',
    email: searchParams?.get('email') || ''
  })
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  })

  // Update form data when URL params change (e.g., when returning from verify-email)
  useEffect(() => {
    const nameParam = searchParams?.get('name')
    const phoneParam = searchParams?.get('phone')
    const emailParam = searchParams?.get('email')
    
    if (nameParam || phoneParam || emailParam) {
      setFormData(prev => ({
        name: nameParam || prev.name,
        phone: phoneParam || prev.phone,
        email: emailParam || prev.email
      }))
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: ''
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Navigate to verify-email page with form data
      const params = new URLSearchParams()
      params.set('email', formData.email)
      params.set('slug', slug)
      params.set('name', formData.name)
      params.set('phone', formData.phone)
      router.push(`/verify-email?${params.toString()}`)
    }
  }

  if (!hasBusiness) {
    return (
      <div className="bg-white min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1c1d20] mb-4">Business not found</h1>
            <a href="/" className="text-[#5A58F2] hover:underline">Go back to home</a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Brand logos for Trusted By section (8 logos, will be duplicated for seamless loop)
  const trustedLogos = [
    { id: 1, name: 'ASDA', src: IMAGES.brands.asda },
    { id: 2, name: 'Campbells', src: IMAGES.brands.campbells },
    { id: 3, name: 'HD', src: IMAGES.brands.hd },
    { id: 4, name: 'McDonalds', src: IMAGES.brands.mcd },
    { id: 5, name: 'Brookdale', src: IMAGES.brands.brookdale },
    { id: 6, name: 'Samsung', src: IMAGES.brands.samsung },
    { id: 7, name: 'First', src: IMAGES.brands.first },
    { id: 8, name: 'FedEx', src: IMAGES.brands.fedex },
  ]

  return (
    <div className="claim-page-wrapper min-h-screen w-full flex flex-col">
      <Header />
      
      {/* Section A: Marketing Hero (dark gradient) */}
      <section className="claim-hero">
        {/* Teal gradient glow blob */}
        <div className="claim-hero-glow" />
        
        <div className="claim-hero-container">
          <div className="claim-hero-grid">
            {/* Left: Marketing Copy */}
            <div className="claim-hero-content">
              <div className="claim-eyebrow">CLAIM AND MANAGE YOUR BUSINESS WITH YEXT</div>
              <h1 className="claim-headline"><span>Be visible </span>everywhere customers search</h1>
              <p className="claim-description">
                Optimize your brand to get found first, trusted most, and chosen more often on local AI and traditional search.
              </p>
            </div>

            {/* Right: Form Card */}
            <div className="claim-form-card">
              {/* Business Card (Simplified) */}
              <div className="claim-business-info">
                <h2 className="claim-business-name">{businessName}</h2>
                <p className="claim-business-address">
                  {businessAddress}
                </p>
                {businessCategory && (
                  <div className="claim-business-category">
                    <SafeImage
                      alt="Tag"
                      className="w-4 h-4"
                      src={IMAGES.tag}
                    />
                    <span>{businessCategory}</span>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="claim-form">
                <div className="claim-form-field">
                  <label htmlFor="name" className="claim-form-label">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`claim-form-input ${errors.name ? 'claim-form-input-error' : ''}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="claim-form-error">{errors.name}</p>
                  )}
                </div>

                <div className="claim-form-field">
                  <label htmlFor="phone" className="claim-form-label">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`claim-form-input ${errors.phone ? 'claim-form-input-error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="claim-form-error">{errors.phone}</p>
                  )}
                </div>

                <div className="claim-form-field">
                  <label htmlFor="email" className="claim-form-label">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`claim-form-input ${errors.email ? 'claim-form-input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="claim-form-error">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="claim-form-submit"
                >
                  Claim Business
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Trusted By (white section + logo carousel) */}
      <section className="claim-trusted">
        <div className="claim-trusted-container">
          <h2 className="claim-trusted-heading">Trusted By</h2>
          <div className="claim-trusted-carousel-wrapper">
            <div className="claim-trusted-carousel-track">
              {/* Render logos twice for seamless loop */}
              {[...trustedLogos, ...trustedLogos].map((logo, idx) => (
                <div key={`${logo.id}-${idx}`} className="claim-trusted-logo">
                  <div className="claim-trusted-logo-placeholder">
                    <SafeImage
                      alt={logo.name}
                      src={logo.src}
                      className="claim-trusted-logo-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Final Marketing CTA */}
      <section className="claim-final-cta">
        <div className="claim-final-cta-container">
          <div className="claim-final-cta-grid">
            {/* Left: Copy + CTA */}
            <div className="claim-final-cta-content">
              <h2 className="claim-final-cta-title">
                Turn Your <span>Brand Visibility</span> into a Differentiator™
              </h2>
              <p className="claim-final-cta-description">
                Ready to see the difference? Schedule a personalized walkthrough of our platform and discover how we help thousands of brands thrive.
              </p>
              <button className="claim-cta-secondary">
                GET A DEMO
              </button>
            </div>

            {/* Right: Placeholder image */}
            <div className="claim-final-cta-graphic">
              <SafeImage
                alt="Marketing graphic"
                src={IMAGES.marketingGraphic}
                className="claim-final-cta-image"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
