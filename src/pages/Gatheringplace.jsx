import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Trash2, Link as LinkIcon, Loader2, Plus, X, Maximize2, ChevronDown, ChevronUp, CheckCircle2, MoreHorizontal, FileText, Camera, Link as LucideLink } from "lucide-react";
import "../index.css";
import { motion, AnimatePresence } from "framer-motion";


const ExpandableNote = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <p className={`text-[16px] italic text-[#36454F] leading-relaxed break-words whitespace-pre-wrap transition-all duration-500 ease-in-out ${isExpanded ? "line-clamp-none" : "line-clamp-2"}`}>
        {content}
      </p>
      {content.length > 80 && (
        <div className="flex justify-end mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1 text-[11px] font-sans uppercase tracking-[0.2em] font-bold text-[#36454F] hover:text-[#36454F] transition-all py-1"
          >
            {isExpanded ? (
              <>Read Less <ChevronUp size={12} /></>
            ) : (
              <>Read More <ChevronDown size={12} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

function GatheringPlace() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("note");
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("gathering_items")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error) setItems(data);
      }
    } finally {
      setTimeout(() => setPageLoading(false), 800);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setInputText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setDeleteConfirmId(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addItem = async () => {
    if (activeTab === "photo" && !selectedFile) return;
    if (activeTab !== "photo" && !inputText.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let finalContent = inputText;
      if (activeTab === "photo" && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("scrapbook_photos")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from("scrapbook_photos")
          .getPublicUrl(fileName);
        finalContent = publicUrl;
      }

      const { error: dbError } = await supabase
        .from("gathering_items")
        .insert([{ user_id: user.id, content: finalContent, type: activeTab }]);

      if (dbError) throw dbError;
      setInputText("");
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchItems();
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("gathering_items").delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (pageLoading) return (
    <div className="fixed inset-0 bg-[#F5F0E8] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#36454F] opacity-20" size={40} />
    </div>
  );

  const filteredItems = items.filter(item => item.type === activeTab);
  const paginatedItems = filteredItems.slice(0, visibleCount);

  const tabs = [
    { id: "note", label: "Note", icon: <FileText size={12} /> },
    { id: "link", label: "Link", icon: <LucideLink size={12} /> },
    { id: "photo", label: "Photo", icon: <Camera size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-24">

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform duration-300">
            <X size={32} />
          </button>
          <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" alt="Enlarged" />
        </div>
      )}

      {/* HEADER */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center ">
        <div className="absolute top-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The Gathering Place</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">

        {/* TABS - EXACT COMPASS STYLE */}
        {/* TABS - NOW COMPACT & CENTERED LIKE COMPASS */}
        <div className="flex justify-center mb-2 px-6">
          <div className="flex bg-white/40 p-1 rounded-full border border-[#36454F]/5 shadow-inner relative w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[12px] uppercase tracking-[0.2em] font-sans font-bold transition-colors duration-300 z-10 ${activeTab === tab.id ? "text-[#F5F0E8]" : "text-[#36454F]"
                  }`}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabGathering"
                    className="absolute inset-0 bg-[#36454F] rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT AREA */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2rem] shadow-xl border border-[#36454F]/5 p-6 mb-10 max-w-xl mx-auto"
          >
            {activeTab === "photo" ? (
              <div className="space-y-8">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group cursor-pointer relative w-full h-[130px] bg-[#F5F0E8]/30 border-2 border-dashed border-[#36454F]/10 rounded-[1.5rem] flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-[#F5F0E8]/50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Plus size={20} className="text-[#36454F]/40" />
                      </div>
                      <p className="italic text-lg text-[#36454F] text-center">A photo worth keeping </p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                <button
                  onClick={addItem}
                  disabled={loading || !selectedFile}
                  className="w-full py-5 rounded-2xl font-sans font-bold uppercase tracking-[0.4em] text-[12px] bg-[#36454F] text-white transition-all hover:bg-black disabled:opacity-20 flex items-center justify-center shadow-lg"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Save"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeTab === "note" ? "A note worth keeping." : "Paste a link worth keeping."}
                  className="w-full bg-transparent outline-none italic text-xl resize-none h-[120px] leading-relaxed placeholder:text-[#36454F] river-scroll shadow-none border-none"
                />
                <button
                  onClick={addItem}
                  disabled={loading || !inputText.trim()}
                  className="w-full py-5 rounded-2xl font-sans font-bold uppercase tracking-[0.4em] text-[12px] bg-[#36454F] text-white transition-all hover:bg-black disabled:opacity-20 flex items-center justify-center shadow-lg"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : `Save `}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* FEED SECTION */}
        <div className={`transition-all duration-700 ${activeTab === "photo" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-8"}`}>
          {paginatedItems.map((item) => (
            item.type === "photo" ? (
              <motion.div layout key={item.id} className="group relative aspect-square bg-white rounded-[1.5rem] border border-[#36454F]/5 shadow-sm overflow-hidden cursor-zoom-in">
                <img src={item.content} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Memory" onClick={() => setSelectedImage(item.content)} />
                <div className="absolute top-2 right-2">
                  {deleteConfirmId === item.id ? (
                    <div className="flex gap-1 bg-white p-1 rounded-full shadow-lg border border-[#36454F]/10">
                      <button onClick={() => removeItem(item.id)} className="p-1.5 bg-red-500 text-white rounded-full"><CheckCircle2 size={14} /></button>
                      <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 text-[#36454F]/40"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(item.id)} className="w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-red-300 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div layout key={item.id} className="bg-white rounded-[2rem] border border-[#36454F]/5 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-[#F5F0E8]/30 px-8 py-4 border-b border-[#36454F]/5 flex justify-between items-center text-[14px] uppercase tracking-[0.1em] font-sans font-bold">
                  {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  <div className="flex items-center">
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-md border border-[#36454F]/5">
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-all"><CheckCircle2 size={12} /></button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 text-[#36454F]"><X size={12} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(item.id)} className="p-2 text-red-200 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  {item.type === "link" ? (
                    <a href={item.content} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg italic text-[#36454F] hover:underline decoration-[#36454F]/20">
                      <LucideLink size={16} className="shrink-0 opacity-30" />
                      <span className="truncate">{item.content}</span>
                    </a>
                  ) : (
                    <ExpandableNote content={item.content} />
                  )}
                </div>
              </motion.div>
            )
          ))}
        </div>

        {/* LOAD MORE */}
        {filteredItems.length > visibleCount && (
          <div className="mt-16 flex justify-center">
            <button onClick={() => setVisibleCount(prev => prev + 5)} className="flex flex-col items-center gap-3 group">
              <div className="p-4 bg-white rounded-full shadow-md border border-[#36454F]/5 group-hover:scale-110 transition-transform">
                <MoreHorizontal size={24} className="opacity-20" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold ">Load More</span>
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .river-scroll::-webkit-scrollbar { width: 3px; }
        .river-scroll::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default GatheringPlace;