import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

      const response = await axios.get("/api/articles", { params });
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
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          資格試験コミュニティ
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          資格試験に関する知識や経験を共有しましょう
        </p>

        {!currentUser && (
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              コミュニティに参加
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              ログイン
            </Link>
          </div>
        )}
      </div>

      {/* Articles Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <h2 className="text-xl font-bold mr-4">記事一覧</h2>
          {currentUser && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              {showCreateForm ? "キャンセル" : "記事を作成"}
            </button>
          )}
        </div>

        <SearchBar onSearch={handleSearch} />

        {showCreateForm && (
          <CreateArticle
            onArticleCreated={handleArticleCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">記事を読み込み中...</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onLike={handleLike}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
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
        ) : (
          <div className="text-center py-8 text-gray-600">
            {searchTerm
              ? "検索結果が見つかりませんでした。"
              : "まだ記事がありません。"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
