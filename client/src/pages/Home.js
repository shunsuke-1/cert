import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import ArticleCard from "../components/ArticleCard";
import CreateArticle from "../components/CreateArticle";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const [popularTags, setPopularTags] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalLikes: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm, sortBy, filterTag]);

  useEffect(() => {
    // Only fetch stats once when component mounts
    fetchAllArticlesForStats();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      extractPopularTags();
    }
  }, [articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get("/api/articles", { params });
      let fetchedArticles = response.data.articles;
      
      // Client-side filtering and sorting since backend doesn't support it yet
      if (filterTag) {
        fetchedArticles = fetchedArticles.filter(article => 
          article.tags && article.tags.includes(filterTag)
        );
      }
      
      // Client-side sorting
      switch (sortBy) {
        case 'popular':
          fetchedArticles.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'mostLiked':
          fetchedArticles.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
          break;
        case 'mostViewed':
          fetchedArticles.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        default: // newest
          fetchedArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setArticles(fetchedArticles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractPopularTags = () => {
    // Extract tags from current articles and count them
    const tagCounts = {};
    articles.forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ _id: tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    setPopularTags(sortedTags);
  };

  const fetchAllArticlesForStats = async () => {
    try {
      setStatsLoading(true);
      // Fetch all articles for accurate community stats (use a high limit to get all)
      const response = await api.get("/api/articles", { params: { limit: 10000 } });
      const allArticles = response.data.articles || [];
      
      console.log("Fetched articles for stats:", allArticles.length); // Debug log
      console.log("Sample article:", allArticles[0]); // Debug log
      
      const totalLikes = allArticles.reduce((sum, article) => {
        const likesCount = article.likes?.length || 0;
        return sum + likesCount;
      }, 0);
      
      const uniqueAuthors = new Set(
        allArticles
          .map(article => article.author?._id)
          .filter(id => id) // Filter out null/undefined
      ).size;
      
      const stats = {
        totalArticles: allArticles.length,
        totalUsers: uniqueAuthors,
        totalLikes: totalLikes
      };
      
      console.log("Calculated stats:", stats); // Debug log
      setCommunityStats(stats);
    } catch (error) {
      console.error("Error fetching articles for stats:", error);
      console.error("Error details:", error.response?.data || error.message);
      // Set default stats on error
      setCommunityStats({
        totalArticles: 0,
        totalUsers: 0,
        totalLikes: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleArticleCreated = (newArticle) => {
    // 新しい記事を一覧に追加してフォームを閉じる
    setArticles([newArticle, ...articles]);
    setShowCreateForm(false);
    // Refresh stats when new article is created
    fetchAllArticlesForStats();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setFilterTag("");
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleTagFilter = (tag) => {
    setFilterTag(tag === filterTag ? "" : tag);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleLike = (articleId, newLikeCount) => {
    setArticles(
      articles.map((article) =>
        article._id === articleId
          ? { ...article, likes: Array(newLikeCount).fill(null) }
          : article
      )
    );
  };

  return (
    <div>
      {/* Hero セクション */}
      <section className="relative py-16 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-5 right-5 sm:top-10 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 left-10 sm:-bottom-8 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            資格学習を
            <span className="text-gradient block">もっと楽しく</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2">
            資格試験に関する知識や経験を共有し、<br className="hidden sm:block" />
            一緒に成長していくコミュニティ
          </p>
          {!currentUser && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
              <Link
                to="/register"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                コミュニティに参加
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                ログイン
              </Link>
            </div>
          )}
          
          {/* Community Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">
                {statsLoading ? "..." : `${communityStats.totalArticles || 0}+`}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">記事</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                {statsLoading ? "..." : `${communityStats.totalUsers || 0}+`}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">ユーザー</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-pink-600 mb-1 sm:mb-2">
                {statsLoading ? "..." : `${communityStats.totalLikes || 0}+`}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">いいね</div>
            </div>
          </div>
        </div>
      </section>

      {/* 記事セクション */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">記事一覧</h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">最新の学習記事をチェックしよう</p>
          </div>
          {currentUser && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`${showCreateForm ? 'btn-secondary' : 'btn-primary'} text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto`}
            >
              {showCreateForm ? "キャンセル" : "✨ 記事を作成"}
            </button>
          )}
        </div>

        {/* 記事作成フォーム */}
        {showCreateForm && (
          <div className="mb-8 sm:mb-12">
            <CreateArticle
              onArticleCreated={handleArticleCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Featured Articles - Show top 3 most liked articles */}
        {articles.length > 0 && !searchTerm && !filterTag && (
          <div className="mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-6 text-center">
              ✨ 注目の記事
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {articles
                .slice()
                .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                .slice(0, 3)
                .map((article) => (
                <div key={article._id} className="card-modern p-6 group hover:scale-105 transition-transform duration-300">
                  <Link to={`/articles/${article._id}`}>
                    <h4 className="font-display font-semibold text-lg text-gray-900 group-hover:text-purple-600 mb-3 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>👁 {article.views || 0}</span>
                      <span>❤️ {article.likes?.length || 0}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-4 sm:space-y-6">
          <SearchBar onSearch={handleSearch} />
          
          {/* Sort and Filter Controls */}
          <div className="card-modern p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium text-gray-700">並び替え:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="newest">新着順</option>
                  <option value="popular">人気順</option>
                  <option value="mostLiked">いいね順</option>
                  <option value="mostViewed">閲覧数順</option>
                </select>
              </div>
              
              {filterTag && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">フィルター:</span>
                  <span className="tag-modern text-sm">#{filterTag}</span>
                  <button
                    onClick={() => handleTagFilter("")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            
            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700 mb-3 block">人気のタグ:</span>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => handleTagFilter(tag._id)}
                      className={`tag-modern text-sm transition-all duration-200 ${
                        filterTag === tag._id 
                          ? 'bg-purple-200 border-purple-400 text-purple-800' 
                          : 'hover:bg-purple-100'
                      }`}
                    >
                      #{tag._id} ({tag.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 記事リスト */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="card-modern p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">記事を読み込み中...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="card-modern p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
                {searchTerm ? "検索結果が見つかりません" : "まだ記事がありません"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "別のキーワードで検索してみてください" 
                  : "最初の記事を投稿してコミュニティを始めましょう！"
                }
              </p>
              {!searchTerm && currentUser && !showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary px-6 py-3"
                >
                  ✨ 最初の記事を作成
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onLike={handleLike}
              />
            ))}
            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 sm:mt-12">
                <div className="card-modern p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 sm:px-6 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700 text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">← 前へ</span>
                    <span className="sm:hidden">←</span>
                  </button>
                  <span className="px-2 sm:px-4 py-2 text-gray-700 font-semibold text-sm sm:text-base">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-6 py-2 rounded-lg border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-700 text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">次へ →</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
