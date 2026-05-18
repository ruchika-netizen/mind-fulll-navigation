import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import pikaHill from "../assets/pexels-regan-dsouza-1315522347-30692724.jpg";
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";

const FinalWord = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col overflow-x-hidden selection:bg-[#36454F]/10">

      <section className="min-h-screen flex flex-col items-center justify-center p-8 md:p-20 text-center space-y-12">
        <div className="max-w-4xl w-full">
          <div className="aspect-video w-full rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-[#36454F]/10 bg-white p-4">
            <img
              src={pikaHill}
              alt="Navigating toward horizon"
              className="w-full h-full object-cover rounded-[2rem] grayscale-[0.2]"
            />
          </div>

          <h2 className="text-xl md:text-xl font-light italic leading-relaxed max-w-2xl mx-auto">
            “You have navigated the river. You have stood upon the mountain.
            The journey is not finished; it has simply become you. Go in peace.”
          </h2>
        </div>

        <div className="pt-20">
          <p className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold opacity-60">
            Designed and printed in British Columbia, Canada.
          </p>
        </div>
      </section>

      <section className="min-h-[80vh] bg-[#FDFCFB] flex flex-col items-center justify-center p-8 md:p-20 text-center border-t border-[#36454F]/5">
        <div className="max-w-xl space-y-10">
          <div className="space-y-6 text-2xl md:text-xl font-light italic leading-relaxed">
            <p>When the day feels long and the path feels uncertain,</p>
            <p>offer a smile to the next person you meet.</p>
            <p>Not because they deserve it.</p>
            <p>Not because you have it to spare.</p>
            <p>But because in that single moment,</p>
            <p className="text-4xl md:text-xl border-b border-[#36454F]/10 pb-6 inline-block">
              you will both be a little less alone.
            </p>
          </div>

          <p className="text-[12px] uppercase tracking-[0.2em] font-sans font-bold pt-8">
            This is the way of the Mindful Navigator.
          </p>

          <div className="flex justify-center pt-12">
            <img src={pikaSmile} alt="Facing the reader" className="w-32 h-auto grayscale-[0.5]" />
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-20 flex items-center gap-2 text-[10px] uppercase tracking-[0.5em] font-sans font-bold hover:tracking-[0.7em] transition-all duration-500"
        >
          <ArrowLeft size={14} /> Back to Start
        </button>
      </section>
    </div>
  );
};

export default FinalWord;