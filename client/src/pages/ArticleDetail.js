import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import Comments from "../components/Comments";
import { Link } from "react-router-dom";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      setError("記事が見つかりませんでした");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const response = await api.post(`/api/articles/${id}/like`);
      setArticle({
        ...article,
        likes: Array(response.data.likes).fill(null),
      });
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("この記事を削除しますか？")) return;
    try {
      await api.delete(`/api/articles/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">記事を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  if (!article) return null;

  const isAuthor = currentUser && article.author._id === currentUser.id;
  const isLiked = currentUser && article.likes?.includes(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-purple-600 hover:text-purple-800 flex items-center font-medium transition-colors duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        ホームに戻る
      </button>

      <article className="card-modern p-6 sm:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
        <header className="relative z-10 mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {article.author.username.charAt(0).toUpperCase()}
                </div>
                <Link 
                  to={`/users/${article.author._id}`}
                  className="font-medium hover:text-purple-600 transition-colors"
                >
                  {article.author.username}
                </Link>
              </div>
              <span className="text-gray-400">•</span>
              <span>{formatDate(article.createdAt)}</span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span>{article.views} 閲覧</span>
              </span>
            </div>

            {isAuthor && (
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/articles/${id}/edit`)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  🗑️ 削除
                </button>
              </div>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="article-content prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="relative z-10 border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {currentUser && (
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isLiked
                      ? "bg-gradient-to-r from-pink-100 to-red-100 text-red-600 hover:from-pink-200 hover:to-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                  <span>{article.likes?.length || 0} いいね</span>
                </button>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>コメントで議論しよう</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {article.updatedAt !== article.createdAt && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>最終更新: {formatDate(article.updatedAt)}</span>
                </span>
              )}
            </div>
          </div>
        </footer>
      </article>

      {/* Comments Section */}
      <Comments articleId={id} />
    </div>
  );
};

export default ArticleDetail;
