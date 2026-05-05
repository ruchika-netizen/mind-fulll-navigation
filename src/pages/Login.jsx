import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link, useLocation } from "react-router-dom"; // useLocation add kiya
import { Loader2 } from "lucide-react";
import bansuriIntro from "../assets/segment_5s_to_95s (1).mp3"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // URL params check karne ke liye

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // 1. Check if URL has 'verified=true'
      const searchParams = new URLSearchParams(location.search);
      const isVerifiedFlow = searchParams.get("verified") === "true";

      sessionStorage.setItem("isInitialLogin", "true");

      // Sound Setup
      const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
      if (soundEnabled && !window.currentAppAudio) {
        const audio = new Audio(bansuriIntro);
        audio.loop = true;
        audio.volume = 0.5;
        audio.play().catch(err => console.log("Audio Blocked", err));
        window.currentAppAudio = audio;
      }

      // 2. REDIRECTION LOGIC:
      // Agar URL me ?verified=true hai, toh Invitation page par bhejo
      // Warna sidha Home (/) par bhejo
      if (isVerifiedFlow) {
        navigate("/invitation");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center font-serif text-[#36454F]">
      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm">
        <h2 className="text-3xl text-center mb-10 italic">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[9px] uppercase tracking-widest opacity-40 font-sans font-bold ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-transparent border-b border-[#36454F]/10 p-3 outline-none italic"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-widest opacity-40 font-sans font-bold ml-1">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent border-b border-[#36454F]/10 p-3 outline-none italic"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#36454F] text-white py-4 rounded-full uppercase text-[10px] tracking-[0.5em] font-bold font-sans transition-all active:scale-95">
            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.4em] opacity-40 font-sans font-bold">
          Don't have an account? <Link to="/signup" className="underline font-bold opacity-100">signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;