import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Comments from '../components/Comments';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      setError('記事が見つかりませんでした');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.post(`/api/articles/${id}/like`);
      setArticle({
        ...article,
        likes: Array(response.data.likes).fill(null)
      });
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('この記事を削除しますか？')) return;
    
    try {
      await axios.delete(`/api/articles/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          onClick={() => navigate('/')}
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
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        ← ホームに戻る
      </button>

      <article className="bg-white rounded-lg shadow-md p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <span>投稿者: {article.author.username}</span>
              <span>{formatDate(article.createdAt)}</span>
              <span>👁 {article.views} 閲覧</span>
            </div>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/articles/${id}/edit`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  削除
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

        <footer className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentUser && (
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-4 py-2 rounded ${
                    isLiked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{isLiked ? '❤️' : '🤍'}</span>
                  <span>{article.likes?.length || 0}</span>
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {article.updatedAt !== article.createdAt && (
                <span>最終更新: {formatDate(article.updatedAt)}</span>
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