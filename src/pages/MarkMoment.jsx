import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Trash2, CheckCircle2, X } from "lucide-react"; // Icons add kiye

function MarkMoment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Delete confirmation ke liye

  const [formData, setFormData] = useState({
    title: "",
    ask_of_you: "",
    carry_forward: "",
    surprised_you: ""
  });

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


  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", id);

      if (error) throw error;
      navigate("/milestones");
    } catch (err) {
      alert("Error deleting milestone");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const entryData = { ...formData, user_id: user.id };

      let result;
      if (id) {
        result = await supabase.from("milestones").update(entryData).eq("id", id);
      } else {
        result = await supabase.from("milestones").insert([entryData]);
      }

      if (!result.error) navigate("/milestones");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] italic opacity-40">Gathering...</div>
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20">
      <header className="relative w-full max-w-7xl mx-auto py-12 px-6 text-center">
        <button onClick={() => navigate("/milestones")} className="absolute left-6 top-12 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold group">
          <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform">‹</span>
          <span className="mt-0.5">Back</span>
        </button>

        <h1 className="text-3xl italic tracking-tight">{id ? "Edit Milestone" : "Mark Milestone"}</h1>

        <div className="absolute right-6 top-12">
          {id && (
            <div className="flex items-center gap-1.5 bg-white/40 p-1.5 rounded-full border border-[#36454F]/5 shadow-sm">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-2 text-[#36454F]/40 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <div className="flex items-center gap-1 animate-in slide-in-from-right-4">
                  <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full shadow-md">
                    <CheckCircle2 size={16} />
                  </button>
                  <button onClick={() => setShowConfirm(false)} className="p-2 text-[#36454F]/60">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6">
        <form onSubmit={handleSave} className="bg-white/70 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 space-y-7">
          <div className="space-y-2">
            <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">Name this moment</label>
            <input
              required
              className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic focus:border-[#EAB308] focus:bg-white transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">What did this moment ask of you?</label>
            <textarea
              className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 min-h-[80px] outline-none italic focus:border-[#EAB308] focus:bg-white"
              value={formData.ask_of_you}
              onChange={(e) => setFormData({ ...formData, ask_of_you: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">What are you ready to carry forward?</label>
            <textarea
              className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 min-h-[80px] outline-none italic focus:border-[#EAB308] focus:bg-white"
              value={formData.carry_forward}
              onChange={(e) => setFormData({ ...formData, carry_forward: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-40 ml-1">What surprised you?</label>
            <textarea
              className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 min-h-[80px] outline-none italic focus:border-[#EAB308] focus:bg-white"
              value={formData.surprised_you}
              onChange={(e) => setFormData({ ...formData, surprised_you: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-4 rounded-xl text-[10px] font-sans uppercase tracking-[0.4em] font-bold shadow-lg flex items-center justify-center gap-3 hover:bg-black transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>{id ? "Update Flow" : "Seal Moment"}</>}
          </button>
        </form>
      </main>
    </div>
  );
}

export default MarkMoment;