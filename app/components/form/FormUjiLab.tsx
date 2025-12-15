'use client'

interface FormProps {
    formData: any
    setFormData: (data: any) => void
}

export default function FormUjiLab({ formData, setFormData }: FormProps) {
    const isUjiLabDisabled = formData.ULABO === 'Belum'

    return (
        <div>
            <h3 className="mb-8 text-3xl font-bold tracking-tight text-red-700">
                Uji Laboratorium
            </h3>

            <div className="flex flex-col gap-y-8">
                {/* Apakah Sudah Uji Lab */}
                <div className="flex flex-col gap-y-4">
                    <div className="flex gap-x-6 items-start">
                        <img src="/blood-analysis.png" alt="Question" className="w-16 flex-shrink-0" />
                        <div className="flex-1">
                            <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                Apakah anda sudah melakukan uji darah di Laboratorium?
                            </h5>
                            <p className="font-normal text-gray-700 mb-4">
                                Uji darah dapat dilakukan untuk mengetahui kondisi tubuh Anda
                            </p>
                            <ul className="w-full items-center text-sm font-medium flex gap-4">
                                {['Sudah', 'Belum'].map((choice, index) => {
                                    const checked = formData.ULABO === choice
                                    return (
                                        <li key={choice} className="flex-1 rounded-xl border border-gray-200">
                                            <div
                                                className={`flex items-center px-8 transition-colors duration-200 rounded-xl ${checked ? 'bg-red-700 text-white' : 'bg-white text-gray-900'
                                                    }`}
                                            >
                                                <input
                                                    id={`ulabo-${index}`}
                                                    type="radio"
                                                    value={choice}
                                                    name="ULABO"
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, ULABO: e.target.value })
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor={`ulabo-${index}`}
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
                    {/* WBC */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/white-blood-cell.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className="flex flex-col flex-1">
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Jumlah WBC (sel darah putih) [×10^3/uL]
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Jumlah sel darah putih yang normal berkisar antara 4.5-11.0
                                    ×10^3/uL
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="JWBCS"
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                            min={1.0}
                            max={15.0}
                            step={0.1}
                            value={formData.JWBCS}
                            onChange={(e) =>
                                setFormData({ ...formData, JWBCS: parseFloat(e.target.value) })
                            }
                            disabled={isUjiLabDisabled}
                        />
                    </div>

                    {/* Hemoglobin */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/red-blood-cells.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className="flex flex-col flex-1">
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Hemoglobin [g/dL]
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Hemoglobin adalah protein yang membawa oksigen dalam sel darah
                                    merah
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="HEMOG"
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                            min={10.0}
                            max={20.0}
                            step={0.1}
                            value={formData.HEMOG}
                            onChange={(e) =>
                                setFormData({ ...formData, HEMOG: parseFloat(e.target.value) })
                            }
                            disabled={isUjiLabDisabled}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Hematocrit */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/blood-test.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className="flex flex-col flex-1">
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Hematokrit [%]
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Hematokrit adalah persentase volume sel darah merah dalam
                                    darah
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="HEMAT"
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                            min={1}
                            max={70}
                            step={1}
                            value={formData.HEMAT}
                            onChange={(e) =>
                                setFormData({ ...formData, HEMAT: parseInt(e.target.value) })
                            }
                            disabled={isUjiLabDisabled}
                        />
                    </div>

                    {/* Platelet */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex gap-x-6 items-center">
                            <img
                                src="/thermometer.png"
                                alt="Question"
                                className={`w-16 flex-shrink-0 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50' : ''}`}
                            />
                            <label className="flex flex-col flex-1">
                                <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-900">
                                    Jumlah Platelet [×10^3/uL]
                                </h5>
                                <p className="font-normal text-gray-700">
                                    Jumlah platelet yang normal berkisar antara 150-450 ×10^3/uL
                                </p>
                            </label>
                        </div>
                        <input
                            type="number"
                            name="JPLAT"
                            className={`w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-700 focus:border-red-700 block p-2.5 transition-all ${isUjiLabDisabled ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
                            min={1}
                            max={700}
                            step={1}
                            value={formData.JPLAT}
                            onChange={(e) =>
                                setFormData({ ...formData, JPLAT: parseInt(e.target.value) })
                            }
                            disabled={isUjiLabDisabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}