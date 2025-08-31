import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const Qualifications = () => {
  const { currentUser } = useAuth();
  const [qualifications, setQualifications] = useState([]);
  const [myQualifications, setMyQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQualification, setNewQualification] = useState({
    name: "",
    category: "IT",
    difficulty: "Intermediate",
    description: "",
    examDate: "",
  });

  useEffect(() => {
    fetchQualifications();
    fetchCategories();
    if (currentUser) {
      fetchMyQualifications();
    }
  }, [currentUser, searchTerm, selectedCategory]);

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await api.get("/api/qualifications", { params });
      setQualifications(response.data.qualifications);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/qualifications/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMyQualifications = async () => {
    try {
      const response = await api.get("/api/study-records/my-qualifications");
      setMyQualifications(response.data.map(uq => uq.qualification._id));
    } catch (error) {
      console.error("Error fetching my qualifications:", error);
    }
  };

  const handleCreateQualification = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/qualifications", newQualification);
      setQualifications([response.data, ...qualifications]);
      setNewQualification({
        name: "",
        category: "IT",
        difficulty: "Intermediate",
        description: "",
        examDate: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating qualification:", error);
    }
  };

  const handleAddToMyList = async (qualificationId) => {
    try {
      await api.post("/api/study-records/add-qualification", {
        qualificationId,
        status: "studying",
      });
      setMyQualifications([...myQualifications, qualificationId]);
    } catch (error) {
      console.error("Error adding qualification:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '初級';
      case 'Intermediate': return '中級';
      case 'Advanced': return '上級';
      case 'Expert': return '専門';
      default: return difficulty;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
            資格一覧
          </h1>
          <p className="text-gray-700 text-lg">目標とする資格を見つけて学習を始めよう</p>
        </div>
        {currentUser && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`${showCreateForm ? 'btn-secondary' : 'btn-primary'} px-4 py-2 mt-4 sm:mt-0`}
          >
            {showCreateForm ? "キャンセル" : "➕ 資格を追加"}
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card-modern p-6 mb-8">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
            新しい資格を追加
          </h2>
          <form onSubmit={handleCreateQualification} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  資格名 *
                </label>
                <input
                  type="text"
                  value={newQualification.name}
                  onChange={(e) => setNewQualification({...newQualification, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ *
                </label>
                <select
                  value={newQualification.category}
                  onChange={(e) => setNewQualification({...newQualification, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="IT">IT</option>
                  <option value="Business">ビジネス</option>
                  <option value="Language">語学</option>
                  <option value="Finance">金融</option>
                  <option value="Medical">医療</option>
                  <option value="Legal">法律</option>
                  <option value="Engineering">工学</option>
                  <option value="Other">その他</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  難易度
                </label>
                <select
                  value={newQualification.difficulty}
                  onChange={(e) => setNewQualification({...newQualification, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="Beginner">初級</option>
                  <option value="Intermediate">中級</option>
                  <option value="Advanced">上級</option>
                  <option value="Expert">専門</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  試験日
                </label>
                <input
                  type="date"
                  value={newQualification.examDate}
                  onChange={(e) => setNewQualification({...newQualification, examDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                value={newQualification.description}
                onChange={(e) => setNewQualification({...newQualification, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                rows="3"
                placeholder="資格の詳細や特徴を入力してください"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6 py-2">
                追加
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary px-6 py-2"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card-modern p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="資格名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Qualifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">資格を読み込み中...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualifications.map((qualification) => (
            <div key={qualification._id} className="card-modern p-6 hover:scale-105 transition-transform duration-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-bold text-lg text-gray-900 line-clamp-2">
                  {qualification.name}
                </h3>
                {qualification.isOfficial && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                    公式
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {qualification.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(qualification.difficulty)}`}>
                  {getDifficultyText(qualification.difficulty)}
                </span>
              </div>
              
              {qualification.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {qualification.description}
                </p>
              )}
              
              {qualification.examDate && (
                <p className="text-sm text-gray-500 mb-4">
                  📅 試験日: {new Date(qualification.examDate).toLocaleDateString('ja-JP')}
                </p>
              )}
              
              {currentUser && (
                <div className="mt-4">
                  {myQualifications.includes(qualification._id) ? (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      ✅ 学習中
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToMyList(qualification._id)}
                      className="btn-primary w-full py-2 text-sm"
                    >
                      学習リストに追加
                    </button>
                  )}
                </div>
              )}
              
              {qualification.createdBy && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    作成者: {qualification.createdBy.username}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!loading && qualifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            資格が見つかりません
          </h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、新しい資格を追加してください
          </p>
          {currentUser && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary px-6 py-3"
            >
              資格を追加
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Qualifications;