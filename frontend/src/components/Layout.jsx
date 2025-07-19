import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import React from "react";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";
import { Menu, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Settings,
  BarChart3,
  Users as UsersIcon,
  Package,
  TrendingUp,
  LogOut,
} from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [userInitials, setUserInitials] = useState('US');
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user?.name) {
      const names = user.name.split(' ');
      const initials = names
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      setUserInitials(initials);
    }
  }, [user]);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    {
      path: "/users",
      label: "Kullanıcılar",
      icon: <UsersIcon className="w-4 h-4" />,
    },
    {
      path: "/orders",
      label: "Siparişler",
      icon: <Package className="w-4 h-4" />,
    },
    {
      path: "/products",
      label: "Ürünler",
      icon: <Package className="w-4 h-4" />
    },
    {
      path: "/analytics",
      label: "Analitik",
      icon: <TrendingUp className="w-4 h-4" />,
    }, 
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Mobil Header */}
      <div className="md:hidden bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-transparent">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-gray-900 border-r border-gray-800 p-0">
              <SheetHeader className="p-4 border-b border-gray-800">
                <SheetTitle className="text-white text-left">Menü</SheetTitle>
              </SheetHeader>
              <div className="p-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-md ${
                      currentPath === item.path
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">NamıkAI Admin</h1>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none flex items-center">
                <Avatar className="size-8 cursor-pointer bg-blue-600">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                {!isCollapsed && user && (
                  <span className="ml-2 text-sm font-medium text-white md:hidden">
                    {user.name || 'Kullanıcı'}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-gray-200">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-white">{user?.name || 'Kullanıcı'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
              </div>
              <DropdownMenuItem className="flex items-center cursor-pointer px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                <Settings className="mr-2 h-4 w-4" />
                <span>Ayarlar</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center cursor-pointer px-3 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 focus:text-white text-red-400 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 pt-16 md:pt-0">
        {/* Masaüstü Sidebar */}
        <div 
          className={`hidden md:flex flex-col fixed top-0 left-0 h-screen transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          } bg-gray-950 border-r border-gray-800 z-30`}
        >
          <div className="overflow-y-auto h-full flex flex-col">
            <div className="p-4 flex-1">
              <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && <h1 className="text-xl font-bold text-white">NamıkAI</h1>}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-md ${
                      currentPath === item.path
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`p-4 border-t border-gray-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className={`flex items-center ${!isCollapsed ? 'w-full' : 'justify-center'}`}>
                    <Avatar className="size-10 cursor-pointer bg-blue-600">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && user && (
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user.name || 'Kullanıcı'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-gray-900 border-gray-700 text-gray-200"
                  align={isCollapsed ? 'center' : 'start'}
                  sideOffset={5}
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">{user?.name || 'Kullanıcı'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="flex items-center cursor-pointer px-2 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer px-2 py-2 text-sm hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ayarlar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer px-2 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <FullPageSkeleton />
        ) : (
          <div 
            className={`flex-1 flex flex-col min-h-0 w-full transition-all duration-300 ${
              isCollapsed ? 'md:ml-20' : 'md:ml-64'
            }`}
          >
            <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
              <div className="max-w-full overflow-x-hidden">
                <Outlet />
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
              <div className="px-4 sm:px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-4">NamıkAI</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Yapay zeka destekli güçlü yönetim paneli çözümü.
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        AI Makyaj Analizi
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        Sanal Makyaj Denemesi
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                    Destek
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Yardım Merkezi
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        API Dokümantasyonu
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Kullanım Kılavuzu
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        İletişim
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                    Yasal
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Gizlilik Politikası
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Kullanım Şartları
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Çerez Politikası
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        KVKK
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    2025 Namık AI Studio. Tüm hakları saklıdır.
                  </p>
                  <div className="flex items-center space-x-4 text-xs sm:text-sm">
                    <span className="text-gray-400">Powered by</span>
                    <span className="text-white font-semibold">
                      Namık Technology
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
