import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="glass-dark text-white shadow-xl sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <Link
            to="/"
            className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gradient-accent hover:scale-105 transition-transform duration-300"
          >
            Shikaku
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/study-dashboard" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200 text-xs sm:text-sm"
              >
                📚 学習
              </Link>
              <Link 
                to="/study-timeline" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200 text-xs sm:text-sm"
              >
                📊 タイムライン
              </Link>
              <Link 
                to="/profile" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block text-sm">{currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/login" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                ログイン
              </Link>
              <Link
                to="/register"
                className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
