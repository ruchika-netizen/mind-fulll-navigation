import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import redpanda from "../assets/redanada fruits1.png";
import redpandas from "../assets/pexels-flickr-148182.jpg";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

function Orchard() {
  const navigate = useNavigate();
  const [pruning, setPruning] = useState(["", "", ""]);
  const [harvest, setHarvest] = useState("");
  const [loading, setLoading] = useState(false);


  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const saveOrchard = async () => {
    if (!harvest.trim() && !pruning.some(p => p.trim())) {
      showToast("Please record your thoughts first.", "error");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("orchard_data").insert([{
        user_id: user?.id,
        harvest: harvest,
        pruning: pruning,
        created_at: new Date().toISOString(),
      }]);

      if (error) throw error;

      showToast("Data has been successfully recorded. ", "success");
      setHarvest("");
      setPruning(["", "", ""]);
    } catch (error) {
      showToast(error.message, "error");
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
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7  text-center">
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
            The Orchard
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-5 pb-20 flex flex-col lg:flex-row gap-8 items-stretch relative z-10 justify-center">


        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col transition-all hover:shadow-md overflow-hidden">

          <div className="mb-8 text-center">
            <h2 className="md:text-2xl font-light tracking-tight italic text-[#36454F]">Seasonal Pruning</h2>
            <p className="text-[13px] uppercase tracking-[0.3em] font-bold opacity-30 mt-2 font-sans">Tending to your growth</p>
          </div>

          <div className="flex-grow space-y-6">
            <div className="w-full h-78 mb-6 rounded-[2rem] overflow-hidden border border-[#36454F]/5 shadow-inner">
              <img src={redpanda} alt="Red Panda" className="w-full h-full object-cover grayscale-[20%] opacity-90" />
            </div>

            {[
              { label: "What I am letting go", val: pruning[0], idx: 0 },
              { label: "What I am nurturing", val: pruning[1], idx: 1 },
              { label: "What I am reaching toward", val: pruning[2], idx: 2 }
            ].map((item) => (
              <div key={item.idx} className="group">
                <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed ">
                  {item.label}
                </label>
                <textarea
                  value={item.val}
                  onChange={(e) => {
                    const newP = [...pruning];
                    newP[item.idx] = e.target.value;
                    setPruning(newP);
                  }}
                  placeholder="..."
                  className="w-full h-[85px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-3 py-2 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PAGE: THE HARVEST */}
        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col transition-all hover:shadow-md relative overflow-hidden">

          <div className="mb-10 text-center">
            <h2 className="md:text-2xl font-light tracking-tight italic text-[#36454F]">The Harvest: What Has Grown</h2>
            {/* <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mt-2 font-sans">Gathering what has grown</p> */}
          </div>

          <div className="flex-grow flex flex-col">
            <label className="text-[13px] uppercase tracking-[0.3em] font-bold block mb-3 font-sans opacity-40 text-center italic">
              “Three things that grew this season”
            </label>

            <textarea
              value={harvest}
              onChange={(e) => setHarvest(e.target.value)}
              placeholder="Record what you are gathering..."
              className="w-full flex-grow bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-inner"
            />
          </div>

          <div className="mt-8">
            <button
              onClick={saveOrchard}
              disabled={loading}
              className="w-full bg-[#36454F] text-white py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all tracking-[0.4em] font-sans uppercase text-[12px] font-bold font-sans shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <> SAVE NEW ENTRY </>}
            </button>

            <div className="flex items-center justify-between opacity-40 mt-6 px-2">
              <p className="text-[16px] italic max-w-[280px] leading-relaxed font-serif">
                “Tend to your orchard, and the fruit will follow.”
              </p>
              <div className="w-18 h-10 bg-[#36454F]/5 rounded-xl flex items-center justify-center overflow-hidden border border-[#36454F]/10">
                <img src={redpandas} alt="Companion" className="w-full h-full object-contain grayscale" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .river-scroll::-webkit-scrollbar { width: 3px; }
        .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Orchard;