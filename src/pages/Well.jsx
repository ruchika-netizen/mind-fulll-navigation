import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Edit2, X, Loader2, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import fixedImg from "../assets/pikastone.png";

// Prompts array same rahega...
const prompts = [
  { id: 1, title: "The Shadow Self", text: "Which part of your personality do you work hardest to hide from others? What happens if you bring it into the light?" },
  { id: 2, title: "The Architecture of Joy", text: "Strip away your titles, your possessions, and your roles. What remains that cannot be taken?" },
  { id: 3, title: "The Threshold of Fear", text: "What is the specific price of admission you are currently refusing to pay for the life you actually want?" },
  { id: 4, title: "The Final Integration", text: "How would you treat yourself today if you truly believed you were already enough, exactly as you are?" },
  { id: 5, title: "The Silent Architect", text: "If you were to stop trying to be good, what would you finally have the freedom to become?" },
  { id: 6, title: "The Legacy of Ash", text: "What part of your past do you need to stop trying to fix and finally allow to burn away?" },
  { id: 7, title: "The Body Knows", text: "What is your body trying to tell you that your mind has been too busy to hear? Where in your physical self does your unfinished business live?" },
  { id: 8, title: "The Life You Are Walking Toward", text: "Stand ten years from now. What does that person want you to know about the choices available to you today?" },
];

