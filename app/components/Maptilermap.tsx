'use client'

import { useEffect, useRef, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'

interface MapTilerMapProps {
  data: any
  layout?: any
}

export default function MapTilerMap({ data, layout }: MapTilerMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const [points, setPoints] = useState<[number, number, number][]>([])
  const [mounted, setMounted] = useState(false)

  // Process data into points
  useEffect(() => {
    if (!data || !data[0]) {
      return
    }

    const trace = data[0]
    const { lat, lon, z } = trace

    if (!lat || !lon || !z) {
      return
    }

    // Process points - same logic as before
    const processedPoints: [number, number, number][] = []

    for (let i = 0; i < lat.length; i++) {
      // All points visible: 0 -> 0.5 intensity, 1 -> 1.0 intensity
      const intensity = z[i] === 1 ? 1.0 : 0.5
      processedPoints.push([lat[i], lon[i], intensity])
    }

    setPoints(processedPoints)
  }, [data])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    setMounted(true)

    // Set MapTiler API key
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'get_your_own_key'

    // Create map
    const newMap = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [117.5, -2.5], // Indonesia center [lng, lat]
      zoom: 5,
      attributionControl: false, // Disable attribution to prevent third-party cookies
    })

    map.current = newMap

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Add heatmap layer when points are ready
  useEffect(() => {
    if (!map.current || !points || points.length === 0) return

    const currentMap = map.current

    currentMap.on('load', () => {
      // Convert points to GeoJSON
      const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: points.map(([lat, lon, intensity]) => ({
          type: 'Feature',
          properties: {
            intensity: intensity
          },
          geometry: {
            type: 'Point',
            coordinates: [lon, lat] // GeoJSON uses [lng, lat]
          }
        }))
      }

      // Add source
      if (!currentMap.getSource('dengue-cases')) {
        currentMap.addSource('dengue-cases', {
          type: 'geojson',
          data: geojsonData
        })
      }

      // Add heatmap layer
      if (!currentMap.getLayer('dengue-heatmap')) {
        currentMap.addLayer({
          id: 'dengue-heatmap',
          type: 'heatmap',
          source: 'dengue-cases',
          maxzoom: 18,
          paint: {
            // Increase weight as intensity increases
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 0.5,
              1, 1
            ],
            // Increase intensity as zoom level increases
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              18, 3
            ],
            // Color gradient - yellow to red
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(255, 255, 0, 0)',      // transparent yellow
              0.2, '#ffff00',                  // bright yellow
              0.4, '#ffaa00',                  // orange-yellow
              0.6, '#ff7700',                  // orange
              0.8, '#ff3300',                  // red-orange
              1, '#ff0000'                     // red
            ],
            // Adjust radius based on zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              5, 6,
              18, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              18, 0.5
            ],
          }
        })
      }
    })

  }, [points])

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }} />

      {/* Data points counter */}
      {points.length > 0 && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: '5px', borderRadius: '3px', fontSize: '12px' }}>
          {points.length} data points loaded
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-xs font-bold mb-2 text-gray-800">Tingkat Kasus DBD</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffff00' }}></div>
            <span className="text-xs text-gray-600">Sangat Rendah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffdd00' }}></div>
            <span className="text-xs text-gray-600">Rendah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffaa00' }}></div>
            <span className="text-xs text-gray-600">Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff7700' }}></div>
            <span className="text-xs text-gray-600">Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff0000' }}></div>
            <span className="text-xs text-gray-600">Sangat Tinggi</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Scroll untuk zoom, drag untuk pan</span>
        </div>
      </div>
    </div>
  )
}
