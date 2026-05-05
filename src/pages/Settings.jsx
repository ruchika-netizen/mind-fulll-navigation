import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
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

  const playToggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;

    audio.play()
      .then(() => {
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 2000);
      })
      .catch(() => {
        console.log("Sound blocked");
      });
  };

  // 1. Password Change Logic
  const handlePasswordChange = async () => {
    if (!newPassword) return alert("Enter a new password");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert(error.message);
    else alert("Password updated successfully!");
    setNewPassword("");
    setLoading(false);
  };

  // 2. Logout Logic
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] p-8 md:p-20 font-serif">
      <header className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-3xl font-light tracking-[0.5em] uppercase italic">Settings</h1>
        <p className="opacity-40 text-xs mt-4 tracking-widest uppercase">System Controls</p>
      </header>

      <div className="max-w-2xl mx-auto space-y-20">


        <section className="space-y-8">
          <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-40 border-b border-[#36454F]/10 pb-2">
            Ambience
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg italic opacity-80">Master Sound</p>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">
                Ritual bells and focus timers
              </p>
            </div>

            <button
              onClick={() => {
                const newState = !soundEnabled;
                setSoundEnabled(newState);

                playToggleSound(); // 🔊 ON + OFF dono pe sound
              }}
              className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${soundEnabled ? "bg-[#36454F]" : "bg-[#36454F]/10"
                }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-all ${soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        </section>

        {/* Account Management */}
        <section className="space-y-8">
          <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-40 border-b border-[#36454F]/10 pb-2">
            Account Management
          </h2>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest opacity-40">
                Email Address
              </label>
              <input
                type="text"
                value={email}
                disabled
                className="bg-transparent border-b border-[#36454F]/5 py-2 opacity-50 italic outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <label className="text-[10px] uppercase tracking-widest opacity-40">
                New Password
              </label>

              <div className="flex gap-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent border-b border-[#36454F]/10 py-2 focus:outline-none italic"
                />

                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="text-[10px] uppercase tracking-widest border border-[#36454F]/20 px-4 py-1 rounded hover:bg-[#36454F] hover:text-white transition-all"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-10 space-y-8">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-red-800/40 border-b border-red-800/5 pb-2">
            Danger Zone
          </h2>

          <div className="flex items-center justify-between">
            <p className="text-sm italic opacity-60">Terminate current session</p>

            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-[0.3em] bg-red-50 text-red-800 px-6 py-2 rounded-full border border-red-100 hover:bg-red-800 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Settings;