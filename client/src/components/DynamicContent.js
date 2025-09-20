import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DynamicContent = ({ pageId, title }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      } else {
        // Fallback to default content
        setContent(getDefaultContent(pageId));
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setContent(getDefaultContent(pageId));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = (pageId) => {
    // Fallback content if API fails
    return `# ${title}

コンテンツを読み込み中です...

管理者の方は[管理画面](/admin)からコンテンツを編集できます。`;
  };

  const markdownToHtml = (markdown) => {
    if (!markdown) return "";
    
    return markdown
      // Headers
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Code blocks with syntax highlighting
      .replace(/```swift\n([\s\S]*?)\n```/g, '<div class="code-example"><div class="code-header">Swift</div><div class="code-content"><pre><code>$1</code></pre></div></div>')
      .replace(/```([\s\S]*?)```/g, '<div class="code-example"><div class="code-header">コード例</div><div class="code-content"><pre><code>$1</code></pre></div></div>')
      
      // Note boxes
      .replace(/^> \*\*(.*?)\*\*(.*$)/gim, '<div class="note"><div class="note-title">$1</div><p>$2</p></div>')
      .replace(/^> ⚠️ (.*$)/gim, '<div class="warning"><div class="warning-title">⚠️ 注意</div><p>$1</p></div>')
      .replace(/^> 💡 (.*$)/gim, '<div class="note"><div class="note-title">💡 ヒント</div><p>$1</p></div>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      
      // Clean up HTML
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><div/g, '<div')
      .replace(/<\/div><\/p>/g, '</div>')
      .replace(/<p><li>/g, '<li>')
      .replace(/<\/li><\/p>/g, '</li>')
      .replace(/<p><\/p>/g, '')
      
      // Wrap lists
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '');
  };

  if (loading) {
    return (
      <div className="content">
        <div className="breadcrumb">
          <Link to="/">SwiftUI リファレンス</Link> &gt; {title}
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/">SwiftUI リファレンス</Link> &gt; {title}
      </div>
      
      <div 
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
        className="markdown-content"
      />
    </div>
  );
};

export default DynamicContent;