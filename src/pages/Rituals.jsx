import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Check, Loader2 } from "lucide-react";
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle"); // Sirf 'idle' aur 'completed' use hoga
  const [sendSeedCard, setSendSeedCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(new Audio(bellSound));

  const handlePlant = async () => {
    if (!intention.trim()) return;
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

      // Seedha Success State pe bhej rahe hain
      if (bellRef.current) bellRef.current.play().catch(() => { });
      setStatus("completed");
    } catch (e) {
      console.error("Error:", e.message);
    } finally {
      setLoading(false);
    }
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

      {/* MAIN CARD CONTAINER */}
      <div className="max-w-7xl w-full flex flex-col md:grid md:grid-cols-2 gap-12 items-center bg-white/40 rounded-[2rem] p-8 md:p-14 border border-white/60 shadow-2xl relative min-h-[600px]">

        {/* LEFT SIDE - Hide on completion */}
        {status !== 'completed' && (
          <div className="flex flex-col justify-center animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="space-y-4 text-md md:text-xl font-light italic leading-relaxed opacity-80 max-w-prose">
                <p>When the day feels long and the path feels uncertain, offer a smile to the next person you meet.</p>
                <p>Not because they deserve it.</p><p> Not because you have it to spare.</p>
                <p>But because in that single moment, you will both be a little less alone.</p>
              </div>
              <p className="text-[14px] uppercase font-sans font-bold tracking-widest pt-4">This is the way of the Mindful Navigator.</p>
            </div>
            <div className="pt-10">
              <img src={pikaSmile} alt="Companion" className="w-20 h-auto grayscale opacity-40 rounded-xl" />
            </div>
          </div>
        )}

        {/* RIGHT SIDE - Full width on completion */}
        <div className={`flex flex-col items-center justify-center text-center w-full ${status === 'completed' ? 'md:col-span-2' : ''}`}>

          <div className="w-full flex flex-col items-center py-4">

            {/* ENSO CIRCLE - No more animation delay */}
            <div className={`relative flex items-center justify-center transition-all duration-500 ${status === 'completed' ? 'w-44 h-44 md:w-56 md:h-56 mb-8' : 'w-32 h-32 md:w-44 md:h-44 mb-8'}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                <circle
                  cx="50" cy="50" r="48"
                  fill="none" stroke="#36454F" strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={status === "idle" ? "301.6" : "0"}
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            {/* INTERACTIVE CONTENT AREA */}
            <div className="w-full max-w-lg mx-auto">
              {status === "idle" ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-3">
                    <h3 className="text-[14px] uppercase font-sans font-bold tracking-widest">The Closing Ritual</h3>
                    <p className="text-lg font-light italic">Write one intention you are ready to plant in the world.</p>
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
                    className="w-full py-5 rounded-full text-[12px] uppercase font-sans font-bold tracking-widest bg-[#36454F] text-white shadow-xl active:scale-95 disabled:opacity-20"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Plant It"}
                  </button>
                </div>
              ) : (
                /* DIRECT SUCCESS STATE (image_a190c1.png style) */
                <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="space-y-4">
                    <h3 className="text-5xl md:text-6xl font-light italic text-[#36454F]">It is planted.</h3>
                    <p className="text-xl font-light italic opacity-60">Go in peace.</p>
                  </div>

                  <div className="bg-[#F5F0E8]/70 rounded-[1.5rem] p-8 border border-white/50 shadow-xl space-y-6 max-w-lg">
                    <p className="text-[20px] font-serif italic text-[#36454F]/80 leading-relaxed">
                      "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post."
                    </p>
                    <label className="flex items-start text-left gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center pt-1">
                        <input
                          type="checkbox"
                          checked={sendSeedCard}
                          onChange={(e) => setSendSeedCard(e.target.checked)}
                          className="peer appearance-none w-5 h-5 border-2 border-[#36454F]/20 rounded checked:bg-[#36454F] transition-all"
                        />
                        <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} strokeWidth={4} />
                      </div>
                      <span className="text-[14px] uppercase tracking-widest font-sans font-bold  leading-tight">
                        Please send me a seed card — $6 CAD plus postage
                      </span>
                    </label>
                  </div>
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