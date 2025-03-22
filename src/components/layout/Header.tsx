
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-8",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-sfu-red rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">SG</span>
          </div>
          <span className={cn(
            "font-display font-semibold text-xl transition-all duration-300",
            isScrolled ? "text-sfu-black" : "text-sfu-black"
          )}>
            SFU Globe
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {['home', 'study', 'clubs', 'quizzes', 'leaderboard'].map((item) => (
            <Link
              key={item}
              to={item === 'home' ? '/' : `/${item}`}
              className={cn(
                "text-sm font-medium transition-all duration-200 hover:text-sfu-red relative",
                isScrolled ? "text-sfu-black" : "text-sfu-black",
                "after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-sfu-red after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              )}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-sfu-lightgray text-sfu-black hover:bg-sfu-lightgray/80 transition-all duration-200">
            <Bell size={20} />
          </button>
          <Link 
            to="/profile" 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-sfu-lightgray text-sfu-black hover:bg-sfu-lightgray/80 transition-all duration-200"
          >
            <User size={20} />
          </Link>
        </div>

        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-sfu-lightgray text-sfu-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white p-4 pt-20 transform transition-transform duration-300 ease-in-out md:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-6 items-center">
          {['home', 'study', 'clubs', 'quizzes', 'leaderboard', 'profile'].map((item) => (
            <Link
              key={item}
              to={item === 'home' ? '/' : `/${item}`}
              className="text-lg font-medium text-sfu-black hover:text-sfu-red transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
