import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import redpandaImg from "../assets/redanada fruits1.png";
import redpandasImg from "../assets/pexels-flickr-148182.jpg";
import { Loader2, Plus, History, Waves, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Orchard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("previous");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form States (New Entry)
  const [pruning, setPruning] = useState(["", "", ""]);
  const [harvest, setHarvest] = useState("");

  // Edit/Previous States
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

  // SYNC LOGIC: Database ke alag columns ko wapas array mein map karna display ke liye
  useEffect(() => {
    if (activeTab === "previous" && entries.length > 0) {
      const latest = entries[0];
      setPrevEditData({
        ...latest,
        pruning: [
          latest.letting_go || "",
          latest.nurturing || "",
          latest.reaching_toward || ""
        ]
      });
    }
  }, [entries, activeTab]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orchard_data")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // SAVE: Alag-alag columns mein data bhej rahe hain
  const handleSave = async () => {
    if (entries.length >= 25) {
      showToast("Orchard is full (25/25).", "error");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("orchard_data").insert([{
        user_id: user.id,
        harvest: harvest,
        letting_go: pruning[0],
        nurturing: pruning[1],
        reaching_toward: pruning[2]
      }]);

      if (error) throw error;

      setHarvest("");
      setPruning(["", "", ""]);
      await fetchEntries();
      setActiveTab("all");
      showToast("Harvest Recorded", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE: Edit karte waqt array se nikal kar columns mein update karna
  const handleUpdate = async (id, updatedData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("orchard_data")
        .update({
          harvest: updatedData.harvest,
          letting_go: updatedData.pruning[0],
          nurturing: updatedData.pruning[1],
          reaching_toward: updatedData.pruning[2]
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      await fetchEntries();
      setIsEditingAll(false);
      showToast("Updated Successfully", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await supabase.from("orchard_data").delete().eq("id", id);
      await fetchEntries();
      setIsEditingAll(false);
      setShowConfirm(false);
      if (entries.length <= 1) setActiveTab("new");
      showToast("Entry Deleted", "success");
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { id: "previous", label: "Previous", icon: <History size={12} /> },
    { id: "new", label: "New", icon: <Plus size={12} /> },
    { id: "all", label: "All", icon: <Waves size={12} /> },
  ];

  const pruningLabels = ["What I am letting go", "What I am nurturing", "What I am reaching toward"];

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] pb-20 selection:bg-[#36454F]/10">

      {/* Toast */}
      <div className={`fixed top-10 right-10 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] text-white"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-7 text-center">
        <div className="absolute top-6 md:top-12 left-0 ">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic text-[#36454F]">The Orchard</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-md mx-auto px-6 mb-12">
        <div className="flex bg-white/40 p-1 rounded-full border border-[#36454F]/5 shadow-inner relative">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsEditingAll(false); setShowConfirm(false); }}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[12px] uppercase tracking-[0.2em] font-sans font-bold transition-colors duration-300 z-10 ${activeTab === tab.id ? "text-[#F5F0E8]" : "text-[#36454F]"}`}>
              {tab.icon} {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTabOrchard" className="absolute inset-0 bg-[#36454F] rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-[#36454F] opacity-20" size={40} />
              <p className="mt-4 text-[11px] uppercase tracking-[0.3em] font-sans font-bold opacity-30 italic">Loading...</p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(activeTab === "new" || activeTab === "previous" || isEditingAll) && (
                <div className="relative">

                  {/* Delete UI */}
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

                  {/* Empty State */}
                  {activeTab === "previous" && entries.length === 0 ? (
                    <div className="text-center py-32 italic opacity-40">
                      <p className="mb-6 text-xl">The orchard is quiet. No previous harvests found.</p>
                      <button onClick={() => setActiveTab("new")} className="text-[12px] border-b border-[#36454F]/20 pb-1 uppercase font-sans font-bold hover:border-[#36454F] transition-all tracking-[0.2em]">
                        Plant something new
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">

                      {/* LEFT CARD: SEASONAL PRUNING */}
                      <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col transition-all hover:shadow-md">
                        <div className="mb-8 text-center">
                          <h2 className="text-2xl font-light italic text-[#36454F]">Seasonal Pruning</h2>
                          <p className="text-[14px] uppercase tracking-[0.3em] font-bold opacity-80 mt-2 font-sans">Tending to your growth</p>
                        </div>
                        <div className="w-full h-78 mb-6 rounded-[2rem] overflow-hidden border border-[#36454F]/5 shadow-inner">
                          <img src={redpandaImg} alt="Red Panda" className="w-full h-full object-cover grayscale-[20%] opacity-90" />
                        </div>
                        <div className="space-y-6">
                          {pruningLabels.map((label, i) => (
                            <div key={i}>
                              <label className="text-[13px] uppercase tracking-[0.2em] block mb-2 font-sans font-bold opacity-80">{label}</label>
                              <textarea
                                value={activeTab === "new" ? pruning[i] : (prevEditData.pruning ? prevEditData.pruning[i] : "")}
                                onChange={(e) => {
                                  if (activeTab === "new") {
                                    const newP = [...pruning]; newP[i] = e.target.value; setPruning(newP);
                                  } else {
                                    const newP = [...prevEditData.pruning]; newP[i] = e.target.value; setPrevEditData({ ...prevEditData, pruning: newP });
                                  }
                                }}
                                placeholder="..."
                                className="w-full h-[85px] bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-xl px-4 py-3 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RIGHT CARD: THE HARVEST */}
                      <div className="flex-1 max-w-[550px] bg-white rounded-[25px] p-10 shadow-sm border border-white/50 flex flex-col transition-all hover:shadow-md">
                        <div className="text-center">
                          <h2 className="text-2xl font-light italic text-[#36454F] mb-10 ">The Harvest</h2>
                          <p className="text-[14px] uppercase tracking-[0.3em] font-bold opacity-80 mt-2 font-sans italic mb-3">“What has grown this season”</p>
                        </div>
                        <div className="flex-grow flex flex-col">
                          <textarea
                            value={activeTab === "new" ? harvest : prevEditData.harvest || ""}
                            onChange={(e) => activeTab === "new" ? setHarvest(e.target.value) : setPrevEditData({ ...prevEditData, harvest: e.target.value })}
                            placeholder="Record what you are gathering..."
                            className="w-full flex-grow bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 resize-none river-scroll shadow-inner min-h-[300px]"
                          />
                        </div>
                        <div className="mt-8">
                          <button
                            onClick={activeTab === "new" ? handleSave : () => handleUpdate(prevEditData.id, prevEditData)}
                            disabled={loading}
                            className="w-full bg-[#36454F] text-white py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all tracking-[0.4em] font-sans uppercase text-[12px] font-bold shadow-lg active:scale-95 disabled:opacity-50"
                          >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : activeTab === "new" ? "SAVE NEW ENTRY" : "UPDATE ENTRY"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ALL LIST VIEW */}
              {activeTab === "all" && !isEditingAll && (
                <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
                  <div className="flex flex-col gap-1 mb-10 px-2">
                    <span className="text-[16px] uppercase tracking-[0.1em] font-sans font-bold">Captured</span>
                    <div className="flex items-baseline"><span className="text-2xl italic font-bold">{entries.length}</span><span className="text-2xl italic font-light mx-2 ">/</span><span className="text-2xl italic font-light opacity-40">25</span></div>
                  </div>
                  <div className="space-y-3">
                    {currentEntries.map((entry) => (
                      <div key={entry.id}
                        onClick={() => {
                          setPrevEditData({
                            ...entry,
                            pruning: [entry.letting_go || "", entry.nurturing || "", entry.reaching_toward || ""]
                          });
                          setIsEditingAll(true);
                        }}
                        className="group bg-white/40 px-6 py-5 rounded-2xl border border-[#36454F]/5 flex items-center gap-6 cursor-pointer hover:bg-white hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl flex flex-col items-center justify-center group-hover:bg-[#36454F] group-hover:text-white transition-all">
                          <span className="text-sm font-sans font-bold">{new Date(entry.created_at).getDate()}</span>
                          <span className="text-[10px] font-sans uppercase font-bold opacity-40">{new Date(entry.created_at).toLocaleDateString('en-GB', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1 truncate">
                          <h3 className="text-[17px] italic truncate">{entry.harvest || "A seasonal gathering..."}</h3>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#36454F]/10 group-hover:bg-[#EAB308] transition-colors" />
                      </div>
                    ))}
                  </div>
                  {/* Pagination logic remains the same */}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Orchard;