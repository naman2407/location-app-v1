'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Toast } from '../components/Toast'

const VALID_CODE = '123456'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') || ''
  const businessSlug = searchParams?.get('slug') || ''
  const name = searchParams?.get('name') || ''
  const phone = searchParams?.get('phone') || ''

  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/')
    }
  }, [email, router])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('') // Clear error when user edits

    // Auto-advance to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous field if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setCode(digits)
      setError('')
      // Focus the last input after paste
      inputRefs.current[5]?.focus()
    } else if (/^\d+$/.test(pastedData)) {
      // If it's digits but not exactly 6, fill what we can
      const digits = pastedData.split('').slice(0, 6)
      const newCode = [...code]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })
      setCode(newCode)
      setError('')
      // Focus the next empty field or last field
      const nextIndex = Math.min(index + digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleResendCode = () => {
    setShowToast(true)
  }

  const handleChangeEmail = () => {
    // Navigate back to claim page with preserved data
    const params = new URLSearchParams()
    if (businessSlug) params.set('slug', businessSlug)
    if (name) params.set('name', name)
    if (phone) params.set('phone', phone)
    if (email) params.set('email', email)
    router.push(`/claim/${businessSlug}?${params.toString()}`)
  }

  const handleConfirm = () => {
    const codeString = code.join('')
    
    if (codeString.length !== 6) {
      setError('The verification code you entered is incorrect. Please try again.')
      return
    }

    if (codeString === VALID_CODE) {
      // Navigate to success page
      router.push('/claim-success')
    } else {
      setError('The verification code you entered is incorrect. Please try again.')
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-8 xl:px-[150px] py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1c1d20] mb-4 text-center">
            Verify your email address
          </h1>
          
          <p className="text-base text-[#6b6d71] mb-8 text-center">
            We've sent a 6-digit verification code to<br />
            <strong className="text-[#1c1d20]">{email}</strong>
          </p>
          
          <p className="text-sm text-[#6b6d71] mb-6 text-center">
            Please enter the code below to continue.
          </p>

          {/* Error Banner */}
          {error && (
            <div 
              role="alert"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Verification Code Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(index, e)}
                aria-label={`Digit ${index + 1} of 6`}
                className="w-12 h-14 text-center text-2xl font-semibold border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A58F2] focus:border-[#5A58F2]"
              />
            ))}
          </div>

          {/* Helper Text */}
          <p className="text-sm text-[#6b6d71] mb-4 text-center">
            Didn't receive the code?
          </p>

          {/* Inline Actions */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleResendCode}
              className="text-sm text-[#5A58F2] hover:underline"
            >
              Resend code
            </button>
            <span className="text-sm text-[#6b6d71]">|</span>
            <button
              onClick={handleChangeEmail}
              className="text-sm text-[#5A58F2] hover:underline"
            >
              Change email address
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!isCodeComplete}
            className={`w-full px-6 py-3 rounded-md font-medium transition-colors ${
              isCodeComplete
                ? 'bg-[#5A58F2] text-white hover:bg-[#4a48e0]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>

      <Footer />

      {/* Toast Notification */}
      <Toast
        message="A new verification code has been sent. Please check your email."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
