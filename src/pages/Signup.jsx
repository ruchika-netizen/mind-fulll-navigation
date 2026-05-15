import React, { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, MailCheck } from "lucide-react"; // MailCheck added
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isSignedUp, setIsSignedUp] = useState(false); // Success state tracking

  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      triggerToast("Please verify the Google reCAPTCHA", "error");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          captchaToken: captchaToken,
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        triggerToast(error.message, "error");
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        // Agar user already exist karta hai (Supabase behavior)
        if (data?.user && data.user.identities?.length === 0) {
          triggerToast("Email already registered. Try logging in.", "error");
        } else {
          // SUCCESS: Show success UI instead of blank or instant redirect
          setIsSignedUp(true);
          triggerToast("Verification link sent! Check your email.", "success");
        }
      }
    } catch (err) {
      triggerToast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner pr-14";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4 font-serif text-[#36454F] relative">
      {/* Toast Notification */}
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform 
        ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"} 
        ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm text-center">
        {isSignedUp ? (
          // --- SUCCESS VIEW (Fixes Blank Screen) ---
          <div className="py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl italic mb-4">Check your inbox</h2>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">
              We've sent a verification link to <br /> <strong>{form.email}</strong>. <br />
              Please confirm your email to activate your account.
            </p>
            {/* <Link to="/login" className="text-[10px] uppercase tracking-widest font-bold font-sans underline opacity-60 hover:opacity-100">
              Back to Login
            </Link> */}
          </div>
        ) : (
          // --- SIGNUP FORM ---
          <>
            <h2 className="text-3xl text-center mb-10 italic text-[#36454F]">Create Account</h2>
            <form onSubmit={handleSignup} className="space-y-6" autoComplete="off">
              <div className="text-left space-y-2">
                <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className={fieldClasses}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="text-left space-y-2">
                <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Create Password</label>
                <div className="relative group">
                  <input
                    type="text"
                    style={!showPassword ? { WebkitTextSecurity: "disc" } : {}}
                    placeholder="Enter Password"
                    className={fieldClasses}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#36454F]/30 hover:text-[#36454F]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <div className="scale-[0.85] origin-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeH3NssAAAAAGpM5Uw9uM8XLWDTq_5a2qqR0fHA"
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Sign Up"}
              </button>
            </form>

            <p className="text-center mt-8 text-[11px] uppercase tracking-[0.2em] opacity-40 font-sans font-bold">
              Have an account? <Link to="/login" className="underline font-bold opacity-100 text-[#36454F]">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;