import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ArrowLeft } from "lucide-react";
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("rituals").insert([{ user_id: user.id, intention: intention }]);
      }
    } catch (e) {
      console.error("Error:", e.message);
    }

    setTimeout(() => {
      bellRef.current.play();
      setStatus("completed");
      setTimeout(() => performActualLogout(), 6000);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-[#36454F]/10">

      {/* THE BOOK SPREAD CONTAINER */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch bg-white/30 rounded-[3rem] p-8 md:p-16 border border-white/50 shadow-2xl relative">

        {/* LEFT SIDE: FINAL WORD (Philosophy) */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#36454F]/10 pb-12 md:pb-0 md:pr-12">
          <div className="space-y-8">
            {/* <h2 className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold opacity-40">Inside Back Cover</h2> */}

            <div className="space-y-5 text-xl md:text-xl font-light italic leading-relaxed">
              <p>When the day feels long and the path feels uncertain,</p>
              <p>offer a smile to the next person you meet.</p>
              <p>Not because they deserve it.</p>
              <p>Not because you have it to spare.</p>
              <p>But because in that single moment,</p>
              <p> you will both be a little less alone.</p>


            </div>

            <p className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold pt-4 opacity-70">
              This is the way of the Mindful Navigator.
            </p>
          </div>

          <div className="pt-12 flex flex-col items-start gap-6">
            <img src={pikaSmile} alt="Characters facing reader" className="w-32 h-auto grayscale-[0.3] rounded-xl opacity-80" />
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-[9px] text-[#fff] uppercase tracking-[0.4em] px-4  py-4 bg-[#36454F] rounded-full font-sans font-bold hover:opacity-50 transition-opacity"
            >
              <ArrowLeft size={12} /> Back to Home
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: RITUALS (Interactive) */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 pl-0 md:pl-4">

          {/* ENSŌ CIRCLE */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="0.2" opacity="0.1" />
              <circle
                cx="50" cy="50" r="48"
                fill="none" stroke="#36454F" strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="301.6"
                strokeDashoffset={status === "planting" || status === "completed" ? "0" : "301.6"}
                className={`transition-all duration-[5000ms] ease-in-out ${status === "idle" ? "opacity-10" : "opacity-100"}`}
              />
            </svg>
            {status === "idle" && (
              <div className="absolute w-2 h-2 bg-[#36454F] rounded-full animate-ping opacity-20"></div>
            )}
          </div>

          <div className="w-full min-h-[250px] flex flex-col items-center justify-center">
            {status === "idle" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold">The Closing Ritual</h3>
                  <p className="text-xl italic opacity-70">Before you go — one final moment.</p>

                  <p className="text-md italic opacity-70">Write one intention you are ready to plant in the world <br></br>A single word. A sentence. Whatever arrives.</p>

                  <p className="text-md italic opacity-70"> </p>
                </div>

                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="One word... or a whole world."
                  className="w-full bg-transparent border-b border-[#36454F]/20 focus:border-[#36454F] outline-none text-center text-xl italic py-4 resize-none transition-all placeholder:text-[#36454F]/10 h-20"
                />

                <button
                  onClick={handlePlant}
                  disabled={!intention.trim()}
                  className={`px-12 py-4 rounded-full text-[9px] uppercase tracking-[0.4em] font-sans font-bold transition-all duration-700 border border-[#36454F] ${intention.trim()
                    ? "bg-[#36454F] text-white hover:bg-transparent hover:text-[#36454F]"
                    : "opacity-20 cursor-not-allowed"
                    }`}
                >
                  Plant It
                </button>
              </div>
            )}

            {status === "planting" && (
              <div className="space-y-8 animate-in fade-in duration-1000">
                <p className="text-3xl italic animate-pulse opacity-50">"{intention}"</p>
                <p className="text-[12px] uppercase tracking-[0.5em] font-sans opacity-40">Returning to the earth...</p>
              </div>
            )}

            {status === "completed" && (
              <div className="space-y-6 animate-in fade-in duration-1000">
                <h3 className="text-2xl font-light italic">It is planted. </h3>
                <p className="text-sm italic opacity-60 tracking-widest">Go in peace.</p>
                <div className="w-px h-10 bg-[#36454F]/20 mx-auto animate-bounce pt-8"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background info tag */}
      {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 opacity-20">
        <p className="text-[8px] uppercase tracking-[0.6em] font-sans font-bold">Designed in BC, Canada • Mindful Navigator</p>
      </div> */}
    </div>
  );
};

export default JourneyEnd;