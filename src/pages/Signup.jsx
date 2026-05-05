import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Verification link sent! Please check your email.");
      await supabase.auth.signOut(); 
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4 font-serif text-[#36454F]">
      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm">
        
        {/* Header - Serif Font */}
        <h2 className="text-3xl text-center mb-10 italic text-[#36454F]">Create Account</h2>
        {/* <p className="text-[10px] uppercase tracking-[0.3em] text-center opacity-40 mb-10 font-sans font-bold text-[#36454F]">Join The River</p> */}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-1">
            {/* Label - Force Sans Font */}
            <label className="text-[9px] uppercase tracking-widest opacity-40 font-sans font-bold ml-1 text-[#36454F]">Email Address</label>
            <input
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border-b border-[#36454F]/10 p-3 outline-none italic text-lg"
              required
            />
          </div>

          <div className="space-y-1">
            {/* Label - Force Sans Font */}
            <label className="text-[9px] uppercase tracking-widest opacity-40 font-sans font-bold ml-1 text-[#36454F]">Create Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-transparent border-b border-[#36454F]/10 p-3 outline-none italic text-lg"
              required
            />
          </div>

          {/* Button - Match exactly with Login Button Font */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-4 rounded-full uppercase text-[10px] tracking-[0.5em] font-bold font-sans hover:bg-black transition-all shadow-lg active:scale-95 flex justify-center items-center"
          >
            {loading ? "Sending Link..." : "Sign Up "}
          </button>
        </form>

        {/* Footer Link - Match exactly with Login Footer Font */}
        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.4em] opacity-40 font-sans font-bold text-[#36454F]">
          Have an account? <Link to="/login" className="underline font-bold opacity-100">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;