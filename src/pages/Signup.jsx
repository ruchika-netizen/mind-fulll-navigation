import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {

        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      },
    });

    if (error) {
      triggerToast(error.message, "error");
    } else {
      triggerToast("Verification link sent! Check your email.", "success");
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login"), 2500);
    }
    setLoading(false);
  };

  const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner pr-14";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4 font-serif text-[#36454F] relative">

      {/* Toast Notification */}
      <div className={`fixed top-10 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 z-[100] flex items-center gap-4 p-5 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"} ${toast.type === "success" ? "bg-white border-green-100" : "bg-[#36454F] border-white/10 text-[#F5F0E8]"}`}>
        {toast.type === "success" ? <CheckCircle2 className="text-green-500" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold italic">{toast.message}</p>
      </div>

      <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm">
        <h2 className="text-3xl text-center mb-10 italic text-[#36454F]">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter Email"
              className={fieldClasses}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">Create Password</label>
            <div className="relative group">
              <input
                type="text"
                style={!showPassword ? { WebkitTextSecurity: "disc" } : {}}
                placeholder="Enter Password"
                className={fieldClasses}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#36454F]/30 hover:text-[#36454F]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ReCAPTCHA wala poora div yahan se remove kar diya hai */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-[11px] uppercase tracking-[0.2em] opacity-40 font-sans font-bold">
          Have an account? <Link to="/login" className="underline font-bold opacity-100 text-[#36454F]">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;