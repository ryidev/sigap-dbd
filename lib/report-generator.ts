import { DengueCheckRecord } from './dengue-service'
import jsPDF from 'jspdf'

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getModelNameDisplay = (modelName: string): string => {
    const modelMap: Record<string, string> = {
        'all_data': 'Model Lengkap (Demam + Lab + Gejala)',
        'fever_general_data': 'Model Demam (Demam + Gejala)',
        'lab_general_data': 'Model Lab (Lab + Gejala)',
        'only_general_data': 'Model Gejala (Hanya Gejala)',
        'decision_tree_v1': 'Model Lama (v1)'
    }
    return modelMap[modelName] || modelName
}

export const getStatusInfo = (prediction: number, probability: number) => {
    if (prediction === 1) {
        if (probability >= 75) {
            return {
                status: 'Positif DBD',
                color: [220, 38, 38] as [number, number, number], // red-600
                bgColor: [254, 226, 226] as [number, number, number] // red-100
            }
        } else {
            return {
                status: 'Kemungkinan DBD',
                color: [234, 88, 12] as [number, number, number], // orange-600
                bgColor: [255, 237, 213] as [number, number, number] // orange-100
            }
        }
    }
    return {
        status: 'Negatif DBD',
        color: [22, 163, 74] as [number, number, number], // green-600
        bgColor: [220, 252, 231] as [number, number, number] // green-100
    }
}

