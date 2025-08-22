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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* 上段: サイトタイトルとメニュー全体 */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
          {/* サイトタイトル */}
          <Link to="/" className="text-xl font-bold">
            Shikaku
          </Link>

          {/* メニュー: ログイン/登録 または プロフィール/ログアウト + プライバシーポリシー */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            {currentUser ? (
              <>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link to="/profile" className="hover:text-blue-200">
                    {currentUser.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 w-full sm:w-auto"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Link
                    to="/login"
                    className="hover:text-blue-200 w-full sm:w-auto"
                  >
                    ログイン
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 w-full sm:w-auto text-center"
                  >
                    新規登録
                  </Link>
                </div>
              </>
            )}
            {/* プライバシーポリシーへのリンク */}
            <Link
              to="/privacy-policy"
              className="hover:text-blue-200 w-full sm:w-auto sm:ml-4 mt-2 sm:mt-0"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
