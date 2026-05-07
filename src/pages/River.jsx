import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Trash2 } from "lucide-react";

import redpanda from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import pika from "../assets/pfQpy9wSq4zFDCKwAg8gwf.jpg";

const PIKA_SUTRAS = [
  "You are already where you need to be.", "Be still and know.", "This moment, exactly as it is, is enough.", "You are a mountain. The clouds pass, but you remain.", "In the silence, the truth speaks.", "The stone does not try to be anything but a stone.", "Ground yourself in the earth beneath your feet.", "Stability is the foundation of freedom.", "Watch the thoughts like birds in the sky; let them fly past.", "Deep roots do not fear the wind.", "Listen to the sound of your own heart.", "Patience is the shortest path.", "The mountain does not seek the sun; it simply receives it.", "Simplicity is the ultimate sophistication.", "Rest in the sanctuary of the breath.", "You are not the weather; you are the sky.", "To understand everything is to forgive everything.", "Find the temple within the stone.", "Stillness is not the absence of sound, but the presence of self.", "Wisdom is found in the pause.", "The centre of the circle is always still.", "Observe without judgment.", "The earth supports you; let it.", "Silence is a fence around wisdom.", "Your presence is the greatest gift."
];

const RED_PANDA_SUTRAS = [
  "Let your breath lead the way, your smile follow, and your pace honour both.", "Peace is every step.", "The path is the goal.", "Flow with the river, do not fight the current.", "Every moment is a fresh start.", "Tend to your orchard, and the fruit will follow.", "Mindfulness is the energy of being alive.", "Be present in the doing.", "A step taken in peace reaches the heart.", "Lighten your load; carry only what serves the journey.", "Every step on solid ground is its own quiet miracle.", "Hold your cup as you would hold a moment — warmly, and without rushing.", "The only door that opens is the one you are standing at now.", "Each inhale is a gathering. Each exhale, a release.", "The secret of health is to live fully in the now.", "Each step is a realisation.", "Let go of the shore.", "The water is always moving, yet the river remains.", "Action from stillness is the most powerful action.", "Follow the rhythm of your own breath.", "Blossom where you are planted.", "The leaf falls when it is ready; do not rush the season.", "Movement is the song of the soul.", "Be the traveller, not just the map.", "Everything is exactly as it should be."
];

function River() {
  const navigate = useNavigate();
  const location = useLocation();
  const entryId = new URLSearchParams(location.search).get("id");

  const [morning, setMorning] = useState({ intentions: "", presence: "", firstSteps: "" });
  const [evening, setEvening] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);

  // STATIC STATE (No Slider)
  const [currentSutra, setCurrentSutra] = useState("");
  const [companion, setCompanion] = useState(pika);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all entries for sequential logic
        const { data: allEntries } = await supabase
          .from("journal_entries")
          .select("id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        // Calculate Position
        let position = entryId ? allEntries.findIndex(e => e.id === entryId) : (allEntries ? allEntries.length : 0);
        if (position === -1) position = allEntries.length;

        // Static Selection (Continuous Alternative)
        const isRedPanda = (position + 1) % 2 === 0;
        const sutraIdx = Math.floor(position / 2) % 25;

        if (isRedPanda) {
          setCurrentSutra(RED_PANDA_SUTRAS[sutraIdx]);
          setCompanion(redpanda);
        } else {
          setCurrentSutra(PIKA_SUTRAS[sutraIdx]);
          setCompanion(pika);
        }

        if (entryId) {
          const { data: entryData } = await supabase.from("journal_entries").select("*").eq("id", entryId).single();
          if (entryData) {
            setMorning({ intentions: entryData.intentions || "", presence: entryData.presence || "", firstSteps: entryData.first_steps || "" });
            setEvening(entryData.evening_reflection || "");
          }
        }
      } catch (err) { console.error(err); }
      finally { setInitialFetchLoading(false); }
    };
    initializeFlow();
  }, [entryId]);

  const saveJourney = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = { user_id: user.id, intentions: morning.intentions, presence: morning.presence, first_steps: morning.firstSteps, evening_reflection: evening };
      if (entryId) await supabase.from("journal_entries").update(payload).eq("id", entryId);
      else await supabase.from("journal_entries").insert([payload]);
      navigate("/river-list");
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (initialFetchLoading) return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center italic opacity-40">Gathering flow...</div>;

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] animate-in fade-in duration-1000 pb-20">
      <header className="max-w-7xl mx-auto pt-10 pb-7 px-6 flex justify-between items-center">
        <button onClick={() => navigate("/river-list")} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
          <span className="text-lg">‹</span> Back
        </button>
        <h1 className="text-2xl md:text-4xl italic font-bold">The River</h1>
        <div className="min-w-[100px] flex justify-end">
          {entryId && <button onClick={() => setShowConfirm(true)} className="p-2 text-[#36454F]/20 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">

          {/* Morning Section (Static Layout) */}
          <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col relative">
            <h2 className="text-2xl font-light italic text-center pb-10">The Morning Current</h2>

            <div className="space-y-10 flex-grow z-10">
              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">
                  Intentions — What matters most in this moment?
                </label>
                <textarea
                  value={morning.intentions}
                  onChange={(e) => setMorning({ ...morning, intentions: e.target.value })}
                  placeholder="Permission to..."
                  className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">
                  Presence — A single word for your attention.
                </label>
                <input
                  value={morning.presence}
                  onChange={(e) => setMorning({ ...morning, presence: e.target.value })}
                  placeholder="One word..."
                  className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">
                  First Steps — Actions to move you forward.
                </label>
                <textarea
                  value={morning.firstSteps}
                  onChange={(e) => setMorning({ ...morning, firstSteps: e.target.value })}
                  placeholder="Small steps..."
                  className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white leading-relaxed resize-none"
                />
              </div>
            </div>
            <img src={companion} className="absolute bottom-8 right-6 w-20 opacity-[0.12] grayscale rounded-xl z-0 pointer-events-none" alt="companion" />
          </div>

          {/* Evening Section (Static Layout) */}
          <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col">
            <h2 className="text-2xl font-light italic text-center pb-10">The Evening Reflection</h2>
            <div className="flex-grow flex flex-col">
              <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">
                Gratitude & Observations & Closing
              </label>
              <textarea
                value={evening}
                onChange={(e) => setEvening(e.target.value)}
                placeholder="How was the flow today?..."
                className="flex-grow w-full min-h-[400px] bg-[#F5F0E8]/30 border border-[#36454F]/5 rounded-xl p-4 outline-none italic leading-loose focus:border-[#EAB308] focus:bg-white resize-none"
              />
            </div>

            <div className="mt-10">
              <button
                onClick={saveJourney}
                disabled={loading}
                className="w-full bg-[#36454F] text-white py-5 mb-8 rounded-xl font-sans flex items-center justify-center gap-3 tracking-[0.4em] uppercase text-[10px] font-bold shadow-lg hover:bg-black transition-all active:scale-95"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (entryId ? "Update Journey" : "Record Journey")}
              </button>

              {/* STATIC SUTRA (No animation/slider) */}
              <div className="min-h-[50px] opacity-40">
                <p className="text-[17px] italic leading-relaxed">"{currentSutra}"</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
            <p className="italic mb-8 opacity-70">Delete this ripple?</p>
            <div className="flex gap-4">
              <button onClick={async () => { await supabase.from("journal_entries").delete().eq("id", entryId); navigate("/river-list"); }} className="flex-1 bg-red-500 text-white py-3 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold">Delete</button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-[#F5F0E8] py-3 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default River;