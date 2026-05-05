import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("add");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    intentions: "",
    presence: "",
    first_steps: "",
    evening_reflection: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/login");
      else setUser(data.user);
    };
    getUser();
  }, [navigate]);


  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("journal_entries").insert([
      {
        user_id: user.id,
        morning_intentions: form.intentions,
        presence_text: form.presence,
        first_steps: form.first_steps,
        evening_reflection: form.evening_reflection,
      },
    ]);

    setLoading(false);
    if (error) return alert(error.message);

    alert("Your thoughts have been saved.");
    setActiveTab("journal");
    fetchEntries();
    setForm({ intentions: "", presence: "", first_steps: "", evening_reflection: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      await supabase.from("journal_entries").delete().eq("id", id);
      fetchEntries();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex font-serif">

      {/* SIDEBAR - Mindful Navigation */}
      <div className="w-64 bg-white border-r border-[#e5e0d8] p-6 hidden md:block">
        <h2 className="text-xl font-medium mb-10 text-[#36454F] tracking-widest uppercase">The Navigator</h2>

        <ul className="space-y-6 text-[#36454F]">
          <li onClick={() => setActiveTab("add")}
            className={`cursor-pointer flex items-center gap-3 transition ${activeTab === "add" ? "font-bold text-black" : "opacity-60 hover:opacity-100"}`}>
            <span>✍️</span> New Entry
          </li>
          <li onClick={() => setActiveTab("journal")}
            className={`cursor-pointer flex items-center gap-3 transition ${activeTab === "journal" ? "font-bold text-black" : "opacity-60 hover:opacity-100"}`}>
            <span>🌊</span> The River (Journal)
          </li>
          <li onClick={() => setActiveTab("milestones")}
            className={`cursor-pointer flex items-center gap-3 transition ${activeTab === "milestones" ? "font-bold text-black" : "opacity-60 hover:opacity-100"}`}>
            <span>🏔️</span> Milestones
          </li>
          <li className="pt-10 opacity-40 hover:opacity-100 cursor-pointer text-sm" onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}>
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">

        {/* ADD NEW ENTRY (The Morning/Evening Form) */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-[#e5e0d8]">
            <h2 className="text-3xl text-[#36454F] mb-2">Morning Current</h2>
            <p className="text-gray-400 italic mb-8">Set your intentions for the day ahead...</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-sans">Intentions</label>
                <textarea
                  name="intentions"
                  placeholder="What is your focus today?"
                  value={form.intentions}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-100 bg-[#faf9f6] rounded-xl focus:ring-1 focus:ring-[#36454F] outline-none h-24 transition"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-sans">Presence</label>
                  <input
                    type="text"
                    name="presence"
                    placeholder="One word for now..."
                    value={form.presence}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-100 bg-[#faf9f6] rounded-xl focus:ring-1 focus:ring-[#36454F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-sans">First Steps</label>
                  <input
                    type="text"
                    name="first_steps"
                    placeholder="Small action to take..."
                    value={form.first_steps}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-100 bg-[#faf9f6] rounded-xl focus:ring-1 focus:ring-[#36454F] outline-none"
                  />
                </div>
              </div>

              <hr className="border-[#F5F0E8] my-4" />

              <div>
                <h2 className="text-2xl text-[#36454F] mb-4">Evening Reflection</h2>
                <textarea
                  name="evening_reflection"
                  placeholder="How did you move through the day?"
                  value={form.evening_reflection}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-100 bg-[#faf9f6] rounded-xl focus:ring-1 focus:ring-[#36454F] outline-none h-32"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#36454F] text-white py-4 rounded-xl hover:opacity-90 transition tracking-widest uppercase text-sm font-sans"
              >
                {loading ? "Saving..." : "Plant this Intention"}
              </button>
            </form>
          </div>
        )}

        {/* THE RIVER (List of past entries) */}
        {activeTab === "journal" && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl text-[#36454F] mb-10">The River</h2>
            <div className="space-y-8">
              {entries.length === 0 && <p className="text-gray-400 italic">The water is still. Start writing to see your journey flow...</p>}
              {entries.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-2xl border border-[#e5e0d8] relative group">
                  <span className="text-xs text-gray-400 uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <div className="mt-4 grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs uppercase text-gray-300 mb-2 font-sans">Morning</h4>
                      <p className="text-[#36454F] italic">"{item.morning_intentions}"</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-300 mb-2 font-sans">Evening</h4>
                      <p className="text-[#36454F]">{item.evening_reflection || "No reflection added."}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-8 right-8 text-xs text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MILESTONES (Placeholder for now) */}
        {activeTab === "milestones" && (
          <div className="text-center mt-20">
            <h2 className="text-3xl text-[#36454F] mb-4">Milestones</h2>
            <p className="text-gray-500 italic">This section is for your most significant moments. Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;