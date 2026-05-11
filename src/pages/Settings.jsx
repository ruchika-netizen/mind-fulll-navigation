import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Bell, ChevronDown } from "lucide-react";
import sound from "../assets/milanwulf-toggle-button-on-166329.mp3";

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const audioRef = useRef(null);

  const faqs = [
    {
      question: "How do I save my entries?",
      answer: "Your entries are automatically saved to our secure database as you write. You can find them anytime in The River or your Gathering Place."
    },
    {
      question: "Is my data private?",
      answer: "Yes. Your journal is yours alone. We use industry-standard encryption through Supabase to ensure only you can access your reflections."
    },
    {
      question: "Can I use the app offline?",
      answer: "Currently, an internet connection is required to sync your journey across devices, but we are working on offline support for future updates."
    }
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
    const audio = audioRef.current;
    if (!audio) return;
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

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] font-sans selection:bg-[#36454F]/10">

      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto py-10 ">
        <div className="relative flex items-center justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-xl leading-none group-hover:-translate-x-1 transition-transform duration-300 inline-block">
              ‹
            </span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pb-24">
        <header className="mb-20">
          <h1 className="text-5xl font-serif italic mb-2 tracking-tight">Settings</h1>
          <p className="text-[15px] font-sans font-bold uppercase tracking-[0.2em] ">Personalize your environment</p>
        </header>

        <div className="space-y-16">

          {/* PREFERENCES SECTION */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <Bell size={30} className="" />
              <h2 className="text-[15px] uppercase tracking-[0.2em] font-bold ">Preferences</h2>
            </div>

            <div className="bg-white/50 border border-[#36454F]/5 rounded-[2rem] p-8 flex items-center justify-between hover:border-[#36454F]/10 transition-all shadow-sm">
              <div>
                <p className="text-lg font-serif italic">Interface Ambience</p>
                <p className="text-[14px] font-sans font-bold uppercase tracking-widest mt-1">
                  Audio feedback for interactions
                </p>
              </div>

              <button
                onClick={() => {
                  playToggleSound();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`w-14 h-7 rounded-full transition-all duration-500 flex items-center px-1.5 ${soundEnabled ? "bg-[#36454F]" : "bg-[#36454F]/10"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 transform ${soundEnabled ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
          </section>

          {/* SECURITY SECTION */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={30} className="" />
              <h2 className="text-[15px] uppercase tracking-[0.2em] font-bold ">Security</h2>
            </div>

            <div className="space-y-8 px-2">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-sans font-bold uppercase tracking-widest ">User ID (Email)</label>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="bg-transparent border-b border-[#36454F]/5 py-3 text-md font-sans opacity-50 italic outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-6 w-full">
                <label className="text-[14px] font-sans font-bold uppercase tracking-widest">
                  Reset Password
                </label>

                <div className="relative flex items-center bg-white/40 border border-[#D4AF37]/40 rounded-[1.5rem] px-6 py-1 transition-all duration-500 hover:border-[#D4AF37] focus-within:border-[#D4AF37] focus-within:shadow-lg focus-within:shadow-[#D4AF37]/5">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New password"
                    className="flex-1 bg-transparent py-3 text-md italic font-serif outline-none text-[#36454F] z"
                  />
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading || !newPassword}
                    className={`ml-4 text-[14px] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 ${newPassword ? "text-[#D4AF37] opacity-100 hover:tracking-[0.4em]" : "text-[#36454F] opacity-10"}`}
                  >
                    {loading ? "..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border border-[#36454F] flex items-center justify-center">
                <span className="text-[15px] font-bold">?</span>
              </div>
              <h2 className="text-[14px] font-sans font-bold uppercase tracking-widest">FAQ</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`group bg-white/20 border border-[#36454F]/5 rounded-[1.2rem] p-4 transition-all duration-500 shadow-sm ${isOpen ? 'bg-white/40 border-[#36454F]/10' : 'hover:border-[#36454F]/10'}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between cursor-pointer text-left outline-none"
                    >
                      <p className={`text-[18px] font-serif italic text-[#36454F] transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-100'}`}>
                        {faq.question}
                      </p>
                      <ChevronDown
                        size={14}
                        className={`text-[#36454F]/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#36454F]/50' : ''}`}
                      />
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-[#36454F]/5' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[16px] font-sans leading-relaxed tracking-[0.02em]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LOGOUT SECTION HAS BEEN REMOVED TO PREVENT CONFLICTS */}

        </div>
      </main>
    </div>
  );
}

export default Settings;