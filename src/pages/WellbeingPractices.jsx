import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Assets
import pika from "../assets/pikastone.png";
import pikas from "../assets/redanda.png";
import pikass from "../assets/redpikapnada.png";

const WellbeingPractices = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const practices = [
    {
      title: "One — Morning Stillness",
      subtitle: "THE PIKA PRACTICE",
      img: pika,
      content: [
        "Before the day begins, find one minute of stillness. The Pika does not rush the morning. Neither need you.",
        "Find Your Mountain: Stand with feet hip-width apart, feeling the floor beneath you.",
        "Soft Sight: Let your gaze rest on a single, unmoving point in the distance."
      ],
      sutra: "You are already where you need to be.",
      author: "— The Pika"
    },
    {
      title: "Two — The Navigator's Breath",
      subtitle: "STILLNESS IN MOTION",
      img: pika,
      content: [
        "The breath is the bridge between the world and the self. It is the only constant in the river's flow.",
        "Inhale for four counts, feeling the chest expand like a sail.",
        "Hold for two counts, then exhale for six, letting the weight of the night drift away.",
        "Step forward carrying only the rhythm of your own breath."
      ],
      sutra: "Peace is every step.",
      author: "— The Navigator"
    },
    {
      title: "Three — Nourishing the Body",
      subtitle: "THE GROUND CHOICE",
      img: pikas,
      content: [
        "Your body is the vessel for your journey. Treat it with the respect you would show a holy temple.",
        "Eat slowly enough to taste what you are eating. Prioritize foods that come directly from the soil.",
        "Hydration: Drink water before you are thirsty—it is the river within."
      ],
      sutra: "Hold your cup as you would hold a moment.",
      author: "— The Navigator"
    },
    {
      title: "Four — Mindful Eating",
      subtitle: "THE SLOW TASTE",
      img: pikas,
      content: [
        "Gratitude: Acknowledge the source of your food before the first bite. Notice the textures and subtle flavours.",
        "Full Presence: Eat without the distraction of news or noise. Let the act of eating be your only task.",
        "The soul is nourished when the body is fed with intention."
      ],
      sutra: "This moment, exactly as it is, is enough.",
      author: "— The Red Panda"
    },
    {
      title: "Five — Moving Through the Day",
      subtitle: "FLOW STATE",
      img: pikass,
      content: [
        "Movement does not require a complex plan — it requires only a willingness to begin. Let your body sing.",
        "The natural gait: Walk for ten minutes outside, regardless of the weather.",
        "Joint Release: Rotate your wrists, neck, and ankles every hour to reset flow."
      ],
      sutra: "Movement is the song of the soul.",
      author: "— The Traveler"
    },
    {
      title: "Six — The Silent Listen",
      subtitle: "TENDING TO RELATIONSHIPS",
      img: pikass,
      content: [
        "Small gestures of attention are the threads that weave a strong community. Listen more than you speak.",
        "The Silent Listen: Practice listening without preparing your next answer.",
        "Eye Presence: Look people in the eye when they speak to you. Acknowledge them."
      ],
      sutra: "A step taken in peace reaches the heart.",
      author: "— The Traveler"
    },
    {
      title: "Seven — Learning and Curiosity",
      subtitle: "THE TRAVELER'S MIND",
      img: pikass,
      content: [
        "The mind that stays open stays alive. Be the traveller, not just the map of where you've been.",
        "Unrelated Reading: Read five pages of something outside your profession.",
        "The Observation Walk: Notice three details in your room you never saw before."
      ],
      sutra: "Be the traveller, not just the map.",
      author: "— The Traveler"
    },
    {
      title: "Eight — Sleeping Well",
      subtitle: "THE EVENING RETURN",
      img: pika,
      content: [
        "The day is complete. Set it down at the threshold. Do not carry its weight into the quiet hours.",
        "The absence of screens in the final hour is a gift to your tomorrow self.",
        "Rest gently. Your body has carried you faithfully through this day."
      ],
      sutra: "Rest in the sanctuary of the breath.",
      author: "— The Pika"
    }
  ];

  const totalSlides = practices.length;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col overflow-x-hidden selection:bg-[#36454F]/10">

      {/* HEADER */}
      <header className="relative w-full max-w-7xl mx-auto py-10 md:py-16 px-6 text-center">
        <div className="absolute top-6 md:top-12 left-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The Wellbeing Practices
          </h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      {/* MAIN BOOK SPREAD */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-10 pb-6">
        <div key={currentSlide} className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 border border-[#36454F]/10">

          {/* LEFT SIDE: IMAGE */}
          <div className="p-6 md:p-8 flex flex-col items-center justify-center border-r border-[#36454F]/5">
            <div className="w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-[#FDFCFB]">
              <img
                src={practices[currentSlide].img}
                alt="Practice Illustration"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
            </div>
          </div>

          {/* RIGHT SIDE: TEXT */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-[#FDFCFB]">
            <div className="max-w-md mx-auto space-y-8 text-center lg:text-left">
              <header className="space-y-2">
                <h2 className="text-4xl font-light italic leading-tight text-[#36454F]">
                  {practices[currentSlide].title}
                </h2>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold opacity-50">
                  {practices[currentSlide].subtitle}
                </p>
              </header>

              <div className="space-y-6">
                {practices[currentSlide].content.map((para, i) => (
                  <p key={i} className="text-[16px] md:text-[17px] italic leading-relaxed opacity-80">
                    {para}
                  </p>
                ))}

                {practices[currentSlide].sutra && (
                  <div className="pt-6 border-t border-[#36454F]/10">
                    <p className="text-[9px] uppercase tracking-widest font-sans font-bold mb-2 italic opacity-40">Sutra</p>
                    <p className="text-2xl italic font-light leading-snug">
                      “{practices[currentSlide].sutra}”
                    </p>
                  </div>
                )}

                <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold pt-4 opacity-50">
                  {practices[currentSlide].author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="h-[12vh] flex flex-col items-center justify-center gap-6 px-10 mb-6">
        {/* DOTS */}
        <div className="flex gap-4">
          {practices.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "bg-[#36454F] w-8" : "bg-[#36454F]/20"}`}
            />
          ))}
        </div>

        <div className="max-w-7xl w-full flex justify-between px-4">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${currentSlide === 0 ? "invisible" : "hover:text-black"}`}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentSlide === totalSlides - 1 ? (
            <button onClick={() => navigate("/companionReadings")} className="px-10 py-4 bg-[#36454F] text-[#F5F0E8] text-[10px] uppercase tracking-[0.4em] font-sans font-bold rounded-full hover:bg-black transition-all shadow-lg active:scale-95">
              Explore Readings
            </button>
          ) : (
            <button onClick={() => setCurrentSlide(prev => prev + 1)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-black transition-all">
              Next Practice <ChevronRight size={16} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default WellbeingPractices;