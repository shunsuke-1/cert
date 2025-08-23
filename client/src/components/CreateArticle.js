import React, { useState } from "react";
import api from "../api";
import RichTextEditor from "./RichTextEditor";

const CreateArticle = ({ onArticleCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("タイトルと内容は必須です");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.post("/api/articles", formData);
      onArticleCreated(response.data);
      setFormData({ title: "", content: "", tags: [] });
      setTagInput("");
    } catch (error) {
      setError(error.response?.data?.message || "記事の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="card-modern p-8 mb-8 border-l-4 border-purple-500 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900">新しい記事を作成</h2>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3">
            タイトル
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
            placeholder="記事のタイトルを入力してください"
            maxLength={200}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3">
            内容
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-800 text-lg font-semibold mb-3">
            タグ
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            placeholder="タグを入力してEnterキーを押してください"
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-modern flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            type="submit"
            className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "投稿中..." : "✨ 記事を投稿"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
