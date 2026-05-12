import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, ChevronDown, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import sound from "../assets/milanwulf-toggle-button-on-166329.mp3";
import "../App.css";

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const audioRef = useRef(null);

  const faqs = [
    { question: "How do I save my entries?", answer: "Your entries are automatically saved to our secure database as you write." },
    { question: "Is my data private?", answer: "Yes. Your journal is yours alone, protected by industry-standard encryption." },
    { question: "Can I use the app offline?", answer: "Currently, an internet connection is required to sync your journey." }
  ];

  useEffect(() => {
    const audio = new Audio(sound);
    audio.volume = 0.4;
    audioRef.current = audio;
    getUserData();
  }, []);

  const getUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setEmail(user.email);
  };

  const playToggleSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    setLoading(true);
    try {
      // Alert removed as per your request
      await supabase.auth.updateUser({ password: newPassword });
      setNewPassword("");
      setShowPassword(false);
    } catch (error) {
      console.error("Update failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] font-sans">
      <nav className="max-w-7xl mx-auto py-10 ">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-bold group">
          <span className="text-xl group-hover:-translate-x-1 transition-transform inline-block">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <header className="mb-20">
          <h1 className="text-5xl font-serif italic mb-2">Settings</h1>
          <p className="text-[15px] font-sans font-bold uppercase tracking-[0.2em]">Personalize your environment</p>
        </header>

        <div className="space-y-16">
          {/* PREFERENCES */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Bell size={30} />
              <h2 className="text-[15px] uppercase tracking-[0.2em] font-bold">Preferences</h2>
            </div>
            <div className="bg-white/50 border border-[#36454F]/5 rounded-[2rem] p-8 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-lg font-serif italic">Interface Ambience</p>
                <p className="text-[14px] font-sans font-bold uppercase tracking-widest mt-1">Audio feedback</p>
              </div>
              <button
                onClick={() => { playToggleSound(); setSoundEnabled(!soundEnabled); }}
                className={`w-14 h-7 rounded-full flex items-center px-1.5 transition-all duration-500 ${soundEnabled ? "bg-[#36454F]" : "bg-[#36454F]/10"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${soundEnabled ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
          </section>

          {/* SECURITY - FIXED SECTION */}
          {/* SECURITY SECTION - BROWSER EYE ICON FIXED */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={30} />
              <h2 className="text-[15px] uppercase tracking-[0.2em] font-bold">Security</h2>
            </div>

            <div className="space-y-8 px-2">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-sans font-bold uppercase tracking-widest">User ID (Email)</label>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="bg-transparent border-b border-[#36454F]/5 py-3 text-md font-sans opacity-50 italic outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-6 w-full">
                <label className="text-[14px] font-sans font-bold uppercase tracking-widest">Reset Password</label>

                <div className="relative flex items-center bg-white border border-[#36454F]/5 rounded-[1.5rem] px-6 py-2 transition-all duration-500 focus-within:border-[#D4AF37]/40 shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••"
                    /* Added specific Edge/Chrome browser override classes */
                    className="flex-1 bg-transparent py-3 text-md italic font-serif outline-none text-[#36454F] [::-ms-reveal]:hidden [::-ms-clear]:hidden"
                    autoComplete="new-password"
                  />

                  <div className="flex items-center gap-3">
                    {/* Your Custom React Icon */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#36454F]/30 hover:text-[#36454F] transition-colors flex items-center justify-center w-6"
                    >
                      {showPassword ? (
                        <EyeOff size={18} key="hide-pass" />
                      ) : (
                        <Eye size={18} key="show-pass" />
                      )}
                    </button>

                    {/* Submit Button */}
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !newPassword}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-500 ${newPassword
                        ? "bg-[#D4AF37] text-white shadow-md hover:scale-105"
                        : "bg-[#36454F]/5 text-[#36454F]/10"
                        }`}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={18} strokeWidth={3} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border border-[#36454F] flex items-center justify-center font-bold">?</div>
              <h2 className="text-[14px] font-sans font-bold uppercase tracking-widest">FAQ</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className={`bg-white/20 border border-[#36454F]/5 rounded-[1.2rem] p-4 transition-all ${isOpen ? 'bg-white/40' : ''}`}>
                    <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between text-left outline-none">
                      <p className="text-[18px] font-serif italic">{faq.question}</p>
                      <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="mt-3 pt-3 border-t border-[#36454F]/5 text-[16px] animate-in fade-in slide-in-from-top-1">{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;