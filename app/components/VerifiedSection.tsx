export function VerifiedSection() {
  return (
    <section className="verified-hero">
      {/* Background layer */}
      <div className="verified-hero-bg" />

      {/* Content */}
      <div className="verified-hero-content flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-2 sm:gap-3 items-center">
          <p className="text-gray-500 uppercase font-semibold text-sm tracking-wider text-center">
            Powered by TX3Y
          </p>
          <h2 className="font-light text-2xl sm:text-3xl md:text-4xl text-center max-w-[464px]">
            Verified Business Information from Trusted Brands
          </h2>
        </div>
        <p className="text-base text-gray-700 text-center max-w-[568px] mx-auto">
          The TX3Y Directory brings together accurate, up-to-date information about businesses spanning industries and regions across the web. Powered by direct data from the source, find what you need quickly and reliably, whether you're searching for a local shop or a national brand.
        </p>
      </div>
    </section>
  )
}

