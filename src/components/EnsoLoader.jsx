import React, { useState, useEffect } from "react";
import bowlSound from "../assets/first_3_seconds.mp3";

const EnsoLoader = ({ onComplete }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 1. Sound Logic: Circle animation 3s ki hai
    const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
    
    // Animation khatam hone ke theek pehle ya saath sound bajna chahiye
    const audioTimer = setTimeout(() => {
      if (soundEnabled) {
        const audio = new Audio(bowlSound);
        audio.volume = 0.6; // Presence ke liye thoda loud rakha hai
        audio.play().catch(e => console.log("Bowl sound blocked by browser", e));
      }
    }, 2800); // 3s animation hai, 2.8s par strike hona perfect lagta hai

    // 2. Button dikhane ka timer
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3500);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleEnter = () => {
    // Ab yahan sound bajane ki zaroorat nahi, wo circle complete hone par baj chuka hai
    // Seedha transition karein
    onComplete();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F5F0E8] z-[100] px-6">
      <div className="relative flex flex-col items-center w-full max-w-sm">
        
        {/* LOGO */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#36454F"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="264"
              strokeDashoffset="264"
              className="animate-draw-circle"
              strokeLinecap="round"
              style={{ opacity: 0.8 }}
            />
            
            <circle
              cx="92"
              cy="50"
              r="2"
              fill="#EAB308"
              className="opacity-0 animate-fade-dot"
              style={{ animationDelay: '2.8s' }}
            />
          </svg>
        </div>

        {/* TITLE & SUBTITLE */}
        <div className="mt-12 text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-serif text-[#36454F] tracking-[0.15em] opacity-0 animate-fade-up">
            The Mindful Navigator
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#36454F]/50 uppercase opacity-0 animate-fade-up-delayed">
            Arrive. Breathe. Begin.
          </p>
        </div>

        {/* ENTER BUTTON */}
        <div className={`mt-14 transition-all duration-1000 transform ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <button 
            onClick={handleEnter}
            className="px-10 py-3 bg-[#36454F] text-[#F5F0E8] text-[10px] uppercase tracking-[0.5em] rounded-full transition-all hover:bg-black active:scale-95 shadow-lg font-medium"
          >
            Enter ›
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-draw-circle {
          animation: drawCircle 3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .animate-fade-up {
          animation: fadeUp 1.5s ease-out 1s forwards;
        }
        .animate-fade-up-delayed {
          animation: fadeUp 1.5s ease-out 1.8s forwards;
        }
        .animate-fade-dot {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnsoLoader;