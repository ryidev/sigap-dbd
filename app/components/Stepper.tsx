interface StepperProps {
  active: number
  currentStep?: number
}

export default function Stepper({ active, currentStep = 1 }: StepperProps) {
  const activeStep = 'flex items-center justify-center w-8 h-8 rounded-full bg-red-700 text-white text-sm font-bold'
  const regularStep = 'flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 text-sm font-bold'

  const surveySteps = [
    { id: 1, label: 'Gejala Utama' },
    { id: 2, label: 'Gejala Tambahan' },
    { id: 3, label: 'Uji Laboratorium' },
  ]

  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Main Progress Bar - Konfirmasi, Survey, Hasil */}
      <div className="flex w-full px-4 py-4 justify-center">
        <div className="relative w-full lg:w-1/2 after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
          <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
            <li className="flex items-center gap-2 bg-slate-50 p-2">
              <span className={active === 0 ? activeStep : regularStep}>1</span>
              <span className="hidden sm:block"> Konfirmasi </span>
            </li>

            <li className="flex items-center gap-2 bg-slate-50 p-2">
              <span className={active === 1 ? activeStep : regularStep}>2</span>
              <span className="hidden sm:block"> Survey </span>
            </li>

            <li className="flex items-center gap-2 bg-slate-50 p-2">
              <span className={active === 2 ? activeStep : regularStep}>3</span>
              <span className="hidden sm:block"> Hasil </span>
            </li>
          </ol>
        </div>
      </div>

      {/* Survey Sub Progress Bar - Only show when active === 1 (Survey) */}
      {active === 1 && (
        <div className="w-full px-4 md:px-16 py-6 border-t border-gray-200">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              {surveySteps.map((step) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={
                        currentStep === step.id
                          ? 'text-sm font-semibold text-gray-900'
                          : currentStep > step.id
                          ? 'text-sm font-medium text-gray-500'
                          : 'text-sm font-medium text-gray-400'
                      }
                    >
                      {currentStep === step.id && `Langkah ${step.id} dari 3: `}
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Progress Bar Line */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-red-700 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / surveySteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
