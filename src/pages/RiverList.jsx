import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ChevronRight, RefreshCw, Plus } from "lucide-react";

function RiverList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        setEntries(data || []);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEntries(); }, []);

  if (loading) return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center opacity-20"><RefreshCw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20 animate-in fade-in duration-1000">
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
            TheRiver list
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col"><span className="text-[10px] opacity-30 font-sans font-bold uppercase tracking-widest">Moments</span><span className="text-xl italic">{entries.length}</span></div>
          <Link to="/river" className="bg-[#36454F] text-white px-8 py-3 font-sans rounded-full text-[9px] uppercase tracking-widest font-bold flex items-center gap-2"><Plus size={14} /> New</Link>
        </div>

        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} onClick={() => navigate(`/river?id=${entry.id}`)} className="group bg-white/40 hover:bg-white px-6 py-5 rounded-2xl border border-[#36454F]/5 transition-all cursor-pointer flex items-center gap-6">
              <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl flex flex-col items-center justify-center group-hover:bg-[#36454F] group-hover:text-white transition-all">
                <span className="text-sm italic">{new Date(entry.created_at).getDate()}</span>
                <span className="text-[7px] uppercase font-bold opacity-40">{new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'short' })}</span>
              </div>
              <div className="flex-1"><h3 className="text-[16px] italic font-medium group-hover:text-black transition-colors">{entry.presence || "A Silent Flow"}</h3></div>
              <ChevronRight size={14} className="opacity-20 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RiverList;