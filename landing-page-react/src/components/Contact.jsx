import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import AnimatedContent from "./AnimatedContent";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { firstName, lastName, email });
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
      <section className="text-white relative my-10 md:my-36">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-left font-bold">
            İletişim
          </h2>
        </div>

        {/* Card container */}
        <div className="w-[92%] md:w-1/2 mx-auto rounded-xl bg-white/5 border border-white/10 shadow-lg py-12 md:py-28">
          <p className="text-base sm:text-lg text-center mb-10 md:mb-20 px-4">
            Herhangi bir sorunuz veya geri bildiriminiz için bizimle iletişime
            geçin.
          </p>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start">
              {/* Sol: Logo */}
              <div className="flex justify-center md:justify-start">
                <img
                  src="/TempImages/logo-textless.png"
                  alt="Virtual Try On Logo"
                  className="w-36 xs:w-44 sm:w-56 md:w-72 lg:w-[380px] h-auto select-none"
                  draggable="false"
                />
              </div>

              {/* Sağ: Form */}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="space-y-6 sm:space-y-8 md:space-y-10">
                  {/* İsim */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <label className="col-span-12 sm:col-span-3 text-xs sm:text-sm md:text-base text-neutral-300">
                      İsim
                    </label>
                    <div className="col-span-12 sm:col-span-9">
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Adınız"
                        className="text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* Soyisim */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <label className="col-span-12 sm:col-span-3 text-xs sm:text-sm md:text-base text-neutral-300">
                      Soyisim
                    </label>
                    <div className="col-span-12 sm:col-span-9">
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Soyadınız"
                        className="text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* E-posta */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <label className="col-span-12 sm:col-span-3 text-xs sm:text-sm md:text-base text-neutral-300">
                      E-posta
                    </label>
                    <div className="col-span-12 sm:col-span-9">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@ornek.com"
                        className="text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* Gönder */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-10 md:h-12 text-sm md:text-base"
                  >
                    Gönder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </AnimatedContent>
  );
};

export default Contact;
