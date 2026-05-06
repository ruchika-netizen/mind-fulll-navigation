import React from "react";
import { useNavigate } from "react-router-dom";
import { Droplets } from "lucide-react";

const prompts = [
  {
    id: 1,
    title: "The Shadow Self",
    text: "Which part of your personality do you work hardest to hide from others? What happens if you bring it into the light?"
  },
  {
    id: 2,
    title: "The Architecture of Joy",
    text: "Strip away your titles, your possessions, and your roles. What remains that cannot be taken?"
  },
  {
    id: 3,
    title: "The Threshold of Fear",
    text: "What is the specific price of admission you are currently refusing to pay for the life you actually want?"
  },
  {
    id: 4,
    title: "The Final Integration",
    text: "How would you treat yourself today if you truly believed you were already enough, exactly as you are?"
  },
  {
    id: 5,
    title: "The Silent Architect",
    text: "If you were to stop trying to be good, what would you finally have the freedom to become?"
  },
  {
    id: 6,
    title: "The Legacy of Ash",
    text: "What part of your past do you need to stop trying to fix and finally allow to burn away?"
  },
  {
    id: 7,
    title: "The Body Knows",
    text: "What is your body trying to tell you that your mind has been too busy to hear? Where in your physical self does your unfinished business live?"
  },
  {
    id: 8,
    title: "The Life You Are Walking Toward",
    text: "Stand ten years from now in the life you are genuinely capable of living. What does that person want you to know about the choices available to you today?"
  },

];

function Well() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 flex flex-col items-center">
      {/* Header matches Navigator Guide Style */}
      <header className="relative w-full max-w-7xl mx-auto pt-10 py-8 text-center">
        {/* Back Button Container */}
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
            The Well
          </h1>

          <div className="w-12 h-[1px] bg-[#36454F]/10 mt-8" />
        </div>
      </header>

      <main className="max-w-4xl w-full px-6 pb-24">
        {/* Intro Quote from Client Doc */}
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-6">
          <p className="text-[16px] italic leading-relaxed opacity-60">
            "The Well is a living resource — a quiet place the writer returns to whenever they need grounding, a prompt, or a practice."
          </p>
          {/* <div className="w-8 h-[1px] bg-[#36454F]/10 mx-auto" /> */}
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate("/still-water", { state: { selectedPrompt: p.text, title: p.title } })}
              className="group bg-white/50 border border-[#36454F]/5 p-10 rounded-[2.5rem] text-left hover:bg-white hover:shadow-2xl hover:shadow-[#36454F]/5 transition-all duration-700 flex flex-col items-center text-center group active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700">
                <Droplets size={18} strokeWidth={1.2} className="opacity-40" />
              </div>

              <h3 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold opacity-30 mb-3">
                {p.title}
              </h3>

              <p className="text-[15px] italic leading-relaxed opacity-40 group-hover:opacity-80 transition-opacity line-clamp-4 text-center">
                {p.text}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Well;