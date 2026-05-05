import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ChevronRight, RefreshCw, Plus, Clock } from "lucide-react";

function RiverList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const fetchEntries = async (isManualUpdate = false) => {
    if (isManualUpdate) setIsUpdating(true);
    // Artifical delay for that "mindful" feel
    const timer = new Promise(resolve => setTimeout(resolve, 800));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        await timer;
        setEntries(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading || isUpdating) return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center transition-all duration-700">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-[#36454F] opacity-20" size={24} />
        <p className="font-serif italic text-[#36454F] tracking-widest text-[11px] uppercase opacity-40">
          {isUpdating ? "Refining the flow..." : "The river is flowing..."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20 animate-in fade-in duration-1000">

      {/* 1. UNIVERSAL HEADER */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7  text-center">
        {/* Back Button Container */}
        <div className="absolute top-6 md:top-12 left-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The River List
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">

        {/* 2. ACTIONS BAR */}
        <div className="flex justify-between items-center mb-16 px-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold opacity-30">
              Total Flow
            </span>
            <span className="text-xl italic font-light font-serif">
              {entries.length} {entries.length === 1 ? "Moment" : "Moments"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchEntries(true)}
              className="p-3 bg-white rounded-full hover:shadow-md transition-all border border-[#36454F]/5"
              title="Refresh"
            >
              <RefreshCw size={14} className="opacity-40" />
            </button>

            <Link
              to="/river"
              className="bg-[#36454F] text-[#F5F0E8] px-8 py-3 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 font-sans"
            >
              <Plus size={14} /> New Entry
            </Link>
          </div>
        </div>

        {/* 3. MINIMAL LISTING */}
        {/* 3. COMPACT MINIMAL LISTING */}
        <div className="space-y-3"> {/* Spacing kam ki hai */}
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/river?id=${entry.id}`)}
              className="group bg-white/30 hover:bg-white px-5 py-4 rounded-2xl border border-[#36454F]/5 transition-all duration-500 cursor-pointer flex items-center gap-5"
            >
              {/* Small Date Circle/Block */}
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#F5F0E8] rounded-xl border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-500 flex-shrink-0">
                <span className="text-sm font-light italic leading-none">
                  {new Date(entry.created_at).toLocaleDateString('en-GB', { day: '2-digit' })}
                </span>
                <span className="text-[7px] uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100">
                  {new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </div>

              {/* Compact Content Block */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-[15px] italic font-medium text-[#36454F] group-hover:text-black transition-colors truncate">
                  {entry.presence || "A Silent Flow"}
                </h3>
                <p className="text-[11px] opacity-40 line-clamp-1 font-serif mt-0.5 italic">
                  {entry.evening_reflection || "No reflection recorded."}
                </p>
              </div>

              {/* Minimal Icon instead of text */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <ChevronRight size={14} className="text-[#36454F]/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-32 rounded-[3rem] border border-dashed border-[#36454F]/10 bg-white/20">
            <Clock className="mx-auto mb-4 opacity-10" size={32} />
            <p className="text-xl font-light italic opacity-30 mb-8">The river has no ripples yet...</p>
            <Link to="/river" className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold bg-[#36454F] text-white px-8 py-3 rounded-full shadow-lg">
              Capture First Moment
            </Link>
          </div>
        )}
      </main>

      <footer className="py-24 text-center">
        <div className="w-12 h-[1px] bg-[#36454F]/10 mx-auto mb-8"></div>
        <p className="text-[9px] uppercase tracking-[0.8em] opacity-20 font-sans">The End of the Stream</p>
      </footer>
    </div>
  );
}

export default RiverList;