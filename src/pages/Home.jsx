import React from "react";
import { Link } from "react-router-dom";
import {
  Waves, Compass, Trees, Droplets,
  Leaf, Flag, Heart, BookOpen
} from "lucide-react";

const sections = [
  {
    id: "compass",
    title: "The Compass",
    icon: <Compass size={22} />,
    path: "/compass",
    desc: "Your North Star and the shape of your path. Define what you are leaving behind and the horizon you move toward."
  },
  {
    id: "orchard",
    title: "The Orchard",
    icon: <Trees size={22} />,
    path: "/orchard",
    desc: "Where you tend to your growth, season by season. Prune what no longer serves and celebrate the harvest."
  },
  {
    id: "river",
    title: "The River",
    icon: <Waves size={22} />,
    path: "/river-list",
    desc: "The flow of your immediate actions and reflections. Navigate the morning current and evening stillness."
  },
  {
    id: "milestones",
    title: "The Milestones",
    icon: <Flag size={22} />,
    path: "/milestones",
    desc: "Mark the completions, realisations, and turning points. Seven pages for the moments that ask to be remembered."
  },
  {
    id: "well",
    title: "The Well",
    icon: <Droplets size={22} />,
    path: "/well",
    desc: "A living resource — wellness practices and reflections to draw from freely. It does not run dry."
  },
  {
    id: "well-practices",
    title: "The Practices",
    icon: <Heart size={22} />,
    path: "/wellbeingpractices",
    desc: "The Pika's mountain and the Red Panda's river. Small, repeated choices to notice and be seen."
  },
  {
    id: "readings",
    title: "Companion Readings",
    icon: <BookOpen size={22} />,
    path: "/companionReadings",
    desc: "Philosophy of stillness and movement. Words to carry you further when the path feels long."
  },
  {
    id: "gathering",
    title: "Gathering Place",
    icon: <Leaf size={22} />,
    path: "/gathering-place",
    desc: "A private space for keeping the photographs, words, and moments that find you along the way."
  },
];

function Home() {
  return (
    <div className="h-[calc(80vh-64px)] bg-[#F5F0E8] text-[#36454F] font-serif overflow-hidden flex flex-col selection:bg-[#36454F]/10">

      <header className="w-full py-10 md:py-14 text-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight italic">The Mindful Navigator</h1>
        <div className="h-[1px] w-12 bg-[#36454F]/20 mx-auto mt-4" />
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pb-12 grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-4 md:gap-8">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="group bg-white/40 border border-[#36454F]/5 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center text-center p-6 transition-all duration-700 hover:bg-white hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500 text-[#36454F]/70 group-hover:text-[#36454F]">
              {section.icon}
            </div>

            <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
              {section.title}
            </h2>

            <div className="w-6 h-[1.5px] bg-[#36454F]/10 mb-4 group-hover:w-12 group-hover:bg-[#EAB308] transition-all duration-500" />

            <p className="text-[12px] font-sans italic opacity-40 leading-relaxed max-w-[200px] group-hover:opacity-70 transition-opacity">
              {section.desc}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default Home;