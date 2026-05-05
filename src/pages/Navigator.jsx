import React from "react";
import { useNavigate } from "react-router-dom";

function JournalGuide() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 relative overflow-hidden flex flex-col items-center justify-center p-4 py-10">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed left-6 top-8 text-[10px] uppercase tracking-[0.4em] font-sans font-bold transition-all z-20 "
            >
                ‹ Back
            </button>

            {/* Main Container */}
            <div className="w-full max-w-[750px] bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-white/50 relative flex flex-col h-[85vh] md:h-auto md:min-h-[750px]">

                {/* Header */}
                <header className="mb-10 text-center">
                    <p className="text-[9px] uppercase tracking-[0.5em] font-sans font-bold mb-3 ">Welcome to The River</p>
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight italic">The Navigator’s Journal Guide</h1>
                    <p className="text-[13px] mt-4 italic max-w-sm mx-auto leading-relaxed ">
                        This is where your entries will live.
                    </p>
                </header>

                {/* Guide Content */}
                <div className="space-y-10 flex-grow overflow-y-auto pr-4 custom-scrollbar mb-5">

                    <section className="group">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-3 ">Find Your Moment</h3>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            Choose a time that feels naturally yours — the quiet before the house wakes, a pause at midday, or the settling hour before sleep. Five to ten minutes is enough. Keep this journal somewhere you will see it, so it can remind you it is waiting.
                        </p>
                    </section>

                    <section className="group">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-3 ">Write From the Heart</h3>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            When you write, write honestly. Do not compose for an audience or reach for the right words. Let what is true arrive on the page in whatever form it comes. Nothing you write is wrong. Nothing is too small or too large to matter.
                        </p>
                    </section>

                    <section className="group">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-3 ">Gratitude as a Practice</h3>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            Each time you return, name three things you are grateful for. They need not be grand. The quality of morning light. A conversation that surprised you. The warmth of a cup held in both hands. Practised with intention, gratitude changes what you see.
                        </p>
                    </section>

                    <section className="group">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-3 ">Go Deeper When You Are Ready</h3>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            On entries when the standard prompts feel too familiar, turn to <span className="underline underline-offset-4 decoration-[#36454F]/20 font-bold">The Well</span>. There you will find a collection of questions to carry you further. Choose the one that finds you — not the one that seems most useful.
                        </p>
                    </section>

                    <section className="group pb-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-3 ">Permission to Rest</h3>
                        <p className="text-[16px] md:text-[17px] italic leading-relaxed font-serif ">
                            If you miss an entry — or many — the bookmark will be where you left it. The river does not judge the time between visits. Return when you are ready. Begin again without ceremony.
                        </p>
                    </section>
                </div>

                {/* --- Professional Continue Button inside Card --- */}
                <div className="flex justify-end pt-3 ">

                    <button
                        onClick={() => navigate("/")} // Guide ke baad Home/Dashboard par
                        className="group flex items-center gap-4 bg-[#36454F] text-[#F5F0E8] pl-7 pr-6 py-3.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-95 shadow-md">
                        Continue
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