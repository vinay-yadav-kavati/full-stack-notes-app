import { useState, FormEvent, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/forms/Input';
import { Checkbox } from '../components/forms/Checkbox';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  registeredEmail?: string;
  successMessage?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const state = location.state as LocationState | null;

  const [email, setEmail] = useState(state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(state?.successMessage || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (state?.registeredEmail && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [state?.registeredEmail]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    const { error } = await login(email, password);
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message || 'Invalid login credentials');
    } else {
      navigate('/dashboard');
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

      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm p-6 sm:p-8 space-y-6 transition-colors duration-200">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1]">
            Sign in to your account to continue
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[#22C55E] dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[#EF4444] dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            ref={passwordInputRef}
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <Checkbox label="Remember Me" id="login-remember" />
            <Link
              to="/forgot-password"
              className="font-medium text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/')}
              id="login-back-home-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </form>

        {/* Create Account Link */}
        <div className="text-center pt-2 text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] hover:underline transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

