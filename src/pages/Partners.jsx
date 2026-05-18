import React from "react";
import { useNavigate } from "react-router-dom";
import pika from "../assets/pexels-84328701-10035016.jpg";
import redpanda from "../assets/bothredpikapandatogether.png";

function Invitation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center relative p-4 md:p-12 font-serif text-[#36454F] overflow-x-hidden">


      <div className="max-w-5xl w-full bg-white rounded-[3rem] p-8 md:p-16 shadow-sm flex flex-col items-center relative z-10 animate-in fade-in zoom-in duration-1000">


        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-light italic tracking-tight mb-2">The Invitation</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold opacity-30">Of The Navigator</p>
        </header>

        <div className="max-w-2xl text-center space-y-6 mb-16">
          <p className="text-md md:text-lg italic leading-relaxed opacity-90">
            The Mindful Navigator is a place to create your life — one intention, one reflection, one step at a time. To tend it. To navigate it with presence and purpose.
          </p>
          <div className="w-12 h-px bg-[#36454F]/10 mx-auto"></div>
          <p className="text-sm md:text-md italic leading-relaxed opacity-70">
            The Ensō on the cover is your circle — the shape of a journey that is already whole. May your path be clear and your heart be present.
          </p>
        </div>


        <div className="w-full border-t border-[#36454F]/5 pt-16">
          <div className="w-full h-56 md:h-96 rounded-[2.5rem] overflow-hidden mb-16 grayscale-[0.1] opacity-95 border border-[#36454F]/5 shadow-inner">
            <img
              src={redpanda}
              alt="Forest Companions"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>

          <header className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light italic tracking-tight">Your Partners in This Journey</h2>
            <div className="w-8 h-[1px] bg-[#36454F]/20 mx-auto mt-4" />
          </header>

          <div className="flex flex-col md:flex-row gap-12 md:gap-16 px-2 items-stretch mb-10">

            {/* Red Panda Section */}
            <div className="flex-1 flex flex-col space-y-5 group">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl italic font-medium border-b border-[#36454F]/10 pb-3 inline-block">
                  The Red Panda (Flow)
                </h3>
                <p className="text-[9px] uppercase tracking-widest font-sans font-bold opacity-30 mt-3">Guidance in Motion</p>
              </div>
              <p className="text-sm md:text-md italic leading-relaxed opacity-60 group-hover:opacity-100 transition-all duration-500">
                Meet the Red Panda — your guide through each moment. It thrives in the movement of the trees and the changing of the seasons, never rushing the current but flowing with it. Every step taken with intention is a successful one.
              </p>
            </div>


            <div className="hidden md:block w-px bg-[#36454F]/10 self-stretch" />

            <div className="flex-1 flex flex-col space-y-5 group">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl italic font-medium border-b border-[#36454F]/10 pb-3 inline-block">
                  The Pika (Sanctuary)
                </h3>
                <p className="text-[9px] uppercase tracking-widest font-sans font-bold opacity-30 mt-3">Guidance in Stillness</p>
              </div>
              <p className="text-sm md:text-md italic leading-relaxed opacity-60 group-hover:opacity-100 transition-all duration-500">
                Meet the Pika — your guide to the Sanctuary of Stillness. The Pika stands perfectly still upon the ancient stones, never seeking to be anywhere but exactly where it is. You are a mountain — unshakeable and already home.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-12 gap-8 border-t border-[#36454F]/5 pt-12">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[11px] italic opacity-40 font-medium tracking-wide">
              "At the end of your journey, one final companion waits."
            </p>
          </div>

          <button
            onClick={() => navigate("/breath")}
            className="group flex items-center gap-6 bg-[#36454F] text-[#F5F0E8] pl-10 pr-8 py-5 rounded-full text-[11px] uppercase tracking-[0.4em] font-sans font-bold transition-all duration-500 hover:bg-black hover:shadow-2xl active:scale-95 shadow-lg w-full md:w-auto justify-center"
          >
            Enter the Journey
            <span className="group-hover:translate-x-2 transition-transform text-xl leading-none">›</span>
          </button>
        </div>
      </div>

      {/* --- CORNER DECORATIONS --- */}
      <div className="fixed bottom-8 left-8 w-14 h-14 rounded-full overflow-hidden grayscale opacity-20 border border-white shadow-sm hidden lg:block hover:opacity-50 transition-opacity duration-500">
        <img src={pika} alt="pika" className="w-full h-full object-cover" />
      </div>

    </div>
  );
}

export default Invitation;