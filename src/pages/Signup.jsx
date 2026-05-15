import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();
  const recaptchaRef = useRef();


  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {

        navigate("/onboarding");
      }
    };
    checkUser();
  }, [navigate]);

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

        if (error.status === 429) {
          triggerToast("Too many requests. Please wait a moment.", "error");
        } else {
          triggerToast(error.message, "error");
        }
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {

        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          triggerToast("This email is already registered. Try logging in.", "error");
          recaptchaRef.current?.reset();
          setCaptchaToken(null);
        } else {
          triggerToast("Verification link sent! Check your email.", "success");
          await supabase.auth.signOut();
          setTimeout(() => navigate("/login"), 2500);
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


      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform 
        ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"} 
        ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>

        {toast.type === "success" ? (
          <CheckCircle2 className="text-green-500" size={20} />
        ) : (
          <AlertCircle className="text-red-400" size={20} />
        )}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm">
        <h2 className="text-3xl text-center mb-10 italic text-[#36454F]">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter Email"
              className={fieldClasses}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
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
      </div>
    </div>
  );
}

export default Signup;