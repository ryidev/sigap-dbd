'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import Stepper from '../components/Stepper'
import Step1Landing from '../components/form/Step1Landing'
import Step2Container from '../components/form/Step2Container'

function FormContent() {
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get('step') || '0')
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar active="form" />
      <div style={{ top: 0, marginTop: 80 }}>
        <Stepper active={step} currentStep={currentStep} />
      </div>

      {step === 0 && <Step1Landing />}
      {step === 1 && <Step2Container onStepChange={setCurrentStep} />}
    </div>
  )
}

export default function FormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormContent />
    </Suspense>
  )
}
