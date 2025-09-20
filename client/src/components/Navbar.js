import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-0">SwiftUI リファレンス</h1>
              <p className="text-sm text-gray-600 -mt-1">iOS アプリ開発ガイド</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              ホーム
            </Link>
            <a 
              href="https://developer.apple.com/documentation/swiftui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              公式ドキュメント
            </a>

            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="検索..." 
                className="bg-transparent text-sm outline-none w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;