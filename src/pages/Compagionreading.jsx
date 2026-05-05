import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Deepwater from "../assets/deep winter.png";
import alone from "../assets/alone.png";
import autunm from "../assets/autnum.png";
import tree from "../assets/treee.png";
import pikaice from "../assets/pikaice.png";

const CompanionReadings = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const readings = [
    {
      id: 1,
      title: "The Pause",
      subtitle: "Inspired by the stillness between steps",
      img: pikaice,
      content: [
        "Let yourself stop for a moment. Not because the path has ended, but because the quiet is asking you to notice it.",
        "The woods fill with snow whether we watch or not. But the one who pauses to see it carries something the hurrying traveller does not.",
        "Breathe. Notice what is here. Then continue — not rushed, but aware."
      ],
      author: "— Inspired by the stillness between steps"
    },
    {
      id: 2,
      title: "The Return",
      subtitle: "Finding the way back",
      img: tree,
      content: [
        "You carry commitments that deserve your return. This is not a burden — it is a compass.",
        "Rest is not abandonment. Stillness is not surrender. You may pause in the quiet and still arrive where you are going.",
        "Touch the beauty of this moment. Then return to your path with clarity. The two are not in conflict. They never were."
      ],
      author: "— The Red Panda, finding the way back"
    },
    {
      id: 3,
      title: " The Path",
      subtitle: "Moving forward",
      img: autunm,
      content: [
        "There is no single right path. There is only the one you choose and the awareness you bring to walking it.",
        "Each step taken with intention becomes its own meaning. Each choice made with honesty becomes its own home.",
        "Walk the path that feels true. That is enough. That has always been enough."
      ],
      author: "— The Red Panda, moving forward"
    },
    {
      id: 4,
      title: " The Witness",
      subtitle: "At the edge of the woods",
      img: Deepwater,
      content: [
        "He sits alone on frosted stone, While winter breath grows still and cold, A silent watcher, grey and small, Before the forest’s dark unfolds.",
        "The snowdrifts quiet every sound, A world of white beneath the boughs, The Pika lingers where the edges blend, And only silence it allows.",
        "The Pika knows the woodland’s heart, The patient pulse, the waiting air, A humble grace on rock and pine, Content to simply witness there."
      ],
      author: "— The Pika at the edge of the woods"
    },
    {
      id: 5,
      title: " The Solo Table",
      subtitle: "Presence over loneliness",
      img: alone,
      content: [
        "There is a difference between loneliness and solitude. Loneliness is the feeling of being unwanted. Solitude is the practice of being with yourself — fully, without distraction, without apology.",
        "The Pika understands this. The Pika does not sit on its stone waiting for company. It sits because the stone is exactly where it needs to be.",
        "Notice that you are not incomplete. You are simply unaccompanied — which is an entirely different thing.",
        "The person who is comfortable in their own company carries something others are still looking for. Solitude is not a waiting room. It is a destination."
      ],
      sutra: "Your presence is the greatest gift.",
      author: "— The Pika, at the solo table"
    }
  ];

  const totalSlides = readings.length;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col overflow-x-hidden">

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

        {/* Header Text */}
        <div className="flex flex-col items-center pt-6 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#36454F]">
            The Companion Readings
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      {/* BOOK SPREAD AREA */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-10 pb-6">
        <div key={currentSlide} className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 border border-[#36454F]/10">

          {/* LEFT PAGE: Image (Standardized Size) */}
          <div className="p-8 md:p-8 flex flex-col items-center justify-center border-r border-[#36454F]/10">
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner bg-[#FDFCFB]">
              <img
                src={readings[currentSlide].img}
                alt="Reading Visual"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
            </div>
          </div>

          {/* RIGHT PAGE: Text Content */}
          <div className="p-8 md:p-8 flex flex-col justify-center bg-[#FDFCFB]">
            <div className="max-w-md mx-auto space-y-8 text-center lg:text-left">
              <header className="space-y-2">
                <h2 className="text-4xl font-light italic leading-tight">{readings[currentSlide].title}</h2>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold">The Collection</p>
              </header>

              <div className="space-y-6">
                {readings[currentSlide].content.map((para, i) => (
                  <p key={i} className="text-[16px] md:text-[18px] italic leading-relaxed">
                    {para}
                  </p>
                ))}

                {readings[currentSlide].sutra && (
                  <div className="pt-4 border-t border-[#36454F]/10">
                    <p className="text-[9px] uppercase tracking-widest font-sans font-bold mb-1 italic">Sutra</p>
                    <p className="text-2xl italic font-light">“{readings[currentSlide].sutra}”</p>
                  </div>
                )}

                <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold pt-4">
                  {readings[currentSlide].author}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="h-[15vh] flex flex-col items-center justify-center gap-6 px-10">
        {/* DOTS */}
        <div className="flex gap-4">
          {readings.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? "bg-[#36454F] w-8" : "bg-[#36454F]/20"}`}
            />
          ))}
        </div>

        <div className="max-w-7xl w-full flex justify-between">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className={`flex items-center gap-2 text-[10px] uppercase font-sans tracking-widest font-bold transition-all ${currentSlide === 0 ? "invisible" : "hover:text-black"}`}
          >
            <ChevronLeft size={16} /> Previous
          </button>


          {currentSlide < totalSlides - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="flex font-sans items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-black transition-all"
            >
              Next Reading <ChevronRight size={16} />
            </button>
          ) : (

            <div className="min-w-[100px]" />
          )}
        </div>
      </footer>
    </div>
  );
};

export default CompanionReadings;