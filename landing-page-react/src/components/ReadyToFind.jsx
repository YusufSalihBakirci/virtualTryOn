import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog";
import { setLenisEnabled } from "../utils/lenisUtils";
import AnimatedContent from "./AnimatedContent";

const ReadyToFind = () => {
  const [openDialog, setOpenDialog] = useState(null);

  useEffect(() => {
    if (openDialog !== null) {
      // Store current scroll position BEFORE disabling anything
      const savedScrollY =
        window.pageYOffset || document.documentElement.scrollTop;

      // Disable Lenis first
      setLenisEnabled(false);

      //  Scroll'u koru
      const body = document.body;
      body.style.position = "fixed";
      body.style.top = `-${savedScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";

      // Cleanup
      return () => {
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        document.documentElement.style.overflow = "";

        window.scrollTo(0, savedScrollY);

        setTimeout(() => {
          setLenisEnabled(true);
        }, 10);
      };
    }
  }, [openDialog]);

  const people = [
    {
      id: 1,
      src: "/TempImages/person1.jpg",
      label: "Person 1",
    },
    {
      id: 2,
      src: "/TempImages/person2.jpg",
      label: "Person 2",
    },
    {
      id: 3,
      src: "/TempImages/person3.jpg",
      label: "Person 3",
    },
  ];

  const glasses = [
    { id: 1, src: "/TempImages/glasses1.webp", label: "Aviator Style" },
    { id: 2, src: "/TempImages/glasses2.webp", label: "Classic Frame" },
    { id: 3, src: "/TempImages/glasses3.webp", label: "Modern Square" },
    { id: 4, src: "/TempImages/glasses4.webp", label: "Round Vintage" },
  ];

  const handlePersonClick = (personId) => {
    setOpenDialog(personId);
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  return (
    <AnimatedContent
      istance={100}
      direction="vertical"
      reverse={false}
      duration={1.2}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      delay={0.3}
    >
      <div className="text-white relative z-10 py-24 md:my-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-left font-bold">
            Aradığınızı Bulmaya Hazır mısınız?
          </h2>
        </div>

        {/* Card container */}
        <div className="pt-16 md:pt-28 pb-16 md:pb-36 w-[92%] md:w-1/2 mx-auto rounded-xl bg-white/5 border border-white/10 shadow-lg">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 sm:-ml-4">
                {people.map((person) => (
                  <CarouselItem
                    key={person.id}
                    className="pl-3 sm:pl-4 basis-full"
                  >
                    <div
                      className="cursor-pointer group max-w-sm sm:max-w-md mx-auto"
                      onClick={() => handlePersonClick(person.id)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300">
                        <img
                          src={person.src}
                          alt={person.label}
                          className="w-full h-56 sm:h-64 md:h-80 object-contain transition-opacity duration-300 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="font-semibold">{person.label}</p>
                          <p className="text-sm text-gray-300">
                            Denemek için tıklayın
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Her kişi için ayrı dialog */}
                    <Dialog
                      open={openDialog === person.id}
                      onOpenChange={(open) => !open && closeDialog()}
                    >
                      <DialogContent className="w-[95vw] sm:w-auto max-w-[96vw] sm:max-w-2xl bg-gray-900 border-gray-700 text-white p-4 sm:p-6">
                        <DialogHeader>
                          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-white">
                            {person.label} - Virtual Try-On
                          </DialogTitle>
                          <DialogDescription className="text-center text-gray-400 text-sm">
                            İşlenmiş ve orijinal görselleri, seçilen gözlük ile
                            birlikte görüntüleyin.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 sm:space-y-6">
                          {/* Üst kısım - İşlenmiş resim */}
                          <div className="text-center">
                            <h3 className="text-base sm:text-lg font-semibold mb-3 text-white">
                              İşlenmiş Resim
                            </h3>
                            <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                              <img
                                src="/TempImages/filtered-person1.jpg"
                                alt={`${person.label} işlenmiş resim`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>

                          {/* Alt kısım - Orijinal resim ve gözlük seçenekleri */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Orijinal kişi resmi */}
                            <div className="text-center">
                              <h4 className="text-sm sm:text-md font-medium mb-2 text-gray-300">
                                Orjinal
                              </h4>
                              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-lg overflow-hidden bg-gray-800 border border-gray-600">
                                <img
                                  src={person.src}
                                  alt={person.label}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Gözlük seçeneği */}
                            <div className="text-center">
                              <h4 className="text-sm sm:text-md font-medium mb-2 text-gray-300">
                                Seçilen Gözlük
                              </h4>
                              <div className="p-2 sm:p-3 border border-gray-600 rounded-lg bg-gray-800">
                                {(() => {
                                  let selectedGlass;
                                  if (person.id === 2) {
                                    // Person 2 için Round Vintage
                                    selectedGlass = glasses.find(
                                      (g) => g.label === "Round Vintage"
                                    );
                                  } else if (person.id === 1) {
                                    // Person 1 için Aviator Style
                                    selectedGlass = glasses.find(
                                      (g) => g.label === "Aviator Style"
                                    );
                                  } else {
                                    // Person 3 için Modern Square
                                    selectedGlass = glasses.find(
                                      (g) => g.label === "Modern Square"
                                    );
                                  }

                                  return (
                                    <div>
                                      <img
                                        src={selectedGlass.src}
                                        alt={selectedGlass.label}
                                        className="w-full h-14 sm:h-16 object-contain mb-2"
                                      />
                                      <p className="text-xs sm:text-sm text-gray-300 font-medium">
                                        {selectedGlass.label}
                                      </p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-1 sm:left-0 text-white border-gray-600 bg-gray-800/80 hover:bg-gray-700 hover:border-gray-500 backdrop-blur-sm h-9 w-9 sm:h-10 sm:w-10" />
              <CarouselNext className="right-1 sm:right-0 text-white border-gray-600 bg-gray-800/80 hover:bg-gray-700 hover:border-gray-500 backdrop-blur-sm h-9 w-9 sm:h-10 sm:w-10" />
            </Carousel>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default ReadyToFind;
