import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, CheckCircle2, AlertCircle, X, Trash2 } from "lucide-react";
import "../App.css";

// Assets
import redpanda from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import pika from "../assets/pfQpy9wSq4zFDCKwAg8gwf.jpg";

const sutras = [
  { text: "Let your breath lead the way, your smile follow, and your pace honour both.", type: "Red Panda" },
  { text: "You are already where you need to be.", type: "Pika" },
  { text: "Your presence is the greatest gift.", type: "Pika" }
];

function River() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const entryId = queryParams.get("id");

  const [morning, setMorning] = useState({ intentions: "", presence: "", firstSteps: "" });
  const [evening, setEvening] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(!!entryId);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [companion, setCompanion] = useState(redpanda);
  const [isViewMode, setIsViewMode] = useState(!!entryId);
  const [currentSutraIndex, setCurrentSutraIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };


  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", entryId);
      if (error) throw error;

      triggerToast("Entry deleted successfully", "success");


      setTimeout(() => navigate("/river-list"), 500);
    } catch (err) {
      triggerToast("Error deleting entry", "error");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSutraIndex((prev) => (prev + 1) % sutras.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setInitialFetchLoading(false); return; }

      if (entryId) {
        setInitialFetchLoading(true);
        setIsViewMode(true);
        try {
          const { data } = await supabase.from("journal_entries").select("*").eq("id", entryId).single();
          if (data) {
            setMorning({
              intentions: data.intentions || "",
              presence: data.presence || "",
              firstSteps: data.first_steps || ""
            });
            setEvening(data.evening_reflection || "");
          }
        } catch (err) { triggerToast("Error fetching flow", "error"); }
        finally { setInitialFetchLoading(false); }
      }

      const { count } = await supabase.from("journal_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      if (count !== null) { setCompanion(count % 2 === 0 ? redpanda : pika); }
    };
    fetchData();
  }, [entryId]);

  const saveJourney = async () => {
    if (!morning.intentions.trim() && !evening.trim()) {
      triggerToast("Please share your thoughts.", "error");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        user_id: user.id,
        intentions: morning.intentions,
        presence: morning.presence,
        first_steps: morning.firstSteps,
        evening_reflection: evening,
      };

      if (entryId) {
        await supabase.from("journal_entries").update(payload).eq("id", entryId);
      } else {
        await supabase.from("journal_entries").insert([payload]);
      }
      triggerToast("River data recorded.", "success");
      setTimeout(() => navigate("/river-list"), 1000); // Saved navigation is 1s
    } catch (error) { triggerToast("Error recording flow.", "error"); }
    finally { setLoading(false); }
  };

  if (initialFetchLoading) {
    return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center italic opacity-40">Gathering flow...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] relative animate-in fade-in duration-1000">

      {/* Toast Notification */}
      <div className={`fixed top-8 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100 text-[#36454F]" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <header className="max-w-7xl mx-auto w-full pt-10 pb-7 relative z-10">
        <div className="flex justify-between items-center ">
          <button
            onClick={() => navigate("/river-list")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>

          <h1 className="md:text-4xl font-bold tracking-tight italic flex-grow text-center">
            The River
          </h1>

          <div className="flex items-center justify-end min-w-[120px]">
            {entryId && (
              <div className="relative flex items-center gap-1.5 bg-white/40 p-1.5 rounded-full border border-[#36454F]/5 shadow-sm overflow-hidden">
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="p-2 text-[#36454F]/40 hover:text-red-500 transition-all hover:bg-white rounded-full"
                    title="Delete Entry"
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 animate-in slide-in-from-right-4 duration-300">
                    <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-md active:scale-90">
                      <CheckCircle2 size={16} />
                    </button>
                    <button onClick={() => setShowConfirm(false)} className="p-2 text-[#36454F]/60 hover:text-black transition-all hover:bg-white rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">

          {/* Morning Section */}
          <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col relative">
            <h2 className="md:text-2xl font-light italic text-center pb-10 z-10 ">The Morning Current</h2>

            <div className="space-y-10 flex-grow z-10">
              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed">
                  Intentions — What matters most in this moment?
                </label>
                <textarea
                  value={morning.intentions}
                  onChange={(e) => setMorning({ ...morning, intentions: e.target.value })}
                  placeholder="Permission to..."
                  className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white river-scroll leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed">
                  Presence — A single word for your attention.
                </label>

                <input
                  value={morning.presence}
                  onChange={(e) => {
                    const value = e.target.value;

                    // allow only one word (no spaces) + max 16 chars
                    if (!value.includes(" ") && value.length <= 16) {
                      setMorning({ ...morning, presence: value });
                    }
                  }}
                  placeholder="One word..."
                  maxLength={16}
                  className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed">
                  First Steps — Actions to move you forward.
                </label>
                <textarea
                  value={morning.firstSteps}
                  onChange={(e) => setMorning({ ...morning, firstSteps: e.target.value })}
                  placeholder="Small steps..."
                  className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white river-scroll leading-relaxed"
                />
              </div>
            </div>
            <img src={companion} className="absolute bottom-8 right-6 w-20 opacity-[0.15] grayscale rounded-xl z-0 pointer-events-none" alt="companion watermark" />
          </div>

          {/* Evening Section */}
          <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col">
            <h2 className="md:text-2xl font-light italic text-center pb-10 z-10">The Evening Reflection</h2>

            <div className="flex-grow flex flex-col">
              <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed">
                Gratitude & Observations & Closing
              </label>
              <textarea
                value={evening}
                onChange={(e) => setEvening(e.target.value)}
                placeholder="How was the flow today?..."
                className="flex-grow w-full min-h-[400px] bg-[#F5F0E8]/30 border border-[#36454F]/5 rounded-xl p-4 outline-none italic leading-loose focus:border-[#EAB308] focus:bg-white river-scroll"
              />
            </div>

            <div className="mt-10 mb-4 min-h-[60px] flex flex-col ">
              <button
                onClick={saveJourney}
                disabled={loading}
                className="w-full bg-[#36454F] text-white py-5 mb-8 rounded-xl font-sans flex items-center justify-center gap-3 tracking-[0.4em] uppercase text-[10px] font-bold shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50 z-10"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (entryId ? "Update Journey" : "Record Journey")}
              </button>
              <div key={currentSutraIndex} className="font-sans animate-in fade-in slide-in-from-bottom-2 duration-1000">
                <p className="text-[18px] italic opacity-40 leading-relaxed ">"{sutras[currentSutraIndex].text}"</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default River;