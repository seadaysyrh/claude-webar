# WebAR サンプルアプリ 仕様書
**Vue 3 + TypeScript + MindAR.js + A-Frame**
Ver 1.0 | 2026年4月

---

## 1. プロジェクト概要

Vue 3 / TypeScript の学習と WebAR 開発を同時に体験できる教育用アプリケーション。MindAR.js と A-Frame を組み合わせ、ブラウザだけで動作する画像認識 AR を実装する。

**学習ターゲット:** HTML/JS の基礎知識があり、Vue・TypeScript を勉強中の開発者

---

## 2. 技術スタック

| カテゴリ | ツール / ライブラリ | バージョン | 役割 |
|---|---|---|---|
| フレームワーク | Vue 3 (Composition API) | ^3.4 | UI コンポーネント管理 |
| 言語 | TypeScript | ^5.3 | 型安全な実装 |
| ビルドツール | Vite | ^5.2 | 高速な開発サーバー |
| AR エンジン | MindAR.js | ^1.2.5 | 画像認識 AR（CDN 読み込み） |
| 3D 描画 | A-Frame | ^1.5.0 | 宣言的な 3D シーン（CDN 読み込み） |
| ホスティング | GitHub Pages | 最新 | HTTPS 対応の無料公開 |
| CI/CD | GitHub Actions | 最新 | プッシュ時の自動ビルド & デプロイ |

---

## 3. 機能仕様

### 3-1. メイン機能

- **画像マーカー認識:** 指定した画像をカメラでかざすと 3D モデルが出現
- **モデル切替:** Vue のリアクティブなステートで表示モデルを動的に切替
- **AR 情報オーバーレイ:** 認識中マーカーに関連テキスト情報を表示
- **認識状態インジケーター:** 検出中 / 未検出をリアルタイムで UI 表示

### 3-2. 学習ポイント別の実装

| Vue / TS の概念 | 本サンプルでの実装箇所 | 難易度 |
|---|---|---|
| ref / reactive | AR 認識状態の管理 (`isDetected`, `currentModel`) | ★☆☆ |
| computed | 認識モデル名・説明文の算出 | ★☆☆ |
| emit / props | AR ビューアとコントロールパネルの連携 | ★★☆ |
| 型定義 (interface) | `ModelConfig`, `AREvent` の型設計 | ★★☆ |
| Composable | `useAR()` で AR ロジックを分離・再利用 | ★★★ |
| onMounted / onUnmounted | MindAR シーンの初期化・クリーンアップ | ★★☆ |

---

## 4. コンポーネント設計

### 4-1. ファイル構成

```
src/
├── App.vue                  # ルートコンポーネント
├── components/
│   ├── ARViewer.vue         # MindAR + A-Frame を内包する AR ビューア
│   ├── ModelSelector.vue    # 表示モデルを切替するコントロール UI
│   └── StatusBadge.vue      # AR 認識状態インジケーター
├── composables/
│   └── useAR.ts             # AR ロジックの Composable
└── types/
    └── ar.ts                # 共通型定義

public/
├── targets/
│   └── targets.mind         # MindAR Compiler で生成したマーカーファイル
└── models/
    ├── duck.glb
    ├── robot.glb
    └── astronaut.glb        # 表示する 3D モデル（GLB 形式）

.github/
└── workflows/
    └── deploy.yml           # GitHub Actions 自動デプロイ設定
```

### 4-2. コンポーネント責務

| コンポーネント | 責務 | 主なプロパティ / イベント |
|---|---|---|
| App.vue | 状態管理の起点、コンポーネントの組み合わせ | `selectedId (ref)`, `isDetected (ref)` |
| ARViewer.vue | MindAR 初期化・A-Frame シーンのレンダリング | props: `models`, `selectedId` / emit: `detected`, `lost` |
| ModelSelector.vue | モデル一覧表示・選択操作 | props: `models`, `selectedId` / emit: `select` |
| StatusBadge.vue | 認識状態をバッジ表示 | props: `isDetected` |
| useAR.ts | MindAR イベントのバインドと状態管理 | `isDetected`, `init()`, `destroy()` |

---

## 5. 主要型定義 (`types/ar.ts`)

