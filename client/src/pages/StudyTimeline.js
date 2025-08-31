import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const StudyTimeline = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQualification, setSelectedQualification] = useState("");
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    fetchTimeline();
    fetchQualifications();
  }, [currentPage, selectedQualification]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (selectedQualification) {
        params.qualification = selectedQualification;
      }
      
      const response = await api.get("/api/study-records/timeline", { params });
      setRecords(response.data.records);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQualifications = async () => {
    try {
      const response = await api.get("/api/qualifications", { params: { limit: 100 } });
      setQualifications(response.data.qualifications);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const handleLike = async (recordId) => {
    if (!currentUser) return;
    
    try {
      const response = await api.post(`/api/study-records/${recordId}/like`);
      setRecords(records.map(record => 
        record._id === recordId 
          ? { ...record, likes: Array(response.data.likes).fill(null), isLiked: response.data.isLiked }
          : record
      ));
    } catch (error) {
      console.error("Error liking record:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "今日";
    if (diffDays === 2) return "昨日";
    if (diffDays <= 7) return `${diffDays - 1}日前`;
    
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
            学習タイムライン
          </h1>
          <p className="text-gray-700 text-lg">みんなの学習記録をチェックしよう</p>
        </div>
        {currentUser && (
          <Link
            to="/study-records/new"
            className="btn-primary px-4 py-2 mt-4 sm:mt-0"
          >
            ✍️ 記録を投稿
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="card-modern p-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-medium text-gray-700">資格で絞り込み:</span>
          <select
            value={selectedQualification}
            onChange={(e) => {
              setSelectedQualification(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="">すべての資格</option>
            {qualifications.map((qual) => (
              <option key={qual._id} value={qual._id}>
                {qual.name}
              </option>
            ))}
          </select>
          {selectedQualification && (
            <button
              onClick={() => {
                setSelectedQualification("");
                setCurrentPage(1);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ クリア
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">学習記録を読み込み中...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <div className="card-modern p-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
              学習記録がありません
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedQualification 
                ? "この資格の学習記録はまだありません" 
                : "まだ学習記録が投稿されていません"
              }
            </p>
            {currentUser && (
              <Link to="/study-records/new" className="btn-primary px-6 py-3">
                最初の記録を投稿
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record, index) => (
            <div key={record._id} className="relative">
              {/* Timeline line */}
              {index < records.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200"></div>
              )}
              
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">{record.mood}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 card-modern p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-gray-900 mb-1">
                        {record.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-medium">{record.user.username}</span>
                        <span>•</span>
                        <span>{formatDate(record.createdAt)}</span>
                        {record.studyHours && (
                          <>
                            <span>•</span>
                            <span>{record.studyHours}時間</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {record.qualification && (
                    <div className="mb-3">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {record.qualification.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {record.content}
                    </p>
                  </div>
                  
                  {record.tags && record.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {record.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      {currentUser && (
                        <button
                          onClick={() => handleLike(record._id)}
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            record.isLiked 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <span className={record.isLiked ? '❤️' : '🤍'}>
                            {record.isLiked ? '❤️' : '🤍'}
                          </span>
                          <span>{record.likes?.length || 0}</span>
                        </button>
                      )}
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>💬</span>
                        <span>{record.comments?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {new Date(record.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="card-modern p-3 flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700"
            >
              ← 前へ
            </button>
            <span className="px-4 py-2 text-gray-700 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700"
            >
              次へ →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimeline;