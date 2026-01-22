'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'

// Import Leaflet CSS only on client side
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css')
}

interface Location {
  slug: string
  name: string
  lat: number
  lng: number
  address: string
  rating: number
  reviewCount?: number
  number?: number
}

interface MapComponentProps {
  locations: Location[]
  selectedLocation?: string | null
  onLocationClick?: (slug: string) => void
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

// Zoom Controls Component - Bottom Right
function ZoomControls() {
  const map = useMap()
  
  const handleZoomIn = () => {
    map.zoomIn()
  }
  
  const handleZoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Zoom in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Zoom out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
    </div>
  )
}

// Recenter Button Component
function RecenterButton({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  
  const handleRecenter = () => {
    map.setView(center, zoom)
  }

  return (
    <button
      onClick={handleRecenter}
      className="absolute top-4 right-4 z-[1000] bg-[#1f1f1f] text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2 hover:bg-[#2f2f2f] transition-colors"
      aria-label="Recenter map"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </svg>
      Recenter Map
    </button>
  )
}

// Create numbered marker icon - all pins are purple
function createNumberedIcon(number: number, slug: string, isSelected: boolean = false): L.DivIcon {
  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #5a58f2;
        border: 2px solid #5a58f2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">${number}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

export function MapComponent({ locations, selectedLocation, onLocationClick }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-[8px] flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-[8px] flex items-center justify-center">
        <p className="text-gray-500">No locations to display</p>
      </div>
    )
  }

  // Calculate center from all locations
  const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
  const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length
  const center: [number, number] = [centerLat, centerLng]

  return (
    <div className="w-full h-full rounded-[8px] overflow-hidden border border-[#ededed] relative">
      <MapContainer
        center={center}
        zoom={13}
        className="map-container-full"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          className="grayscale-tiles"
        />
        <MapController center={center} zoom={13} />
        <RecenterButton center={center} zoom={13} />
        <ZoomControls />
        {locations.map((location) => {
          const markerKey = `marker-${location.slug}`
          const number = location.number || 1
          const icon = createNumberedIcon(number, location.slug, false)
          
          return (
            <Marker
              key={markerKey}
              position={[location.lat, location.lng]}
              icon={icon}
              eventHandlers={{
                click: (e) => {
                  // Prevent default marker click behavior and card scrolling
                  e.originalEvent.preventDefault()
                  e.originalEvent.stopPropagation()
                  // Open in new tab
                  window.open(`/business/${location.slug}`, '_blank', 'noopener,noreferrer')
                },
              }}
            >
              <Tooltip
                className="custom-tooltip"
                permanent={false}
                direction="top"
                offset={[0, -10]}
              >
                <div className="p-3 cursor-pointer min-w-[200px] bg-white opacity-100">
                  <p className="font-semibold text-sm text-black mb-1.5">{location.name}</p>
                  <p className="text-xs text-[#6b6d71] mb-1.5 font-normal">{location.address}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-black">{location.rating.toFixed(1)}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-[#5C5D60] mx-1"></span>
                    <span className="text-xs text-[#6b6d71] font-normal">{location.reviewCount || 0} reviews</span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
