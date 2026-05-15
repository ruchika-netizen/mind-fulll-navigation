import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, ChevronDown, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    setLoading(true);
    try {
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
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] font-sans selection:bg-[#36454F]/5">
      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto py-10 ">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-bold group text-[#36454F] hover:text-[#36454F] transition-all">
          <span className="text-xl group-hover:-translate-x-1 transition-transform inline-block">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        {/* SINGLE SEAMLESS WHITE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Inline style use kar rahe hain taaki koi bhi CSS file ise override na kar sake
          style={{ backgroundColor: '#ffffff' }}
          className="rounded-[3rem] shadow-xl border border-[#36454F]/5 overflow-hidden p-12 space-y-20"
        >
          {/* HEADER SECTION */}
          <header>
            <h1 className="text-5xl font-serif italic mb-3 text-[#36454F]">Settings</h1>
            <p className="text-[14px] font-sans font-bold uppercase tracking-[0.3em] ">Personalize your environment</p>
          </header>

          <div className="space-y-20">
            {/* PREFERENCES */}
            <section>
              <div className="flex items-center gap-3 mb-8 ">
                <Bell size={24} strokeWidth={1.5} />
                <h2 className="text-[14px] uppercase tracking-[0.2em] font-bold">Preferences</h2>
              </div>
              <div className="bg-[#FDFCFB]/60 border border-[#36454F]/5 rounded-[2rem] p-8 flex items-center justify-between transition-all hover:bg-[#FDFCFB] shadow-sm">
                <div>
                  <p className="text-xl font-serif italic text-[#36454F]">Interface Ambience</p>
                  <p className="text-[12px] font-sans font-bold uppercase tracking-widest mt-1">Audio feedback</p>
                </div>
                <button
                  onClick={() => { playToggleSound(); setSoundEnabled(!soundEnabled); }}
                  className={`w-14 h-7 rounded-full flex items-center px-1.5 transition-all duration-500 ${soundEnabled ? "bg-[#36454F]" : "bg-[#36454F]/10"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform shadow-sm ${soundEnabled ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>
            </section>

            {/* SECURITY */}
            <section>
              <div className="flex items-center gap-3 mb-8 ">
                <ShieldCheck size={24} strokeWidth={1.5} />
                <h2 className="text-[14px] uppercase tracking-[0.2em] font-bold">Security</h2>
              </div>
              <div className="space-y-8 max-w-xl">
                <div className="flex flex-col gap-2 border-b border-[#36454F]/10 pb-4">
                  <span className="text-[11px] uppercase tracking-widest font-bold  text-[#36454F]">User ID (Email)</span>
                  <span className="text-lg font-serif italic  text-[#36454F]">{email}</span>
                </div>

                <div className="relative flex items-center bg-[#FDFCFB]/60 border border-[#36454F]/5 rounded-[1.8rem] px-7 py-4 shadow-sm focus-within:bg-[#FDFCFB] transition-all">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Update Password"
                    className="flex-1 bg-transparent  text-lg italic font-serif outline-none text-[#36454F] "
                  />
                  <div className="flex items-center gap-4">
                    <button onClick={() => setShowPassword(!showPassword)} className="text-[#36454F]/30 hover:text-[#36454F] transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      disabled={!newPassword || loading}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${newPassword ? "bg-[#36454F] text-white shadow-lg hover:scale-105" : "bg-[#36454F]/5 text-[#36454F]/10"}`}
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={20} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ SECTION */}
            <section className="pb-10">
              <div className="flex items-center gap-3 mb-6 ">
                <div className="w-5 h-5 rounded-full border border-[#36454F] flex items-center justify-center text-[9px] font-bold">?</div>
                <h2 className="text-[12px] uppercase tracking-[0.2em] font-bold">FAQ</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-[1.5rem] transition-all duration-500 overflow-hidden ${isOpen ? 'bg-[#FDFCFB] border-[#36454F]/10 shadow-sm' : 'bg-transparent border-[#36454F]/5 hover:bg-[#FDFCFB]/20'
                        }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between text-left px-6 py-4 outline-none"
                      >
                        {/* Font size 19px se 16px kar diya */}
                        <p className="text-[16px] font-serif italic text-[#36454F]">{faq.question}</p>
                        <ChevronDown size={14} className={`transition-transform duration-500 text-[#36454F]/30 ${isOpen ? 'rotate-180 text-[#36454F]' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            {/* Answer ka font 17px se 14px kar diya */}
                            <div className="px-6 pb-5 pt-0 text-[16px] font-sans italic text-[#36454F] leading-relaxed">
                              <div className="w-6 h-[1px] bg-[#36454F]/10 mb-3" />
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Settings;