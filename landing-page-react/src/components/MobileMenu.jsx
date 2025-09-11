import React, { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Referanslarımız", href: "/referanslar" },
    { label: "Demo", href: "/demo" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Login", href: "/login" },
  ];

  return (
    <>
      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 z-50">
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
          className="flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
          aria-label="Toggle menu"
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white text-2xl font-semibold hover:text-purple-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Background overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileMenu;
