import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Smooth transitions ke liye
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle");
  const [sendSeedCard, setSendSeedCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const bellRef = useRef(new Audio(bellSound));

  const handlePlant = async () => {
    if (!intention.trim()) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const { data, error } = await supabase
        .from("rituals")
        .insert([{
          user_id: user?.id,
          intention: intention,
          seed_card_requested: sendSeedCard
        }])
        .select();

      if (error) throw error;
      if (data) setRecordId(data[0].id);

      if (bellRef.current) {
        bellRef.current.volume = 0.4;
        bellRef.current.play().catch(() => { });
      }

      // Yahan se transition trigger hoga
      setStatus("completed");

    } catch (e) {
      alert("Database error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (checked) => {
    setSendSeedCard(checked);
    if (!recordId) return;
    try {
      await supabase.from("rituals").update({ seed_card_requested: checked }).eq('id', recordId);
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col items-center py-10 px-4 md:px-8 overflow-hidden">

      {/* BACK BUTTON */}
      <div className="w-full max-w-7xl mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold group  hover:opacity-100 transition-all">
          <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
      </div>

      <div className="max-w-7xl w-full relative min-h-[700px]">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            /* ================== STATE 1: INITIAL SPLIT VIEW ================== */
            <motion.div
              key="input-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }} // Left ki taraf fade-out
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-12 items-center bg-white/40 rounded-[2rem] p-8 md:p-14 border border-white/60 shadow-2xl min-h-[700px]"
            >
              {/* Left Quote */}
              <div className="flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="space-y-4 text-md md:text-2xl font-light italic leading-relaxed opacity-80 max-w-prose">
                    <p>When the day feels long and the path feels uncertain, offer a smile to the next person you meet.</p>
                    <p>Not because they deserve it. </p>
                    <p>Not because you have it to spare.</p>
                    <p>But because in that single moment, you will both be a little less alone.</p>
                  </div>
                  <p className="text-[14px] uppercase font-sans font-bold tracking-widest pt-4">This is the way of the Mindful Navigator.</p>
                </div>
                <div className="pt-10">
                  <img src={pikaSmile} alt="Companion" className="w-20 h-auto grayscale opacity-40 rounded-xl" />
                </div>
              </div>

              {/* Right Input Area */}
              <div className="flex flex-col items-center justify-center text-center w-full">
                <div className="w-full flex flex-col items-center py-4">
                  <div className="w-32 h-32 md:w-44 md:h-44 mb-8 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1.5" strokeDasharray="301.6" strokeDashoffset="301.6" />
                    </svg>
                  </div>
                  <div className="w-full max-w-lg space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-[14px] uppercase font-sans font-bold tracking-widest">The Closing Ritual</h3>
                      <p className="text-xl font-light italic">Write one intention you are ready<br /> to plant in the world.</p>
                    </div>
                    <textarea
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder="Whatever arrives..."
                      className="w-full bg-transparent border-b border-[#36454F]/20 text-center text-xl italic py-4 outline-none min-h-[100px] resize-none focus:border-[#36454F]"
                    />
                    <button
                      onClick={handlePlant}
                      disabled={!intention.trim() || loading}
                      className="w-full py-5 rounded-full text-[12px] uppercase font-sans font-bold tracking-widest bg-[#36454F] text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Plant It"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================== STATE 2: SUCCESS VIEW (Slides in from Right) ================== */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, x: 100 }} // Right side se enter karega
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Elegant springy slide
              className="w-full flex flex-col items-center justify-center bg-white/40 rounded-[2rem] p-8 md:p-14 border border-white/60 shadow-2xl min-h-[700px]"
            >
              {/* Completed Circle */}
              <div className="w-48 h-48 md:w-64 md:h-64 mb-12 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                  <motion.circle
                    cx="50" cy="50" r="48"
                    fill="none" stroke="#36454F" strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              <div className="max-w-lg text-center space-y-12">
                <div className="space-y-4">
                  <h3 className="text-5xl md:text-7xl font-light italic text-[#36454F]">It is planted.</h3>
                  <p className="text-xl font-light italic opacity-60">Go in peace.</p>
                </div>

                <div className="bg-[#F5F0E8]/80 rounded-[2rem] p-8 border border-white shadow-lg space-y-6">
                  <p className="text-[20px] font-serif italic text-[#36454F]/80 leading-relaxed">
                    "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post."
                  </p>
                  <label className="flex items-start text-left gap-4 cursor-pointer group justify-center">
                    <div className="relative flex items-center justify-center pt-1">
                      <input
                        type="checkbox"
                        checked={sendSeedCard}
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                        className="peer appearance-none w-6 h-6 border-2 border-[#36454F]/20 rounded checked:bg-[#36454F] transition-all"
                      />
                      <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} strokeWidth={4} />
                    </div>
                    <span className="text-[14px] uppercase tracking-widest font-sans font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                      Please send me a seed card — $6 CAD plus postage
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JourneyEnd;