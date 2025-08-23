import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="glass-dark text-white mt-16">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h3 className="font-display text-2xl font-bold text-gradient-accent mb-2">Shikaku</h3>
          <p className="text-white/80">&copy; {new Date().getFullYear()} 資格学習コミュニティ</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <Link 
            to="/privacy-policy" 
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            プライバシーポリシー
          </Link>
          <Link 
            to="/contact" 
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