function Well() {
  const navigate = useNavigate();
  const textAreaRef = useRef(null);

  const [activePrompt, setActivePrompt] = useState(null);
  const [reflection, setReflection] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // PAGE LOADING STATE
  const [imageLoaded, setImageLoaded] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleEditClick = async (prompt) => {
    setActivePrompt(prompt);
    setIsPopupOpen(true);
    setReflection("");
    setFetching(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("still_water_entries")
        .select("reflection")
        .eq("user_id", user?.id)
        .eq("prompt", prompt.text)
        .maybeSingle();
      if (data) setReflection(data.reflection);
    } catch (err) { console.log("Fresh entry"); } finally { setFetching(false); }
  };

  const saveEntry = async () => {
    if (!reflection.trim()) { showToast("Please share a reflection.", "error"); return; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("still_water_entries").delete().eq("user_id", user?.id).eq("prompt", activePrompt.text);
      const { error } = await supabase.from("still_water_entries").insert({
        user_id: user?.id, prompt: activePrompt.text, reflection: reflection, created_at: new Date().toISOString(),
      });
      if (!error) setTimeout(() => setIsPopupOpen(false), 500);
    } catch (err) { showToast("Error saving.", "error"); } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] flex flex-col">

      {/* Toast Notification */}
      <div className={`fixed top-10 right-10 z-[600] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>
        <p className="text-[11px] uppercase tracking-widest font-sans font-bold">{toast.message}</p>
      </div>

      {/* HEADER - HAMESHA VISIBLE RAHEGA */}
      <header className="w-full max-w-7xl mx-auto pt-10 pb-5 shrink-0 relative text-center z-10">
        <div className="absolute top-12 left-6 md:left-12">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold transition-all group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span> Back
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold italic">The Well</h1>
        <div className="max-w-2xl mx-auto text-center mb-5 mt-5">
          <p className="text-[18px] italic leading-relaxed opacity-80 px-4">
            "The Well is a living resource — a quiet place the writer returns to whenever they need grounding, a prompt, or a practice."
          </p>
        </div>
      </header>

      {/* LOWER SECTION WRAPPER */}
      <div className="relative flex-grow flex flex-col overflow-hidden">

        {/* 1. LOADING OVERLAY - SIRF CONTENT AREA KE LIYE */}
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-[50] bg-[#F5F0E8] flex flex-col items-center justify-center gap-4"
            >
              <Loader2 size={30} className="animate-spin text-[#36454F]/20" strokeWidth={1} />
              <p className="text-[9px] uppercase tracking-[0.4em] font-sans font-bold opacity-30">Filling the Well...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTAINER - Fade in hoga jab image load ho jaye */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[85rem] h-[700px] mx-auto px-6 md:px-12 flex-grow pb-4 flex gap-8 items-stretch"
        >
          <div className="hidden lg:block w-[450px] xl:w-[550px] shrink-0">
            <img
              src={fixedImg}
              alt="Well"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover rounded-[2rem] grayscale brightness-90 transition-all duration-1000 ${imageLoaded ? "scale-100 blur-0" : "scale-105 blur-sm"}`}
            />
          </div>

          <div className="flex-1 h-full bg-white/40 rounded-[2rem] border border-[#36454F]/5 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto river-scroll px-7 py-7">
              <div className="max-w-3xl space-y-6">
                {prompts.map((p) => (
                  <div key={p.id} className="group bg-white/70 border border-[#36454F]/5 p-8 rounded-[2.5rem] text-left hover:shadow-lg hover:bg-white transition-all relative">
                    <button onClick={() => handleEditClick(p)} className="absolute top-8 right-8 w-10 h-10 bg-[#F5F0E8] rounded-2xl flex items-center justify-center hover:bg-[#36454F] hover:text-white transition-all z-10">
                      <Edit2 size={15} className="opacity-40" />
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-[#F5F0E8] rounded-full flex items-center justify-center shrink-0">
                        <Droplets size={16} strokeWidth={1.2} className="opacity-80" />
                      </div>
                      <h3 className="text-[14px] uppercase tracking-widest font-sans font-bold leading-none ">
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-[18px] italic leading-relaxed text-[#36454F]/90">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.main>

        <footer className="w-full max-w-[85rem] mx-auto px-6 md:px-12 h-[12vh] flex flex-col items-center justify-center shrink-0 mb-4">
          <div className="w-full flex justify-end">
            <button onClick={() => navigate("/wellbeingpractices")} className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-sans font-bold group">
              Next Practices <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </footer>
      </div>

      {/* POPUP SECTION - (Popup logic same rahegi) */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#36454F]/15 backdrop-blur-md"
              onClick={() => !loading && !fetching && setIsPopupOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#F5F0E8] rounded-[2rem] shadow-2xl p-8 md:p-12 min-h-[500px] flex flex-col"
            >
              {fetching ? (
                <div className="flex-grow flex flex-col items-center justify-center gap-6 opacity-40 italic">
                  <Loader2 size={40} className="animate-spin text-[#36454F]" strokeWidth={1.2} />
                  <p className="text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Summoning Water...</p>
                </div>
              ) : (
                <>
                  <button onClick={() => setIsPopupOpen(false)} className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center bg-white rounded-full hover:scale-110 transition-all z-10">
                    <X size={18} className="opacity-30" />
                  </button>

                  <div className="mb-8 pr-12">
                    <span className="text-[12px] uppercase tracking-[0.2em] font-sans font-bold block mb-3">{activePrompt?.title}</span>
                    <h3 className="text-[19px] italic leading-snug">"{activePrompt?.text}"</h3>
                  </div>

                  <div className="relative w-full p-3 rounded-[2rem] border border-[#EAB308]/10 bg-white focus-within:border-[#EAB308]/40 transition-all">
                    <textarea
                      ref={textAreaRef}
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      placeholder="Let your thoughts settle on the page..."
                      className="w-full h-[300px] bg-transparent outline-none italic text-[18px] p-6 text-[#36454F] leading-relaxed resize-none river-scroll placeholder:opacity-20"
                    />
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={saveEntry}
                      disabled={loading || !reflection.trim()}
                      className="w-full py-6 bg-[#36454F] text-[#F5F0E8] rounded-2xl font-sans text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-black disabled:opacity-30 flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : "Merge with Well"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.river-scroll::-webkit-scrollbar { width: 4px; } .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }` }} />
    </div>
  );
}

export default Well;