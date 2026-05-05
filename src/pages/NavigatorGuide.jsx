import React from "react";
import { useNavigate } from "react-router-dom";
import ensoImage from "../assets/pexels-flickr-148182.jpg";

function NavigatorGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-serif text-[#36454F] selection:bg-[#36454F]/10 p-6 md:p-12 lg:p-20 flex flex-col items-center overflow-x-hidden">


      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10  items-stretch">

        <div className="flex-1 bg-white rounded-[25px]  p-8  shadow-sm border border-white/50 relative flex flex-col justify-center min-h-[650px] transition-transform hover:shadow-md">


          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">

          </div>

          <div className="relative z-10 text-center space-y-12">
            <header>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight italic mb-3">The Breath</h1>
              <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-sans font-bold">of the Navigator</p>
            </header>
            <p>Before you open to the first page, before you pick up your pen, before the entry begins — pause here for one breath.</p>

            <div className="space-y-6 text-left font-sans">
              {[
                "Sit or stand with both feet on the floor. Feel the ground beneath you.",
                "Breathe in slowly for four counts — let the breath fill the body fully.",
                "Hold gently for two counts — rest in the stillness between.",
                "Breathe out slowly for six counts — release what the night held.",
                "Set one word as your intention for this entry. Let it arrive without effort."
              ].map((step, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <span className="text-[11px] font-bold  transition-opacity mt-1.5 border-b border-[#36454F]/20 pb-0.5">
                    {index + 1}
                  </span>
                  <p className="text-[15px] tracking-wide leading-relaxed  transition-opacity">
                    {step}
                  </p>
                </div>
              ))}
            </div>
            <p>You are now ready. The river is waiting.</p>
          </div>
        </div>


        <div className="flex-1 bg-white rounded-[25px] p-8  shadow-sm border border-white/50 flex flex-col min-h-[650px] transition-transform hover:shadow-md">
          <header className="mb-10 text-center lg:text-left">
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-sans font-bold mb-4">The Navigator’s </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight italic">Journal Guide</h2>
          </header>


          <div className="space-y-8 flex-grow overflow-y-auto river-scroll pr-4">

            <section className="group">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold mb-3  transition-opacity">Find Your Moment</h3>
              <p className="text-lg italic opacity-70 leading-relaxed font-serif">
                Choose a time that feels naturally yours — the quiet before the house wakes or the settling hour before sleep. Five to ten minutes is enough.
              </p>
            </section>

            <section className="group">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold mb-3  transition-opacity">Write From the Heart</h3>
              <p className="text-lg italic opacity-70 leading-relaxed font-serif">
                Write honestly. Do not compose for an audience. Let what is true arrive on the page in whatever form it comes. Nothing is wrong.
              </p>
            </section>

            <section className="group">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold mb-3  transition-opacity">Gratitude Practice</h3>
              <p className="text-lg italic opacity-70 leading-relaxed font-serif">
                Name three things you are grateful for. Practised with intention, gratitude changes what you see and how you move.
              </p>
            </section>

            <section className="group">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold mb-3 transition-opacity">The Well</h3>
              <p className="text-lg italic opacity-70 leading-relaxed font-serif">
                When prompts feel familiar, turn to <span className="underline decoration-1 underline-offset-8 decoration-[#36454F]/20">The Well</span>. Choose the question that finds you.
              </p>
            </section>

            <section className="group">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold mb-3  transition-opacity">Permission to Rest</h3>
              <p className="text-lg italic opacity-70 leading-relaxed font-serif">
                The river does not judge the time between visits. If you miss a day, begin again without ceremony. The water is always here.
              </p>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}

export default NavigatorGuide;