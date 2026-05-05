import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Sparkles } from "lucide-react";

function StillWater() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = location.state?.selectedPrompt || "Choose a prompt from the Well.";
  const title = location.state?.title || "Deep Reflection";

  const handleSave = async () => {
    if (!reflection.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("still_water_entries").insert([
      {
        user_id: user.id,
        prompt: `${title}: ${prompt}`,
        reflection: reflection
      }
    ]);

    if (!error) navigate("/well");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 flex flex-col items-center">

      {/* Navigation */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center">
        {/* Back Button Container */}
        <div className="absolute top-6 md:top-12 left-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The Still Water
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-3xl w-full px-6 pb-20">
        <div className="bg-white rounded-[40px] p-10 md:p-10 shadow-sm border border-white/50 flex flex-col gap-6">

          {/* THE PROMPT AREA - Matches Client's Deep Question Look */}
          <div className="space-y-4 text-center">
            <h2 className="text-[13px] uppercase tracking-[0.5em] font-sans font-bold opacity-30 italic">
              {title}
            </h2>
            <p className="text-[18px] md:text-[18px] italic leading-relaxed text-[#36454F] px-4 font-medium">
              "{prompt}"
            </p>
            <div className="w-12 h-[1px] bg-[#36454F]/10 mx-auto mt-8" />
          </div>

          {/* WRITING AREA - Same as Compass/River */}
          <div className="group">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write as freely as you need to..."
              className="w-full h-[350px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-[2rem] p-4 outline-none italic text-[17px] text-[#36454F] leading-relaxed focus:border-[#EAB308] focus:bg-white transition-all duration-500 resize-none shadow-inner river-scroll"
            />
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading || !reflection.trim()}
            className="w-full bg-[#36454F] text-[#F5F0E8] py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-black transition-all tracking-[0.4em] uppercase text-[10px] font-bold font-sans shadow-lg active:scale-95 disabled:opacity-20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <> Release to the Flow </>}
          </button>

          {/* FOOTER - Client Requirement: Still Water Vibe */}
          {/* <p className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold opacity-20 text-center italic">
            Look into the reflection. It will know when.
          </p> */}
        </div>
      </main>
    </div>
  );
}

export default StillWater;