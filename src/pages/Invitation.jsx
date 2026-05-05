import React from "react";
import { useNavigate } from "react-router-dom";
import pikaIcon from "../assets/pexels-84328701-10035016.jpg";
import mainHero from "../assets/bothredpikapandatogether.png";

function Invitation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center py-12 px-6 font-serif text-[#36454F] selection:bg-[#EAB308]/20">

      {/* 🔹 THE SINGLE SHARED WHITE CARD */}
      <div className="max-w-[1400px] w-full bg-white rounded-[3.5rem] shadow-sm flex flex-col lg:flex-row items-stretch overflow-hidden animate-in fade-in zoom-in duration-1000">

        {/* ========================================== */}
        {/* ⬅️ LEFT COLUMN (The Invitation) */}
        {/* ========================================== */}
        <div className="flex-[0.8] p-8 md:p-12 flex flex-col justify-center text-center border-b lg:border-b-0 lg:border-r border-[#36454F]/5">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-light italic tracking-tight mb-4 leading-tight">
              The Invitation
            </h1>
          </header>

          <div className="space-y-5 max-w-xl mx-auto">
            <p className="text-lg md:text-lg italic leading-relaxed opacity-90">
              The Mindful Navigator is a place to create your life — one intention, one reflection, one step at a time.
            </p>

            <p className="text-lg md:text-lg italic leading-relaxed opacity-90">
              The Ensō on the cover is your circle — the shape of a journey that is already whole. May your path be clear and your heart be present.
            </p>
          </div>
        </div>


        {/* ========================================== */}
        {/* ➡️ RIGHT COLUMN (Image & Partners) */}
        {/* ========================================== */}
        <div className="flex-1 p-8 md:p-8 flex flex-col bg-white min-h-full">

          {/* Top content wrapper */}
          <div className="flex-grow">
            {/* 🔸 HERO IMAGE */}
            <div className="w-full h-44 md:h-[350px] overflow-hidden rounded-[2.5rem] shadow-inner border border-[#36454F]/5 mb-8">
              <img
                src={mainHero}
                alt="The Companions"
                className="w-full h-full object-cover transition-transform duration-[3000ms] hover:scale-105"
              />
            </div>

            <h2 className="text-center text-2xl italic font-light opacity-80 mb-5">
              Your Partners in This Journey
            </h2>

            {/* 🔸 PARTNER GRID */}
            <div className="flex flex-col md:flex-row gap-12 items-stretch">

              {/* RED PANDA */}
              <div className="flex-1 space-y-4 group">
                <div className="border-b border-[#36454F]/10 pb-4">
                  <h3 className="text-2xl italic font-medium">The Red Panda</h3>
                  <p className="text-[9px] uppercase font-sans font-bold opacity-30 tracking-widest mt-1">Flow</p>
                </div>
                <p className="text-[14px] italic font-sans opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity duration-500">
                  Meet the Red Panda — your guide through each moment of your journey. The Red Panda thrives in the movement of the trees and the changing of the seasons, never rushing the current but flowing with it. When navigating the energy of the ‘now,’ look to the Red Panda as a reminder that every step taken with intention is a successful one.                </p>
              </div>

              {/* PIKA */}
              <div className="flex-1 space-y-4 group">
                <div className="border-b border-[#36454F]/10 pb-4">
                  <h3 className="text-2xl italic font-medium">The Pika</h3>
                  <p className="text-[9px] uppercase font-sans font-bold opacity-30 tracking-widest mt-1">Sanctuary</p>
                </div>
                <p className="text-[14px] italic font-sans opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity duration-500">
                  Meet the Pika — your guide to the Sanctuary of Stillness. The Pika is the master of the high alpine, standing perfectly still upon the ancient stones, never seeking to be anywhere but exactly where it is. When reaching for meditation or quiet, look to the Pika as a reminder that you are a mountain — unshakeable, present, and already home.                </p>
              </div>
            </div>
          </div>

          {/* 🔸 BUTTON (Pushed to the very end) */}
          <div className="pt-8 flex justify-end">
            <button
              onClick={() => navigate("/breath")}
              className="group flex items-center gap-6 bg-[#36454F] text-[#F5F0E8] px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-sans font-bold transition-all duration-500 hover:bg-black active:scale-95 shadow-lg"
            >
              Continue
              <span className="group-hover:translate-x-2 transition-transform text-xl leading-none">›</span>
            </button>
          </div>

        </div>

      </div>

      {/* FLOAT ICON */}
      <div className="fixed bottom-10 left-10 w-16 h-16 rounded-full overflow-hidden grayscale opacity-20 border border-white hidden lg:block">
        <img src={pikaIcon} alt="Icon" className="w-full h-full object-cover" />
      </div>

    </div>
  );
}

export default Invitation;