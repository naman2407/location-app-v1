import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#5b5d60]">404</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-black">
          This page could not be found.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5b5d60]">
          The link may be broken or the page may have been removed.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#5A58F2] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a48e0]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
