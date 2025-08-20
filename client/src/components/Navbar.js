import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            資格試験コミュニティ
          </Link>
          
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-blue-200">
                  {currentUser.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-blue-200">
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;