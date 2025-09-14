import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-slate-300">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/TempImages/logo-textless.png"
                alt="VirtualTryOn"
                className="h-8 w-auto"
                loading="lazy"
              />
              <span className="text-white font-semibold">VirtualTryOn</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Yüzünüze en yakışan gözlüğü, artırılmış gerçeklikle anında
              deneyimleyin. Ürünleri karşılaştırın, paylaşın ve güvenle satın
              alın.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium">Keşfet</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  Nasıl Çalışır
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  className="hover:text-white transition-colors"
                >
                  Koleksiyon
                </a>
              </li>
              <li>
                <a
                  href="#try-on"
                  className="hover:text-white transition-colors"
                >
                  Hemen Dene
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium">Destek</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  S.S.S.
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@virtualtryon.app"
                  className="hover:text-white transition-colors"
                >
                  İletişim
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Gizlilik
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kullanım Şartları
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-sm">
          <p>© {year} VirtualTryOn. Tüm hakları saklıdır.</p>
          <div className="mt-3 sm:mt-0 flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Çerez Tercihleri
            </a>
            <a href="#" className="hover:text-white transition-colors">
              TR
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
