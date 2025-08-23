import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import ArticleCard from "../components/ArticleCard";
import CreateArticle from "../components/CreateArticle";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // 検索ワードやページ番号が変わったら記事を再取得
    fetchArticles();
  }, [currentPage, searchTerm]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get("/api/articles", { params });
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleCreated = (newArticle) => {
    // 新しい記事を一覧に追加してフォームを閉じる
    setArticles([newArticle, ...articles]);
    setShowCreateForm(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleLike = (articleId, newLikeCount) => {
    setArticles(
      articles.map((article) =>
        article._id === articleId
          ? { ...article, likes: Array(newLikeCount).fill(null) }
          : article
      )
    );
  };

  return (
    <div>
      {/* Hero セクション */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl sm:text-7xl font-display font-bold text-gray-900 mb-8 leading-tight">
            資格学習を
            <span className="text-gradient block">もっと楽しく</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            資格試験に関する知識や経験を共有し、<br className="hidden sm:block" />
            一緒に成長していくコミュニティ
          </p>
          {!currentUser && (
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4"
              >
                コミュニティに参加
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 記事セクション */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">記事一覧</h2>
            <p className="text-gray-700 text-lg font-medium">最新の学習記事をチェックしよう</p>
          </div>
          {currentUser && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`${showCreateForm ? 'btn-secondary' : 'btn-primary'} text-lg px-6 py-3 w-full sm:w-auto`}
            >
              {showCreateForm ? "キャンセル" : "✨ 記事を作成"}
            </button>
          )}
        </div>

        {/* 作成フォーム表示中は検索バー・一覧を隠す */}
        {showCreateForm ? (
          <CreateArticle
            onArticleCreated={handleArticleCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <>
            {/* 検索バー */}
            <SearchBar onSearch={handleSearch} />

            {/* 記事リスト */}
            {loading ? (
              <p>記事を読み込み中...</p>
            ) : (
              <>
                {articles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    onLike={handleLike}
                  />
                ))}
                {/* ページネーション */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="card-modern p-4 flex items-center space-x-4">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-6 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700"
                      >
                        ← 前へ
                      </button>
                      <span className="px-4 py-2 text-gray-700 font-semibold">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-6 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700"
                      >
                        次へ →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
