'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#5b5d60]">ERROR</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-black">
          Something went wrong.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5b5d60]">
          Please try again, or return to the homepage.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#5A58F2] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a48e0]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#e0e0e0] px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-[#f6f6f6]"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  )
}
