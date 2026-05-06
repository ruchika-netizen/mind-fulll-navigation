import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Bell, ChevronLeft } from "lucide-react";
import sound from "../assets/milanwulf-toggle-button-on-166329.mp3";

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(sound);
    audio.volume = 0.4;
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setEmail(user.email);
  };

  // Sound play function ko fix kiya
  const playToggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Yahan se !soundEnabled wali condition hata di taaki OFF pe bhi sound aaye
    audio.currentTime = 0;
    audio.play().catch(() => console.log("Sound blocked by browser"));
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else alert("Security credentials updated.");
    setNewPassword("");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] font-sans selection:bg-[#36454F]/10">

      <nav className="max-w-7xl mx-auto  py-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all"
        >
          <ChevronLeft size={14} /> Back
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <header className="mb-20">
          <h1 className="text-4xl font-serif italic mb-2 tracking-tight">Settings</h1>
          <p className="text-[13px] font-sans uppercase tracking-[0.2em] opacity-40">Personalize your environment</p>
        </header>

        <div className="space-y-16">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <Bell size={16} className="opacity-30" />
              <h2 className="text-[13px] uppercase tracking-[0.4em] font-bold opacity-30">Preferences</h2>
            </div>

            <div className="bg-white/50 border border-[#36454F]/5 rounded-[2rem] p-8 flex items-center justify-between hover:border-[#36454F]/10 transition-all shadow-sm">
              <div>
                <p className="text-lg font-serif italic">Interface Ambience</p>
                <p className="text-[13px] font-sans opacity-40 uppercase tracking-widest mt-1">
                  Audio feedback for interactions
                </p>
              </div>

              {/* Toggle Button logic fix */}
              <button
                onClick={() => {
                  playToggleSound(); // Pehle sound play hogi
                  setSoundEnabled(!soundEnabled); // Phir state change hogi
                }}
                className={`w-14 h-7 rounded-full transition-all duration-500 flex items-center px-1.5 ${soundEnabled ? "bg-[#36454F]" : "bg-[#36454F]/10"
                  }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 transform ${soundEnabled ? "translate-x-7" : "translate-x-0"
                  }`} />
              </button>
            </div>
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={16} className="opacity-30" />
              <h2 className="text-[13px] uppercase tracking-[0.4em] font-bold opacity-30">Security</h2>
            </div>

            <div className="space-y-8 px-2">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-sans font-bold uppercase tracking-widest opacity-40">User ID (Email)</label>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="bg-transparent border-b border-[#36454F]/5 py-3 text-sm font-sans opacity-50 italic outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-6 w-full max-w-md">
                {/* Label - Minimalist & Spaced */}
                <label className="text-[13px] font-sans font-bold uppercase tracking-[0.4em] opacity-30 ml-1">
                  Reset Password
                </label>

                <div className="relative group">
                  {/* The Presence Style Input Box */}
                  <div className="relative flex items-center bg-white/40 border border-[#D4AF37]/40 rounded-[1.5rem] px-6 py-1 transition-all duration-500 hover:border-[#D4AF37] focus-within:border-[#D4AF37] focus-within:shadow-lg focus-within:shadow-[#D4AF37]/5">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Eneter New password"
                      className="flex-1 bg-transparent py-2 text-md italic font-serif outline-none text-[#36454F] placeholder:opacity-20"
                    />

                    {/* Sleek Action Button inside/beside */}
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !newPassword}
                      className={`ml-4 text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 ${newPassword
                        ? "text-[#D4AF37] opacity-100 hover:tracking-[0.4em]"
                        : "text-[#36454F] opacity-10"
                        }`}
                    >
                      {loading ? "..." : "Update"}
                    </button>
                  </div>

                  {/* Optional subtle help text */}
                  {/* <p className="mt-3 ml-4 text-[12px] font-bold  uppercase tracking-widest font-sans">
                    Enter at least 6 characters
                  </p> */}
                </div>
              </div>
            </div>
          </section>

          {/* <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#36454F]/5 to-transparent" /> */}

          <section className="pt-4">
            <div className="flex items-center justify-between bg-red-50/30 border border-red-900/5 p-8 rounded-[2rem]">
              <div>
                <p className="text-lg font-sans font-bold opacity-70 tracking-tight">Active Session</p>
                <p className="text-[13px] font-sans opacity-40 uppercase tracking-widest mt-1">Sign out of all devices</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-[9px] font-sans font-bold uppercase tracking-[0.3em] bg-white text-red-700 px-8 py-3 rounded-full border border-red-100 hover:bg-red-700 hover:text-white hover:shadow-xl hover:shadow-red-900/10 transition-all duration-500"
              >
                <LogOut size={12} /> Logout
              </button>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}

export default Settings;