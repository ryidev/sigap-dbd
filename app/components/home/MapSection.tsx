'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MapTilerMap = dynamic(() => import('../Maptilermap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat komponen peta...</p>
            </div>
        </div>
    ),
})

export default function MapSection() {
    const [plotData, setPlotData] = useState<any>(null)
    const [isLoadingPlot, setIsLoadingPlot] = useState<boolean>(true)
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
        // Load heatmap data
        setIsLoadingPlot(true)
        fetch('/heatmap_geo.json')
            .then((response) => response.json())
            .then((data) => {
                setPlotData(data)
                setIsLoadingPlot(false)
            })
            .catch(() => {
                setIsLoadingPlot(false)
            })
    }, [])

    return (
        <section className="min-h-screen relative z-0 flex items-center bg-white"
            style={{ backgroundColor: '#fafafa' }}>
            <div className="mx-auto max-w-screen-xl px-4 py-20 w-full">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        Peta Sebaran DBD di Indonesia
                    </h2>
                    <p className="text-gray-600">
                        Visualisasi data kasus DBD berdasarkan lokasi geografis
                    </p>
                </div>

                <div
                    id="chart"
                    className="chart mx-auto w-full bg-white rounded-lg shadow-lg p-6"
                    style={{ minHeight: 600, height: 600, width: '100%' }}
                >
                    {isLoadingPlot && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
                                <p className="text-gray-500">Memuat peta Indonesia...</p>
                            </div>
                        </div>
                    )}
                    {!isLoadingPlot && !plotData && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-red-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="text-red-700 font-medium">Gagal memuat data peta</p>
                                <p className="text-gray-500 text-sm mt-2">Silakan refresh halaman atau coba lagi nanti</p>
                            </div>
                        </div>
                    )}
                    {!isLoadingPlot && plotData && isMounted && (
                        <MapTilerMap
                            data={plotData.data}
                            layout={plotData.layout}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}
