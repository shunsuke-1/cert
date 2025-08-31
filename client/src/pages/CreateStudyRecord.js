import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const CreateStudyRecord = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [myQualifications, setMyQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    qualification: "",
    title: "",
    content: "",
    studyHours: "",
    mood: "😊",
    tags: "",
    isPublic: true,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchMyQualifications();
  }, [currentUser, navigate]);

  const fetchMyQualifications = async () => {
    try {
      const response = await api.get("/api/study-records/my-qualifications");
      setMyQualifications(response.data);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.qualification || !formData.title || !formData.content) {
      alert("必須項目を入力してください");
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        studyHours: formData.studyHours ? parseFloat(formData.studyHours) : undefined,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
      };

      await api.post("/api/study-records", submitData);
      navigate("/study-timeline");
    } catch (error) {
      console.error("Error creating study record:", error);
      alert("記録の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const moods = [
    { emoji: "😊", label: "良好" },
    { emoji: "😐", label: "普通" },
    { emoji: "😔", label: "疲れた" },
    { emoji: "🔥", label: "やる気満々" },
    { emoji: "😴", label: "眠い" },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
          学習記録を作成
        </h1>
        <p className="text-gray-700 text-lg">今日の学習内容を記録しよう</p>
      </div>

      {/* Form */}
      <div className="card-modern p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Qualification Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資格 *
            </label>
            {myQualifications.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  まず学習する資格を追加してください
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/qualifications")}
                  className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                >
                  資格を追加 →
                </button>
              </div>
            ) : (
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">資格を選択してください</option>
                {myQualifications.map((userQual) => (
                  <option key={userQual._id} value={userQual.qualification._id}>
                    {userQual.qualification.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例: 第3章の復習と練習問題"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              学習内容 *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="今日学習した内容、気づいたこと、つまづいた点などを記録しましょう..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              rows="6"
              required
            />
          </div>

          {/* Study Hours and Mood */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学習時間（時間）
              </label>
              <input
                type="number"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleChange}
                placeholder="2.5"
                min="0"
                max="24"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                今日の気分
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood: mood.emoji }))}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      formData.mood === mood.emoji
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={mood.label}
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <div className="text-xs text-gray-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="例: 基礎, 練習問題, 復習"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              タグをカンマで区切って入力してください
            </p>
          </div>

          {/* Privacy */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              この記録を公開する（他のユーザーがタイムラインで見ることができます）
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || myQualifications.length === 0}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "作成中..." : "📝 記録を作成"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/study-dashboard")}
              className="btn-secondary px-6 py-3"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 card-modern p-6 bg-blue-50 border-blue-200">
        <h3 className="font-display font-bold text-blue-900 mb-3">
          💡 記録のコツ
        </h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• 学習した内容だけでなく、感じたことや気づきも記録しましょう</li>
          <li>• つまづいた点や疑問点も書いておくと後で振り返りやすくなります</li>
          <li>• 定期的に記録することで学習の習慣化につながります</li>
          <li>• 他の人の記録を見ることでモチベーション向上にもつながります</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateStudyRecord;