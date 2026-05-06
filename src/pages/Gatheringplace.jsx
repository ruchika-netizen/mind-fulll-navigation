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
      {/* HEADER SECTION */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center">
        <div className="absolute top-6 md:top-12 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
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
        <div className="bg-white rounded-[2rem] shadow-xl shadow-[#36454F]/5 border border-[#36454F]/5 overflow-hidden mb-12 max-w-lg mx-auto transition-all">
          <div className="flex bg-[#F5F0E8]/50 p-1.5 border-b border-[#36454F]/5">
            {["note", "link", "photo"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setInputText(""); }}
                className={`flex-1 py-2 text-[10px] uppercase tracking-[0.2em] font-sans font-bold rounded-xl transition-all ${activeTab === tab ? "bg-[#36454F] text-white shadow-md" : "opacity-30 hover:opacity-100"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-[12px] uppercase tracking-[0.3em] font-sans font-bold mb-4 ">
              {/* {activeTab === "note" && ""}
              {activeTab === "link" && ""} */}
              {activeTab === "photo" && "Upload"}
            </h2>

            {activeTab === "photo" ? (
              <div className="flex flex-col items-center py-2">
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center border border-[#36454F]/10 group-hover:bg-[#36454F] group-hover:text-white transition-all transform group-active:scale-95">
                    {uploadingPhoto ? <Loader2 size={20} className="animate-spin" /> : <Plus size={22} />}
                  </div>
                  {/* <span className="text-[13px] uppercase tracking-widest font-bold font-sans ">Select Image</span> */}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write here...`}
                  className="w-full bg-transparent outline-none italic text-xl resize-none h-[80px] text-black leading-snug"
                />
                <button
                  onClick={addItem}
                  disabled={loading || !inputText.trim()}
                  className={`w-full py-4 rounded-xl text-[9px] uppercase tracking-[0.4em] font-bold font-sans transition-all transform active:scale-95 flex justify-center items-center gap-2 ${inputText.trim() ? "bg-[#36454F] text-white shadow-lg" : "bg-[#36454F]/5 text-[#36454F]/20 cursor-not-allowed"}`}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : `Save Entry`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC LISTING: Photos (Grid) vs Notes/Links (River List) */}

        <div className={activeTab === "photo" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-3"}>
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 opacity-20 italic">No entries yet.</div>
          ) : (
            filteredItems.map((item) => (
              item.type === "photo" ? (
                /* PHOTO GRID STYLE - DATE ALWAYS VISIBLE */
                <div key={item.id} className="group relative aspect-square bg-white rounded-3xl overflow-hidden border border-[#36454F]/5 shadow-sm hover:shadow-xl transition-all duration-500">
                  <img src={item.content} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Memory" />

                  {/* Always Visible Date Badge (Bottom Left) */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                    <span className="text-[9px] uppercase tracking-[0.1em] font-sans font-bold text-white">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  {/* Delete Button (Sirf ye hover par dikhega taaki look clean rahe) */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                /* NOTE & LINK RIVER STYLE (Same as before) */
                <div key={item.id} className="group relative bg-white/60 rounded-[22px] p-4 shadow-sm border border-white/50 hover:shadow-md transition-all duration-500 flex items-center gap-5">
                  <div className="flex flex-col items-center justify-center min-w-[52px] h-12 bg-[#F5F0E8] rounded-xl border border-[#36454F]/5 group-hover:bg-[#36454F] group-hover:text-white transition-all duration-500">
                    <span className="text-[10px] font-bold font-sans">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit' })}
                    </span>
                    <span className="text-[7px] uppercase font-bold font-sans opacity-40 group-hover:opacity-80">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    {item.type === "link" ? (
                      <a href={item.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm italic text-[#36454F] hover:underline transition-colors truncate">
                        <LinkIcon size={12} className="shrink-0 opacity-40" />
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-[15px] italic text-[#36454F] group-hover:text-black transition-colors leading-tight">
                        {item.content}
                      </p>
                    )}
                  </div>

                  <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-all p-2 text-red-400 hover:text-red-600">
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