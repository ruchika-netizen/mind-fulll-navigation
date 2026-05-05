import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ChevronLeft, Loader2, Save } from "lucide-react";

function MilestoneForm() {
  const { id } = useParams(); // URL se ID uthayega (/edit/:id)
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔥 EDIT MODE: Agar ID hai toh content fetch karo
  useEffect(() => {
    if (id) {
      const fetchMilestone = async () => {
        setFetching(true);
        const { data, error } = await supabase
          .from("milestones")
          .select("*")
          .eq("id", id)
          .single();
        
        if (data && !error) {
          setTitle(data.title);
          setDescription(data.description);
        }
        setFetching(false);
      };
      fetchMilestone();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const milestoneData = {
      title,
      description,
      user_id: user.id,
    };

    let error;
    if (id) {
      // Update existing
      const { error: updateError } = await supabase
        .from("milestones")
        .update(milestoneData)
        .eq("id", id);
      error = updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from("milestones")
        .insert([milestoneData]);
      error = insertError;
    }

    if (!error) navigate("/milestones");
    setLoading(false);
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <Loader2 className="animate-spin opacity-20" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif">
      <header className="relative w-full max-w-7xl mx-auto py-12 px-6 text-center">
        <button onClick={() => navigate(-1)} className="absolute left-6 top-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
          ‹ Back
        </button>
        <h1 className="text-3xl md:text-4xl italic">{id ? "Refine Milestone" : "Mark Milestone"}</h1>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <form onSubmit={handleSave} className="space-y-12">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-30">The Title</label>
            <input 
              required
              className="w-full bg-transparent border-b border-[#36454F]/10 py-3 outline-none text-2xl italic placeholder:opacity-10"
              placeholder="What happened?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-30">The Reflection</label>
            <textarea 
              required
              className="w-full bg-transparent border border-[#36454F]/10 rounded-2xl p-6 outline-none text-lg italic min-h-[200px] leading-relaxed resize-none shadow-inner"
              placeholder="Describe this turning point..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-4 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> {id ? "Update Flow" : "Seal Milestone"}</>}
          </button>
        </form>
      </main>
    </div>
  );
}

export default MilestoneForm;