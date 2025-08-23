import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`/api/users/${id}`);
        setUser(userRes.data);
        setFollowersCount(userRes.data.followers?.length || 0);
        setFollowingCount(userRes.data.following?.length || 0);

        if (currentUser && userRes.data.followers) {
          setIsFollowing(userRes.data.followers.includes(currentUser._id));
        }

        const articlesRes = await axios.get(`/api/articles/user/${id}`);
        setArticles(articlesRes.data.articles);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(`/api/users/${id}/follow`);
      setFollowersCount(res.data.followersCount);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
        <p className="mb-2">{user.profile?.bio}</p>
        <p className="mb-2">
          フォロー中: {followingCount}人 / フォロワー: {followersCount}人
        </p>
        {currentUser && currentUser._id !== user._id && (
          <button
            className={`px-4 py-2 rounded ${
              isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}
            onClick={handleFollow}
          >
            {isFollowing ? "フォロー解除" : "フォロー"}
          </button>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">投稿一覧</h3>
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
