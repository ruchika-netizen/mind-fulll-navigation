import React, { useState, useRef, useEffect } from "react"; // Added useEffect
import { supabase } from "../supabaseClient";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import EnsoLoader from "../components/EnsoLoader";
import bansuriIntro from "../assets/segment_5s_to_95s (1).mp3";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEnso, setShowEnso] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef();
  const searchParams = new URLSearchParams(location.search);

  const isVerifiedFlow = searchParams.get("verified") === "true";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/invitation?mode=onboarding");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setErrorMsg("Please verify that you are human");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
      options: {
        captchaToken: captchaToken,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      // Error hone par captcha reset karna zaroori hai
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } else if (data?.user) {
      if (isVerifiedFlow) {
        navigate("/invitation?mode=onboarding");
      } else {
        setShowEnso(true);
      }
    }
  };

  const handleLoaderComplete = () => {
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    if (soundEnabled && !window.currentAppAudio) {
      const audio = new Audio(bansuriIntro);
      audio.loop = true;
      audio.volume = 0.4;
      audio.play().catch(() => { });
      window.currentAppAudio = audio;
    }
    navigate("/", { replace: true });
  };

  const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner pr-12";

  if (showEnso) return <EnsoLoader onComplete={handleLoaderComplete} />;

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center font-serif text-[#36454F] px-4">
      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm animate-in fade-in duration-700">
        <h2 className="text-3xl text-center mb-10 italic">
          {isVerifiedFlow ? "Confirm Presence" : "Welcome Back"}
        </h2>

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-widest font-sans font-bold bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-7" autoComplete="off">
          <div className="space-y-2">
            <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter Email"
              className={fieldClasses}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold">Password</label>
              <Link to="/forgot-password" size={10} className="text-[10px] uppercase tracking-[0.2em] transition-opacity font-sans font-bold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={fieldClasses}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#36454F]/30 hover:text-[#36454F] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ReCAPTCHA */}
          <div className="flex justify-center py-2 overflow-hidden">
            <div className="scale-[0.85] origin-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeH3NssAAAAAGpM5Uw9uM8XLWDTq_5a2qqR0fHA" // Make sure this key is correct for your domain
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>

        {!isVerifiedFlow && (
          <p className="text-center mt-8 text-[11px] uppercase tracking-[0.2em] opacity-40 font-bold font-sans">
            Don't have an account? <Link to="/signup" className="underline font-bold opacity-100">signup</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;