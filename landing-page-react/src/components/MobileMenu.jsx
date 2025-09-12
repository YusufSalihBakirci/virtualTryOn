import React, { useState, useEffect, useRef } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((o) => !o);

  const menuItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Referanslarımız", href: "/referanslar" },
    { label: "Demo", href: "/demo" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Login", href: "/login" },
  ];

  // Dışarı tıklayınca kapanma
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!isOpen) return;
      const dropdownEl = dropdownRef.current;
      const headerEl = headerRef.current;
      if (
        (dropdownEl && dropdownEl.contains(e.target)) ||
        (headerEl && headerEl.contains(e.target))
      ) {
        return; // içeride tıklama
      }
      setIsOpen(false);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [isOpen]);

  return (
    <>
      {/* Header */}
      <div
        ref={headerRef}
        className="fixed top-2 left-0 w-full flex items-center backdrop-blur-md rounded-full border border-white/25 justify-between px-4 py-3 z-50"
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/TempImages/logo.png"
            alt="VirtualTryOn"
            className="h-8 w-auto"
          />
        </div>
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-9 h-9 space-y-1 focus:outline-none"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menü (Header altı) */}
      <div className="fixed top-[72px] left-0 w-full flex justify-center z-40">
        <div
          ref={dropdownRef}
          className={`w-[90%] max-w-sm rounded-2xl bg-gradient-to-br from-indigo850 via-purple-900 to-blue-950 backdrop-blur-xl border border-white/15 px-6 py-8 flex flex-col items-center gap-6 shadow-lg shadow-black/30 transition-all duration-300 origin-top ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white text-lg font-medium tracking-wide hover:text-purple-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
