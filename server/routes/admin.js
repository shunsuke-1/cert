const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer swiftui-admin-2024") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Content storage - in production, use a database
const contentStorage = new Map();

// Page configurations
const pages = {
  "home": { title: "ホーム", file: "Home.js" },
  "basic-types": { title: "基本データ型", file: "BasicTypes.js" },
  "views": { title: "ビュー", file: "Views.js" },
  "modifiers": { title: "モディファイア", file: "Modifiers.js" },
  "layout": { title: "レイアウト", file: "Layout.js" },
  "navigation": { title: "ナビゲーション", file: "Navigation.js" },
  "data-flow": { title: "データフロー", file: "DataFlow.js" },
  "animation": { title: "アニメーション", file: "Animation.js" },
  "gestures": { title: "ジェスチャー", file: "Gestures.js" },
  "drawing": { title: "描画とグラフィックス", file: "Drawing.js" },
  "performance": { title: "パフォーマンス最適化", file: "Performance.js" },
  "testing": { title: "テストとデバッグ", file: "Testing.js" },
};

// Get page content
router.get("/pages/:pageId", async (req, res) => {
  try {
    const { pageId } = req.params;
    
    if (!pages[pageId]) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Check if content exists in storage
    if (contentStorage.has(pageId)) {
      return res.json({ content: contentStorage.get(pageId) });
    }

    // Load default content based on page
    const defaultContent = getDefaultContent(pageId);
    contentStorage.set(pageId, defaultContent);
    
    res.json({ content: defaultContent });
  } catch (error) {
    console.error("Error getting page content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update page content
router.put("/pages/:pageId", async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content } = req.body;
    
    if (!pages[pageId]) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Store content
    contentStorage.set(pageId, content);
    
    // In production, you might want to save to a database or file
    // await saveContentToFile(pageId, content);
    
    res.json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating page content:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all pages
router.get("/pages", (req, res) => {
  const pageList = Object.entries(pages).map(([id, config]) => ({
    id,
    title: config.title,
    file: config.file,
    hasContent: contentStorage.has(id)
  }));
  
  res.json(pageList);
});

// Convert markdown content to React component
router.post("/pages/:pageId/generate", async (req, res) => {
  try {
    const { pageId } = req.params;
    const content = contentStorage.get(pageId);
    
    if (!content) {
      return res.status(404).json({ message: "No content found for this page" });
    }

    const reactComponent = generateReactComponent(pageId, content);
    
    res.json({ component: reactComponent });
  } catch (error) {
    console.error("Error generating component:", error);
    res.status(500).json({ message: "Server error" });
  }
});

function getDefaultContent(pageId) {
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

## 主要なトピック

### 📱 ビューとUI
Text、Image、Button などの基本的なビューコンポーネントと、それらを組み合わせてUIを構築する方法を学びます。

### 📐 レイアウト
VStack、HStack、ZStack を使用したレイアウト設計と、複雑なUI構造の構築方法を解説します。

### 🔄 データフロー
@State、@Binding、@ObservedObject などの状態管理とデータバインディングの仕組みを理解します。

### ✨ アニメーション
SwiftUIの強力なアニメーション機能を使用して、魅力的でインタラクティブなUIを作成する方法を学びます。

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
\`\`\`

## 学習の進め方

1. **基本概念**から始めて、SwiftUIの基礎を理解する
2. **ビューとUI**で基本的なコンポーネントを学ぶ
3. **レイアウト**でUI構造の設計方法を習得する
4. **データフロー**で状態管理を理解する
5. **アニメーション**と**ジェスチャー**でインタラクティブなUIを作成する

> **⚠️ 注意**  
> SwiftUIは比較的新しいフレームワークのため、頻繁にアップデートされます。
> 最新の情報については、Apple公式ドキュメントも併せて参照してください。`,

    "basic-types": `# 基本データ型

SwiftUIアプリケーションで使用される基本的なデータ型について説明します。
これらの型を理解することで、効果的なSwiftUIアプリを構築できます。

## String（文字列）

文字列は、テキストデータを表現するために使用されます。
SwiftUIでは、\`Text\`ビューで文字列を表示します。

\`\`\`swift
struct ContentView: View {
    let greeting = "こんにちは、SwiftUI！"
    
    var body: some View {
        VStack {
            Text(greeting)
            Text("直接文字列を指定")
            Text("\\(greeting) - 文字列補間")
        }
    }
}
\`\`\`

## Int（整数）

整数値を表現するために使用されます。カウンターやインデックスなどに使用されます。

\`\`\`swift
struct CounterView: View {
    @State private var count = 0
    
    var body: some View {
        VStack {
            Text("カウント: \\(count)")
            
            Button("増加") {
                count += 1
            }
            
            Button("リセット") {
                count = 0
            }
        }
    }
}
\`\`\`

## Bool（真偽値）

真（true）または偽（false）の値を表現します。
条件分岐やトグルスイッチなどに使用されます。

\`\`\`swift
struct ToggleView: View {
    @State private var isOn = false
    
    var body: some View {
        VStack {
            Toggle("設定", isOn: $isOn)
                .padding()
            
            if isOn {
                Text("設定がオンです")
                    .foregroundColor(.green)
            } else {
                Text("設定がオフです")
                    .foregroundColor(.red)
            }
        }
    }
}
\`\`\``,

    "performance": `# パフォーマンス最適化

SwiftUIアプリのパフォーマンスを向上させるためのテクニックとベストプラクティスについて説明します。

## 基本的な最適化

### ビューの最適化

\`\`\`swift
struct OptimizedView: View {
    var body: some View {
        // 最適化されたビューの実装
        Text("パフォーマンス最適化")
    }
}
\`\`\`

> **💡 ヒント**  
> ビューの再描画を最小限に抑えることが重要です。`,

    "testing": `# テストとデバッグ

SwiftUIアプリのテストとデバッグ手法について説明します。

## 単体テスト

### ビューのテスト

\`\`\`swift
import XCTest
@testable import YourApp

class ViewTests: XCTestCase {
    func testViewRendering() {
        // テストの実装
    }
}
\`\`\`

## デバッグ技術

### プレビューでのデバッグ

\`\`\`swift
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .previewDisplayName("デバッグ用")
    }
}
\`\`\`

> **💡 ヒント**  
> Xcodeのプレビュー機能を活用してリアルタイムでデバッグしましょう。`,

    // Add more default contents for other pages...
  };

  return defaultContents[pageId] || `# ${pages[pageId]?.title || "新しいページ"}

ここにコンテンツを追加してください。

## セクション例

### サブセクション

テキストの例です。

\`\`\`swift
// コード例
struct ExampleView: View {
    var body: some View {
        Text("例")
    }
}
\`\`\`

> **💡 ヒント**  
> ここにヒントを書きます。`;
}

function generateReactComponent(pageId, content) {
  // Convert markdown content to React component
  // This is a simplified version - in production you'd want a more robust converter
  
  const componentName = pages[pageId].title.replace(/[^a-zA-Z0-9]/g, '');
  
  return `import React from "react";
import { Link } from "react-router-dom";

const ${componentName} = () => {
  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/">SwiftUI リファレンス</Link> &gt; ${pages[pageId].title}
      </div>
      
      <div dangerouslySetInnerHTML={{ __html: \`${markdownToHtml(content)}\` }} />
    </div>
  );
};

export default ${componentName};`;
}

function markdownToHtml(markdown) {
  // Simple markdown to HTML conversion
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```swift\n([\s\S]*?)\n```/g, '<div class="code-example"><div class="code-header">Swift</div><div class="code-content"><pre><code>$1</code></pre></div></div>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^> \*\*(.*?)\*\*(.*$)/gim, '<div class="note"><div class="note-title">$1</div><p>$2</p></div>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><div/g, '<div')
    .replace(/<\/div><\/p>/g, '</div>');
}

module.exports = router;