import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Trash2, Link as LinkIcon, FileText, Image as ImageIcon, Loader2, ChevronLeft, Plus, ExternalLink } from "lucide-react";

function GatheringPlace() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("note");
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      setTimeout(() => setPageLoading(false), 600);
    }
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

  if (pageLoading) return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center"><Loader2 className="animate-spin text-[#36454F] opacity-20" /></div>;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif pb-20">

      {/* UNIVERSAL RESPONSIVE HEADER */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center">
        {/* Back Button Container */}
        <div className="absolute top-6 md:top-12 left-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The Gathering Place
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">

        {/* COMPACT INPUT BOX */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#36454F]/5 border border-[#36454F]/5 overflow-hidden mb-16 max-w-lg mx-auto transition-all">
          <div className="flex bg-[#36454F]/5 p-1.5">
            {["note", "link", "photo"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setInputText(""); }}
                className={`flex-1 py-2 text-[12px] uppercase tracking-widest font-sans font-bold rounded-2xl transition-all ${activeTab === tab ? "bg-[#36454F] text-white shadow-md" : "opacity-30 hover:opacity-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "photo" ? (
              <div className="flex flex-col items-center">
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all transform group-active:scale-90">
                    {uploadingPhoto ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  </div>
                  <span className="text-[12px] uppercase tracking-widest font-bold ">Add {activeTab}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Enter your ${activeTab}...`}
                  className="w-full bg-transparent outline-none italic text-lg text-center resize-none h-[40px] text-[#000]  leading-relaxed"
                />
                {inputText.trim() && (
                  <button onClick={addItem} disabled={loading} className="px-10 py-3 bg-[#36454F] text-white rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-lg transform active:scale-95 transition-all">
                    {loading ? "..." : "Save Entry"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FEED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl border border-[#36454F]/5 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-[#36454F]/5 transition-all duration-500">
              <div className="relative w-full aspect-square bg-[#FDFCFB] overflow-hidden flex items-center justify-center">
                {item.type === "photo" ? (
                  <img src={item.content} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Gathering" />
                ) : item.type === "link" ? (
                  <div className="p-8 text-center flex flex-col items-center gap-4">
                    <LinkIcon size={20} className="opacity-10" />
                    <a href={item.content} target="_blank" rel="noreferrer" className="text-sm italic hover:underline break-all leading-snug px-2">
                      {item.content}
                    </a>
                  </div>
                ) : (
                  <div className="p-10">
                    <p className="text-xl italic text-center leading-relaxed">“{item.content}”</p>
                  </div>
                )}

                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="p-4 bg-white border-t border-[#36454F]/5 text-center">
                <span className="text-[12px] uppercase tracking-widest font-bold opacity-20">
                  {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default GatheringPlace;