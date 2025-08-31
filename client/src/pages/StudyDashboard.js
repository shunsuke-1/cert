import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const StudyDashboard = () => {
  const { currentUser } = useAuth();
  const [myQualifications, setMyQualifications] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    recordsThisWeek: 0,
    activeQualifications: 0,
  });

  useEffect(() => {
    if (currentUser) {
      fetchMyQualifications();
      fetchRecentRecords();
    }
  }, [currentUser]);

  const fetchMyQualifications = async () => {
    try {
      const response = await api.get("/api/study-records/my-qualifications");
      setMyQualifications(response.data);
      setStats(prev => ({
        ...prev,
        activeQualifications: response.data.filter(q => q.status === 'studying').length
      }));
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const fetchRecentRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/study-records/my-records", {
        params: { limit: 5 }
      });
      setRecentRecords(response.data.records);
      
      // Calculate stats
      const totalHours = response.data.records.reduce((sum, record) => sum + (record.studyHours || 0), 0);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recordsThisWeek = response.data.records.filter(
        record => new Date(record.createdAt) > oneWeekAgo
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalHours,
        recordsThisWeek
      }));
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'studying': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'planning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'studying': return '学習中';
      case 'passed': return '合格';
      case 'failed': return '不合格';
      case 'planning': return '計画中';
      default: return status;
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="card-modern p-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
            学習記録を始めよう
          </h2>
          <p className="text-gray-600 mb-6">
            ログインして資格学習の記録を管理しましょう
          </p>
          <Link to="/login" className="btn-primary px-6 py-3">
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
          学習ダッシュボード
        </h1>
        <p className="text-gray-700 text-lg">あなたの学習進捗を管理しよう</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card-modern p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.activeQualifications}
          </div>
          <div className="text-gray-600 font-medium">学習中の資格</div>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.recordsThisWeek}
          </div>
          <div className="text-gray-600 font-medium">今週の記録</div>
        </div>
        <div className="card-modern p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.totalHours.toFixed(1)}h
          </div>
          <div className="text-gray-600 font-medium">総学習時間</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Qualifications */}
        <div className="card-modern p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">
              📋 マイ資格
            </h2>
            <Link
              to="/qualifications"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              資格を追加 →
            </Link>
          </div>
          
          {myQualifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-600 mb-4">まだ資格が登録されていません</p>
              <Link to="/qualifications" className="btn-primary px-4 py-2 text-sm">
                資格を追加
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myQualifications.slice(0, 5).map((userQual) => (
                <div key={userQual._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {userQual.qualification.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {userQual.qualification.category}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userQual.status)}`}>
                    {getStatusText(userQual.status)}
                  </span>
                </div>
              ))}
              {myQualifications.length > 5 && (
                <div className="text-center pt-2">
                  <Link to="/qualifications" className="text-purple-600 hover:text-purple-700 text-sm">
                    すべて見る ({myQualifications.length - 5}件)
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Study Records */}
        <div className="card-modern p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900">
              📝 最近の学習記録
            </h2>
            <Link
              to="/study-records/new"
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              記録を追加 →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : recentRecords.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✍️</div>
              <p className="text-gray-600 mb-4">まだ学習記録がありません</p>
              <Link to="/study-records/new" className="btn-primary px-4 py-2 text-sm">
                記録を作成
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record._id} className="border-l-4 border-purple-400 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {record.title}
                    </h3>
                    <span className="text-2xl">{record.mood}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {record.qualification?.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(record.createdAt).toLocaleDateString('ja-JP')}</span>
                    {record.studyHours && (
                      <span>{record.studyHours}時間</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link to="/study-timeline" className="text-purple-600 hover:text-purple-700 text-sm">
                  すべての記録を見る →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/study-records/new"
          className="card-modern p-4 text-center hover:scale-105 transition-transform duration-200 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✍️</div>
          <div className="font-semibold text-gray-900">学習記録</div>
          <div className="text-sm text-gray-600">今日の学習を記録</div>
        </Link>
        
        <Link
          to="/qualifications"
          className="card-modern p-4 text-center hover:scale-105 transition-transform duration-200 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
          <div className="font-semibold text-gray-900">資格管理</div>
          <div className="text-sm text-gray-600">目標資格を設定</div>
        </Link>
        
        <Link
          to="/study-timeline"
          className="card-modern p-4 text-center hover:scale-105 transition-transform duration-200 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
          <div className="font-semibold text-gray-900">タイムライン</div>
          <div className="text-sm text-gray-600">みんなの学習記録</div>
        </Link>
        
        <Link
          to="/articles"
          className="card-modern p-4 text-center hover:scale-105 transition-transform duration-200 group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
          <div className="font-semibold text-gray-900">記事</div>
          <div className="text-sm text-gray-600">学習記事を読む</div>
        </Link>
      </div>
    </div>
  );
};

export default StudyDashboard;