import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, FileText, CheckCircle2, X } from "lucide-react";

function StillWater() {
  const location = useLocation();
  const navigate = useNavigate();

  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const textAreaRef = useRef(null);

  const prompt = location.state?.selectedPrompt || "Choose a prompt from the Well.";
  const title = location.state?.title || "The Shadow Self";

  const handleSaveAndClose = async () => {
    if (!reflection.trim()) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("still_water_entries").insert([
        {
          user_id: user.id,
          prompt: `${title}: ${prompt}`,
          reflection: reflection
        }
      ]);
      if (!error) {
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
        setIsPopupOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isPopupOpen && textAreaRef.current) {
      const length = reflection.length;

      textAreaRef.current.setSelectionRange(length, length);
    }
  }, [isPopupOpen]);
  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 flex flex-col items-center relative overflow-x-hidden">

      {/* Saved Toast */}
      <div className={`fixed top-12 right-12 flex items-center gap-2 transition-all duration-700 z-[120] ${showSavedToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-[#36454F]/40">Saved</span>
        <CheckCircle2 size={12} className="text-[#36454F]/40" />
      </div>

      {/* Header */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center px-6 flex-shrink-0">
        <div className="absolute top-12 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The Still Water</h1>
        <div className="w-12 h-[1px] bg-[#36454F]/10 mx-auto mt-4" />
      </header>

      {/* Main Content Area */}
      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-6 pb-20 flex-grow">
        <div className="flex flex-col items-start justify-start animate-in fade-in duration-1000 w-full">
          <div className="w-full flex items-center justify-between pb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-[12px] uppercase tracking-[0.2em] font-sans font-bold opacity-30 italic">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-10 h-10 bg-white/60 border border-[#36454F]/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:border-[#36454F]/30 hover:bg-white active:scale-95 shadow-sm"
              >
                <FileText size={24} className="opacity-40" strokeWidth={1} />
              </button>
            </div>
          </div>


          <div className="w-full flex justify-center">
            <div className="max-w-3xl flex flex-col items-center">
              <p className="text-3xl text-center italic leading-[1.4] text-[#36454F] font-light whitespace-pre-line">
                {prompt.replace('? ', '?\n')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* POP-UP WRITING AREA */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-[#36454F]/20 backdrop-blur-md z-[130] flex items-center justify-center px-6 animate-in fade-in duration-500">

          <div className="w-full max-w-2xl bg-[#F5F0E8] rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-[#36454F]/10 relative animate-in zoom-in-95 duration-500">

            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/40 rounded-full flex items-center justify-center border border-[#36454F]/5 shadow-sm hover:bg-white transition-all active:scale-90 z-10"
            >
              <X size={18} className="opacity-40" />
            </button>

            <div className="pt-4">

              <div className="bg-white/60 border border-[#36454F]/5 rounded-[1.8rem] p-6 focus-within:border-[#EAB308]/40 transition-all duration-300">
                <textarea
                  ref={textAreaRef}
                  autoFocus
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="If something arrives — write it here..."
                  className="w-full h-[320px] bg-transparent outline-none ring-0 italic text-[18px] text-[#36454F] leading-relaxed resize-none river-scroll placeholder:opacity-40"
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-center items-center mt-6 pt-6 border-t border-[#36454F]/5">
              <button
                onClick={handleSaveAndClose}
                disabled={loading || !reflection.trim()}
                className="bg-[#36454F] text-[#F5F0E8] px-14 py-5 w-full font-sans rounded-2xl flex items-center justify-center gap-3 tracking-[0.4em] uppercase text-[10px] font-bold shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-20"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Release to Flow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StillWater;