export const generateDenguePDF = (record: DengueCheckRecord): jsPDF => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 20

    const statusInfo = getStatusInfo(record.prediction, record.probability)

    // Header with red background
    doc.setFillColor(220, 38, 38) // red-600
    doc.rect(0, 0, pageWidth, 45, 'F')

    // Title in white
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('LAPORAN HASIL PEMERIKSAAN DBD', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Dengue Fever Check Report', pageWidth / 2, 30, { align: 'center' })

    doc.setFontSize(9)
    doc.text('SiGap Dengue - Sistem Tanggap Dengue', pageWidth / 2, 38, { align: 'center' })

    yPos = 55

    // Reset text color for body
    doc.setTextColor(0, 0, 0)

    // Section: Informasi Pemeriksaan
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('INFORMASI PEMERIKSAAN', 15, yPos)
    yPos += 2
    doc.setDrawColor(220, 38, 38)
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`Tanggal Pemeriksaan: ${formatDate(record.created_at)}`, 15, yPos)
    yPos += 6
    doc.setFontSize(8)
    doc.text(`ID Pemeriksaan: ${record.id}`, 15, yPos)
    yPos += 12

    // Section: Hasil Pemeriksaan (with colored box)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('HASIL PEMERIKSAAN', 15, yPos)
    yPos += 2
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    // Status box
    doc.setFillColor(...statusInfo.bgColor)
    doc.setDrawColor(...statusInfo.color)
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 25, 3, 3, 'FD')

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...statusInfo.color)
    doc.text(`Status: ${statusInfo.status}`, pageWidth / 2, yPos + 3, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Tingkat Kepercayaan: ${Math.round(record.probability || 0)}%`, pageWidth / 2, yPos + 12, { align: 'center' })

    yPos += 30

    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    doc.text(`Model Prediksi: ${getModelNameDisplay(record.model_used)}`, 15, yPos)
    yPos += 12

    // Warning/Info message
    doc.setFillColor(255, 251, 235) // yellow-50
    doc.setDrawColor(251, 191, 36) // yellow-400
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 16, 2, 2, 'FD')

    doc.setFontSize(9)
    doc.setTextColor(120, 53, 15) // yellow-900
    let warningText = ''
    if (statusInfo.status === 'Positif DBD') {
        warningText = 'PERHATIAN: Hasil menunjukkan indikasi POSITIF DBD. Segera konsultasikan ke dokter!'
    } else if (statusInfo.status === 'Kemungkinan DBD') {
        warningText = 'PERINGATAN: Ada kemungkinan DBD. Disarankan untuk memeriksakan diri ke dokter.'
    } else {
        warningText = 'Hasil pemeriksaan tidak menunjukkan indikasi DBD. Tetap jaga kesehatan!'
    }

    const splitWarning = doc.splitTextToSize(warningText, pageWidth - 40)
    doc.text(splitWarning, 20, yPos + 1)
    yPos += 22

    // Section: Data Demam
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('DATA DEMAM', 15, yPos)
    yPos += 2
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`Mengalami Demam: ${record.kdema}`, 15, yPos)
    yPos += 6

    if (record.kdema === 'Iya') {
        doc.text(`Durasi Demam: ${record.ddema} hari`, 15, yPos)
        yPos += 6
        doc.text(`Suhu Tubuh: ${record.suhun}°C`, 15, yPos)
        yPos += 6
    }
    yPos += 6

    // Section: Data Uji Laboratorium
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('DATA UJI LABORATORIUM', 15, yPos)
    yPos += 2
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(`Status Uji Lab: ${record.ulabo}`, 15, yPos)
    yPos += 6

    if (record.ulabo === 'Sudah') {
        doc.text(`Leukosit (WBC): ${record.jwbcs.toFixed(1)} x10³/uL`, 15, yPos)
        yPos += 6
        doc.text(`Hemoglobin: ${record.hemog.toFixed(1)} g/dL`, 15, yPos)
        yPos += 6
        doc.text(`Hematokrit: ${record.hemat}%`, 15, yPos)
        yPos += 6
        doc.text(`Trombosit: ${record.jplat} x10³/uL`, 15, yPos)
        yPos += 6
    }
    yPos += 6

    // Section: Gejala Klinis
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('GEJALA KLINIS', 15, yPos)
    yPos += 2
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    const symptoms = [
        { label: 'Sakit Kepala Parah', value: record.skpla },
        { label: 'Nyeri Belakang Mata', value: record.nymat },
        { label: 'Nyeri Sendi/Otot', value: record.nysen },
        { label: 'Rasa Logam di Mulut', value: record.rsmul },
        { label: 'Hilang Nafsu Makan', value: record.hinfm },
        { label: 'Nyeri Perut', value: record.nyper },
        { label: 'Mual/Muntah', value: record.mumun },
        { label: 'Diare', value: record.mdiar }
    ]

    symptoms.forEach((symptom) => {
        const isChecked = symptom.value === 'Iya'

        // Draw checkbox
        doc.setDrawColor(100, 100, 100)
        doc.setLineWidth(0.3)
        doc.rect(15, yPos - 3, 4, 4)

        // Draw checkmark if checked
        if (isChecked) {
            doc.setDrawColor(220, 38, 38)
            doc.setLineWidth(0.5)
            // Draw checkmark
            doc.line(15.5, yPos - 1, 16.5, yPos + 0.5)
            doc.line(16.5, yPos + 0.5, 18.5, yPos - 2.5)
        }

        // Draw label
        doc.setTextColor(0, 0, 0)
        doc.text(symptom.label, 21, yPos)
        yPos += 6
    })

    yPos += 6

    // New page if needed
    if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
    }

    // Section: Disclaimer
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('DISCLAIMER', 15, yPos)
    yPos += 2
    doc.line(15, yPos, pageWidth - 15, yPos)
    yPos += 8

    doc.setFillColor(239, 246, 255) // blue-50
    doc.setDrawColor(59, 130, 246) // blue-500
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 20, 2, 2, 'FD')

    doc.setFontSize(9)
    doc.setTextColor(30, 58, 138) // blue-900
    const disclaimerText = 'PENTING: Hasil pemeriksaan ini bersifat prediktif dan tidak dapat menggantikan diagnosis medis profesional. Selalu konsultasikan dengan dokter untuk diagnosis yang akurat.'
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 40)
    doc.text(splitDisclaimer, 20, yPos + 1)

    // Footer
    yPos = pageHeight - 25
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Laporan dibuat oleh: SiGap Dengue (Sistem Tanggap Dengue)', pageWidth / 2, yPos, { align: 'center' })
    yPos += 5
    doc.setTextColor(59, 130, 246)
    doc.text('Website: https://sigap-dengue.vercel.app', pageWidth / 2, yPos, { align: 'center' })
    yPos += 5
    doc.setTextColor(100, 100, 100)
    const printTime = new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
    doc.text(`Waktu cetak: ${printTime}`, pageWidth / 2, yPos, { align: 'center' })

    return doc
}

export const downloadReport = (record: DengueCheckRecord) => {
    const doc = generateDenguePDF(record)

    const dateObj = new Date(record.created_at)
    const dateStr = dateObj.toLocaleDateString('id-ID').replace(/\//g, '-')
    const timeStr = dateObj.toLocaleTimeString('id-ID').replace(/:/g, '')

    doc.save(`Laporan-DBD-${dateStr}-${timeStr}.pdf`)
}

// Keep the old text generator for backwards compatibility if needed
export const generateDengueReport = (record: DengueCheckRecord): string => {
    const statusInfo = getStatusInfo(record.prediction, record.probability)

    return `
╔═══════════════════════════════════════════════════════════════════╗
║              LAPORAN HASIL PEMERIKSAAN DBD                        ║
║                  Dengue Fever Check Report                        ║
╚═══════════════════════════════════════════════════════════════════╝

INFORMASI PEMERIKSAAN
─────────────────────────────────────────────────────────────────────
Tanggal Pemeriksaan : ${formatDate(record.created_at)}
ID Pemeriksaan      : ${record.id}

HASIL PEMERIKSAAN
─────────────────────────────────────────────────────────────────────
Status              : ${statusInfo.status}
Tingkat Kepercayaan : ${Math.round(record.probability || 0)}%
Model Prediksi      : ${record.model_used}

${statusInfo.status === 'Positif DBD' ? '⚠️  PERHATIAN: Hasil menunjukkan indikasi POSITIF DBD\n    Segera konsultasikan ke dokter atau fasilitas kesehatan!' :
            statusInfo.status === 'Kemungkinan DBD' ? '⚠️  PERINGATAN: Ada kemungkinan DBD\n    Disarankan untuk memeriksakan diri ke dokter.' :
                '✓  Hasil pemeriksaan tidak menunjukkan indikasi DBD\n    Tetap jaga kesehatan dan kebersihan lingkungan.'}

DATA DEMAM
─────────────────────────────────────────────────────────────────────
Mengalami Demam     : ${record.kdema}
${record.kdema === 'Iya' ? `Durasi Demam        : ${record.ddema} hari
Suhu Tubuh          : ${record.suhun}°C` : ''}

DATA UJI LABORATORIUM
─────────────────────────────────────────────────────────────────────
Status Uji Lab      : ${record.ulabo}
${record.ulabo === 'Sudah' ? `Leukosit (WBC)      : ${record.jwbcs.toFixed(1)} x10³/μL
Hemoglobin          : ${record.hemog.toFixed(1)} g/dL
Hematokrit          : ${record.hemat}%
Trombosit           : ${record.jplat} x10³/μL` : ''}

GEJALA KLINIS
─────────────────────────────────────────────────────────────────────
[${record.skpla === 'Iya' ? '✓' : '✗'}] Sakit Kepala Parah
[${record.nymat === 'Iya' ? '✓' : '✗'}] Nyeri Belakang Mata
[${record.nysen === 'Iya' ? '✓' : '✗'}] Nyeri Sendi/Otot
[${record.rsmul === 'Iya' ? '✓' : '✗'}] Rasa Logam di Mulut
[${record.hinfm === 'Iya' ? '✓' : '✗'}] Hilang Nafsu Makan
[${record.nyper === 'Iya' ? '✓' : '✗'}] Nyeri Perut
[${record.mumun === 'Iya' ? '✓' : '✗'}] Mual/Muntah
[${record.mdiar === 'Iya' ? '✓' : '✗'}] Diare

INFORMASI MODEL
─────────────────────────────────────────────────────────────────────
Model yang digunakan menggunakan algoritma Logistic Regression untuk
memprediksi kemungkinan DBD berdasarkan data yang dimasukkan.

Varian Model: ${getModelNameDisplay(record.model_used)}

DISCLAIMER
─────────────────────────────────────────────────────────────────────
⚠️  PENTING: Hasil pemeriksaan ini bersifat prediktif dan tidak dapat
    menggantikan diagnosis medis profesional. Selalu konsultasikan
    dengan dokter untuk diagnosis yang akurat.

─────────────────────────────────────────────────────────────────────
Laporan dibuat oleh: SiGap Dengue (Sistem Tanggap Dengue)
Website: https://sigap-dengue.vercel.app
Waktu cetak: ${new Date().toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
═══════════════════════════════════════════════════════════════════════
`.trim()
}
