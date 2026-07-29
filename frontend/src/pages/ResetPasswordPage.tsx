import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "../components/forms/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRecoverySession, setIsRecoverySession] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setIsRecoverySession(true);
        setCheckingSession(false);
        return;
      }

      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    // Wait a short time for Supabase to process the recovery link.
    const timer = setTimeout(() => {
      if (!isRecoverySession) {
        navigate("/login", { replace: true });
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate, isRecoverySession]);

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await updatePassword(password);

    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
      return;
    }

    // Success message
    setSuccessMsg("Password updated successfully! Redirecting to login...");

    setPassword("");
    setConfirmPassword("");

    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    }, 2000);
  };


  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking recovery session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center p-4 [&_label]:!text-[#0F172A]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
        <div className="text-center mb-6">
          <CheckCircle2 className="mx-auto w-10 h-10 text-[#6366F1]" />
          <h1 className="text-2xl font-bold mt-4">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your new password.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting || !!successMsg}
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
