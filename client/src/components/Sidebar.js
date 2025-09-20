import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const sections = [
    {
      title: "基本概念",
      items: [
        { path: "/", label: "はじめに" },
        { path: "/basic-types", label: "基本データ型" },
      ]
    },
    {
      title: "ビューとUI",
      items: [
        { path: "/views", label: "ビュー" },
        { path: "/modifiers", label: "モディファイア" },
        { path: "/layout", label: "レイアウト" },
      ]
    },
    {
      title: "ナビゲーション",
      items: [
        { path: "/navigation", label: "ナビゲーション" },
      ]
    },
    {
      title: "データとロジック",
      items: [
        { path: "/data-flow", label: "データフロー" },
      ]
    },
    {
      title: "インタラクション",
      items: [
        { path: "/animation", label: "アニメーション" },
        { path: "/gestures", label: "ジェスチャー" },
      ]
    },
    {
      title: "グラフィックス",
      items: [
        { path: "/drawing", label: "描画とグラフィックス" },
      ]
    },
    {
      title: "高度なトピック",
      items: [
        { path: "/performance", label: "パフォーマンス最適化" },
        { path: "/testing", label: "テストとデバッグ" },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {sections.map((section, index) => (
        <div key={index} className="sidebar-section">
          <h3 className="sidebar-title">{section.title}</h3>
          <nav>
            {section.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}
      
      {/* Quick Reference */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">クイックリファレンス</h3>
        <div className="text-xs text-gray-600 space-y-2">
          <div>
            <strong>@State</strong><br />
            ローカル状態管理
          </div>
          <div>
            <strong>@Binding</strong><br />
            双方向データバインディング
          </div>
          <div>
            <strong>@ObservedObject</strong><br />
            外部オブジェクトの監視
          </div>
          <div>
            <strong>@EnvironmentObject</strong><br />
            環境オブジェクト
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;