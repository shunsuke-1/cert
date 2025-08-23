import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import CreateArticle from "../components/CreateArticle";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 編集モードやプロフィール内容
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    bio: currentUser?.profile?.bio || "",
    studyGoals: currentUser?.profile?.studyGoals || [],
    certifications: currentUser?.profile?.certifications || [],
  });

  // 投稿一覧・ページング
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 統計 & フォロー数
  const [stats, setStats] = useState({ articleCount: 0, totalLikes: 0 });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchMyArticles();
    fetchUserStats();
    fetchFollowCounts();
  }, [currentUser, navigate, currentPage]);

  // 自分の投稿を取得
  const fetchMyArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/articles/my-articles", {
        params: { page: currentPage, limit: 10 },
      });
      setArticles(res.data.articles);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching my articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // 統計取得
  const fetchUserStats = async () => {
    try {
      const userId = currentUser.id || currentUser._id;
      const res = await api.get(`/api/users/stats/${userId}`);
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  // フォロー数取得
  const fetchFollowCounts = async () => {
    try {
      const userId = currentUser.id || currentUser._id;
      const res = await api.get(`/api/users/${userId}`);
      setFollowersCount(res.data.followers?.length || 0);
      setFollowingCount(res.data.following?.length || 0);
    } catch (error) {
      console.error("Error fetching follow counts:", error);
    }
  };

  // 記事投稿後の処理
  const handleArticleCreated = (newArticle) => {
    setArticles([newArticle, ...articles]);
    setShowCreateForm(false);
    fetchUserStats();
    fetchFollowCounts();
  };

  // 記事削除
  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm("この記事を削除しますか？")) return;
    try {
      await api.delete(`/api/articles/${articleId}`);
      setArticles(articles.filter((article) => article._id !== articleId));
      fetchUserStats();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("記事の削除に失敗しました");
    }
  };

  // プロフィール保存
  const handleSave = async () => {
    try {
      await api.put("/api/users/profile", { profile });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("プロフィールの更新に失敗しました");
    }
  };

  // 日付フォーマット
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 未ログイン時の表示
  if (!currentUser) {
    return (
      <div className="text-center">
        <p>プロフィールを表示するにはログインしてください。</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* プロフィールセクション */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentUser.username}</h1>
            <p className="text-gray-600">{currentUser.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              登録日:{" "}
              {new Date(currentUser.createdAt).toLocaleDateString("ja-JP")}
            </p>
            <p className="mt-2">
              <Link to="/following" className="text-blue-600 hover:underline">
                フォロー中: {followingCount}人
              </Link>{" "}
              / フォロワー: {followersCount}人
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? "キャンセル" : "プロフィール編集"}
          </button>
        </div>

        {/* 自己紹介と資格の編集 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 自己紹介 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">自己紹介</h2>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="あなたの自己紹介と資格取得の目標を教えてください..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                rows="4"
              />
            ) : (
              <p className="text-gray-700">
                {profile.bio || "まだ自己紹介が追加されていません。"}
              </p>
            )}
          </div>
          {/* 資格 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">資格</h2>
            {isEditing ? (
              <div className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded"
                  >
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...profile.certifications];
                        newCerts[index].name = e.target.value;
                        setProfile({
                          ...profile,
                          certifications: newCerts,
                        });
                      }}
                      placeholder="資格名"
                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={cert.status}
                      onChange={(e) => {
                        const newCerts = [...profile.certifications];
                        newCerts[index].status = e.target.value;
                        setProfile({
                          ...profile,
                          certifications: newCerts,
                        });
                      }}
                      className="px-2 py-1 border rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="planning">計画中</option>
                      <option value="studying">学習中</option>
                      <option value="passed">合格</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const newCerts = profile.certifications.filter(
                          (_, i) => i !== index
                        );
                        setProfile({
                          ...profile,
                          certifications: newCerts,
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setProfile({
                      ...profile,
                      certifications: [
                        ...profile.certifications,
                        { name: "", status: "planning" },
                      ],
                    });
                  }}
                  className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-blue-500 hover:text-blue-600"
                >
                  + 資格を追加
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.certifications.length > 0 ? (
                  profile.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{cert.name}</span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          cert.status === "passed"
                            ? "bg-green-100 text-green-800"
                            : cert.status === "studying"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {cert.status === "passed"
                          ? "合格"
                          : cert.status === "studying"
                          ? "学習中"
                          : "計画中"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    まだ資格が追加されていません。
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 学習目標 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">学習目標</h2>
          {isEditing ? (
            <textarea
              value={profile.studyGoals.join("\n")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  studyGoals: e.target.value
                    .split("\n")
                    .filter((goal) => goal.trim()),
                })
              }
              placeholder="学習目標を入力してください（1行に1つ）"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              rows="3"
            />
          ) : profile.studyGoals.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {profile.studyGoals.map((goal, index) => (
                <li key={index} className="text-gray-700">
                  {goal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">まだ学習目標が設定されていません。</p>
          )}
        </div>

        {isEditing && (
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              変更を保存
            </button>
          </div>
        )}

        {/* コミュニティ統計 */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">コミュニティ統計</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalLikes}
              </div>
              <div className="text-sm text-gray-600">獲得いいね数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {stats.articleCount}
              </div>
              <div className="text-sm text-gray-600">投稿記事数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 記事管理セクション */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            投稿した記事 ({articles.length}件)
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showCreateForm ? "キャンセル" : "新しい記事を作成"}
          </button>
        </div>

        {/* 作成フォーム表示中は一覧を隠す */}
        {showCreateForm ? (
          <div className="mb-8">
            <CreateArticle
              onArticleCreated={handleArticleCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">記事を読み込み中...</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Link to={`/articles/${article._id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
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
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>投稿日: {formatDate(article.createdAt)}</span>
                        <span> {article.views || 0} 閲覧</span>
                        <span>❤️ {article.likes?.length || 0} いいね</span>
                        {article.updatedAt !== article.createdAt && (
                          <span>更新日: {formatDate(article.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        to={`/articles/${article._id}`}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                      >
                        表示
                      </Link>
                      <Link
                        to={`/articles/${article._id}/edit`}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  前へ
                </button>
                <span className="px-4 py-2 text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              まだ記事がありません
            </h3>
            <p className="text-gray-600 mb-4">
              最初の記事を投稿してみましょう！
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              記事を作成
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
