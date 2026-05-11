import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EnsoLoader from "../components/EnsoLoader";
import bansuriIntro from "../assets/segment_5s_to_95s (1).mp3";

function JournalGuide() {
    const navigate = useNavigate();
    const [showEnso, setShowEnso] = useState(false);

    const handleFinalContinue = () => {

        setShowEnso(true);
    };

    const handleLoaderComplete = () => {
        // Music play logic (jaise Login mein tha)
        const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
        if (soundEnabled && !window.currentAppAudio) {
            const audio = new Audio(bansuriIntro);
            audio.loop = true;
            audio.volume = 0.4;
            audio.play().catch(() => { });
            window.currentAppAudio = audio;
        }


        navigate("/", { replace: true });
    };


    if (showEnso) {
        return <EnsoLoader onComplete={handleLoaderComplete} />;
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 relative overflow-hidden flex flex-col items-center justify-center p-4 py-10 animate-in fade-in duration-1000">
            {/* BACK BUTTON CONTAINER */}
            <div className="w-full max-w-7xl mx-auto px-6 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 -top-5 md:-top-0 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] transition-all z-20 flex items-center gap-2 group"
                >
                    <span className="text-xl leading-none group-hover:-translate-x-1 transition-transform inline-block">
                        ‹
                    </span>
                    <span className="mt-0.5 transition-opacity">
                        Back
                    </span>
                </button>
            </div>

            <div className="w-full max-w-[750px] bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-white/50 relative flex flex-col h-[85vh] md:h-auto md:min-h-[750px]">
                <header className="mb-10 text-center">
                    <p className="text-[9px] uppercase tracking-[0.5em] font-sans font-bold mb-3 ">Welcome to The River</p>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight italic">This is where your entries will live.</h1>
                </header>

                <div className="space-y-10 flex-grow overflow-y-auto pr-4 custom-scrollbar mb-5">
                    <section className="group pb-4 space-y-5">
                        <p className="text-[18px] md:text-[17px] italic leading-relaxed font-serif font-bold">
                            Find Your Moment
                        </p>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            Choose a time that feels naturally yours — the quiet before the house wakes, a pause at midday, or the settling hour before sleep. Five to ten minutes is enough. Keep this journal somewhere you will see it, so it can remind you it is waiting.
                        </p>

                        <p className="text-[18px] md:text-[17px] italic leading-relaxed font-serif font-bold">
                            Write From the Heart
                        </p>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            When you write, write honestly. Do not compose for an audience or reach for the right words. Let what is true arrive on the page in whatever form it comes. Nothing you write is wrong. Nothing is too small or too large to matter.
                        </p>

                        <p className="text-[18px] md:text-[17px] italic leading-relaxed font-serif font-bold">
                            Gratitude as a Practice
                        </p>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            Each time you return, name three things you are grateful for. They need not be grand. The quality of morning light. A conversation that surprised you. The warmth of a cup held in both hands. Practised with intention, gratitude changes what you see.
                        </p>

                        <p className="text-[18px] md:text-[17px] italic leading-relaxed font-serif font-bold">
                            Go Deeper When You Are Ready
                        </p>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            On entries when the standard prompts feel too familiar, turn to The Well. There you will find a collection of questions to carry you further. Choose the one that finds you — not the one that seems most useful.
                        </p>

                        <p className="text-[18px] md:text-[17px] italic leading-relaxed font-serif font-bold">
                            Permission to Rest
                        </p>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            If you miss an entry — or many — the bookmark will be where you left it. The river does not judge the time between visits. Return when you are ready. Begin again without ceremony.
                        </p>
                    </section>
                </div>

                <div className="flex justify-end pt-3 ">
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-4 bg-[#36454F] text-[#F5F0E8] pl-7 pr-6 py-3.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-95 shadow-md">
                        Back to home
                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">›</span>
                    </button>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(54, 69, 79, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}

export default JournalGuide;