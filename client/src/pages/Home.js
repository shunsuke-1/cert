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
    fetchArticles();
  }, [currentPage, searchTerm]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
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
    setArticles([newArticle, ...articles]);
    setShowCreateForm(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleLike = (articleId, newLikeCount, isLiked) => {
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
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            資格学習をもっと楽しく
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            資格試験に関する知識や経験を共有しよう！
          </p>
          {!currentUser && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition"
              >
                コミュニティに参加
              </Link>
              <Link
                to="/login"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Articles section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">記事一覧</h2>
          {currentUser && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              {showCreateForm ? "キャンセル" : "記事を作成"}
            </button>
          )}
        </div>

        {/* 検索バー */}
        <SearchBar onSearch={handleSearch} />

        {/* 新規投稿フォーム */}
        {showCreateForm && (
          <CreateArticle
            onArticleCreated={handleArticleCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* 記事リスト + ページネーション */}
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
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  前へ
                </button>
                <span className="px-4 py-2 text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
