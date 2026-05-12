import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ArrowLeft, Check, Loader2 } from "lucide-react"; // CreditCard removed if unused
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle");
  const [sendSeedCard, setSendSeedCard] = useState(false);
  const [showFinalOption, setShowFinalOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(new Audio(bellSound));

  const handlePlant = async () => {
    if (!intention.trim()) return;
    setStatus("planting");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("rituals").insert([{
          user_id: user.id,
          intention: intention,
          seed_card_requested: sendSeedCard
        }]);
      }
    } catch (e) {
      console.error("Error:", e.message);
    }

    // FAST MODE: 7000ms ko 2500ms kar diya hai
    setTimeout(() => {
      if (bellRef.current) bellRef.current.play().catch(() => { });
      setStatus("completed");
      setLoading(false);
      // Final option turant dikhane ke liye delay kam kiya
      setTimeout(() => setShowFinalOption(true), 400);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col items-center py-10 px-4 md:px-8 overflow-x-hidden selection:bg-[#36454F]/10">

      {/* BACK BUTTON */}
      <div className="w-full max-w-7xl mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
          <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
      </div>

      {/* MAIN CARD CONTAINER - Transition speed 1500ms -> 600ms */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch bg-white/40 rounded-[2rem] p-8 md:p-14 border border-white/60 shadow-2xl relative transition-all duration-[600ms]">

        {/* LEFT SIDE - Blur/Fade speed optimized */}
        <div className={`flex flex-col justify-center transition-all duration-[800ms] ${status === 'completed' ? 'opacity-0 blur-md pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-10">
            <div className="space-y-5 text-md md:text-2xl font-light italic leading-relaxed opacity-80">
              <p>When the day feels long and the path feels uncertain, offer a smile to the next person you meet.</p>
              <p>Not because they deserve it.</p>
              <p>Not because you have it to spare.</p>
              <p>But because in that single moment, you will both be a little less alone.</p>
            </div>
            <p className="text-[16px] uppercase font-sans font-bold">This is the way of the Mindful Navigator.</p>
          </div>

          <div className="pt-16">
            <img src={pikaSmile} alt="Companion" className="w-24 h-auto grayscale opacity-40 rounded-xl" />
          </div>
        </div>

        {/* RIGHT SIDE - Animation 1500ms -> 600ms */}
        <div className={`flex flex-col items-center justify-center text-center transition-all duration-[600ms] ${status === 'completed' ? 'md:translate-x-[-50%] w-full' : ''}`}>
          <div className={`w-full relative min-h-[500px] flex flex-col items-center transition-all duration-500 ${status === 'completed' ? 'justify-center' : 'justify-start pt-6'}`}>

            {/* ENSO CIRCLE - Drawing speed 5000ms -> 2000ms */}
            <div className={`relative flex items-center justify-center transition-all duration-[1000ms] ${status === 'completed' ? 'w-48 h-48 md:w-64 md:h-64 mb-12 scale-110' : 'w-40 h-40 md:w-56 md:h-56 mb-10'}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                <circle
                  cx="50" cy="50" r="48"
                  fill="none" stroke="#36454F" strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={status === "idle" ? "301.6" : "0"}
                  className={`transition-all duration-[2000ms] ease-out ${status === "idle" ? "opacity-10" : "opacity-100"}`}
                />
              </svg>
            </div>

            {/* CONTENT AREA */}
            <div className="w-full flex flex-col items-center">
              {status === "idle" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-sm">
                  <div className="space-y-4">
                    <h3 className="text-[16px] uppercase font-sans font-bold">The Closing Ritual</h3>
                    <p className="text-xl font-light italic">Write one intention you are ready to plant in the world.</p>
                  </div>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="Whatever arrives..."
                    className="w-full bg-transparent border-b border-[#36454F] text-center text-xl italic py-4 outline-none h-20 resize-none"
                  />
                  <button
                    onClick={handlePlant}
                    disabled={!intention.trim() || loading}
                    className={`w-full py-5 rounded-full text-[12px] uppercase font-sans font-bold transition-all ${intention.trim() ? "bg-[#36454F] text-white shadow-xl active:scale-95" : "opacity-10 cursor-not-allowed"}`}
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Plant It"}
                  </button>
                </div>
              )}

              {status === "planting" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <p className="text-3xl italic font-light opacity-60">"{intention}"</p>
                  <p className="text-[13px] uppercase tracking-[0.2em] animate-pulse font-sans">Returning to the earth</p>
                </div>
              )}

              {status === "completed" && (
                <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                  <div className="space-y-6">
                    <h3 className="text-5xl md:text-6xl font-light italic text-[#36454F]">It is planted.</h3>
                    <p className="text-xl font-light italic">Go in peace.</p>
                  </div>

                  {showFinalOption && (
                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 bg-[#F5F0E8]/70 rounded-[1rem] p-5 border border-white/50 shadow-xl space-y-5 max-w-lg">
                      <p className="text-[15px] font-serif italic text-[#36454F]/80 leading-relaxed">
                        "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post."
                      </p>

                      <div className="space-y-4">
                        <label className="flex items-center justify-center gap-3 cursor-pointer group py-2">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={sendSeedCard}
                              onChange={(e) => setSendSeedCard(e.target.checked)}
                              className="peer appearance-none w-6 h-6 border-2 border-[#36454F]/20 rounded-md checked:bg-[#36454F] checked:border-[#36454F] transition-all"
                            />
                            <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} strokeWidth={4} />
                          </div>
                          <span className="text-[13px] uppercase tracking-widest font-sans font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                            Please send me a seed card — $6 CAD plus postage
                          </span>
                        </label>
                      </div>
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