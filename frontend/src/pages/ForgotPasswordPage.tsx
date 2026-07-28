import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/forms/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    const { error } = await forgotPassword(email);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Failed to send password reset link.');
    } else {
      setSuccessMsg('Password reset link sent! Please check your email inbox.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xl shadow-sm group-hover:scale-105 transition-transform">
            📝
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#0F172A]">
            Notes App
          </span>
        </Link>
      </div>

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#EF4444] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#22C55E] text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              id="forgot-submit-btn"
            >
              <Send className="w-4 h-4" />
              <span>Send Reset Link</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/login')}
              id="forgot-back-login-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Button>
          </div>
        </form>

        {/* Back to Login Link */}
        <div className="text-center pt-2 text-xs text-[#64748B]">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

