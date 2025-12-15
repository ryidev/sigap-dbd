'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect jika tidak ada email
  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  // Countdown untuk resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle input OTP
  const handleOtpChange = (index: number, value: string) => {
    // Hanya allow angka
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus ke input berikutnya
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit jika semua terisi
    if (newOtp.every(digit => digit !== '') && value) {
      handleVerify(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus ke input terakhir yang terisi
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();

    // Auto verify jika lengkap
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  // Verify OTP
  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setError('');
    setAttemptsRemaining(null);

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.attemptsRemaining === 'number') {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);

      // Redirect ke login atau home setelah 2 detik
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError('');
    setAttemptsRemaining(null);

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setResendCooldown(data.retryAfter || 60);
        }
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setResendCooldown(60); // 60 detik cooldown
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      // Show success message
      const isConfirmed = window.confirm('OTP baru telah dikirim ke email Anda! Klik OK untuk melanjutkan.');
      if (!isConfirmed) {
        // Reset state jika user cancel
        setResendCooldown(0);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Verifikasi Email
            </h1>
            <p className="text-gray-600">
              Masukkan kode OTP 6 digit yang telah dikirim ke
            </p>
            <p className="text-red-700 font-semibold mt-1">
              {email}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-800 font-medium">
                  Verifikasi berhasil! Mengalihkan...
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <span className="text-red-800 font-medium block">{error}</span>
                  {attemptsRemaining !== null && attemptsRemaining > 0 && (
                    <span className="text-red-600 text-sm">
                      {attemptsRemaining} percobaan tersisa
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading || success}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold
                    border-2 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-red-700
                    transition-all duration-200
                    ${digit ? 'border-red-700 bg-red-50' : 'border-gray-300'}
                    ${loading || success ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    ${error ? 'border-red-500' : ''}
                  `}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Tidak menerima kode?{' '}
              {resendCooldown > 0 ? (
                <span className="text-gray-400">
                  Kirim ulang dalam {resendCooldown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-red-700 font-semibold hover:text-red-800 hover:underline disabled:opacity-50"
                >
                  Kirim Ulang
                </button>
              )}
            </p>
          </div>

          {/* Timer Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Kode OTP berlaku selama 10 menit</p>
                <p className="text-yellow-700 mt-1">
                  Jangan bagikan kode ini kepada siapapun
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/register"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              ← Kembali ke halaman registrasi
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 text-white text-sm">
          <p>
            Butuh bantuan?{' '}
            <a href="/about" className="font-semibold hover:underline">
              Hubungi Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyOTPLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-700 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Memuat...
            </h1>
            <p className="text-gray-600">
              Mohon tunggu sebentar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<VerifyOTPLoading />}>
      <VerifyOTPContent />
    </Suspense>
  );
}
