import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import mainHero from "../assets/bothredpikapandatogether.png";

function Invitation() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isOnboarding = searchParams.get("mode") === "onboarding";


    const [isImageLoading, setIsImageLoading] = useState(true);

    const handleContinue = () => {
        const nextPath = isOnboarding ? "/breath?mode=onboarding" : "/breath";
        navigate(nextPath);
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] items-center justify-center py-8 px-4 font-serif text-[#36454F] selection:bg-[#EAB308]/20">

            <div className="max-w-[1300px] mx-auto mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
                    <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
                    <span className="mt-0.5">Back</span>
                </button>
            </div>

            <div className="max-w-[1300px] mx-auto w-full bg-white rounded-[2rem] shadow-sm flex flex-col lg:flex-row items-stretch animate-in fade-in zoom-in duration-1000 mt-4">

                {/* LEFT COLUMN */}
                <div className="flex-[0.8] p-8 md:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#36454F]/5">
                    <header className="mb-12 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-light italic text-center tracking-tight leading-tight">
                            The Invitation
                        </h1>
                    </header>

                    <div className="space-y-6 max-w-xl text-left">
                        <p className="text-lg md:text-lg italic leading-relaxed text-center opacity-90">
                            The Mindful Navigator is a place to create your life — one intention, one reflection, one step at a time. To tend it. To navigate it with presence and purpose.
                        </p>
                        <p className="text-lg md:text-lg italic leading-relaxed text-center opacity-90">
                            The Ensō on the cover is your circle — the shape of a journey that is already whole, whatever form it takes. May your path be clear and your heart be present.
                            At the end of your journey, you will find one final companion waiting.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex-1 p-8 md:p-8 flex flex-col rounded-[3.5rem] bg-white min-h-full">

                    <div className="flex-grow">
                        {/* IMAGE CONTAINER WITH LOADER */}
                        <div className="relative w-full h-44 md:h-[350px] overflow-hidden rounded-[2.5rem] shadow-inner border border-[#36454F]/5 mb-8 bg-[#F5F0E8]/30">

                            {isImageLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#36454F]/20" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] mt-2 opacity-40 font-sans font-bold">Loading...</p>
                                </div>
                            )}

                            <img
                                src={mainHero}
                                alt="The Companions"
                                onLoad={() => setIsImageLoading(false)}
                                className={`w-full h-full object-cover transition-all duration-[1500ms] ${isImageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
                                    } hover:scale-105`}
                            />
                        </div>

                        <h2 className="text-center text-2xl italic font-light opacity-80 mb-8">
                            Your Partners in This Journey
                        </h2>

                        <div className="flex flex-col md:flex-row gap-12 items-stretch">
                            <div className="flex-1 space-y-4 group text-left">
                                <div className="border-b border-[#36454F]/10 pb-4">
                                    <h3 className="text-2xl italic font-medium">The Red Panda</h3>
                                    <p className="text-[12px] uppercase font-sans font-bold tracking-widest mt-1">Flow</p>
                                </div>
                                <p className="text-[15px] italic font-sans leading-relaxed transition-opacity duration-500">
                                    Meet the Red Panda — your guide through each moment of your journey. The Red Panda thrives in the movement of the trees and the changing of the seasons, never rushing the current but flowing with it. When navigating the energy of the ‘now,’ look to the Red Panda as a reminder that every step taken with intention is a successful one.
                                </p>
                            </div>
                            <div className="flex-1 space-y-4 group text-left">
                                <div className="border-b border-[#36454F]/10 pb-4">
                                    <h3 className="text-2xl italic font-medium">The Pika</h3>
                                    <p className="text-[12px] uppercase font-sans font-bold tracking-widest mt-1">Sanctuary</p>
                                </div>
                                <p className="text-[15px] italic font-sans leading-relaxed transition-opacity duration-500">
                                    Meet the Pika — your guide to the Sanctuary of Stillness. The Pika is the master of the high alpine, standing perfectly still upon the ancient stones, never seeking to be anywhere but exactly where it is. When reaching for meditation or quiet, look to the Pika as a reminder that you are a mountain — unshakeable, present, and already home.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button
                            onClick={() => navigate("/navigators")}
                            className="group flex items-center gap-4 bg-[#36454F] text-[#F5F0E8] pl-7 pr-6 py-3.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-95 shadow-md">
                            Continue
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">›</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invitation;