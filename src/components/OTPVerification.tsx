import React, { useState, useEffect } from 'react';

interface OTPVerificationProps {
  phone: string;
  sessionId: string;
  onVerification: (otp: string) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function OTPVerification({
  phone,
  onVerification,
  onCancel,
  isLoading = false,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (timeRemaining <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await onVerification(otp);
      if (!result.success) {
        setError(result.message);
        setOtp('');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-300 mb-4">
          Enter the 6-digit code sent to <span className="font-semibold text-yellow-400">{phone}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Enter verification code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setOtp(val);
              }}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
              disabled={isVerifying || isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Code expires in: <span className={`font-semibold ${timeRemaining > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {formatTime(timeRemaining)}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isVerifying || isLoading || timeRemaining <= 0}
              className="flex-1 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 transition font-bold"
            >
              {isVerifying || isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isVerifying || isLoading}
              className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
