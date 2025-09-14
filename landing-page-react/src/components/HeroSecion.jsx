import React from 'react'
import AnimatedContent from "./AnimatedContent";
import CardSwap, { Card } from "./CardSwap";


const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:gap-48 md:gap-12 items-center justify-center text-white px-4 md:px-8 pt-32 md:pt-52 lg:pt-20">
          {/* Sol kısım - Tanıtım Yazısı */}
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            delay={0.3}
          >
            <div className="w-full lg:w-1/2 max-w-lg mb-8 lg:mb-0 text-center lg:text-left relative z-30">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                VirtualTryOn
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8">
                Artırılmış gerçeklik teknolojisi ile gözlüklerinizi sanal
                ortamda deneyin. Gerçek zamanlı yüz takibi ile mükemmel uyumu
                keşfedin.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <span className="text-sm md:text-base">
                    AR tabanlı sanal deneme
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <span className="text-sm md:text-base">
                    Gerçek zamanlı yüz takibi
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <span className="text-sm md:text-base">
                    Geniş gözlük koleksiyonu
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Sağ kısım - CardSwap */}
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={false}
            duration={2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.5}
          >
            <div className="w-full lg:w-1/2 flex justify-center items-center scale-70 md:scale-85 lg:scale-105 xl:scale-125">
              <div
                className="relative"
                style={{ height: "280px", width: "280px" }}
              >
                <CardSwap
                  cardDistance={30}
                  verticalDistance={25}
                  delay={3000}
                  pauseOnHover={false}
                  width={260}
                  height={260}
                >
                  <Card>
                    <div className="p-3 md:p-4 h-full flex flex-col justify-center items-center text-center">
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url('./TempImages/person1.jpg')",
                        }}
                      />
                    </div>
                  </Card>
                  <Card>
                    <div className="p-3 md:p-4 h-full flex flex-col justify-center items-center text-center">
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url('./TempImages/person2.jpg')",
                        }}
                      />
                    </div>
                  </Card>
                  <Card>
                    <div className="p-3 md:p-4 h-full flex flex-col justify-center items-center text-center">
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url('./TempImages/person3.jpg')",
                        }}
                      />
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </AnimatedContent>
        </div>
  )
}

export default HeroSection