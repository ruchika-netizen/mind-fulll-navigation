import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Breath() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isOnboarding = searchParams.get("mode") === "onboarding";

    const handleContinue = () => {
        const nextPath = isOnboarding ? "/navigator?mode=onboarding" : "/navigator";
        navigate(nextPath);
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 relative overflow-x-hidden flex flex-col items-center justify-center p-6 py-12">
            <button
                onClick={() => navigate(-1)}
                className="fixed left-8 top-12 text-[10px] uppercase tracking-[0.4em] font-sans font-bold transition-all z-20 "
            >
                ‹ Back
            </button>

            <div className="w-full max-w-[700px] bg-white rounded-[2.5rem] p-8 md:p-14 shadow-sm border border-white/50 relative flex flex-col items-center justify-center overflow-hidden h-auto min-h-[800px]">
                <div className="relative z-10 w-full pb-15 flex flex-col items-center text-center">
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight italic">The Breath</h1>
                        <p className="text-[11px] uppercase tracking-[0.6em] font-sans font-bold mt-2 ">of the Navigator</p>
                    </header>

                    <p className="text-[15px] md:text-[16px] italic font-medium leading-relaxed max-w-md mx-auto mb-6">
                        Before you open to the first page, before you pick up your pen, before the entry begins — pause here for one breath.
                    </p>

                    <div className="space-y-3 max-w-lg">
                        {[
                            "Sit or stand with both feet on the floor. Feel the ground beneath you.",
                            "Breathe in slowly for four counts — let the breath fill the body fully.",
                            "Hold gently for two counts — rest in the stillness between.",
                            "Breathe out slowly for six counts — release what the night held.",
                            "Set one word as your intention for this entry. Let it arrive without effort."
                        ].map((step, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-6 h-[1px] bg-[#36454F]/10 mb-4" />
                                <p className="text-[14px] md:text-[15px] tracking-wide leading-relaxed ">{step}</p>
                            </div>
                        ))}
                    </div>

                    <footer className="mt-12">
                        <p className="text-[12px] uppercase tracking-[0.3em] font-sans font-bold italic ">
                            You are now ready. The river is waiting.
                        </p>
                    </footer>
                </div>

                <div className="absolute bottom-10 right-10 z-20">
                    <button
                        onClick={() => navigate("/navigators")}
                        className="group flex items-center gap-4 bg-[#36454F] text-[#F5F0E8] pl-7 pr-6 py-3.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-95 shadow-md">
                        Continue
                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Breath;