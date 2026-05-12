import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Home, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isCleaning, setIsCleaning] = useState(true); // Loader state

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        const updatePaymentStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && sessionId) {
                // 1. Database update
                await supabase
                    .from("rituals")
                    .update({
                        payment_status: 'completed',
                        stripe_id: sessionId
                    })
                    .eq('user_id', user.id)
                    .eq('payment_status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);

                // 2. URL Clean
                window.history.replaceState({}, document.title, "/payment-success");

                // 3. Thoda sa delay taaki smooth lage
                setTimeout(() => setIsCleaning(false), 800);
            } else {
                // Agar session_id nahi hai toh turant loader hatao
                setIsCleaning(false);
            }
        };

        updatePaymentStatus();
    }, [searchParams]);

    // Jab tak URL clean ho raha hai, tab tak ye dikhega
    if (isCleaning) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#36454F] opacity-20" size={40} />
            </div>
        );
    }

    // Final Design (URL ab clean ho chuka hai)
    return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6 font-serif">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-1000">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50]">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-current stroke-[3]">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-[#36454F] text-4xl md:text-5xl italic font-light">Payment Confirmed.</h1>
                    <p className="text-[#36454F]/70 text-lg leading-relaxed max-w-[400px] mx-auto">
                        Your intention is now moving through the physical world.
                    </p>
                </div>
                <button onClick={() => navigate("/")} className="mt-8 inline-flex items-center gap-3 bg-[#36454F] text-white px-10 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold font-sans">
                    <Home size={14} /> Return to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;