import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [northStar, setNorthStar] = useState("");
  const [steps, setSteps] = useState(["", "", ""]);

  const [prevEditData, setPrevEditData] = useState({});
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);

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
    setCurrentPage(1);
  }, [entries, activeTab]);

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
    } catch (err) {
      console.error(err);
    } finally {
      // Thoda delay taaki transition smooth lage
      setTimeout(() => setLoading(false), 500);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handleSave = async () => {
    if (entries.length >= 25) {
      showToast("Compass is full (25/25).", "error");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("compass_goals").insert([{
        user_id: user.id,
        north_star: northStar,
        step_1: steps[0],
        step_2: steps[1],
        step_3: steps[2],
        type: "General", // Ab NULL nahi aayega

      }]);
      setNorthStar("");
      setSteps(["", "", ""]);
      await fetchEntries();
      setActiveTab("all");
      showToast("Path Recorded", "success");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!id) return; // Safety check
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("compass_goals")
        .update({
          north_star: updatedData.north_star,
          step_1: updatedData.steps[0],
          step_2: updatedData.steps[1],
          step_3: updatedData.steps[2]
        })
        .eq("id", id)
        .eq("user_id", user.id); // Security filter

      if (error) throw error;

      await fetchEntries(); // Naya data fetch karein
      setIsEditingAll(false);
      showToast("Path Updated Successfully", "success");
    } catch (err) {
      console.error("Update Error:", err.message);
      showToast("Update Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser(); // User ID lena zaruri hai

      const { error } = await supabase
        .from("compass_goals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Ye line safety ke liye add karein

      if (error) {
        console.error("Delete Error:", error.message);
        showToast(error.message, "error");
        setLoading(false);
        return;
      }

      await fetchEntries();
      setIsEditingAll(false);
      setShowConfirm(false);

      if (activeTab === "previous") setActiveTab("new");
      showToast("Entry Deleted", "success");

    } catch (err) {
      console.error("Catch Error:", err);
      setLoading(false);
    }
  };

  const tabs = [
    { id: "previous", label: "Previous", icon: <History size={12} /> },
    { id: "new", label: "New", icon: <Plus size={12} /> },
    { id: "all", label: "All", icon: <Waves size={12} /> },
  ];

  const labels = ["What I am leaving behind", "What I am carrying forward", "The horizon I am moving toward"];

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] pb-20 selection:bg-[#36454F]/10">

      {/* Toast */}
      <div className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] text-white"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold">{toast.message}</p>
      </div>

      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7 text-center">
        <div className="absolute top-6 md:top-12 left-0 ">
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
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditingAll(false); setShowConfirm(false); }}
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
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="animate-spin text-[#36454F] opacity-20" size={40} />
              <p className="mt-4 text-[11px] uppercase tracking-[0.3em] font-sans font-bold opacity-30 italic">Loading...</p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(activeTab === "new" || activeTab === "previous" || isEditingAll) && (
                <div className="relative">

                  {(activeTab === "previous" || isEditingAll) && entries.length > 0 && (
                    <div className="absolute -top-12 right-0 z-20">
                      {!showConfirm ? (
                        <button onClick={() => setShowConfirm(true)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-[#36454F]/5 text-[#36454F]/40 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-md border border-[#36454F]/5">
                          <button onClick={() => deleteEntry(prevEditData.id)} className="p-2 bg-red-500 text-white rounded-full transition-transform active:scale-90">
                            <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => setShowConfirm(false)} className="p-2 text-[#36454F]/40 hover:text-[#36454F] transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isEditingAll && (
                    <button onClick={() => setIsEditingAll(false)} className="absolute -top-10 left-0 text-[12px] uppercase font-bold font-sans tracking-widest hover:opacity-100 transition-opacity">
                      ‹ Back to list
                    </button>
                  )}

                  {activeTab === "previous" && entries.length === 0 ? (
                    <div className="text-center py-32 italic ">
                      <p className="mb-6 text-xl">No previous path found. Start a new journey.</p>
                      <button onClick={() => setActiveTab("new")} className="text-[12px] border-b border-[#36454F]/20 pb-1 uppercase font-sans font-bold hover:border-[#36454F] transition-all tracking-[0.2em]">
                        Map a new journey
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8 justify-center">
                      <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col items-center">
                        <h2 className="text-2xl font-light italic text-center mb-1">Orientation Phase</h2>
                        <p className="text-[14px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 text-center">Finding your direction</p>
                        <div className="mb-10 opacity-[0.15] pointer-events-none">
                          <svg width="180" height="180" viewBox="0 0 100 100" className="stroke-[#36454F] fill-none">
                            <path d="M 85,50 C 85,75 70,88 50,88 C 25,88 12,70 12,50 C 12,25 30,12 55,12 C 70,12 82,22 84,35" strokeWidth="0.8" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="w-full">
                          <label className="text-[14px] uppercase tracking-[0.2em] block mb-3 font-sans font-bold opacity-80 text-center">Define Your North Star</label>
                          <textarea
                            value={activeTab === "new" ? northStar : prevEditData.north_star || ""}
                            onChange={(e) => activeTab === "new" ? setNorthStar(e.target.value) : setPrevEditData({ ...prevEditData, north_star: e.target.value })}
                            placeholder="What is your new direction?..."
                            className="w-full h-[250px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col">
                        <h2 className="text-2xl font-light italic text-center mb-1">Journey Mapping</h2>
                        <p className="text-[14px] uppercase tracking-[0.2em] block mb-8 font-sans font-bold opacity-80 text-center">The shape of your journey</p>
                        <div className="space-y-6 flex-grow">
                          {labels.map((label, i) => (
                            <div key={i}>
                              <label className="text-[13px] uppercase tracking-[0.2em] block mb-2 font-sans font-bold opacity-80">{label}</label>
                              <textarea
                                value={activeTab === "new" ? steps[i] : (prevEditData.steps ? prevEditData.steps[i] : "")}
                                onChange={(e) => {
                                  if (activeTab === "new") {
                                    const n = [...steps]; n[i] = e.target.value; setSteps(n);
                                  } else {
                                    const n = [...prevEditData.steps]; n[i] = e.target.value; setPrevEditData({ ...prevEditData, steps: n });
                                  }
                                }}
                                placeholder="..."
                                className="w-full h-[80px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll"
                              />
                            </div>
                          ))}
                        </div>
                        <button onClick={() => activeTab === "new" ? handleSave() : handleUpdate(prevEditData.id, prevEditData)} disabled={loading} className="w-full bg-[#36454F] text-white py-5 mb-4 rounded-xl mt-8 font-sans tracking-[0.4em] uppercase text-[12px] font-bold shadow-lg hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                          {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : activeTab === "new" ? "Commit to Path" : "Update Path"}
                        </button>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-[18px] italic leading-relaxed opacity-80">“Be the traveller, not just the map.”</p>
                          <img src={redds} className="w-12 h-10 object-contain grayscale opacity-30 rounded-full" alt="icon" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === "all" && !isEditingAll && (
                <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
                  <div className="flex flex-col gap-1 mb-10 px-2">
                    <span className="text-[16px] uppercase tracking-[0.1em] font-sans font-bold">Captured</span>
                    <div className="flex items-baseline"><span className="text-2xl italic font-bold font-light">{entries.length}</span><span className="text-2xl italic font-light mx-2 ">/</span><span className="text-2xl italic font-light opacity-40">25</span></div>
                  </div>
                  <div className="space-y-3">
                    {currentEntries.map((entry) => (
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
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`h-2 rounded-full transition-all duration-500 ${currentPage === i + 1 ? "bg-[#36454F] w-10" : "bg-[#36454F]/20 w-2 hover:bg-[#36454F]/40"}`} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .river-scroll::-webkit-scrollbar { width: 3px; }
        .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default Compass;