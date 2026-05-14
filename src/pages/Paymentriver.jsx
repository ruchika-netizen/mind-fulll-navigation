import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Loader2, CheckCircle } from "lucide-react";

function PaymentSuccess() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updatePremiumStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Profile table mein premium true kar do
                    await supabase
                        .from("profiles")
                        .update({ is_premium: true })
                        .eq("id", user.id);

                    setTimeout(() => {
                        navigate("/river"); // 2 second baad wapas bhej do
                    }, 2000);
                }
            } catch (err) {
                console.error(err);
                navigate("/river");
            } finally {
                setLoading(false);
            }
        };

        updatePremiumStatus();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center font-serif">
            {loading ? (
                <Loader2 className="animate-spin text-[#36454F]" size={40} />
            ) : (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <CheckCircle className="text-green-600 mx-auto mb-4" size={60} />
                    <h1 className="text-2xl font-bold italic text-[#36454F]">Payment Successful!</h1>
                    <p className="opacity-60 mt-2">Unlocking the next 100 paths in your River...</p>
                </div>
            )}
        </div>
    );
}

export default PaymentSuccess;