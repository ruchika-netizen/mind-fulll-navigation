import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        let isMounted = true;

        const syncPayment = async (userId) => {
            try {
                // Get current profile count
                const { data: profile, error: fetchError } = await supabase
                    .from("profiles")
                    .select("payment_count")
                    .eq("id", userId)
                    .single();

                if (fetchError) throw fetchError;

                const currentCount = parseInt(profile?.payment_count || 0);
                const newCount = currentCount + 1;

                // Update database
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({ payment_count: newCount })
                    .eq("id", userId);

                if (updateError) throw updateError;

                if (isMounted) setStatus("success");
            } catch (err) {
                console.error("Sync error:", err);
                if (isMounted) setStatus("error");
            }
        };

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                syncPayment(session.user.id);
            } else {
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (session?.user && status === "verifying") {
                        syncPayment(session.user.id);
                        subscription.unsubscribe();
                    }
                });

                setTimeout(() => {
                    if (isMounted && status === "verifying") setStatus("no_session");
                }, 10000);
            }
        };

        checkSession();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-6 text-center font-serif">
            <div className="max-w-md w-full bg-white/70 p-12 rounded-[3rem] border border-white shadow-2xl backdrop-blur-lg">
                {status === "verifying" && (
                    <div className="space-y-6">
                        <Loader2 className="mx-auto animate-spin text-[#36454F]" size={48} />
                        <h2 className="text-2xl italic">Deepening the River...</h2>
                        <p className="text-sm opacity-60 italic">Updating your journey...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={40} className="text-green-600" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-4xl italic mb-4">The Gate is Open</h2>
                        <p className="opacity-70 italic mb-10 leading-relaxed">Your path has expanded by 100 entries.</p>
                        <button onClick={() => navigate("/river")} className="w-full py-5 bg-[#36454F] text-white rounded-2xl font-sans uppercase tracking-[0.4em] text-[10px] font-bold shadow-xl">Continue the Flow</button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl italic text-red-500">Error Occurred</h2>
                        <button onClick={() => window.location.reload()} className="underline text-[10px] uppercase font-bold tracking-widest">Retry Sync</button>
                    </div>
                )}

                {status === "no_session" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl italic text-red-600">Session Missing</h2>
                        <button onClick={() => navigate("/login")} className="w-full py-4 border border-[#36454F] rounded-full text-[10px] uppercase font-bold tracking-widest">Login to Sync</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;