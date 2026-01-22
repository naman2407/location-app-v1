'use client'

import { useRouter } from 'next/navigation'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function ClaimSuccessPage() {
  const router = useRouter()

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-8 xl:px-[150px] py-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1c1d20] mb-6">
            Thank you for reaching out
          </h1>
          
          <p className="text-base text-[#6b6d71] mb-4">
            A member of our team will contact you shortly to follow up on your request.
          </p>
          
          <p className="text-sm text-[#6b6d71] mb-8">
            We appreciate your interest and will be in touch with next steps.
          </p>

          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#5A58F2] text-white rounded-md font-medium hover:bg-[#4a48e0] transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
