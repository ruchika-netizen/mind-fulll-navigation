import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import mainHero from "../assets/bothredpikapandatogether.png";

function Invitation() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // const isOnboarding = searchParams.get("mode") === "onboarding";
  const isOnboarding = location.state?.mode === "onboarding";

  const [isPageReady, setIsPageReady] = useState(false);

  const handleContinue = () => {

    if (isOnboarding) {
      navigate("/navigator", { state: { mode: "onboarding" } });
    } else {
      navigate("/navigator");
    }
  };

  return (
    <>

      {!isPageReady && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F0E8] text-[#36454F]">
          <Loader2 className="w-10 h-10 animate-spin opacity-40" />
          <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">
            Loading...
          </p>
        </div>
      )}

      <div className={`min-h-screen bg-[#F5F0E8] flex items-center justify-center py-12 px-4 font-serif text-[#36454F] transition-opacity duration-1000 ${isPageReady ? 'opacity-100' : 'opacity-0'}`}>

        <div className="max-w-[1400px] w-full bg-white rounded-[3.5rem] shadow-sm flex flex-col lg:flex-row items-stretch overflow-hidden">

          {/* LEFT COLUMN: The Text Content */}
          <div className="flex-[0.8] p-10 md:p-7 flex flex-col justify-center text-center border-b lg:border-b-0 lg:border-r border-[#36454F]/5">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-light italic tracking-tight mb-6 leading-tight">
                The Invitation
              </h1>
            </header>
            <div className="space-y-6 max-w-xl mx-auto">
              <p className="text-lg md:text-lg italic leading-relaxed opacity-90">The Mindful Navigator is a place to create your life — one intention, one reflection, one step at a time. To tend it. To navigate it with presence and purpose.</p>
              <p className="text-lg md:text-lg italic leading-relaxed opacity-90">The Ensō on the cover is your circle — the shape of a journey that is already whole, whatever form it takes. May your path be clear and your heart be present. At the end of your journey, you will find one final companion waiting.</p>
            </div>
          </div>

          <div className="flex-1 p-10 md:p-7 flex flex-col bg-white">
            <div className="flex-grow">
              <div className="w-full h-44 md:h-[350px] overflow-hidden rounded-[2.5rem] shadow-inner border border-[#36454F]/5 mb-8">
                <img
                  src={mainHero}
                  alt="The Companions"
                  onLoad={() => setIsPageReady(true)}
                  className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
                />
              </div>

              <h2 className="text-center text-2xl italic font-light opacity-80 mb-10">
                Your Partners in This Journey
              </h2>

              <div className="flex flex-col md:flex-row gap-12 items-stretch">
                {/* Red Panda Section */}
                <div className="flex-1 space-y-4">
                  <div className="border-b border-[#36454F]/10 pb-4">
                    <h3 className="text-2xl italic font-medium">The Red Panda</h3>
                    <p className="text-[12px] uppercase font-sans font-bold tracking-widest mt-1">Flow</p>
                  </div>
                  <p className="text-[15px] italic font-sans leading-relaxed opacity-80">
                    Meet the Red Panda — your guide through each moment of your journey. The Red Panda thrives in the movement of the trees and the changing of the seasons, never rushing the current but flowing with it. When navigating the energy of the ‘now,’ look to the Red Panda as a reminder that every step taken with intention is a successful one.
                  </p>
                </div>

                {/* Pika Section */}
                <div className="flex-1 space-y-4">
                  <div className="border-b border-[#36454F]/10 pb-4">
                    <h3 className="text-2xl italic font-medium">The Pika</h3>
                    <p className="text-[12px] uppercase font-sans font-bold tracking-widest mt-1">Sanctuary</p>
                  </div>
                  <p className="text-[15px] italic font-sans leading-relaxed opacity-80">
                    Meet the Pika — your guide to the Sanctuary of Stillness. The Pika is the master of the high alpine, standing perfectly still upon the ancient stones, never seeking to be anywhere but exactly where it is. When reaching for meditation or quiet, look to the Pika as a reminder that you are a mountain — unshakeable, present, and already home.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-end pt-10">
              <button
                onClick={handleContinue}
                className="group flex items-center gap-4 bg-[#36454F] text-[#F5F0E8] pl-8 pr-7 py-4 rounded-full text-[11px] uppercase tracking-[0.3em] font-sans font-bold transition-all duration-700 hover:bg-black active:scale-95 shadow-md">
                Continue
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">›</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Invitation;