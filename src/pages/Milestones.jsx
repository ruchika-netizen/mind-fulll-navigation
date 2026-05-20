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
        if (!error) setMilestones(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  const truncateWords = (text, limit = 8) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#36454F] opacity-10" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-24 animate-in fade-in duration-700">
      <header className="relative w-full max-w-7xl mx-auto py-16 px-6 text-center">
        <div className="absolute top-12 left-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The Milestones
          </h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 px-2">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] uppercase tracking-[0.3em] font-sans font-bold ">Captured</span>
            {/* Limit updated from 7 to 10 */}
            <span className="text-xl italic font-light">{milestones.length} <span className="opacity-20 mx-1">/</span> 10</span>
          </div>

          {/* Condition updated to 10 */}
          {milestones.length < 10 && (
            <button
              onClick={() => navigate("/mark-moment")}
              className="bg-[#36454F] text-[#F5F0E8] px-6 py-2.5 rounded-xl text-[12px] uppercase tracking-[0.3em] font-bold shadow-lg shadow-[#36454F]/10 flex items-center gap-2 font-sans hover:bg-black active:scale-95 transition-all"
            >
              <Plus size={14} /> Mark Milestone
            </button>
          )}
        </div>

        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-32 italic text-lg font-light tracking-wide">The milestone is quiet. No previous milestone found.</div>
          ) : (
            milestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => navigate(`/mark-moment/${milestone.id}`)}
                className="group relative bg-white/40 rounded-[1rem] p-4 md:p-5 border border-white/50 hover:shadow-xl hover:bg-white transition-all duration-500 flex items-center gap-4 md:gap-6 cursor-pointer"
              >
                {/* Visual Left Badge */}
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#F5F0E8] rounded-2xl border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-500 shrink-0">
                  <Bookmark size={14} className="mb-0.5 opacity-20 group-hover:opacity-100" />
                  <span className="text-[9px] font-bold font-sans opacity-40 group-hover:opacity-100">
                    {new Date(milestone.created_at).toLocaleDateString('en-GB', { day: '2-digit' })}
                  </span>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-[17px] italic font-medium text-[#36454F] mb-0.5 group-hover:text-black transition-colors truncate">
                    {milestone.title}
                  </h3>
                  <p className="text-[12px] opacity-40 italic leading-tight font-sans group-hover:opacity-70 transition-opacity">
                    {truncateWords(milestone.ask_of_you, 10)}
                  </p>
                </div>

                {/* Target Date Badge */}
                {milestone.target_date && (
                  <div className="hidden sm:flex flex-col items-end shrink-0 border-l border-[#36454F]/10 pl-4 py-1">
                    <span className="text-[11px] uppercase tracking-[0.1em] font-sans font-bold ">Milestone Date</span>
                    <span className="text-[12px] font-sans font-bold text-[#36454F]/60 group-hover:text-[#36454F]">
                      {formatDate(milestone.target_date)}
                    </span>
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="opacity-0 group-hover:opacity-30 group-hover:translate-x-1 transition-all duration-500 pr-2">
                  <ChevronRight size={16} />
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