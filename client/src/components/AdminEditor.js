import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminEditor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pages = [
    { id: "home", title: "ホーム", file: "Home.js" },
    { id: "basic-types", title: "基本データ型", file: "BasicTypes.js" },
    { id: "views", title: "ビュー", file: "Views.js" },
    { id: "modifiers", title: "モディファイア", file: "Modifiers.js" },
    { id: "layout", title: "レイアウト", file: "Layout.js" },
    { id: "navigation", title: "ナビゲーション", file: "Navigation.js" },
    { id: "data-flow", title: "データフロー", file: "DataFlow.js" },
    { id: "animation", title: "アニメーション", file: "Animation.js" },
    { id: "gestures", title: "ジェスチャー", file: "Gestures.js" },
    { id: "drawing", title: "描画とグラフィックス", file: "Drawing.js" },
    { id: "performance", title: "パフォーマンス最適化", file: "Performance.js" },
    { id: "testing", title: "テストとデバッグ", file: "Testing.js" },
  ];

  useEffect(() => {
    // Check URL parameters for authentication
    const authKey = searchParams.get("key");
    const storedAuth = localStorage.getItem("admin-auth");
    
    if (authKey === "swiftui-admin-2024") {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "authenticated");
      // Clean URL by removing the key parameter
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete("key");
      window.history.replaceState({}, "", newUrl);
    } else if (storedAuth === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setAuthError("アクセスが拒否されました。正しいURLでアクセスしてください。");
    }
  }, [searchParams]);



  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
    setSelectedPage("");
    setContent("");
    setIsEditing(false);
  };

  const loadPageContent = async (pageId) => {
    try {
      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      // In a real implementation, this would fetch from your backend
      // For now, we'll simulate loading the content
      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setOriginalContent(data.content);
      } else {
        // Fallback: load from the actual component file
        setContent(getDefaultContent(pageId));
        setOriginalContent(getDefaultContent(pageId));
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setContent(getDefaultContent(pageId));
      setOriginalContent(getDefaultContent(pageId));
    }
  };

  const getDefaultContent = (pageId) => {
    // This would contain the actual content from your pages
    const defaultContents = {
      "home": `# SwiftUI リファレンス

SwiftUIは、Appleが開発した宣言的なユーザーインターフェースフレームワークです。
iOS、macOS、watchOS、tvOSアプリケーションの開発に使用され、
直感的で効率的なUI構築を可能にします。

## このリファレンスについて

このリファレンスは、SwiftUIを使用したiOSアプリ開発の包括的なガイドです。
基本的な概念から高度なテクニックまで、実用的なコード例とともに解説しています。

> **📱 対象バージョン**  
> このリファレンスは iOS 15.0+ / SwiftUI 3.0+ を対象としています。

## 基本的な例

以下は、SwiftUIの基本的な「Hello, World!」アプリの例です：

\`\`\`swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello, World!")
                .font(.largeTitle)
                .foregroundColor(.blue)
            
            Button("タップしてください") {
                print("ボタンがタップされました")
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)
        }
        .padding()
    }
}
\`\`\``,
      // Add other default contents here...
    };

    return defaultContents[pageId] || "# 新しいページ\n\nここにコンテンツを追加してください。";
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${selectedPage}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setOriginalContent(content);
        setIsEditing(false);
        setMessage("保存しました！");
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("保存に失敗しました");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("保存に失敗しました");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewWindow = window.open("", "_blank");
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>プレビュー</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #3776ab; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
            h2 { color: #3776ab; margin-top: 2rem; }
            code { background: #f8f9fa; padding: 2px 4px; border-radius: 4px; }
            pre { background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto; }
            blockquote { background: #e7f3ff; border-left: 4px solid #3776ab; padding: 1rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          ${markdownToHtml(content)}
        </body>
      </html>
    `);
  };

  const markdownToHtml = (markdown) => {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900">アクセス拒否</h1>
            <p className="text-gray-600 mt-2">このページにアクセスする権限がありません</p>
          </div>
          
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800 text-sm text-center">{authError}</div>
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              ← サイトに戻る
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              管理者の方は正しいURLでアクセスしてください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold text-gray-900">管理モード</h1>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                編集中
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open("/", "_blank")}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>サイトを表示</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>終了</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ページ一覧</h2>
              <div className="space-y-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      setSelectedPage(page.id);
                      loadPageContent(page.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedPage === page.id
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPage ? (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Editor Header */}
                <div className="border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {pages.find(p => p.id === selectedPage)?.title}
                    </h2>
                    <div className="flex items-center space-x-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handlePreview}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                          >
                            プレビュー
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isSaving ? "保存中..." : "保存"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          編集
                        </button>
                      )}
                    </div>
                  </div>
                  {message && (
                    <div className="mt-2 text-green-600 text-sm">{message}</div>
                  )}
                </div>

                {/* Editor Content */}
                <div className="p-6">
                  {isEditing ? (
                    <div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">
                          Markdownで記述してください。コードブロックは ```swift で囲んでください。
                        </div>
                      </div>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ここにMarkdownコンテンツを入力してください..."
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <div 
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                        className="markdown-content"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ページを選択してください</h3>
                  <p className="text-gray-600">左側のリストからページを選択して編集を開始してください。</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;