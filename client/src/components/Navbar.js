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
        <div className="flex justify-between items-center py-6">
          <Link
            to="/"
            className="text-3xl sm:text-4xl font-display font-bold text-gradient-accent hover:scale-105 transition-transform duration-300"
          >
            Shikaku
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-6">
              <Link 
                to="/profile" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-white/95 hover:text-white font-medium transition-colors duration-200"
              >
                ログイン
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
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
