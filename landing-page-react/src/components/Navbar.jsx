import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-6 top-6 pointer-events-auto">
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 border border-white/25 rounded-full px-6 py-2 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <img
                src="./TempImages/logo-textless.png"
                className="w-8 h-8"
                alt=""
              />
            </div>
            <span className="text-white/90 text-xl">VirtualTryOn</span>
          </div>

          <div className="flex items-center gap-6 text-white/80 text-sm">
            <a href="#" className="hover:underline font-bold">
              Referanslarımız
            </a>
            <a href="#" className="hover:underline font-bold">
              Demo
            </a>
            <a href="#" className="hover:underline font-bold">
              İletişim
            </a>
            <a href="#" className="hover:underline font-bold">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
