import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Trash2, Link as LinkIcon, Loader2, Plus } from "lucide-react";

function GatheringPlace() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("note");
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Tab transition state for smooth fade
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      setTimeout(() => setPageLoading(false), 800); // Thoda slow load for zen feel
    }
  };

  // Smooth Tab Switcher
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true); // Start fade out
    setTimeout(() => {
      setActiveTab(tab);
      setInputText("");
      setIsTransitioning(false); // Start fade in
    }, 300); // 0.3s delay for smooth cross-fade
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('scrapbook_photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('scrapbook_photos').getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("gathering_items")
        .insert([{ user_id: user.id, content: publicUrl, type: "photo" }]);

      if (!dbError) fetchItems();
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addItem = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("gathering_items")
        .insert([{ user_id: user.id, content: inputText, type: activeTab }]);

      if (!error) {
        setInputText("");
        fetchItems();
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    const { error } = await supabase.from("gathering_items").delete().eq("id", id);
    if (!error) fetchItems();
  };

  if (pageLoading) return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center animate-pulse"><Loader2 className="animate-spin text-[#36454F] opacity-20" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20 animate-in fade-in duration-1000">

      {/* HEADER SECTION */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center px-6">
        <div className="absolute top-10 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all duration-500">
            <span className="text-lg leading-none group-hover:-translate-x-2 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The Gathering Place</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">

        {/* SLEEK INPUT BOX */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-[#36454F]/5 border border-[#36454F]/5 mb-12 max-w-lg mx-auto transition-all duration-700 hover:shadow-2xl hover:shadow-[#36454F]/10">

          {/* TABS - SLOW TRANSITION */}
          <div className="flex bg-[#F5F0E8]/50 p-1.5 border-b border-[#36454F]/5">
            {["note", "link", "photo"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2.5 text-[13px] uppercase tracking-[0.2em] font-sans font-bold rounded-xl transition-all duration-500 ease-in-out ${activeTab === tab ? "bg-[#36454F] text-white shadow-lg scale-[1.02]" : " hover:bg-[#36454F]/5"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* INPUT CONTENT - FADE ANIMATION */}
          <div className={`p-8 transition-all duration-500 ease-in-out ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            {activeTab === "photo" ? (
              <div className="flex flex-col items-center py-4">
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center border border-[#36454F]/10 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-700 transform group-active:scale-95 shadow-inner">
                    {uploadingPhoto ? <Loader2 size={22} className="animate-spin" /> : <Plus size={24} className="group-hover:rotate-90 transition-transform duration-600" />}
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.3em] font-bold font-sans text-[#36454F] opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    {uploadingPhoto ? "Uploading..." : "Select Image"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Capture a ${activeTab}...`}
                  className="w-full bg-transparent outline-none italic text-xl resize-none h-[100px] text-black leading-snug  transition-all duration-500 "
                />
                <button
                  onClick={addItem}
                  disabled={loading || !inputText.trim()}
                  className={`w-full py-4 rounded-xl text-[12px] uppercase tracking-[0.4em] font-bold font-sans transition-all duration-700 transform active:scale-95 flex justify-center items-center gap-2 ${inputText.trim() ? "bg-[#36454F] text-white shadow-lg hover:shadow-[#36454F]/20" : "bg-[#36454F]/5 text-[#36454F]/20 cursor-not-allowed"}`}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : `Save to Gathering`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LISTING SECTION - STAGGERED FADE */}
        <div className={`transition-all duration-700 ${isTransitioning ? "opacity-30 blur-[2px]" : "opacity-100 blur-0"} ${activeTab === "photo" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-4"}`}>
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-20 italic font-light tracking-widest">No {activeTab}s gathered yet.</div>
          ) : (
            filteredItems.map((item) => (
              item.type === "photo" ? (
                <div key={item.id} className="group relative aspect-square bg-white rounded-3xl border border-[#36454F]/5 shadow-sm hover:shadow-2xl transition-all duration-700 ease-out">
                  <img src={item.content} className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110" alt="Memory" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[9px] uppercase tracking-[0.1em] font-sans font-bold text-white">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-md hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div key={item.id} className="group relative bg-white/40 hover:bg-white rounded-[22px] p-5 shadow-sm border border-[#36454F]/5 hover:shadow-xl hover:shadow-[#36454F]/5 transition-all duration-700 flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center min-w-[56px] h-14 bg-[#F5F0E8] rounded-xl border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-700 ease-in-out">
                    <span className="text-[13px] font-bold font-sans">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit' })}
                    </span>
                    <span className="text-[12px] uppercase font-bold font-sans opacity-40 group-hover:opacity-80">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    {item.type === "link" ? (
                      <a href={item.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[15px] italic text-[#36454F] hover:text-blue-500 transition-colors duration-500 truncate">
                        <LinkIcon size={12} className="shrink-0 opacity-40" />
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-[16px] italic text-[#36454F] group-hover:text-black transition-colors duration-500 leading-snug">
                        {item.content}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-all duration-500 p-2 text-[#36454F]/20 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default GatheringPlace;