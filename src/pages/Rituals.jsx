import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3"; 

function Rituals() {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle"); 
  const bellRef = useRef(new Audio(bellSound));

  const performActualLogout = async () => {
    await supabase.auth.signOut();
    if (window.currentAppAudio) {
      window.currentAppAudio.pause();
      window.currentAppAudio.currentTime = 0;
      window.currentAppAudio = null;
    }
    sessionStorage.removeItem("isInitialLogin");
    navigate("/login");
  };

  const handlePlant = async () => {
    if (!intention.trim()) return;
    setStatus("planting");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from("rituals")
        .insert([{ user_id: user.id, intention: intention }]);

      if (insertError) throw insertError;
      console.log("Intention successfully planted");
    } catch (e) {
      console.error("Supabase Error:", e.message);
    }

    setTimeout(() => {
      bellRef.current.play(); 
      setStatus("completed");
      setTimeout(() => {
        performActualLogout();
      }, 6000); // Thoda extra time for the peaceful ending
    }, 5000); 
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-8 font-serif text-[#36454F] overflow-hidden selection:bg-[#36454F]/10">
      
      <div className="max-w-3xl w-full flex flex-col items-center text-center">
        
        {/* ENSŌ CIRCLE (Minimalist Centerpiece) */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-16">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="0.2" opacity="0.1" />
            <circle
              cx="50" cy="50" r="48"
              fill="none"
              stroke="#36454F"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="301.6"
              strokeDashoffset={status === "planting" || status === "completed" ? "0" : "301.6"}
              className={`transition-all duration-[5000ms] ease-in-out ${status === "idle" ? "opacity-5" : "opacity-100"}`}
            />
          </svg>
          
          {/* Subtle Glow/Pulsing when idle */}
          {status === "idle" && (
             <div className="absolute w-2 h-2 bg-[#36454F] rounded-full animate-ping opacity-20"></div>
          )}
        </div>

        {/* CONTENT STAGES */}
        <div className="w-full min-h-[300px] flex flex-col items-center justify-start">
          
          {/* STAGE 1: IDLE */}
          {status === "idle" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
              <div className="space-y-4">
                <h2 className="text-[10px] uppercase tracking-[0.6em] font-sans font-bold text-[#36454F]">The Closing Ritual</h2>
                <p className="text-3xl font-light italic leading-snug max-w-lg mx-auto">
                  
Before you go — one final moment.

                </p>
                <p className="text-sm italic opacity-60 max-w-sm mx-auto pt-2">
                  Write one intention you are ready to plant in the world.
A single word. A sentence. Whatever arrives.

                </p>
              </div>

              <div className="relative w-full max-w-md mx-auto">
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="One word... or a whole world."
                  className="w-full bg-transparent border-b border-[#36454F]/20 focus:border-[#36454F] outline-none text-center text-2xl italic py-4 resize-none transition-all placeholder:text-[#36454F]/10 h-24"
                />
              </div>

              <button
                onClick={handlePlant}
                disabled={!intention.trim()}
                className={`px-16 py-5 rounded-full text-[10px] uppercase tracking-[0.6em] font-sans font-bold transition-all duration-1000 border border-[#36454F] ${
                  intention.trim() 
                  ? "bg-transparent text-[#36454F] hover:bg-[#36454F] hover:text-white cursor-pointer" 
                  : "opacity-20 cursor-not-allowed"
                }`}
              >
                Plant It
              </button>
            </div>
          )}

          {/* STAGE 2: PLANTING */}
          {status === "planting" && (
            <div className="space-y-12 flex flex-col items-center">
              <p className="text-4xl italic tracking-wide animate-out fade-out zoom-out-95 duration-[5000ms] fill-mode-forwards text-[#36454F]">
                "{intention}"
              </p>
              <div className="pt-20">
                 <p className="text-[9px] uppercase tracking-[0.8em] font-sans text-[#36454F] animate-pulse">Returning to the earth...</p>
              </div>
            </div>
          )}

          {/* STAGE 3: COMPLETED */}
          {status === "completed" && (
            <div className="space-y-8 animate-in fade-in duration-1000">
              <div className="space-y-2">
                <h3 className="text-3xl font-light italic text-[#36454F]">It is done.</h3>
                <p className="text-xl italic opacity-60">Your intention has been planted.</p>
              </div>
              <div className="pt-12">
                 <p className="text-2xl font-light italic tracking-widest text-[#36454F]">Go in peace.</p>
              </div>
              <div className="pt-16 opacity-40">
                 <div className="w-px h-12 bg-[#36454F] mx-auto animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Corner Text (Optional) */}
      <div className="fixed bottom-10 right-10 hidden md:block">
          <p className="text-[8px] uppercase tracking-[0.5em] font-sans font-bold opacity-20 transform -rotate-90 origin-right">Finality • Peace • Growth</p>
      </div>
    </div>
  );
}

export default Rituals;