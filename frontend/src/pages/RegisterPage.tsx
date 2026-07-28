import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/forms/Input';
import { Checkbox } from '../components/forms/Checkbox';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('You must accept the Terms of Service to register.');
      return;
    }

    setIsLoading(true);
    const { error } = await register(email, password, fullName);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Registration failed.');
    } else {
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredEmail: email,
            successMessage: 'Account created successfully. Please log in to continue.',
          },
        });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xl shadow-sm group-hover:scale-105 transition-transform">
            📝
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Notes App
          </span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm p-6 sm:p-8 space-y-6 transition-colors duration-200">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
            Start organizing your thoughts effortlessly
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[#EF4444] dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[#22C55E] dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={User}
            id="register-fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            id="register-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Accept Terms Checkbox */}
          <div className="pt-1">
            <Checkbox
              id="register-terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              label={
                <span>
                  I accept the{' '}
                  <span className="font-semibold text-[#6366F1] dark:text-[#818CF8]">Terms of Service</span> and{' '}
                  <span className="font-semibold text-[#6366F1] dark:text-[#818CF8]">Privacy Policy</span>
                </span>
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              id="register-submit-btn"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/login')}
              id="register-back-login-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center pt-2 text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] hover:underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

