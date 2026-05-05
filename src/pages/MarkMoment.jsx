import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Save } from "lucide-react";

function MarkMoment() {
  const { id } = useParams(); // URL se ID pakadta hai
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    ask_of_you: "",
    carry_forward: "",
    surprised_you: ""
  });

  // Load existing data if editing
  useEffect(() => {
    if (id) {
      const fetchEntry = async () => {
        setFetching(true);
        try {
          const { data, error } = await supabase
            .from("milestones")
            .select("*")
            .eq("id", id)
            .single();

          if (data && !error) {
            setFormData({
              title: data.title || "",
              ask_of_you: data.ask_of_you || "",
              carry_forward: data.carry_forward || "",
              surprised_you: data.surprised_you || ""
            });
          }
        } catch (err) {
          console.error("Error fetching:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchEntry();
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const entryData = {
        title: formData.title,
        ask_of_you: formData.ask_of_you,
        carry_forward: formData.carry_forward,
        surprised_you: formData.surprised_you,
        user_id: user.id,
      };

      let result;
      if (id) {
        // Update Existing
        result = await supabase
          .from("milestones")
          .update(entryData)
          .eq("id", id);
      } else {
        // Insert New
        result = await supabase
          .from("milestones")
          .insert([entryData]);
      }

      if (!result.error) {
        navigate("/milestones");
      } else {
        alert("Error: " + result.error.message);
      }
    } catch (err) {
      console.error("System Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const labelClasses = "text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1 leading-relaxed ";
  const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4  outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-inner";

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] italic opacity-40 text-sm">
      Gathering the moment...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20">
      <header className="relative w-full max-w-7xl mx-auto py-12 px-6 text-center">
        <button onClick={() => navigate("/milestones")} className="absolute left-6 top-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold group">
          <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform">‹</span>
          <span className="mt-0.5">Back</span>
        </button>
        <h1 className="text-3xl italic tracking-tight">{id ? "Mark Milestone" : "Mark Milestone"}</h1>
      </header>

      <main className="max-w-xl mx-auto px-6">
        <form onSubmit={handleSave} className="bg-white/70 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 space-y-7">

          {/* TITLE */}
          <div className="space-y-2 group">
            <label className={labelClasses}>Name this moment</label>
            <input
              required
              className={fieldClasses}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., A New Direction"
            />
          </div>

          {/* QUESTIONS */}
          <div className="space-y-2 group">
            <label className={labelClasses}>What did this moment ask of you?</label>
            <textarea
              className={`${fieldClasses} min-h-[80px] resize-none`}
              value={formData.ask_of_you}
              onChange={(e) => setFormData({ ...formData, ask_of_you: e.target.value })}
            />
          </div>

          <div className="space-y-2 group">
            <label className={labelClasses}>What are you ready to carry forward?</label>
            <textarea
              className={`${fieldClasses} min-h-[80px] resize-none`}
              value={formData.carry_forward}
              onChange={(e) => setFormData({ ...formData, carry_forward: e.target.value })}
            />
          </div>

          <div className="space-y-2 group">
            <label className={labelClasses}>What surprised you?</label>
            <textarea
              className={`${fieldClasses} min-h-[80px] resize-none`}
              value={formData.surprised_you}
              onChange={(e) => setFormData({ ...formData, surprised_you: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-4 rounded-xl text-[10px] uppercase tracking-[0.4em] font-bold shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-black disabled:opacity-50 font-sans mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <> {id ? "Update Flow" : "Seal Moment"}</>}
          </button>
        </form>
      </main>
    </div>
  );
}

export default MarkMoment;