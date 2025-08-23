import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const FollowingList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchFollowing = async () => {
      try {
        // 自分のユーザーデータを取得して、フォローしているID一覧を得る
        const userId = currentUser._id || currentUser.id;
        const res = await api.get(`/api/users/${userId}`);
        const followingIds = res.data.following || [];
        // フォローしている各ユーザーの詳細を取得
        const userResponses = await Promise.all(
          followingIds.map((id) => api.get(`/api/users/${id}`))
        );
        setFollowingUsers(userResponses.map((r) => r.data));
      } catch (error) {
        console.error("Error fetching following users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-4">読み込み中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">フォロー中のユーザー</h2>
      {followingUsers.length > 0 ? (
        <ul className="space-y-3">
          {followingUsers.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center p-3 bg-white shadow-md rounded"
            >
              <Link
                to={`/users/${user._id}`}
                className="text-blue-600 hover:underline"
              >
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>まだ誰もフォローしていません。</p>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-blue-600 hover:underline"
      >
        戻る
      </button>
    </div>
  );
};

export default FollowingList;
