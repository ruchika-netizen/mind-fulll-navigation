import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Plus, Loader2, Bookmark, ChevronRight } from "lucide-react";

function Milestones() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("milestones")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) setMilestones(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const truncateWords = (text, limit = 10) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#36454F] opacity-20" size={24} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20 animate-in fade-in duration-1000">
      <header className="relative w-full max-w-7xl mx-auto py-10 md:py-16 px-6 text-center">
        <div className="absolute top-6 md:top-12 left-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>

        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold italic tracking-tight text-[#36454F]">
            The Milestones
          </h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 px-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold opacity-30">Captured</span>
            <span className="text-lg italic font-light">{milestones.length} / 7</span>
          </div>
          {milestones.length < 7 && (
            <button
              onClick={() => navigate("/mark-moment")}
              className="bg-[#36454F] text-[#F5F0E8] px-5 py-2.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold shadow-md flex items-center gap-2 font-sans hover:bg-black active:scale-95 transition-all"
            >
              <Plus size={14} /> Mark Milestone
            </button>
          )}
        </div>

        <div className="space-y-6">
          {milestones.length === 0 ? (
            <div className="text-center py-20 opacity-20 italic">No entries in the river yet.</div>
          ) : (
            milestones.map((milestone) => (
              <div
                key={milestone.id}

                onClick={() => navigate(`/milestones/edit/${milestone.id}`)}
                className="group relative bg-white/60 rounded-[22px] p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-500 flex items-center gap-6 cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-[#F5F0E8]/80 rounded-xl border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-500">
                  <Bookmark size={16} className="mb-0.5 opacity-30 group-hover:opacity-100" />
                  <span className="text-[9px] uppercase font-bold font-sans opacity-50 group-hover:opacity-100">
                    {new Date(milestone.created_at).toLocaleDateString('en-GB', { day: '2-digit' })}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider font-bold font-sans opacity-30 group-hover:opacity-80">
                    {new Date(milestone.created_at).toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-lg italic font-medium text-[#36454F] mb-1 font-sans group-hover:text-black transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-[12px] opacity-40 italic leading-snug font-sans group-hover:opacity-60 transition-opacity">
                    {truncateWords(milestone.ask_of_you || milestone.description, 10)}
                  </p>
                </div>

                <div className="absolute right-6 opacity-0 group-hover:opacity-20 group-hover:translate-x-1 transition-all duration-500">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Milestones;