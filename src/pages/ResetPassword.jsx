import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            await supabase.auth.signOut();

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        }
    };

    const fieldClasses = "w-full bg-[#F5F0E8]/40 border border-[#36454F]/10 rounded-2xl p-4 outline-none italic text-md text-[#36454F] focus:border-[#EAB308] focus:bg-white transition-all duration-300 shadow-inner pr-12";

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center font-serif text-[#36454F] px-4">
            <div className="bg-white border border-[#36454F]/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-sm animate-in fade-in duration-700">
                <h2 className="text-3xl text-center mb-4 italic">New Path</h2>
                <p className="text-center text-[14px] opacity-60 mb-10 font-sans leading-relaxed">
                    Create a strong new password to secure your journey.
                </p>

                {errorMsg && (
                    <div className="mb-6 flex items-center gap-2 text-red-500 text-[11px] uppercase tracking-widest font-sans font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                        <AlertCircle size={14} /> {errorMsg}
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-2 text-green-600 text-[11px] uppercase tracking-widest font-sans font-bold bg-green-50 p-4 rounded-xl border border-green-100">
                        <CheckCircle2 size={14} /> Password updated! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-7">
                    <div className="space-y-2">
                        <label className="text-[12px] uppercase tracking-[0.3em] opacity-40 font-sans font-bold ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className={fieldClasses}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#36454F]/30"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-[#36454F] text-white py-5 rounded-2xl uppercase text-[10px] tracking-[0.5em] font-bold font-sans shadow-lg hover:bg-black active:scale-95 transition-all flex justify-center items-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;