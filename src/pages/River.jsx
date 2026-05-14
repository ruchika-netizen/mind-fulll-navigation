import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Plus, History, Waves, Trash2, X, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import redpanda from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import pika from "../assets/pfQpy9wSq4zFDCKwAg8gwf.jpg";

const PIKA_SUTRAS = [
  "You are already where you need to be.", "Be still and know.", "This moment, exactly as it is, is enough.", "You are a mountain. The clouds pass, but you remain.", "In the silence, the truth speaks.", "The stone does not try to be anything but a stone.", "Ground yourself in the earth beneath your feet.", "Stability is the foundation of freedom.", "Watch the thoughts like birds in the sky; let them fly past.", "Deep roots do not fear the wind.", "Listen to the sound of your own heart.", "Patience is the shortest path.", "The mountain does not seek the sun; it simply receives it.", "Simplicity is the ultimate sophistication.", "Rest in the sanctuary of the breath.", "You are not the weather; you are the sky.", "To understand everything is to forgive everything.", "Find the temple within the stone.", "Stillness is not the absence of sound, but the presence of self.", "Wisdom is found in the pause.", "The centre of the circle is always still.", "Observe without judgment.", "The earth supports you; let it.", "Silence is a fence around wisdom.", "Your presence is the greatest gift."
];

const RED_PANDA_SUTRAS = [
  "Let your breath lead the way, your smile follow, and your pace honour both.", "Peace is every step.", "The path is the goal.", "Flow with the river, do not fight the current.", "Every moment is a fresh start.", "Tend to your orchard, and the fruit will follow.", "Mindfulness is the energy of being alive.", "Be present in the doing.", "A step taken in peace reaches the heart.", "Lighten your load; carry only what serves the journey.", "Every step on solid ground is its own quiet miracle.", "Hold your cup as you would hold a moment — warmly, and without rushing.", "The only door that opens is the one you are standing at now.", "Each inhale is a gathering. Each exhale, a release.", "The secret of health is to live fully in the now.", "Each step is a realisation.", "Let go of the shore.", "The water is always moving, yet the river remains.", "Action from stillness is the most powerful action.", "Follow the rhythm of your own breath.", "Blossom where you are planted.", "The leaf falls when it is ready; do not rush the season.", "Movement is the song of the soul.", "Be the traveller, not just the map.", "Everything is exactly as it should be."
];

