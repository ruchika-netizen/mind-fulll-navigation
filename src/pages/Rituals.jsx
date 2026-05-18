import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="w-full max-w-7xl mb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold group transition-all">
          <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
      </div>

      <div className="max-w-7xl w-full relative min-h-[700px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="input-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center bg-white/40 rounded-[2rem] p-8 md:py-20  border border-white/60 shadow-2xl w-full"
            >
              {/* Left Quote */}
              <div className="flex flex-col justify-center text-left">
                <div className="space-y-6">
                  <div className="space-y-4 text-md md:text-2xl font-light italic leading-relaxed opacity-80">
                    <p>When the day feels long and the path feels uncertain, offer a smile to the next person you meet.</p>
                    <p>Not because they deserve it.</p>
                    <p> Not because you have it to spare.</p>
                    <p>But because in that single moment, you will both be a little less alone.</p>
                  </div>
                  <p className="text-[14px] uppercase font-sans font-bold tracking-widest pt-4">This is the way of the Mindful Navigator.</p>
                </div>
                <div className="pt-10">
                  <img src={pikaSmile} alt="Companion" className="w-20 h-auto grayscale opacity-40 rounded-xl" />
                </div>
              </div>

              {/* Right Input Area */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 md:w-44 md:h-44 mb-8 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                  </svg>
                </div>
                <div className="w-full max-w-sm space-y-6">
                  <h3 className="text-[18px] uppercase font-sans font-bold tracking-widest ">The Closing Ritual</h3>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="Whatever arrives..."
                    className="w-full bg-transparent border-b border-[#36454F]/20 text-center text-xl italic py-4 outline-none min-h-[100px] resize-none focus:border-[#36454F]"
                  />
                  <button
                    onClick={handlePlant}
                    disabled={!intention.trim() || loading}
                    className="w-full py-5 rounded-full text-[12px] uppercase font-sans font-bold tracking-widest bg-[#36454F] text-white shadow-xl hover:bg-black transition-all disabled:opacity-20"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Plant It"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center bg-white/40 rounded-[2rem] p-12 md:p-10 border border-white/60 shadow-2xl w-full max-w-5xl min-h-[500px]"
            >
              {/* Completed Circle */}
              <div className="w-48 h-48 md:w-64 md:h-64 mb-12 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="space-y-6 mb-12">
                <h3 className="text-5xl md:text-7xl font-light italic text-[#36454F]">It is planted.</h3>
                <p className="text-xl font-light italic opacity-60">Go in peace.</p>
              </div>

              {/* Seed Card Box */}
              <div className="bg-[#F5F0E8]/80 rounded-[2rem] p-8 border border-white shadow-lg space-y-6 max-w-lg mx-auto">
                <p className="text-[18px] font-serif italic text-[#36454F]/80 leading-relaxed">
                  "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post."
                </p>

                <label className="flex items-center justify-center gap-4 cursor-pointer group w-full">
                  {/* Checkbox Container */}
                  <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={sendSeedCard}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                      className="peer appearance-none w-6 h-6 border-2 border-[#36454F]/20 rounded checked:bg-[#36454F] transition-all cursor-pointer"
                    />
                    {/* Icon centered inside the box */}
                    <Check
                      className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      size={14}
                      strokeWidth={4}
                    />
                  </div>

                  <span className="text-[11px] sm:text-[13px] uppercase tracking-widest font-sans font-bold text-[#36454F]/70 group-hover:text-[#36454F] transition-colors">
                    Please send me a seed card — $6 CAD plus postage
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JourneyEnd;