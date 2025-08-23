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
    <article className="card-modern p-8 mb-8 group">
      <div className="flex justify-between items-start mb-4">
        <Link to={`/articles/${article._id}`} className="flex-1">
          <h2 className="text-2xl font-display font-semibold text-gray-900 hover:text-purple-700 cursor-pointer transition-all duration-300 group-hover:text-purple-700 leading-tight">
            {article.title}
          </h2>
        </Link>
        <time className="text-sm text-gray-500 font-medium ml-4 whitespace-nowrap">
          {formatDate(article.createdAt)}
        </time>
      </div>
      
      <div className="text-gray-700 mb-6 line-clamp-3 text-lg leading-relaxed">
        {article.excerpt}
      </div>
      
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="tag-modern"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {article.author?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{article.author?.username}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            <span>{article.views || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentUser && (
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-gradient-to-r from-pink-100 to-red-100 text-red-600 hover:from-pink-200 hover:to-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-medium">{article.likes?.length || 0}</span>
            </button>
          )}
          <Link 
            to={`/articles/${article._id}`}
            className="text-purple-700 hover:text-purple-900 font-semibold flex items-center space-x-1 transition-colors duration-200"
          >
            <span>続きを読む</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;