function River() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [morning, setMorning] = useState({ intentions: "", presence: "", firstSteps: "" });
  const [evening, setEvening] = useState("");
  const [prevEditData, setPrevEditData] = useState({});
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [currentSutra, setCurrentSutra] = useState("");
  const [companion, setCompanion] = useState(pika);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const MAX_ENTRIES = 100;

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (activeTab === "new") {
      updateSutraAndCompanion(null, true);
    } else if (activeTab === "previous") {
      if (entries.length > 0) {
        updateSutraAndCompanion(0);
        setPrevEditData(entries[0]);
      } else {
        setPrevEditData({});
      }
    }
    setCurrentPage(1);
  }, [entries, activeTab]);

  const updateSutraAndCompanion = (indexInList, isNew = false) => {
    let position = isNew ? entries.length + 1 : entries.length - indexInList;
    const isRedPanda = position % 2 === 0;
    const sutraIdx = Math.floor((position - 1) / 2) % 25;
    if (isRedPanda) {
      setCurrentSutra(RED_PANDA_SUTRAS[sutraIdx]);
      setCompanion(redpanda);
    } else {
      setCurrentSutra(PIKA_SUTRAS[sutraIdx]);
      setCompanion(pika);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setEntries(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEntryClick = (entry, index) => {
    setPrevEditData(entry);
    updateSutraAndCompanion(index);
    setIsEditingAll(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (entries.length >= MAX_ENTRIES) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("journal_entries").insert([{
        user_id: user.id,
        intentions: morning.intentions,
        presence: morning.presence,
        first_steps: morning.firstSteps,
        evening_reflection: evening
      }]);
      setMorning({ intentions: "", presence: "", firstSteps: "" });
      setEvening("");
      await fetchEntries();
      setActiveTab("all");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, updatedData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("journal_entries")
        .update({
          intentions: updatedData.intentions,
          presence: updatedData.presence,
          first_steps: updatedData.first_steps,
          evening_reflection: updatedData.evening_reflection
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (!error) {
        await fetchEntries();
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteEntry = async (id) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", user.id);
      await fetchEntries();
      setPrevEditData({});
      setIsEditingAll(false);
      setShowConfirm(false);
      if (activeTab === "previous") setActiveTab("new");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);

  const tabs = [
    { id: "new", label: "New", icon: <Plus size={12} /> },
    { id: "previous", label: "Previous", icon: <History size={12} /> },
    { id: "all", label: "All", icon: <Waves size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 pb-20">

      {/* COMPASS STYLE TOAST NOTIFICATION */}
      <AnimatePresence>
        {updateSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-10 right-10 z-[100] bg-white px-4 py-4 rounded-xl flex items-center gap-3  border border-[#36454F]/5"
          >
            <div className=" p-1 rounded-full">
              <CheckCircle2 size={20} className="text-[#22C55E]" strokeWidth={3} />
            </div>
            <span className="text-[11px] uppercase font-sans font-bold tracking-[0.15em] text-[#36454F]">
              Path Updated Successfully
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7 text-center">
        <div className="absolute top-6 md:top-12 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all ">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The River</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-6 mb-4">
        <div className="flex bg-white/40 p-1 rounded-full border border-[#36454F]/5 shadow-inner relative">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowConfirm(false); setIsEditingAll(false); }}
              className={`relative flex-1 flex items-center text-[#36454F] justify-center gap-2 py-3 rounded-full text-[12px] uppercase tracking-[0.2em] font-sans font-bold transition-colors duration-300 z-10 ${activeTab === tab.id ? "text-[#F5F0E8]" : "text-[#36454F] "}`}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#36454F] rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === "new" && (
            <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-white rounded-[25px] p-10 shadow-sm border border-white/50 relative">
                <h2 className="text-2xl font-light italic text-center pb-10">The Morning Current</h2>
                <div className="space-y-10 relative z-10">
                  <div>
                    <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Intentions — What matters most in this moment?</label>
                    <textarea value={morning.intentions} onChange={(e) => setMorning({ ...morning, intentions: e.target.value })} placeholder="Permission to..." className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/5 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white resize-none" />
                  </div>
                  <div>
                    <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Presence — A single word for your attention.</label>
                    <input type="text" maxLength={16} value={morning.presence} onChange={(e) => setMorning({ ...morning, presence: e.target.value })} placeholder="..." className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">First Steps — Actions to move you forward.</label>
                    <textarea value={morning.firstSteps} onChange={(e) => setMorning({ ...morning, firstSteps: e.target.value })} placeholder="Small steps..." className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/5 rounded-xl px-5 py-4 outline-none italic transition-all focus:border-[#EAB308] focus:bg-white resize-none" />
                  </div>
                </div>
                <img src={companion} className="absolute bottom-6 right-6 w-20 opacity-[0.12] grayscale rounded-xl z-0 pointer-events-none" alt="companion" />
              </div>
              <div className="flex-1 bg-white rounded-[2.5rem] p-10 shadow-sm border border-white/50 flex flex-col">
                <h2 className="text-2xl font-light italic text-center pb-10">The Evening Reflection</h2>
                <div className="flex-grow">
                  <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Gratitude & Observations & Closing</label>
                  <textarea value={evening} onChange={(e) => setEvening(e.target.value)} placeholder="How was the flow today?..." className="w-full min-h-[400px] bg-[#F5F0E8]/30 border border-[#36454F]/5 rounded-xl p-6 outline-none italic leading-loose focus:border-[#EAB308] focus:bg-white resize-none" />
                </div>
                <div className="mt-8">
                  {entries.length >= MAX_ENTRIES ? (
                    <div className="w-full bg-[#36454F]/10 text-[#36454F] py-5 mb-4 rounded-xl font-sans flex items-center justify-center gap-3 border border-[#36454F]/20">
                      <Lock size={16} />
                      <span className="tracking-[0.2em] uppercase text-[11px] font-bold">The River has reached its 100-flow limit</span>
                    </div>
                  ) : (
                    <button onClick={handleSave} disabled={loading} className="w-full bg-[#36454F] text-white py-5 mb-4 rounded-xl font-sans flex items-center justify-center gap-3 tracking-[0.4em] uppercase text-[12px] font-bold shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                      {loading ? <Loader2 size={16} className="animate-spin" /> : "Record Journey"}
                    </button>
                  )}
                  <p className="text-[18px] italic leading-relaxed opacity-80">"{currentSutra}"</p>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "previous" || (activeTab === "all" && isEditingAll)) && (
            <motion.div key="edit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto">
              {Object.keys(prevEditData).length === 0 ? (
                <div className="text-center py-32 italic ">
                  <p className="mb-6 text-xl">No previous path found. Start a new journey.</p>
                  <button onClick={() => setActiveTab("new")} className="text-[12px] border-b border-[#36454F]/20 pb-1 uppercase font-sans font-bold hover:border-[#36454F] transition-all tracking-[0.2em]">
                    Map a new journey
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-5 px-2">
                    {activeTab === "all" && <button onClick={() => setIsEditingAll(false)} className="text-[12px] uppercase font-bold font-sans tracking-widest">‹ Back to List</button>}
                    <div className="ml-auto flex gap-1.5 bg-white/40 p-1.5 rounded-full border border-[#36454F]/5 shadow-sm">
                      {!showConfirm ? <button onClick={() => setShowConfirm(true)} className="p-1 text-[#36454F] hover:text-red-500"><Trash2 size={18} /></button> :
                        <div className="flex items-center gap-1"><button onClick={() => deleteEntry(prevEditData.id)} className="p-2 bg-red-500 text-white rounded-full"><CheckCircle2 size={16} /></button><button onClick={() => setShowConfirm(false)} className="p-2 text-[#36454F]/60"><X size={16} /></button></div>}
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-8 justify-center">
                    <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 relative">
                      <h3 className="text-3xl italic text-center pb-10">The Morning Current</h3>
                      <div className="space-y-12 relative z-10">
                        <div>
                          <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Intentions — What matters most in this moment?</label>
                          <textarea value={prevEditData.intentions || ""} onChange={(e) => setPrevEditData({ ...prevEditData, intentions: e.target.value })} className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white resize-none" />
                        </div>
                        <div>
                          <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Presence — A single word for your attention.</label>
                          <input type="text" maxLength={16} value={prevEditData.presence || ""} onChange={(e) => setPrevEditData({ ...prevEditData, presence: e.target.value })} className="w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white" />
                        </div>
                        <div>
                          <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">First Steps — Actions to move you forward.</label>
                          <textarea value={prevEditData.first_steps || ""} onChange={(e) => setPrevEditData({ ...prevEditData, first_steps: e.target.value })} className="w-full h-[125px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-5 py-4 outline-none italic focus:border-[#EAB308] focus:bg-white resize-none" />
                        </div>
                      </div>
                      <img src={companion} className="absolute bottom-4 right-6 w-20 opacity-[0.12] grayscale rounded-xl z-0 pointer-events-none" alt="companion" />
                    </div>
                    <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col">
                      <h3 className="text-3xl italic text-center pb-10">The Evening Reflection</h3>
                      <label className="text-[13px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 ml-1 leading-relaxed">Gratitude & Observations</label>
                      <textarea value={prevEditData.evening_reflection || ""} onChange={(e) => setPrevEditData({ ...prevEditData, evening_reflection: e.target.value })} className="w-full min-h-[400px] bg-[#F5F0E8]/30 border border-[#36454F]/5 rounded-xl p-6 outline-none italic leading-loose focus:border-[#EAB308] focus:bg-white resize-none flex-grow" />
                      <div className="mt-12">
                        <button onClick={() => handleUpdate(prevEditData.id, prevEditData)} className="w-full bg-[#36454F] text-white py-6 rounded-2xl font-sans uppercase tracking-[0.5em] text-[12px] font-bold shadow-2xl active:scale-95 transition-all hover:bg-black">
                          {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "UPDATE JOURNEY"}
                        </button>
                        <p className="text-[18px] italic opacity-80 mt-8">"{currentSutra}"</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === "all" && !isEditingAll && (
            <motion.div key="all-tab-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="flex flex-col gap-1 mb-8 px-2">
                <span className="text-[16px] uppercase tracking-[0.1em] font-sans font-bold text-[#36454F]">Captured</span>
                <div className="flex items-baseline">
                  <span className="text-2xl italic font-light text-[#36454F]">{entries.length}</span>
                  <span className="text-2xl italic font-light mx-2 opacity-20">/</span>
                  <span className="text-2xl italic font-light text-[#36454F] opacity-40">{MAX_ENTRIES}</span>
                </div>
              </div>
              <div className="space-y-3">
                {currentEntries.map((entry, index) => {
                  const globalIndex = indexOfFirstItem + index;
                  return (
                    <div key={entry.id} onClick={() => handleEntryClick(entry, globalIndex)} className="group bg-white/40 px-6 py-5 rounded-2xl border border-[#36454F]/5 flex items-center gap-6 cursor-pointer hover:bg-white/60 transition-all">
                      <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl flex flex-col items-center justify-center group-hover:bg-[#36454F] group-hover:text-white transition-colors">
                        <span className="text-sm italic font-sans font-bold">{new Date(entry.created_at).getDate()}</span>
                        <span className="text-[10px] uppercase font-bold opacity-40 font-sans">{new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[16px] italic text-[#36454F]">{entry.presence || `Flow of ${new Date(entry.created_at).toLocaleDateString()}`}</h3>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-[#36454F]/10 group-hover:bg-[#EAB308] transition-colors" />
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`h-2 rounded-full transition-all duration-500 ${currentPage === i + 1 ? "bg-[#36454F] w-8" : "bg-[#36454F]/20 w-2 hover:bg-[#36454F]/40"}`} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default River;