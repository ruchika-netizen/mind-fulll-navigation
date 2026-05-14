import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Volume2, VolumeX, Menu, X, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bansuriIntro from "../assets/trimmed_output.mp3";

function Header({ session }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(localStorage.getItem("soundEnabled") !== "false");
  const navigate = useNavigate();

  const confirmLogout = async () => {
    // Loader skip karne ka flag set karo
    sessionStorage.setItem("enso_played", "true");

    // Supabase se logout
    await supabase.auth.signOut();

    // Sirf zaroori data clear karo, sessionStorage ko turant mat chhedo
    localStorage.removeItem("soundEnabled");

    // Direct redirect
    window.location.href = "/login";
  };

  const toggleSound = () => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);
    localStorage.setItem("soundEnabled", newState);
    if (window.currentAppAudio) {
      newState ? window.currentAppAudio.play() : window.currentAppAudio.pause();
    } else if (newState) {
      const audio = new Audio(bansuriIntro);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().then(() => {
        window.currentAppAudio = audio;
      }).catch(() => setIsSoundOn(false));
    }
  };

  const navLinks = [{ name: "Home", path: "/" }];

  return (
    <nav className="bg-[#F5F0E8] border-b border-[#36454F]/10 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-[100] font-serif">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        <Link to="/" className="z-[110] flex-shrink-1 min-w-0">
          <h1 className="text-[10px] sm:text-[14px] lg:text-lg tracking-tighter text-[#36454F] font-bold uppercase leading-tight truncate sm:whitespace-nowrap">
            The Mindful Navigator
          </h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-8 font-sans">
            {navLinks.map((item) => (
              <Link key={item.name} to={item.path} className=" transition text-[13px] uppercase tracking-[0.3em] text-[#000] font-bold">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-6 lg:border-l lg:border-[#36454F]/10 lg:pl-8">
            <button onClick={toggleSound} className="p-1 text-[#36454F] active:scale-90 transition-transform">
              {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} className="opacity-40" />}
            </button>

            {session ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <Link to="/settings" className="hidden md:block text-[13px] uppercase tracking-widest font-bold font-sans">Settings</Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#36454F] text-[12px] sm:text-[11px] uppercase tracking-widest hover:bg-[#36454F] hover:text-white transition font-bold font-sans whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#36454F] text-[8px] sm:text-[10px] uppercase tracking-widest font-bold font-sans">
                Sign In
              </Link>
            )}
          </div>
          <button className="lg:hidden text-[#36454F] z-[110] p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* --- LOGOUT POPUP (MODAL) --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-[#36454F]/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#F5F0E8] border border-[#36454F]/10 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 bg-[#36454F]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={20} className="text-[#36454F]" />
              </div>
              <p className="text-[18px] text-[#36454F] mb-8 font-sans leading-relaxed">
                Are you sure you want to conclude your current session?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmLogout}
                  className="w-full bg-[#36454F] text-white py-3 rounded-xl font-sans text-[11px] uppercase tracking-widest font-bold hover:bg-black transition-colors"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full bg-transparent text-[#36454F]/40 py-2 rounded-xl font-sans text-[12px] uppercase tracking-widest font-bold hover:text-[#36454F] transition-colors"
                >
                  Stay Mindful
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE OVERLAY */}
      <div className={`fixed inset-0 bg-[#F5F0E8] flex flex-col items-center justify-center gap-8 transition-all duration-500 z-[105] ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"} lg:hidden`}>
        {navLinks.map((item) => (
          <Link key={item.name} onClick={() => setIsOpen(false)} to={item.path} className="text-2xl italic text-[#36454F]">{item.name}</Link>
        ))}
        <div className="h-[1px] w-12 bg-[#36454F]/20" />
        {session && (
          <>
            <Link onClick={() => setIsOpen(false)} to="/settings" className="text-sm uppercase tracking-widest font-bold font-sans flex items-center gap-2">
              <Settings size={18} /> Settings
            </Link>
            <button onClick={() => { setIsOpen(false); setShowLogoutModal(true); }} className="text-sm uppercase tracking-widest font-bold font-sans text-red-400 mt-4">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;