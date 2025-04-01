# Open JLPT

Open JLPT は、日本語能力試験（JLPT）の学習と練習のためのオープンソースプラットフォームです。このプロジェクトは、学習者が JLPT 試験の準備をサポートし、包括的な学習リソースと練習ツールを提供することを目的としています。

## 特徴

- 多様な練習モード：語彙、文法、読解、聴解
- N5 から N1 レベルまでの包括的なコンテンツ
- パーソナライズされた学習計画と進捗追跡
- レスポンシブデザインによる複数デバイス対応

## プロジェクト構造

このプロジェクトは monorepo アーキテクチャを使用し、以下の主要部分から構成されています：

- `client`: Vue 3 と Vite を使用したフロントエンドアプリケーション
- `server`: Elysia + Bun.js で構築されたバックエンドサービス
- `models`: 共有データモデル
- `shared`: クライアントとサーバー間で共有されるユーティリティと機能

## 使い方

### 必要条件

- Node.js (v18 以上)
- PNPM (v8 以上推奨)

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/open-jlpt.git
cd open-jlpt

# 依存関係のインストール
pnpm install
```

### 開発

```bash
# 開発サーバーの起動
pnpm -F @root/client dev

# バックエンドサービスの起動
pnpm -F @root/server dev
```

### ビルドとデプロイ

```bash
# フロントエンドアプリケーションのビルド
pnpm -F @root/client build

# バックエンドアプリケーションのビルド
pnpm -F @root/server build
```

## 貢献ガイド

貢献は大歓迎です！issue や pull request を通じてプロジェクト開発に参加してください。

## ライセンス

このプロジェクトは ISC ライセンスの下で提供されています。
