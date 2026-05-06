import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import EnsoLoader from "../components/EnsoLoader";
import bansuriIntro from "../assets/segment_5s_to_95s (1).mp3";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEnso, setShowEnso] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // URL check: ?verified=true
  const isVerifiedFlow = searchParams.get("verified") === "true";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else if (data?.user) {
      // Check if coming from verification link
      if (isVerifiedFlow) {
        navigate("/invitation?mode=onboarding");
      } else {
        setShowEnso(true); // Normal users get Enso -> Home
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

  const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner";

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
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Password</label>
            <input
              type="text"
              style={{ WebkitTextSecurity: "disc" }}
              placeholder="Enter Password"
              className={fieldClasses}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3 mt-4">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>

        {!isVerifiedFlow && (
          <p className="text-center mt-8 text-[11px] uppercase tracking-[0.2em] opacity-40 font-bold font-sans">
            Don't have an account? <Link to="/signup" className="underline font-bold">signup</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;