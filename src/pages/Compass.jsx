import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, Plus, History, Waves, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import redds from "../assets/pexels-regan-dsouza-1315522347-30692724.jpg";

function Compass() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("previous");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [northStar, setNorthStar] = useState("");
  const [steps, setSteps] = useState(["", "", ""]);
  const [prevEditData, setPrevEditData] = useState({});
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const northStarRef = useRef(null);
  const stepRefs = useRef([]);

  const autoGrow = (el) => {
    if (el) {
      el.style.height = "auto";
      const newHeight = el.scrollHeight;
      el.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (activeTab === "previous" && entries.length > 0) {
      const latest = entries[0];
      setPrevEditData({
        ...latest,
        steps: [latest.step_1, latest.step_2, latest.step_3]
      });
    }
    setShowConfirm(false);
  }, [entries, activeTab]);

  useEffect(() => {
    if (northStarRef.current) autoGrow(northStarRef.current);
    stepRefs.current.forEach(el => el && autoGrow(el));
  }, [activeTab, isEditingAll, prevEditData, northStar, steps]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("compass_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setEntries(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const deleteEntry = async (id) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compass_goals").delete().eq("id", id).eq("user_id", user.id);
      await fetchEntries();
      setIsEditingAll(false);
      setShowConfirm(false);
      showToast("Entry Deleted", "success");
    } catch (err) { showToast("Delete Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compass_goals").update({
        north_star: updatedData.north_star,
        step_1: updatedData.steps[0],
        step_2: updatedData.steps[1],
        step_3: updatedData.steps[2]
      }).eq("id", id).eq("user_id", user.id);
      await fetchEntries();
      setIsEditingAll(false);
      showToast("Path Updated Successfully", "success");
    } catch (err) { showToast("Update Failed", "error"); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (entries.length >= 25) { showToast("Compass is full.", "error"); return; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compass_goals").insert([{
        user_id: user.id,
        north_star: northStar,
        step_1: steps[0],
        step_2: steps[1],
        step_3: steps[2],
        type: "General",
      }]);
      setNorthStar(""); setSteps(["", "", ""]);
      await fetchEntries();
      setActiveTab("all");
      showToast("Path Recorded", "success");
    } catch (err) { setLoading(false); }
  };

  const labels = ["What I am leaving behind", "What I am carrying forward", "The horizon I am moving toward"];

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] pb-20 selection:bg-[#36454F]/10">

      {/* Toast Notification */}
      <div className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] text-white"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold">{toast.message}</p>
      </div>

      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7 text-center">
        <div className="absolute top-6 md:top-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold italic text-[#36454F]">The Compass</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-md mx-auto px-6 mb-10">
        <div className="flex bg-white/40 p-1 rounded-full border border-[#36454F]/5 shadow-inner relative">
          {[{ id: "previous", label: "Previous", icon: <History size={12} /> }, { id: "new", label: "New", icon: <Plus size={12} /> }, { id: "all", label: "All", icon: <Waves size={12} /> }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditingAll(false); }}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[12px] uppercase tracking-[0.2em] font-sans font-bold transition-colors duration-300 z-10 ${activeTab === tab.id ? "text-[#F5F0E8]" : "text-[#36454F]"}`}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTabCompass" className="absolute inset-0 bg-[#36454F] rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-[#36454F] opacity-20" size={40} />
            </div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {activeTab === "previous" && entries.length === 0 ? (
                <div className="text-center py-32 italic">
                  <p className="mb-6 text-xl">No previous path found. Start a new journey.</p>
                  <button onClick={() => setActiveTab("new")} className="text-[12px] border-b border-[#36454F]/20 pb-1 uppercase font-sans font-bold hover:border-[#36454F] transition-all tracking-[0.2em]">
                    Map a new journey
                  </button>
                </div>
              ) : (
                <>
                  {(activeTab === "new" || activeTab === "previous" || isEditingAll) && (
                    <div className="relative">
                      {(activeTab === "previous" || isEditingAll) && entries.length > 0 && (
                        <div className="absolute -top-12 right-0 z-50">
                          {!showConfirm ? (
                            <button onClick={() => setShowConfirm(true)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-[#36454F]/5 text-[#36454F]/40 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-md border border-[#36454F]/5">
                              <button onClick={() => deleteEntry(prevEditData.id)} className="p-2 bg-red-500 text-white rounded-full transition-transform active:scale-90"><CheckCircle2 size={16} /></button>
                              <button onClick={() => setShowConfirm(false)} className="p-2 text-[#36454F]/40 hover:text-[#36454F] transition-colors"><X size={16} /></button>
                            </div>
                          )}
                        </div>
                      )}

                      {isEditingAll && (
                        <button onClick={() => setIsEditingAll(false)} className="absolute -top-10 left-0 text-[12px] uppercase font-bold font-sans tracking-widest hover:opacity-100 transition-opacity">‹ Back to list</button>
                      )}

                      <div className="flex flex-col md:flex-row gap-8 justify-center">
                        {/* Orientation Card */}
                        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col items-center h-[800px]">
                          <h2 className="text-2xl font-light italic text-center mb-1">Orientation Phase</h2>
                          <p className="text-[14px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 text-center">Finding your direction</p>
                          <div className="mb-10 opacity-[0.15] pointer-events-none">
                            <svg width="140" height="140" viewBox="0 0 100 100" className="stroke-[#36454F] fill-none"><path d="M 85,50 C 85,75 70,88 50,88 C 25,88 12,70 12,50 C 12,25 30,12 55,12 C 70,12 82,22 84,35" strokeWidth="0.8" strokeLinecap="round" /></svg>
                          </div>
                          <div className="w-full flex flex-col overflow-hidden">
                            <label className="text-[14px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 text-center uppercase">Define Your North Star</label>
                            <div className="w-full h-[390px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 shadow-inner transition-all duration-300 focus-within:border-[#EAB308] focus-within:bg-white overflow-hidden flex flex-col">
                              <textarea
                                ref={northStarRef}
                                maxLength={2000}
                                enterKeyHint="done"
                                spellCheck="false"
                                value={activeTab === "new" ? northStar : prevEditData.north_star || ""}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  activeTab === "new" ? setNorthStar(val) : setPrevEditData({ ...prevEditData, north_star: val });
                                  autoGrow(e.target);
                                }}
                                placeholder="What is your new direction?..."
                                className="w-full h-full bg-transparent outline-none italic text-md text-[#36454F] resize-none overflow-y-auto river-scroll leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Journey Mapping Card */}
                        <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col h-[800px]">
                          <h2 className="text-2xl font-light italic text-center mb-1">Journey Mapping</h2>
                          <p className="text-[14px] uppercase tracking-[0.2em] block mb-8 font-sans font-bold opacity-80 text-center">The shape of your journey</p>
                          <div className="space-y-6 flex-grow flex flex-col overflow-y-auto pr-2 river-scroll">
                            {labels.map((label, i) => (
                              <div key={i} className="flex flex-col flex-shrink-0">
                                <label className="text-[13px] uppercase tracking-[0.2em] mb-2 font-sans font-bold opacity-80">{label}</label>
                                <div className="w-full h-auto min-h-[100px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 shadow-inner transition-all duration-300 focus-within:border-[#EAB308] focus-within:bg-white overflow-hidden">
                                  <textarea
                                    ref={(el) => { stepRefs.current[i] = el; if (el) autoGrow(el); }}
                                    value={activeTab === "new" ? steps[i] : (prevEditData.steps ? prevEditData.steps[i] : "")}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      autoGrow(e.target);
                                      if (activeTab === "new") {
                                        const n = [...steps]; n[i] = val; setSteps(n);
                                      } else {
                                        const n = [...prevEditData.steps]; n[i] = val; setPrevEditData({ ...prevEditData, steps: n });
                                      }
                                    }}
                                    enterKeyHint="done"
                                    spellCheck="false"
                                    placeholder="..."
                                    maxLength={2000}
                                    className="w-full bg-transparent outline-none italic text-md text-[#36454F] resize-none overflow-hidden leading-relaxed min-h-[80px]"
                                    style={{ height: 'auto' }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <button onClick={() => activeTab === "new" ? handleSave() : handleUpdate(prevEditData.id, prevEditData)} className="w-full bg-[#36454F] text-white py-4 rounded-xl mt-6 font-sans tracking-[0.4em] uppercase text-[12px] font-bold shadow-lg hover:bg-black transition-all">
                            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : activeTab === "new" ? "Commit to Path" : "Update Path"}
                          </button>

                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-[18px] italic leading-relaxed opacity-80">“Be the traveller, not just the map.”</p>
                            <img src={redds} className="w-12 h-10 object-contain grayscale opacity-30 rounded-full" alt="icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ALL TAB View */}
                  {activeTab === "all" && !isEditingAll && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
                      <div className="flex flex-col gap-1 mb-10 px-2">
                        <span className="text-[16px] uppercase tracking-[0.1em] font-sans font-bold">Captured</span>
                        <div className="flex items-baseline">
                          <span className="text-2xl italic font-bold">{entries.length}</span>
                          <span className="text-2xl italic font-light mx-2">/</span>
                          <span className="text-2xl italic font-light opacity-40">25</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {entries.map((entry) => (
                          <div key={entry.id} onClick={() => { setPrevEditData({ ...entry, steps: [entry.step_1, entry.step_2, entry.step_3] }); setIsEditingAll(true); }} className="group bg-white/40 px-6 py-5 rounded-2xl border border-[#36454F]/5 flex items-center gap-6 cursor-pointer hover:bg-white hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl flex flex-col items-center justify-center group-hover:bg-[#36454F] group-hover:text-white transition-all">
                              <span className="text-sm font-sans font-bold">{new Date(entry.created_at).getDate()}</span>
                              <span className="text-[10px] font-sans uppercase font-bold opacity-40">{new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'short' })}</span>
                            </div>
                            <div className="flex-1 truncate"><h3 className="text-[17px] italic truncate">{entry.north_star || "Journey"}</h3></div>
                            <div className="w-2 h-2 rounded-full bg-[#36454F]/10 group-hover:bg-[#EAB308] transition-colors" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .river-scroll::-webkit-scrollbar { width: 3px; }
        .river-scroll::-webkit-scrollbar-track { background: transparent; }
        .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Compass;