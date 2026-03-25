# こども手帳

子育て情報を家族でまとめて管理するアプリです。

## 起動方法

```bash
cd child-info-app
npm install
npm run dev
```

## ファイル構成

```
child-info-app/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── postcss.config.js
├── tailwind.config.ts       # カスタムカラーパレット定義
├── README.md
└── src/
    ├── main.tsx             # エントリーポイント
    ├── App.tsx              # ルートコンポーネント・localStorage管理
    ├── index.css            # Tailwindベース + グローバルスタイル
    ├── types.ts             # 全型定義（Child / FamilyInfo / AppData など）
    ├── constants.ts         # 全定数（カラー・選択肢・初期値 など）
    ├── components/
    │   ├── Header.tsx       # ヘッダー（アプリ名・ロゴ）
    │   ├── ChildTabs.tsx    # 子供タブ切り替え・削除確認ダイアログ
    │   ├── ChildCard.tsx    # 子供の基本情報カード
    │   ├── AddChildModal.tsx # 子供追加モーダル・バリデーション
    │   ├── FamilyInfo.tsx   # 家族共通情報（折りたたみ式）
    │   └── EmptyState.tsx   # 子供0人のときの案内画面
    └── hooks/
        ├── useChildren.ts   # 子供の追加・更新・削除ロジック
        └── useFamilyInfo.ts # 家族情報の更新ロジック
```

## データ構造（localStorage）

`AppData` 型でまとめて保存。バージョン管理付きで将来のマイグレーションに対応。

```ts
{
  version: 1,
  children: Child[],
  familyInfo: FamilyInfo
}
```

## カラーパレット

| Tailwindクラス | カラーコード | 用途 |
|---|---|---|
| `bg-cream` | #F1E5D1 | アプリ背景 |
| `bg-pink-soft` | #DBB5B5 | カード・サブ背景 |
| `bg-pink-muted` | #C39898 | ボタン・アクセント |
| `text-rose-brown` | #987070 | ヘッダー・ラベル |
| `text-dark-brown` | #5a3a3a | 本文テキスト |

---

## 実装済み（ステップ①）

- [x] ヘッダー
- [x] 子供の追加・タブ切り替え・削除（確認ダイアログ付き）
- [x] 子供0人時の案内表示
- [x] 家族共通情報（保護者名・緊急連絡先・住所）
- [x] localStorage へのデータ保存・読み込み

## 今後の追加予定

- [ ] ステップ②：タスク管理（お知らせ・持ち物・提出物）
- [ ] ステップ③：医療情報（アレルギー・かかりつけ医・予防接種記録）
- [ ] ステップ④：成長記録（身長・体重グラフ）
- [ ] ステップ⑤：行事カレンダー
