import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ArticleCard = ({ article, onLike }) => {
  const { currentUser } = useAuth();

  const handleLike = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.post(`/api/articles/${article._id}/like`);
      onLike(article._id, response.data.likes, response.data.isLiked);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isLiked = currentUser && article.likes?.includes(currentUser.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/articles/${article._id}`}>
          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            {article.title}
          </h2>
        </Link>
        <span className="text-sm text-gray-500">{formatDate(article.createdAt)}</span>
      </div>
      
      <div className="text-gray-600 mb-4 line-clamp-3">
        {article.excerpt}
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
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>投稿者: {article.author?.username}</span>
          <span>👁 {article.views || 0} 閲覧</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentUser && (
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{article.likes?.length || 0}</span>
            </button>
          )}
          <Link 
            to={`/articles/${article._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            続きを読む →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;