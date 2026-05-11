import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Edit2, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../supabaseClient";
import fixedImg from "../assets/pexels-chris-pearson-310270136-14435134.jpg";

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
  const [loading, setLoading] = useState(false); // Saving state
  const [fetching, setFetching] = useState(false); // Loading previous data state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Logic to fetch existing data and handle cursor
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

      if (data) {
        setReflection(data.reflection);
      }
    } catch (err) {
      console.log("Starting fresh.");
    } finally {
      setFetching(false);
    }
  };

  // 1. Logic for Cursor at the END
  useEffect(() => {
    if (isPopupOpen && !fetching && textAreaRef.current) {
      const el = textAreaRef.current;
      el.focus();
      // Cursor ko end pe le jaane ke liye:
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [isPopupOpen, fetching]);
  const saveEntry = async () => {
    if (!reflection.trim()) {
      showToast("Please share a reflection before merging.", "error");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Deleting existing to avoid conflict
      await supabase.from("still_water_entries")
        .delete()
        .eq("user_id", user?.id)
        .eq("prompt", activePrompt.text);

      const { error } = await supabase.from("still_water_entries").insert({
        user_id: user?.id,
        prompt: activePrompt.text,
        reflection: reflection,
        created_at: new Date().toISOString(),
      });

      if (!error) {
        showToast("Reflection merged into the river.", "success");

        // SUCCESS: Pehle toast dikhega, 1.5 seconds tak form dikhta rahega
        // fir popup close hoga.
        setTimeout(() => {
          setIsPopupOpen(false);
        }, 500);

      } else {
        showToast("Error saving entry.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F5F0E8] font-serif text-[#36454F] flex flex-col overflow-hidden selection:bg-[#36454F]/10">

      {/* Toast Notification */}
      <div className={`fixed top-10 right-10 z-[600] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <header className="w-full max-w-7xl mx-auto px-6 pt-10 pb-5 shrink-0 relative text-center">
        <div className="absolute top-12 left-1">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold transition-all group">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span> Back
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">The Well</h1>
        <div className="max-w-2xl mx-auto text-center mb-5 mt-5">
          <p className="text-[18px] italic leading-relaxed opacity-80">
            "The Well is a living resource — a quiet place the writer returns to whenever they need grounding, a prompt, or a practice."
          </p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 md:px-10 flex-grow overflow-hidden pb-10">
        <div className="w-full h-full bg-white/30 rounded-[3rem] border border-[#36454F]/5 overflow-hidden flex flex-row shadow-sm">
          <div className="w-[45%] h-full relative overflow-hidden hidden md:block">
            <img src={fixedImg} alt="The Well" className="w-full h-full object-cover grayscale brightness-[0.8]" />
            <div className="absolute inset-0 bg-[#36454F]/20" />
          </div>

          <div className="flex-1 h-full overflow-y-auto river-scroll px-8 md:px-14 py-12 bg-white/10">
            <div className="max-w-xl mx-auto md:mx-0 space-y-6">
              {prompts.map((p) => (
                <div key={p.id} className="group bg-white/60 border border-[#36454F]/5 p-8 rounded-[2.5rem] text-left hover:bg-white transition-all duration-700 relative">
                  <button onClick={() => handleEditClick(p)} className="absolute top-8 right-8 w-10 h-10 bg-[#F5F0E8] rounded-2xl flex items-center justify-center hover:bg-[#36454F] hover:text-white transition-all">
                    <Edit2 size={16} className="opacity-40" strokeWidth={1.5} />
                  </button>
                  <div className="w-10 h-10 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-6">
                    <Droplets size={16} strokeWidth={1.2} className="opacity-80" />
                  </div>
                  <h3 className="text-[13px] uppercase tracking-[0.3em] font-sans font-bold mb-3">{p.title}</h3>
                  <p className="text-[17px] md:text-[19px] italic leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* POPUP: LOADER ON FULL POPUP AREA */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#36454F]/10 backdrop-blur-md" onClick={() => !loading && !fetching && setIsPopupOpen(false)} />

          <div className="relative w-full max-w-2xl bg-[#F5F0E8] rounded-[2rem] shadow-2xl p-10 md:p-10 min-h-[500px] flex flex-col animate-in zoom-in-95 duration-500">

            {fetching ? (
              // 2. FULL POPUP LOADER
              <div className="flex-grow flex flex-col items-center justify-center gap-6 opacity-40 italic">
                <Loader2 size={40} className="animate-spin text-[#36454F]" strokeWidth={1.2} />
                <p className="text-[10px] tracking-[0.5em] uppercase font-sans font-bold">Loading...</p>
              </div>
            ) : (
              <>
                <button onClick={() => setIsPopupOpen(false)} className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-all">
                  <X size={18} className="opacity-30" />
                </button>

                <div className="mb-5 px-2">
                  <span className="text-[12px] uppercase tracking-[0.4em] font-sans font-bold block mt-5 mb-2">{activePrompt?.title}</span>
                  <h3 className="text-lg italic">"{activePrompt?.text}"</h3>
                </div>

                {/* Textarea Area */}
                <div className="relative w-full p-8 rounded-[2rem] border border-[#EAB308]/10 bg-white  focus-within:border-[#EAB308]/40 transition-all">
                  <textarea
                    ref={textAreaRef}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="If something arrives — write it here..."
                    className="w-full h-[280px] bg-transparent outline-none italic text-[18px] text-[#36454F] leading-relaxed resize-none river-scroll placeholder:opacity-20"
                  />
                </div>

                <div className="mt-7">
                  <button
                    onClick={saveEntry}
                    disabled={loading || !reflection.trim()}
                    className="w-full py-6 bg-[#36454F] text-white rounded-xl font-sans text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-black disabled:opacity-20 flex items-center justify-center gap-3 transition-all shadow-xl"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "RELEASE TO FLOW"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .river-scroll::-webkit-scrollbar { width: 4px; }
        .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}

export default Well;