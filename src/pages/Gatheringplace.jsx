import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Trash2, Link as LinkIcon, Loader2, Plus, X, Maximize2, ChevronDown, ChevronUp, CheckCircle2, MoreHorizontal } from "lucide-react";
import "../index.css";

// --- CUSTOM NOTE COMPONENT ---
const ExpandableNote = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <p className={`text-[16px] italic text-[#36454F] leading-relaxed whitespace-pre-wrap transition-all duration-500 ${!isExpanded ? "line-clamp-2" : ""}`}>
        {content}
      </p>
      {content.length > 80 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#36454F]/40 hover:text-[#36454F] transition-colors"
        >
          {isExpanded ? (
            <>Read Less <ChevronUp size={12} /></>
          ) : (
            <>Read More <ChevronDown size={12} /></>
          )}
        </button>
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // PAGINATION & DELETE CONFIRMATION
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

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setInputText("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setVisibleCount(5);
      setDeleteConfirmId(null);
      setIsTransitioning(false);
    }, 300);
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
      const { error } = await supabase
        .from("gathering_items")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
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

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20 animate-in fade-in duration-1000">

      {/* IMAGE MODAL POPUP */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform duration-300">
            <X size={32} />
          </button>
          <img src={selectedImage} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-in zoom-in duration-300" alt="Enlarged" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center px-6">
        <div className="absolute top-10 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group">
            <span className="text-lg leading-none group-hover:-translate-x-2 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The Gathering Place</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        {/* INPUT BOX */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-[#36454F]/5 mb-12 max-w-lg mx-auto overflow-hidden">
          <div className="flex bg-[#F5F0E8] p-1.5 border-b border-[#36454F]/5">
            {["note", "link", "photo"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2.5 text-[13px] uppercase tracking-[0.2em] font-sans font-bold rounded-xl transition-all ${activeTab === tab ? "bg-[#36454F] text-white shadow-lg" : "hover:bg-[#36454F]/5"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`p-8 transition-all duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
            {activeTab === "photo" ? (
              <div className="space-y-6">
                <div onClick={() => fileInputRef.current.click()} className="group cursor-pointer relative w-full h-[180px] bg-[#F5F0E8]/30 border-2 border-dashed border-[#36454F]/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Plus size={24} className="opacity-20" />
                      <p className="italic text-xl text-[#36454F]/40">Capture a Memory...</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                <button onClick={addItem} disabled={loading || !selectedFile} className="w-full py-4 rounded-xl font-sans font-bold uppercase tracking-[0.4em] text-[12px] bg-[#36454F] text-white flex items-center justify-center gap-3">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Save to Gathering"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Capture a ${activeTab}...`}
                  className="w-full bg-transparent outline-none italic text-xl resize-none h-[100px] leading-snug"
                />
                <button onClick={addItem} disabled={loading || !inputText.trim()} className="w-full py-4 rounded-xl font-sans font-bold uppercase tracking-[0.4em] text-[12px] bg-[#36454F] text-white flex items-center justify-center gap-3">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : `Save to Gathering`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LISTING SECTION */}
        <div className={`transition-all duration-700 ${activeTab === "photo" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-6"}`}>
          {paginatedItems.map((item) => (
            item.type === "photo" ? (
              <div key={item.id} className="group relative aspect-square bg-white rounded-2xl border border-[#36454F]/5 shadow-sm overflow-hidden cursor-zoom-in">
                <img src={item.content} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Memory" onClick={() => setSelectedImage(item.content)} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><Maximize2 className="text-white" size={20} /></div>

                {/* --- PHOTO DELETE (COMPASS STYLE) --- */}
                <div className="absolute top-2 right-2 z-10">
                  {deleteConfirmId === item.id ? (
                    <div className="flex gap-1.5 bg-white p-1 rounded-full shadow-lg animate-in zoom-in duration-200 border border-[#36454F]/5">
                      <button onClick={() => removeItem(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 active:scale-90 transition-transform">
                        <CheckCircle2 size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(null)} className="p-2 text-[#36454F]/40 hover:text-[#36454F] transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(item.id)} className="w-9 h-9 flex items-center justify-center bg-white/90 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div key={item.id} className="bg-white rounded-[2rem] border border-[#36454F]/5 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="bg-[#F5F0E8]/50 px-6 py-3 border-b border-[#36454F]/5 flex justify-between items-center text-[10px] uppercase tracking-widest font-sans font-bold ">
                  {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}

                  {/* --- NOTE/LINK DELETE (COMPASS STYLE) --- */}
                  <div className="flex items-center">
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-md border border-[#36454F]/5 animate-in slide-in-from-right-2 duration-300">
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all">
                          <CheckCircle2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 text-[#36454F] hover:scale-110 transition-all">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(item.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {item.type === "link" ? (
                    <a href={item.content} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[15px] italic text-blue-500 hover:underline"><LinkIcon size={14} className="shrink-0" /><span className="truncate">{item.content}</span></a>
                  ) : (
                    <ExpandableNote content={item.content} />
                  )}
                </div>
              </div>
            )
          ))}
        </div>

        {/* LOAD MORE BUTTON */}
        {filteredItems.length > visibleCount && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className="p-4 bg-white rounded-full shadow-md border border-[#36454F]/5 group-hover:scale-110 transition-transform">
                <MoreHorizontal size={20} className="opacity-40" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold opacity-30 group-hover:opacity-100">
                Show More Items
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default GatheringPlace;