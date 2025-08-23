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
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-6">
        コメント ({comments.length})
      </h3>
      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力してください..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "コメント中..." : "コメントする"}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            コメントするには{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>{" "}
            してください
          </p>
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
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      削除
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4">
                  {currentUser && (
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`flex items-center space-x-1 text-sm ${
                        isLiked
                          ? "text-red-600"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <span>{isLiked ? "❤️" : ""}</span>
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                  )}
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
