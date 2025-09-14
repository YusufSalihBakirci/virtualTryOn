import React, { useState } from "react";
import AnimatedContent from "./AnimatedContent";

const people = [
  { id: 1, src: "/TempImages/person1.jpg", label: "Person 1" },
  { id: 2, src: "/TempImages/person2.jpg", label: "Person 2" },
  { id: 3, src: "/TempImages/person3.jpg", label: "Person 3" },
];

const glasses = [
  { id: 1, src: "/TempImages/glasses1.webp", label: "Glasses 1" },
  { id: 2, src: "/TempImages/glasses2.webp", label: "Glasses 2" },
  { id: 3, src: "/TempImages/glasses3.webp", label: "Glasses 3" },
  { id: 4, src: "/TempImages/glasses4.webp", label: "Glasses 4" },
];

export default function ExploreCollection() {
  const [chosenPerson, setChosenPerson] = useState(null);
  const [chosenGlasses, setChosenGlasses] = useState(null);

  return (
    <AnimatedContent
      distance={100}
      direction="vertical"
      reverse={false}
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      delay={0.5}
    >
      <section className="relative z-40 pt-24 mt-12 sm:mt-16 md:mt-24 lg:mt-28">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 sm:mb-6">
            Koleksiyonumuzu Keşfedin
          </h2>

          {/* İnsan ve Gözlük Seçimi */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* İnsan Seç */}
            <div className="p-3 md:p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg">
              <h5 className="text-white font-semibold mb-4">İnsan Seç</h5>
              {chosenPerson && (
                <div className="mb-3 sm:mb-4">
                  <img
                    src={chosenPerson.src}
                    alt={chosenPerson.label}
                    className="w-full rounded-lg object-cover max-h-80 sm:max-h-96"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {people.map((p) => (
                  <img
                    key={p.id}
                    src={p.src}
                    alt={p.label}
                    className={`cursor-pointer rounded-lg border transition-colors ${
                      chosenPerson?.id === p.id
                        ? "border-blue-400"
                        : "border-transparent"
                    }`}
                    onClick={() => setChosenPerson(p)}
                  />
                ))}
              </div>
            </div>

            {/* Gözlük Seç */}
            <div className="p-3 md:p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg">
              <h5 className="text-white font-semibold mb-4">Gözlük Seç</h5>
              {chosenGlasses && (
                <div className="mb-3 sm:mb-4">
                  <img
                    src={chosenGlasses.src}
                    alt={chosenGlasses.label}
                    className="w-full rounded-lg object-contain max-h-48 sm:max-h-64 bg-black/20"
                  />
                </div>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {glasses.map((g) => (
                  <img
                    key={g.id}
                    src={g.src}
                    alt={g.label}
                    className={`cursor-pointer rounded-lg border transition-colors ${
                      chosenGlasses?.id === g.id
                        ? "border-blue-400"
                        : "border-transparent"
                    }`}
                    onClick={() => setChosenGlasses(g)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Önizleme */}
          {chosenPerson && chosenGlasses && (
            <AnimatedContent
              key={`${chosenPerson.id}-${chosenGlasses.id}`}
              distance={100}
              direction="vertical"
              reverse={false}
              duration={0.8}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              delay={0.15}
            >
              <div className="mt-6 sm:mt-8 p-3 md:p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg">
                <h5 className="text-white font-semibold mb-4">Önizleme</h5>
                <div className="flex justify-center">
                  <img
                    src="/TempImages/filtered-person1.jpg"
                    alt="Önizleme"
                    className="rounded-lg max-h-72 sm:max-h-96 object-contain"
                  />
                </div>
              </div>
            </AnimatedContent>
          )}
        </div>
      </section>
    </AnimatedContent>
  );
}
