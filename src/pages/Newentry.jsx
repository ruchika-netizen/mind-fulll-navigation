import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function NewRiverEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    morning_intentions: "",
    presence_text: "",
    first_steps: "",
    evening_reflection: ""
  });

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("journal_entries")
      .insert([{ ...formData, user_id: user.id }]);

    if (!error) navigate("/river");
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif p-6 md:p-20">
      <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">


        <div className="flex-1 p-10 border-r border-[#F5F0E8]">
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#36454F]/40 mb-8">Morning Current</h2>

          <div className="space-y-8">
            <div>
              <label className="block text-xs mb-2 opacity-50">Intentions</label>
              <textarea
                className="w-full bg-transparent border-b border-[#36454F]/10 focus:border-[#36454F] outline-none py-2 resize-none"
                rows="2"
                onChange={(e) => setFormData({ ...formData, morning_intentions: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs mb-2 opacity-50">Presence</label>
              <textarea
                className="w-full bg-transparent border-b border-[#36454F]/10 focus:border-[#36454F] outline-none py-2 resize-none"
                rows="2"
                onChange={(e) => setFormData({ ...formData, presence_text: e.target.value })}
              />
            </div>
            <div className="relative">
              <label className="block text-xs mb-2 opacity-50">First Steps</label>
              <textarea
                className="w-full bg-transparent border-b border-[#36454F]/10 focus:border-[#36454F] outline-none py-2 resize-none"
                rows="2"
                onChange={(e) => setFormData({ ...formData, first_steps: e.target.value })}
              />

              <div className="absolute bottom-2 right-2 opacity-[0.15] pointer-events-none">
                <img src="/path-to-character.png" alt="" className="w-12" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-10 bg-stone-50/30 flex flex-col justify-between">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#36454F]/40 mb-8">Evening Reflection</h2>
            <textarea
              placeholder="Write your reflections here..."
              className="w-full bg-transparent outline-none py-2 resize-none h-64 text-lg leading-relaxed italic"
              onChange={(e) => setFormData({ ...formData, evening_reflection: e.target.value })}
            />
          </div>

          {/* Sutra at base (Section 4.F04) */}
          <div className="mt-10 border-t border-[#36454F]/5 pt-6 text-center">
            <p className="text-[13px] text-[#36454F]/40 italic">
              "The river is everywhere at once, at the source and at the mouth."
            </p>
            <button
              onClick={handleSave}
              className="mt-6 text-xs uppercase tracking-widest text-[#36454F] border border-[#36454F] px-6 py-2 rounded-full hover:bg-[#36454F] hover:text-white transition"
            >
              Save Entry
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NewRiverEntry;