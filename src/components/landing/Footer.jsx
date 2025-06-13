import React from 'react';
import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-8 sm:py-12 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span className="font-bold text-lg sm:text-xl text-foreground">Zer0Mind</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Guiding founders from idea to IPO.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 px-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
          <p className="text-xs text-muted-foreground text-center px-4">
            &copy; {new Date().getFullYear()} Zer0Mind AI. All rights reserved. Built by Hostinger Horizons.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
