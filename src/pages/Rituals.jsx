import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ArrowLeft, Check } from "lucide-react";
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle"); // idle | planting | completed
  const [sendSeedCard, setSendSeedCard] = useState(false);
  const [showFinalOption, setShowFinalOption] = useState(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("rituals").insert([{
          user_id: user.id,
          intention: intention,
          seed_card_requested: sendSeedCard
        }]);
      }
    } catch (e) { console.error("Error:", e.message); }

    // Step 5: Animation for Enso and Text Dissolve (7 seconds total)
    setTimeout(() => {
      bellRef.current.play();
      setStatus("completed");

      // Step 6: "It is planted" aane ke baad checkbox dikhao
      setTimeout(() => {
        setShowFinalOption(true);
        // Step 7: 10 seconds peaceful display then logout
        setTimeout(() => performActualLogout(), 10000);
      }, 2500);
    }, 7000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex items-center justify-center p-4 md:p-12 overflow-hidden selection:bg-[#36454F]/10">

      {/* ORIGINAL CONTAINER - Max width aur styling wapas wahi hai */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch bg-white/40 rounded-[3.5rem] p-8 md:p-16 border border-white/60 shadow-2xl relative transition-all duration-[1500ms]">

        {/* LEFT SIDE - Original text aur image wapas aa gayi */}
        <div className={`flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#36454F]/5 pb-12 md:pb-0 md:pr-16 transition-all duration-[2000ms] ${status === 'completed' ? 'opacity-0 blur-sm pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-10">
            <div className="space-y-6 text-md md:text-2xl font-light italic leading-relaxed opacity-80">
              <p>When the day feels long and the path feels uncertain,</p>
              <p>offer a smile to the next person you meet.</p>
              <p>Not because they deserve it.</p>
              <p>Not because you have it to spare.</p>
              <p></p>
              <p>But because in that single moment, you will both be a little less alone.</p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold opacity-30">This is the way of the Mindful Navigator.</p>
          </div>

          <div className="pt-16 flex flex-col items-start gap-8">
            <img src={pikaSmile} alt="Companion" className="w-24 h-auto grayscale opacity-40 rounded-xl" />
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-sans font-bold opacity-40 hover:opacity-100 transition-all"
            >
              <ArrowLeft size={12} /> Back to Home
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Ye 'completed' hone par center mein shift feel hoga */}
        <div className={`flex flex-col items-center justify-center text-center transition-all duration-[1500ms] ${status === 'completed' ? 'md:translate-x-[-50%] w-full' : ''}`}>

          <div className={`w-full relative min-h-[600px] flex flex-col items-center transition-all duration-1000 ${status === 'completed' ? 'justify-center' : 'justify-start pt-6'}`}>

            {/* ENSO CIRCLE */}
            <div className={`relative flex items-center justify-center transition-all duration-[2000ms] ease-in-out ${status === 'completed' ? 'w-48 h-48 md:w-64 md:h-64 mb-12 scale-110' : 'w-40 h-40 md:w-56 md:h-56 mb-10'}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="0.15" opacity="0.1" />
                <circle
                  cx="50" cy="50" r="48"
                  fill="none" stroke="#36454F" strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={status === "idle" ? "301.6" : "0"}
                  className={`transition-all duration-[5000ms] ease-in-out ${status === "idle" ? "opacity-10" : "opacity-100"}`}
                />
              </svg>
            </div>

            {/* CONTENT FLOW */}
            <div className="w-full flex flex-col items-center">

              {/* STAGE 1: IDLE */}
              {status === "idle" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-sm">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.6em] font-sans font-bold opacity-30">The Closing Ritual</h3>
                    <p className="text-xl font-light italic">Write one intention you are ready to plant in the world.</p>
                  </div>

                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="Whatever arrives..."
                    className="w-full bg-transparent border-b border-[#36454F]/10 text-center text-xl italic py-4 outline-none transition-all placeholder:opacity-10 h-20 resize-none"
                  />

                  <button
                    onClick={handlePlant}
                    disabled={!intention.trim()}
                    className={`w-full py-5 rounded-full text-[10px] uppercase tracking-[0.5em] font-sans font-bold transition-all duration-1000 ${intention.trim() ? "bg-[#36454F] text-white shadow-xl" : "opacity-10 cursor-not-allowed"}`}
                  >
                    Plant It
                  </button>
                </div>
              )}

              {/* STAGE 2: PLANTING */}
              {status === "planting" && (
                <div className="space-y-8 animate-out fade-out duration-[5000ms] fill-mode-forwards">
                  <p className="text-3xl italic font-light opacity-60 tracking-wide">"{intention}"</p>
                  <p className="text-[11px] uppercase tracking-[0.8em] font-sans opacity-20 animate-pulse">Returning to the earth</p>
                </div>
              )}

              {/* STAGE 3: COMPLETED */}
              {status === "completed" && (
                <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in-95 duration-[2500ms]">
                  <div className="space-y-6">
                    <h3 className="text-5xl md:text-6xl font-light italic text-[#36454F]">It is planted.</h3>
                    <p className="text-xl font-light italic ">Go in peace.</p>
                  </div>

                  {showFinalOption && (
                    <div className="animate-in slide-in-from-bottom-12 fade-in duration-[1500ms] bg-[#F5F0E8]/70 rounded-[2.5rem] p-10 border border-white/50 shadow-xl space-y-8 max-w-lg">
                      <p className="text-[16px] font-serif italic text-[#36454F]/80 leading-relaxed">
                        "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post. <br />Plant it. Let it grow."
                      </p>

                      <label className="flex items-center justify-center gap-5 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="peer appearance-none w-7 h-7 border-2 border-[#36454F]/20 rounded-md checked:bg-[#36454F] checked:border-[#36454F] transition-all"
                            checked={sendSeedCard}
                            onChange={() => setSendSeedCard(!sendSeedCard)}
                          />
                          <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={18} strokeWidth={4} />
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                          Please send me a seed card — $6 CAD plus postage
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyEnd;