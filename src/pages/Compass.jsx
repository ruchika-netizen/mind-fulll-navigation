import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import redds from "../assets/pexels-regan-dsouza-1315522347-30692724.jpg";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

function Compass() {
  const navigate = useNavigate();
  const [northStar, setNorthStar] = useState("");
  const [steps, setSteps] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const saveData = async () => {
    if (!northStar.trim() && !steps.some((s) => s.trim())) {
      showToast("Please define your direction first.", "error");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("compass_goals").insert({
        user_id: user?.id,
        north_star: northStar,
        step_1: steps[0],
        step_2: steps[1],
        step_3: steps[2],
        created_at: new Date().toISOString(),
      });

      if (!error) {
        setNorthStar("");
        setSteps(["", "", ""]);
        showToast("Data has been successfully recorded.", "success");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Check connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col selection:bg-[#36454F]/10 relative overflow-x-hidden">
      <div
        className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"
          } ${toast.type === "success"
            ? "bg-white border-green-100 text-[#36454F]"
            : "bg-[#36454F] border-white/10 text-[#F5F0E8]"
          }`}
      >
        {toast.type === "success" ? (
          <CheckCircle2 className="text-green-500" size={20} />
        ) : (
          <AlertCircle className="text-red-400" size={20} />
        )}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">
          {toast.message}
        </p>
        <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 opacity-30 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7 text-center">
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
            The Compass
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-5 pb-20 flex flex-col lg:flex-row gap-8 items-stretch relative z-10 justify-center">

        {/* LEFT PAGE: ORIENTATION */}
        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col relative transition-all hover:shadow-md">
          <div className="mb-6 text-center">
            <h2 className="md:text-2xl font-light tracking-tight italic text-[#36454F]">Orientation Phase</h2>
            <p className="text-[13px] uppercase tracking-[0.3em] font-bold opacity-30 mt-2 font-sans">Finding your direction</p>
          </div>

          <div className="flex-grow flex flex-col items-center justify-start pt-6">
            <div className="mb-10 opacity-[0.15] pointer-events-none">
              <svg width="180" height="180" viewBox="0 0 100 100" className="stroke-[#36454F] fill-none">
                <path d="M 85,50 C 85,75 70,88 50,88 C 25,88 12,70 12,50 C 12,25 30,12 55,12 C 70,12 82,22 84,35" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
            </div>

            <div className="w-full group z-10">
              <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed text-center">
                Define Your North Star
              </label>
              <textarea
                value={northStar}
                onChange={(e) => setNorthStar(e.target.value)}
                placeholder="What is your new direction?"
                className="w-full h-[220px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4  outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PAGE: JOURNEY MAPPING */}
        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col transition-all hover:shadow-md">
          <div className="mb-10 text-center">
            <h2 className="md:text-2xl font-light tracking-tight italic text-[#36454F]">Journey Mapping</h2>
            <p className="text-[13px] uppercase tracking-[0.3em] font-bold mt-2 font-sans opacity-30">The Shape of Your Journey</p>
          </div>

          <div className="space-y-6 flex-grow">
            {[
              { label: "What I am leaving behind", val: steps[0], idx: 0 },
              { label: "What I am carrying forward", val: steps[1], idx: 1 },
              { label: "The horizon I am moving toward", val: steps[2], idx: 2 }
            ].map((item) => (
              <div key={item.idx} className="group">
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed">{item.label}</label>
                <textarea
                  value={item.val}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[item.idx] = e.target.value;
                    setSteps(newSteps);
                  }}
                  placeholder="..."
                  className="w-full h-[85px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl p-4  outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll"
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveData}
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-black font-sans transition-all tracking-[0.4em] uppercase text-[12px] font-bold font-sans shadow-lg mt-8 active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <> Commit to Path </>}
          </button>

          {/* Footer Branding */}
          <div className="flex items-center justify-between opacity-40 mt-6 px-2">
            <p className="text-[16px] italic max-w-[280px] leading-relaxed font-serif">
              “Be the traveller, not just the map.”
            </p>
            <div className="w-15 h-10 bg-[#36454F]/5 rounded-4xl flex items-center justify-center overflow-hidden">
              <img src={redds} alt="Companion" className="w-full h-full object-contain grayscale opacity-50" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Compass;