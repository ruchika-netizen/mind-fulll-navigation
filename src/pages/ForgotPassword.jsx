import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            setMessage("Reset link has been sent to your email.");
        }
        setLoading(false);
    };

    const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner";

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center font-serif text-[#36454F] px-4">
            <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm animate-in fade-in zoom-in duration-500">

                <Link to="/login" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-sans font-bold  transition-all mb-8">
                    <ArrowLeft size={14} /> Back to Login
                </Link>

                <h2 className="text-3xl text-center mb-4 italic">Reset Password</h2>
                <p className="text-center text-[16px] opacity-60 font-sans mb-10 leading-relaxed">
                    {/* Enter your email and we'll send you a link to return to your journey. */}
                </p>

                {errorMsg && (
                    <div className="mb-6 flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-widest font-sans font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircle size={14} /> {errorMsg}
                    </div>
                )}

                {message && (
                    <div className="mb-6 flex items-center gap-2 text-green-600 text-[11px] uppercase tracking-widest font-sans font-bold bg-green-50 p-4 rounded-xl border border-green-100">
                        <CheckCircle2 size={14} /> {message}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-7">
                    <div className="space-y-2">
                        <label className="text-[12px] uppercase tracking-[0.3em]  font-sans font-bold ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            className={fieldClasses}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;