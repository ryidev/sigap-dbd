'use client'

interface FormProps {
    formData: any
    setFormData: (data: any) => void
}

export default function FormGejalaTambahan({ formData, setFormData }: FormProps) {
    const symptoms = [
        {
            code: 'SKPLA',
            title: 'Sakit Kepala Parah',
            desc: 'Sakit kepala parah biasanya disertai dengan gejala lain seperti mual dan muntah',
            img: '/fainting.png',
        },
        {
            code: 'NYMAT',
            title: 'Nyeri Belakang Mata',
            desc: 'Nyeri di belakang mata dapat dirasakan saat bergerak atau menolehkan kepala',
            img: '/eye.png',
        },
        {
            code: 'NYSEN',
            title: 'Nyeri Sendi/Otot',
            desc: 'Nyeri sendi atau otot biasanya dirasakan di beberapa bagian',
            img: '/muscle-pain.png',
        },
        {
            code: 'RSMUL',
            title: 'Rasa Logam di Mulut',
            desc: 'Mulut yang terasa seperti logam disebut dysgeusia, atau penyimpangan sensasi rasa',
            img: '/disease.png',
        },
        {
            code: 'HINFM',
            title: 'Hilang Nafsu Makan',
            desc: 'Anda sudah tidak selera makan apapun dalam beberapa hari terakhir',
            img: '/loss-of-appetite.png',
        },
        {
            code: 'NYPER',
            title: 'Nyeri Perut',
            desc: 'Nyeri perut biasanya dirasakan di bagian perut atas atau bawah',
            img: '/abdominal-pain.png',
        },
        {
            code: 'MUMUN',
            title: 'Mual/Muntah',
            desc: 'Mual dan muntah biasanya disertai dengan gejala lain seperti sakit kepala',
            img: '/vomit.png',
        },
        {
            code: 'MDIAR',
            title: 'Diare',
            desc: 'Frekuensi buang air besar (BAB) meningkat dan feses yang dikeluarkan bertekstur encer atau cair',
            img: '/diarrhea.png',
        },
    ]

    const handleToggle = (code: string) => {
        const currentValue = formData[code]
        const newValue = currentValue === 'Iya' ? 'Tidak' : 'Iya'
        setFormData({
            ...formData,
            [code]: newValue,
        })
    }

    return (
        <div>
            <h3 className="mb-8 text-3xl font-bold tracking-tight text-red-700">
                Gejala Tambahan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {symptoms.map((symptom) => {
                    const isSelected = formData[symptom.code] === 'Iya'
                    return (
                        <button
                            key={symptom.code}
                            type="button"
                            onClick={() => handleToggle(symptom.code)}
                            className={`flex flex-col gap-3 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${isSelected
                                    ? 'bg-red-700 border-red-700 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${isSelected ? 'bg-red-100' : 'bg-gray-100'
                                    }`}>
                                    <img
                                        src={symptom.img}
                                        alt={symptom.title}
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>
                                <h5 className={`text-left text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {symptom.title}
                                </h5>
                            </div>
                            <p className={`text-xs text-left line-clamp-2 ${isSelected ? 'text-white' : 'text-gray-600'
                                }`}>
                                {symptom.desc}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}