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
    <div className="card-modern p-8 mb-8">
      <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">新しい記事を作成</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
