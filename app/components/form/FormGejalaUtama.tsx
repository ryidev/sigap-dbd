'use client'

interface FormProps {
    formData: any
    setFormData: (data: any) => void
}

export default function FormGejalaUtama({ formData, setFormData }: FormProps) {
    return (
        <div>
            <h3 className="mb-8 text-3xl font-bold tracking-tight text-red-700">
                Gejala Utama
            </h3>

            <div className="flex flex-col gap-y-8">
                {/* Apakah Merasakan Demam */}
                <div className="flex flex-col gap-y-4">
                    <div className="flex gap-x-6 items-start">
                        <img src="/sick.png" alt="Question" className="w-16 flex-shrink-0" />
                        <div className="flex-1">
                            <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                Apakah anda merasakan demam?
                            </h5>
                            <p className="font-normal text-gray-700 mb-4">
                                Jika suhu tubuh anda di atas 38°C, maka anda seharusnya
                                merasakan demam
                            </p>
                            <ul className="w-full items-center text-sm font-medium flex gap-4">
                                {['Iya', 'Tidak'].map((choice, index) => {
                                    const checked = formData.KDEMA === choice
                                    return (
                                        <li key={choice} className="flex-1 rounded-xl border border-gray-200">
                                            <div
                                                className={`flex items-center px-8 transition-colors duration-200 rounded-xl ${checked ? 'bg-red-700 text-white' : 'bg-white text-gray-900'
                                                    }`}
                                            >
                                                <input
                                                    id={`kdema-${index}`}
                                                    type="radio"
                                                    value={choice}
                                                    name="KDEMA"
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, KDEMA: e.target.value })
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor={`kdema-${index}`}
                                                    className="w-full py-3 text-center text-sm font-medium cursor-pointer"
                                                >
                                                    {choice}
                                                </label>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Durasi Demam */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/schedule.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all duration-200 ${formData.KDEMA !== 'Iya' ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className={`flex flex-col flex-1 min-h-[88px] transition-all duration-200 ${formData.KDEMA !== 'Iya' ? 'opacity-50' : ''}`}>
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Durasi demam (hari)
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Berapa lama Anda merasakan demam?
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="DDEMA"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            min={1}
                            max={31}
                            step={1}
                            value={formData.DDEMA || 1}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                                const value = e.target.value === '' ? 1 : parseInt(e.target.value)
                                const finalValue = value < 1 ? 1 : value
                                setFormData({ ...formData, DDEMA: finalValue })
                            }}
                            onBlur={(e) => {
                                if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                    setFormData({ ...formData, DDEMA: 1 })
                                }
                            }}
                            disabled={formData.KDEMA !== 'Iya'}
                        />
                    </div>

                    {/* Suhu */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/thermometer.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all duration-200 ${formData.KDEMA !== 'Iya' ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className={`flex flex-col flex-1 min-h-[88px] transition-all duration-200 ${formData.KDEMA !== 'Iya' ? 'opacity-50' : ''}`}>
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Suhu saat ini (°C)
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Anda dapat mengecek suhu tubuh Anda dengan termometer
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="SUHUN"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            min={35.0}
                            max={45.0}
                            step={0.1}
                            value={formData.SUHUN || ''}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                                const value = e.target.value === '' ? '' : parseFloat(e.target.value)
                                setFormData({ ...formData, SUHUN: value })
                            }}
                            onBlur={(e) => {
                                if (e.target.value === '' || parseFloat(e.target.value) < 35) {
                                    setFormData({ ...formData, SUHUN: 35 })
                                }
                            }}
                            disabled={formData.KDEMA !== 'Iya'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}