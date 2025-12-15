'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormGejalaUtama from './FormGejalaUtama'
import FormGejalaTambahan from './FormGejalaTambahan'
import FormUjiLab from './FormUjiLab'

interface Step2ContainerProps {
    onStepChange?: (step: number) => void
}

export default function Step2Container({ onStepChange }: Step2ContainerProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        if (onStepChange) {
            onStepChange(currentStep)
        }
    }, [currentStep, onStepChange])

    // Form state
    const [formData, setFormData] = useState({
        KDEMA: 'Tidak',
        DDEMA: 1,
        SUHUN: 38.2,
        ULABO: 'Belum',
        JWBCS: 6.0,
        HEMOG: 14.0,
        HEMAT: 40,
        JPLAT: 150,
        SKPLA: 'Tidak',
        NYMAT: 'Tidak',
        NYSEN: 'Tidak',
        RSMUL: 'Tidak',
        HINFM: 'Tidak',
        NYPER: 'Tidak',
        MUMUN: 'Tidak',
        MDIAR: 'Tidak',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Store form data in localStorage
        localStorage.setItem('formData', JSON.stringify(formData))

        // Navigate to result
        router.push('/result')
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            router.push('/form')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Form Container */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
                    {/* Form Content */}
                    {currentStep === 1 && (
                        <FormGejalaUtama formData={formData} setFormData={setFormData} />
                    )}
                    {currentStep === 2 && (
                        <FormGejalaTambahan formData={formData} setFormData={setFormData} />
                    )}
                    {currentStep === 3 && (
                        <FormUjiLab formData={formData} setFormData={setFormData} />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Kembali
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors"
                        >
                            {currentStep === 3 ? 'Selesai' : 'Lanjut'}
                            {currentStep < 3 && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
