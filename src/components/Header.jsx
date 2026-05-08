import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Settings,
  CircleHelp,
  ChevronDown,
} from "lucide-react";
import bansuriIntro from "../assets/trimmed_output.mp3";

function Header() {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPathOpen, setIsPathOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(
    localStorage.getItem("soundEnabled") !== "false"
  );

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate("/login");
  };

  const toggleSound = () => {
    const newState = !isSoundOn;

    setIsSoundOn(newState);
    localStorage.setItem("soundEnabled", newState);

    if (window.currentAppAudio) {
      newState
        ? window.currentAppAudio.play()
        : window.currentAppAudio.pause();
    } else if (newState) {
      const audio = new Audio(bansuriIntro);

      audio.loop = true;
      audio.volume = 0.5;

      audio
        .play()
        .then(() => {
          window.currentAppAudio = audio;
        })
        .catch(() => setIsSoundOn(false));
    }
  };

  const pathLinks = [
    { name: "The Compass", path: "/compass" },
    { name: "The Orchard", path: "/orchard" },
    { name: "The River", path: "/river" },
    { name: "The Milestones", path: "/milestones" },
    { name: "The Well", path: "/well" },
    { name: "The Practices", path: "/wellbeingpractices" },
    { name: "Companion Readings", path: "/companionReadings" },
    { name: "Gathering Place", path: "/gathering-place" },
  ];

  return (
    <nav className="bg-[#F5F0E8] border-b border-[#36454F]/10 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-[100] font-serif">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
        {/* LOGO */}
        <Link to="/" className="z-[110] flex-shrink-1 min-w-0">
          <h1 className="text-[10px] sm:text-[14px] lg:text-lg tracking-tighter text-[#36454F] font-bold uppercase leading-tight truncate sm:whitespace-nowrap">
            The Mindful Navigator
          </h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 flex-shrink-0">
          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-8 font-sans">
            <Link
              to="/"
              className="hover:opacity-60 transition text-[10px] uppercase tracking-[0.3em] text-[#36454F] font-bold"
            >
              Home
            </Link>

            {/* THE PATH DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsPathOpen(!isPathOpen)}
                className="flex items-center gap-1 hover:opacity-60 transition text-[10px] uppercase tracking-[0.3em] text-[#36454F] font-bold"
              >
                The Path

                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isPathOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isPathOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-xl border border-[#36454F]/5 rounded-2xl py-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {pathLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsPathOpen(false)}
                      className="block px-6 py-2.5 text-[11px] uppercase tracking-widest text-[#36454F] hover:bg-[#F5F0E8] transition-colors font-bold"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-6 lg:border-l lg:border-[#36454F]/10 lg:pl-8">
            {/* SOUND TOGGLE */}
            <button
              onClick={toggleSound}
              className="p-1 text-[#36454F] active:scale-90"
            >
              {isSoundOn ? (
                <Volume2 size={16} />
              ) : (
                <VolumeX size={16} className="opacity-40" />
              )}
            </button>

            {/* HELP */}
            {session && (
              <Link
                to="/invitations"
                className="p-1 text-[#36454F] hover:opacity-60 transition active:scale-90"
              >
                <CircleHelp size={18} strokeWidth={1.5} />
              </Link>
            )}

            {/* AUTH */}
            {session ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <Link
                  to="/settings"
                  className="hidden md:block text-[10px] uppercase tracking-widest opacity-60 font-bold font-sans"
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#36454F] text-[8px] sm:text-[10px] uppercase tracking-widest hover:bg-[#36454F] hover:text-white transition font-bold font-sans whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#36454F] text-[8px] sm:text-[10px] uppercase tracking-widest font-bold font-sans"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden text-[#36454F] z-[110] p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-[#F5F0E8] flex flex-col items-center justify-center overflow-y-auto gap-6 transition-all duration-500 z-[105] ${isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full"
          } lg:hidden`}
      >
        <Link
          onClick={() => setIsOpen(false)}
          to="/"
          className="text-xl italic text-[#36454F]"
        >
          Home
        </Link>

        <div className="h-[1px] w-8 bg-[#36454F]/10" />

        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">
          The Path
        </span>

        <div className="flex flex-col items-center gap-4">
          {pathLinks.map((item) => (
            <Link
              key={item.name}
              onClick={() => setIsOpen(false)}
              to={item.path}
              className="text-lg italic text-[#36454F] hover:opacity-50 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="h-[1px] w-12 bg-[#36454F]/20" />

        {session && (
          <Link
            onClick={() => setIsOpen(false)}
            to="/settings"
            className="text-sm uppercase tracking-widest font-bold font-sans flex items-center gap-2"
          >
            <Settings size={18} />
            Settings
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;