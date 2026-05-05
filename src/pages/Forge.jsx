import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Forge() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState("");

  const rituals = [
    { name: "Morning Breathwork", time: 5 },
    { name: "Zen Meditation", time: 10 },
    { name: "Deep Reflection", time: 20 }
  ];

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      completeRitual();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = (mins, name) => {
    setTimeLeft(mins * 60);
    setSelectedRitual(name);
    setIsActive(true);
  };

  const completeRitual = async () => {
    setIsActive(false);
    
    // Play Zen Bell (Placeholder Sound)
    new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3").play();

    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("rituals_progress").insert([
      { user_id: user.id, ritual_name: selectedRitual, duration_minutes: timeLeft / 60 }
    ]);
    alert("Ritual Complete. You are centered. ✨");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#36454F] flex flex-col items-center justify-center p-8 font-serif">
      <header className="mb-24 text-center">
        <h1 className="text-[10px] uppercase tracking-[0.8em] opacity-40 mb-4">The Forge</h1>
        <p className="italic text-2xl opacity-60">Sharpen your presence</p>
      </header>

      {isActive ? (
        <div className="text-center space-y-16">
          <div className="text-9xl font-light tracking-tighter opacity-80 animate-pulse font-sans">
            {formatTime(timeLeft)}
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 italic">{selectedRitual}</p>
          <button 
            onClick={() => setIsActive(false)}
            className="text-[9px] uppercase tracking-widest opacity-30 hover:opacity-100 border-b border-[#36454F]/20 pb-1 transition-all"
          >
            Interrupt Flow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
          {rituals.map((r) => (
            <button
              key={r.name}
              onClick={() => startTimer(r.time, r.name)}
              className="group p-16 border border-[#36454F]/5 rounded-[40px] hover:border-[#36454F]/20 transition-all text-center space-y-6 bg-white/20"
            >
              <h3 className="text-xl italic opacity-60 group-hover:opacity-100 transition-all">{r.name}</h3>
              <p className="text-[9px] uppercase tracking-widest opacity-20">{r.time} Minutes</p>
              <div className="w-1.5 h-1.5 bg-[#36454F]/10 rounded-full mx-auto group-hover:scale-150 transition-all"></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Forge;