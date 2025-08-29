import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Comments = ({ articleId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/comments/article/${articleId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    try {
      setSubmitting(true);
      const response = await api.post("/api/comments", {
        content: newComment,
        article: articleId,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("コメントの投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("このコメントを削除しますか？")) return;
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("コメントの削除に失敗しました");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) return;
    try {
      const response = await api.post(`/api/comments/${commentId}/like`);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: Array(response.data.likes).fill(null) }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-8 flex items-center">
        <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        コメント ({comments.length})
      </h3>
      {/* Comment Form */}
      {currentUser ? (
        <div className="card-modern p-6 mb-8">
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="この記事についてどう思いますか？コメントを残してみましょう..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none"
                rows="4"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span>{currentUser.username} としてコメント</span>
              </div>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "投稿中..." : "💬 コメントする"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card-modern p-8 mb-8 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">コメントに参加しよう</h4>
          <p className="text-gray-600 mb-4">
            この記事について意見を共有するには、ログインが必要です
          </p>
          <Link 
            to="/login" 
            className="btn-primary px-6 py-2 inline-block"
          >
            ログインしてコメント
          </Link>
        </div>
      )}
      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor =
              currentUser && comment.author._id === currentUser.id;
            const isLiked =
              currentUser && comment.likes?.includes(currentUser.id);
            return (
              <div key={comment._id} className="card-modern p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.author.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {comment.author.username}
                      </span>
                      <div className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      🗑️ 削除
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center space-x-4">
                    {currentUser && (
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          isLiked
                            ? "bg-red-100 text-red-600"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <span>{isLiked ? "❤️" : "🤍"}</span>
                        <span>{comment.likes?.length || 0}</span>
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    #{comments.indexOf(comment) + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          まだコメントがありません
        </div>
      )}
    </div>
  );
};

export default Comments;
