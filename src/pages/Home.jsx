import React from "react";
import { Link } from "react-router-dom";
import {
  Waves, Compass, Trees, Droplets,
  MailOpen, Flag, Heart, BookOpen, Layers, Sparkles
} from "lucide-react";

const sections = [
  {
    id: "invitations",
    title: "The Invitations",
    icon: <MailOpen size={28} />,
    path: "/invitations",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: "compass",
    title: "The Compass",
    icon: <Compass size={28} />,
    path: "/compass",
    desc: "Your North Star and the shape of your path. Define what you are leaving behind."
  },
  {
    id: "orchard",
    title: "The Orchard",
    icon: <Trees size={28} />,
    path: "/orchard",
    desc: "Where you tend to your growth, season by season."
  },
  {
    id: "river",
    title: "The River",
    icon: <Waves size={28} />,
    path: "/river",
    desc: "The flow of your immediate actions and reflections. "
  },
  {
    id: "milestones",
    title: "The Milestones",
    icon: <Flag size={28} />,
    path: "/milestones",
    desc: "Seven unmarked pages for the moments that ask to be remembered."
  },
  {
    id: "well",
    title: "The Well",
    icon: <Droplets size={28} />,
    path: "/well",
    desc: "A living resource — wellness practices and reflections to draw from freely."
  },

  {
    id: "readings",
    title: "Companion Readings",
    icon: <BookOpen size={28} />,
    path: "/companionReadings",
    desc: "Philosophy of stillness and movement. Words to carry you further."
  },
  {
    id: "gathering-place",
    title: "Gathering Place",
    icon: <Layers size={28} />,
    path: "/gathering-place",
    desc: "Your collection of photographs and meaningful moments saved for later."
  },
  {
    id: "closing-rituals",
    title: "The Closing Rituals",
    icon: <Sparkles size={28} />,
    path: "/rituals",
    desc: "A final moment of reflection to plant your intentions and find peace."
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex flex-col selection:bg-[#36454F]/10">

      <header className="w-full py-12 md:py-12 text-center shrink-0">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight italic">The Mindful Navigator</h1>
        <div className="h-[1px] w-16 bg-[#36454F]/30 mx-auto mt-6" />
      </header>


      <main className="flex-grow w-full max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="group bg-white/60 border border-[#36454F]/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-7 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(54,69,79,0.1)] hover:-translate-y-2"
          >

            <div className="w-15 h-15 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-500 text-[#36454F]/80 group-hover:text-[#EAB308]">
              {section.icon}
            </div>


            <h2 className="text-[14px] tracking-[0.25em] uppercase font-sans font-bold mb-4 text-[#36454F] group-hover:text-black transition-colors">
              {section.title}
            </h2>

            {/* Divider */}
            <div className="w-8 h-[2px] bg-[#36454F]/20 mb-5 group-hover:w-16 group-hover:bg-[#EAB308] transition-all duration-500" />

            <p className="text-[18px] font-sans italic text-[#36454F]/80 leading-relaxed transition-colors">
              {section.desc}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default Home;