```typescript
// 3D モデルの設定
interface ModelConfig {
  id: string
  label: string
  description: string
  glbPath: string      // .glb ファイルパス
  scale: string        // A-Frame scale 属性 例: "0.1 0.1 0.1"
  position: string     // A-Frame position 属性
}

// AR 認識イベント
interface AREvent {
  targetIndex: number
  timestamp: number
}

// AR ビューア状態
interface ARState {
  isDetected: boolean
  detectedAt: Date | null
  currentTargetIndex: number | null
}
```

---

## 6. 画面仕様

### 6-1. レイアウト

- 全画面カメラビュー（ARViewer）を背景に配置
- 画面上部: StatusBadge（認識中 / 待機中）
- 画面下部: ModelSelector（横スクロール可能なカード一覧）

### 6-2. AR 表示仕様

| 項目 | 仕様 |
|---|---|
| マーカー画像 | 任意の PNG / JPG（MindAR Compiler でビルド） |
| 表示モデル形式 | glTF / GLB 形式 |
| 認識精度閾値 | MindAR デフォルト（filterMinCF: 0.1） |
| 同時認識数 | 1 マーカー（学習用途のためシンプルに） |
| モデルアニメーション | GLB に含まれる `animation-mixer` で自動再生 |

---

## 7. GitHub Pages へのデプロイ

### 7-1. 自動デプロイの仕組み（GitHub Actions）

`.github/workflows/deploy.yml` に自動デプロイの設定が書かれている。

**GitHub Actions** とは、GitHub が提供する自動化サービス。  
コードをプッシュするだけで、以下の処理が自動で実行される。

```
git push → GitHub Actions 起動
              ↓
         Ubuntu サーバーを起動
              ↓
         npm ci          （依存パッケージをインストール）
              ↓
         npm run build   （Vite でビルド → dist/ を生成）
              ↓
         gh-pages ブランチへ dist/ をプッシュ
              ↓
         GitHub Pages が公開
```

`deploy.yml` がないと、コードを変更するたびに手動でビルド & プッシュが必要になる。

### 7-2. 初回セットアップ手順

1. **リポジトリを GitHub に作成してプッシュ**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

2. **`vite.config.ts` の `base` をリポジトリ名に合わせる**

```ts
base: '/リポジトリ名/',
```

3. **GitHub Pages を有効化**
   - リポジトリの **Settings → Pages** を開く
   - **Source** を `Deploy from a branch` に設定
   - **Branch** を `gh-pages` / `/ (root)` に設定して **Save**

4. **`main` にプッシュするたびに自動デプロイされる**

公開 URL: `https://ユーザー名.github.io/リポジトリ名/`

### 7-3. アセットの配置

| ファイル | 配置場所 | 作り方 |
|---|---|---|
| マーカーファイル | `public/targets/targets.mind` | MindAR Image Compiler でマーカー画像をコンパイル |
| 3D モデル | `public/models/モデル名.glb` | Sketchfab / Poly Pizza などから GLB をダウンロード |

ファイルを追加したら:

```bash
git add public/
git commit -m "Add assets"
git push
```

---

## 8. 学習ステップ（推奨順）

1. **環境構築:** Vite + Vue 3 + TypeScript プロジェクト作成
2. **型定義:** `types/ar.ts` に `ModelConfig` / `ARState` を実装
3. **StatusBadge:** props と TypeScript 型の基本を学ぶ
4. **ModelSelector:** emit でコンポーネント間通信を学ぶ
5. **useAR Composable:** MindAR 初期化ロジックを実装
6. **ARViewer:** A-Frame シーンと Vue ライフサイクルを統合
7. **App.vue:** 全コンポーネントを組み合わせて完成
8. **GitHub Pages:** Vite ビルド + HTTPS 公開

---

## 9. 参考リソース

| ツール | URL |
|---|---|
| MindAR.js 公式 | https://hiukim.github.io/mind-ar-js-doc/ |
| A-Frame 公式 | https://aframe.io/docs/ |
| Vue 3 公式（日本語） | https://ja.vuejs.org/ |
| MindAR Image Compiler | https://hiukim.github.io/mind-ar-js-doc/tools/compile |
| 無料 3D モデル (Poly Pizza) | https://polypizza.com/ |
| Sketchfab 無料モデル | https://sketchfab.com/features/free-3d-models |
| GitHub Actions 公式ドキュメント | https://docs.github.com/ja/actions |
