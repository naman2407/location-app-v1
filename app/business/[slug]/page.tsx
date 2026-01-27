'use client'

import BusinessProfilePage from '../../../src/pages/BusinessProfilePage'
import { Footer } from '../../components/Footer'
import { BrandHeader } from '../../components/BrandHeader'

interface PageProps {
  params: { slug: string }
}

export default function Page({ params }: PageProps) {

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <BrandHeader showSearch={true} fullWidth={true} />
      <div className="flex-1 flex flex-col">
        <BusinessProfilePage params={params} />
      </div>
      <Footer />
    </div>
  )
}
