import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-blue-600 text-white mt-8">
    <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
      <p className="text-sm">&copy; {new Date().getFullYear()} Shikaku</p>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Link to="/privacy-policy" className="hover:underline">
          プライバシーポリシー
        </Link>
        <Link to="/contact" className="hover:underline">
          お問い合わせ
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
