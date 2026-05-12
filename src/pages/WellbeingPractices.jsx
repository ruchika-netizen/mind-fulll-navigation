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
      title: "Morning Stillness",
      subtitle: "THE PIKA PRACTICE",
      img: pika,
      content: [
        "Before the day begins, find one minute of stillness. The Pika does not rush the morning. Neither need you.",
        "Find Your Mountain: Stand with feet hip-width apart, feeling the floor beneath you.",
        "The Navigator’s Breath: Inhale for four counts, hold for two, exhale for six.",
        "Soft Sight: Let your gaze rest on a single, unmoving point.",
        "Stillness in Motion: Notice the subtle sway of your body as it finds its balance.",
        "The Threshold: Set one intention. Step forward carrying only that.",
      ],
      sutra: "You are already where you need to be.",
      author: "— The Pika"
    },
    {
      title: " Sleeping Well ",
      subtitle: "The Evening Return",
      img: pika,
      content: [
        "The day is complete. Set it down. A consistent time to rest, a darkened room, and the absence of screens in the final hour are the three simplest gifts you can give your body.",
        "When the day is done, set it down at the threshold.",
        "Do not carry its weight into the quiet hours.",
        "A body that is rested and at peace is worth more than any achievement the day may have offered.",
        "If you can breathe steadily in this moment — if you can feel the quiet settling around you — you have done enough. You are enough.",
        "Your body has carried you faithfully through this day.",
        "Tonight, return the kindness. Rest gently. You have earned it.",
      ],
      sutra: "Rest in the sanctuary of the breath.",
      author: "— The Pika"
    },
    {
      title: "Nourishing the Body",
      subtitle: "Eating With Intention",
      img: pikas,
      content: [
        "Eat slowly enough to taste what you are eating. Choose foods that came from the ground more often than foods that came from a factory. Drink water before you are thirsty. ",
        "These are not rules — they are acts of care.",
      ],
      sutra: "These are not rules — they are acts of care.",
      author: ""
    },
    {
      title: "Moving Through the Day ",
      subtitle: "The Red Panda Practice ",
      img: pikas,
      content: [
        "The Red Panda does not sit still for long. Movement does not require a plan or a programme — it requires only a willingness to begin. Walk outside when you can. Stretch when you remember. Let the body lead sometimes.",
      ],
      sutra: "Movement is the song of the soul.",
      author: "— The Red Panda"
    },
    {
      title: " Tending to Relationships ",
      subtitle: "Giving and Receiving",
      img: pikass,
      content: [
        "Reach out to one person without a reason. Listen more than you speak. Receive care gracefully when it is offered. The river does not flow in one direction only.",
      ],
      sutra: "A step taken in peace reaches the heart",
      author: ""
    },
    {
      title: " Learning and Curiosity ",
      subtitle: "Feeding the Mind",
      img: pikass,
      content: [
        "Read something that has nothing to do with your work. Ask a question you do not know the answer to. Follow a thread of curiosity without needing it to lead anywhere. The mind that stays open stays alive.",
      ],
      sutra: "Be the traveller, not just the map.",
      author: "— "
    },
    {
      title: "Caring for Yourself ",
      subtitle: "The Pika’s Mountain",
      img: pikass,
      content: [
        "You cannot pour from an empty vessel. Rest is not laziness. Solitude is not loneliness. Saying no to one thing is saying yes to yourself. The mountain does not apologise for being still.",
      ],
      sutra: "The mountain does not seek the sun; it simply receives it.",
      author: ""
    },
    {
      title: "Caring for Others ",
      subtitle: "The Red Panda’s River",
      img: pika,
      content: [
        "Show up. Be present. Do small things with great attention. The most profound acts of care are rarely grand gestures — they are the quiet, repeated choices to notice another person and let them know they have been seen.",
      ],
      sutra: "Every moment is a fresh start.”",
      author: "— The Pika"
    }
  ];

  const totalSlides = practices.length;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col overflow-x-hidden selection:bg-[#36454F]/10">

      {/* HEADER */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 pb-8 text-center">
        <div className="absolute top-6 md:top-12 left-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-[#36454F] group transition-all">
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform inline-block">‹</span>
            <span className="mt-0.5">Back</span>
          </button>
        </div>
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">The Wellbeing Practices</h1>
          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-10 pb-6">
        <div key={currentSlide} className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-7 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex flex-col items-center justify-center border-r border-[#36454F]/5">
            <div className="w-full aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#FDFCFB]">
              <img src={practices[currentSlide].img} alt="Practice" className="w-full h-full object-cover grayscale-[0.2]" />
            </div>
          </div>
          <div className="p-8 md:p-8 flex flex-col rounded-[2rem] justify-center bg-white/40">
            <div className="max-w-lg mx-auto space-y-8 text-center lg:text-left">
              <header className="space-y-2">
                <h2 className="text-4xl font-light italic leading-tight text-[#36454F]">{practices[currentSlide].title}</h2>
                <p className="text-[12px] uppercase tracking-widest font-sans font-bold">{practices[currentSlide].subtitle}</p>
              </header>
              <div className="space-y-5">
                {practices[currentSlide].content.map((para, i) => (
                  <p key={i} className="text-[16px] md:text-[17px] italic leading-relaxed opacity-80">{para}</p>
                ))}
                {practices[currentSlide].sutra && (
                  <div className="pt-6 border-t border-[#36454F]/10">
                    <p className="text-[12px] uppercase tracking-widest font-sans font-bold mb-2 italic">Sutra</p>
                    <p className="text-xl italic font-light leading-snug">“{practices[currentSlide].sutra}”</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-[85rem] mx-auto px-6 md:px-12 h-[12vh] flex items-center justify-between  shrink-0 mb-4 mt-4">

        {/* Left Side: PREVIOUS Button */}
        <button
          onClick={() => currentSlide === 0 ? navigate("/well") : setCurrentSlide(s => s - 1)}
          className="flex items-center gap-2 text-[12px] uppercase tracking-widest font-sans font-bold group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> PREVIOUS
        </button>

        {/* Right Side: NEXT PRACTICE (Only shows if NOT on the last slide) */}
        {currentSlide < practices.length - 1 && (
          <button
            onClick={() => setCurrentSlide(s => s + 1)}
            className="flex items-center gap-2 font-sans text-[12px] uppercase tracking-widest font-bold group"
          >
            NEXT PRACTICE <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}

      </footer>
    </div>
  );
};

export default WellbeingPractices;