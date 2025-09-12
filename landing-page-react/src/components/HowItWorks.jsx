import React from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { FaCamera } from "react-icons/fa6";
import { FaRuler } from "react-icons/fa6";
import { FaMagic } from "react-icons/fa";
import AnimatedContent from "./AnimatedContent";

const HowItWorks = () => {
  return (
    <div className="relative z-30">
          <AnimatedContent
              duration={1.2}
          >
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6 text-center mt-32">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-white text-base md:text-lg lg:text-xl font-medium max-w-3xl mx-auto">
            VirtualTryOn, artırılmış gerçeklik ve yapay zeka teknolojilerini
            kullanarak size en iyi gözlük deneyimini sunar. İşte nasıl
            çalıştığı:
          </p>
        </div>
      </AnimatedContent>
      <ScrollStack
        useWindowScroll={true}
        itemDistance={140}
        itemStackDistance={50}
        stackPosition="30%"
        scaleEndPosition="15%"
        baseScale={0.85}
        itemScale={0.04}
      >
        <ScrollStackItem itemClassName="bg-transparent text-white flex items-center justify-center h-[70vh] text-4xl font-bold backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-full max-w-xl mx-auto px-4 md:px-6 text-left">
            <h2 className="flex items-center gap-4 text-xl md:text-3xl lg:text-4xl font-extrabold mb-4">
              <span className="text-xl md:text-3xl lg:text-4xl">
                <FaCamera />
              </span>
              <span className="break-words whitespace-normal">
                Google Feed Entegrasyonu
              </span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed">
              Google Feed üzerinden elde edilen güncel moda trendleri, popüler
              ürünler ve kullanıcı ilgi alanları sistemimize entegre edilir.
              Böylece size en yeni ve en çok tercih edilen gözlük modelleri
              önerilir.
            </p>
          </div>
        </ScrollStackItem>
        <ScrollStackItem itemClassName="bg-transparent text-white flex items-center justify-center h-[70vh] text-4xl font-bold backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-full max-w-xl mx-auto px-4 md:px-6 text-left">
            <h2 className="flex items-center gap-4 text-xl md:text-3xl lg:text-4xl font-extrabold mb-4">
              <span className="text-xl md:text-3xl lg:text-4xl">
                <FaRuler />
              </span>
              <span className="break-words whitespace-normal">
                Gerçek Zamanlı Yüz Analizi
              </span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed">
              Yapay zeka, yüz şekliniz ve stilinize göre en uygun gözlükleri
              önerir. Size özel ve benzersiz bir kullanıcı deneyimi sunar.
            </p>
          </div>
        </ScrollStackItem>
        <ScrollStackItem itemClassName="bg-transparent text-white flex items-center justify-center h-[70vh] text-4xl font-bold backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-full max-w-xl mx-auto px-4 md:px-6 text-left">
            <h2 className="flex items-center gap-4 text-xl md:text-3xl lg:text-4xl font-extrabold mb-4">
              <span className="text-xl md:text-3xl lg:text-4xl">
                <FaMagic />
              </span>
              <span className="break-words whitespace-normal">
                Kişiselleştirilmiş Gözlük Tavsiyesi
              </span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed">
              Kullanıcıların yüz hatları ve ölçüleri doğrultusunda, en uygun
              gözlük modelleri önerilir. Bu sayede, hem estetik hem de konfor
              açısından en iyi deneyim sağlanır.
            </p>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </div>
  );
};

export default HowItWorks;
