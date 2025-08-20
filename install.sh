#!/bin/bash

echo "🚀 資格試験コミュニティをセットアップ中..."

# Install root dependencies
echo "📦 ルート依存関係をインストール中..."
npm install

# Install server dependencies
echo "📦 サーバー依存関係をインストール中..."
cd server && npm install && cd ..

# Install client dependencies
echo "📦 クライアント依存関係をインストール中..."
cd client && npm install && cd ..

echo "✅ インストール完了！"
echo ""
echo "🔧 セットアップ手順:"
echo "1. システムでMongoDBが実行されていることを確認してください"
echo "2. server/.envファイルでMongoDB URIとJWTシークレットを更新してください"
echo "3. 'npm run dev'を実行してサーバーとクライアントの両方を起動してください"
echo ""
echo "🌐 アプリケーションは以下のURLで利用できます:"
echo "   フロントエンド: http://localhost:3000"
echo "   バックエンド:  http://localhost:3001"