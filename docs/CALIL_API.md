# カーリル図書館API 仕様メモ

`/web/src/lib/calil.ts` から呼び出している外部API（カーリル）の概要と、
このリポジトリ上での利用方針をまとめたドキュメント。

公式仕様: https://calil.jp/doc/api.html

## 認証

- すべてのリクエストにアプリケーションキー (`appkey`) が必須
- `web/.env.local` に `CALIL_APP_KEY` を設定
- 本リポジトリではキーは **サーバーサイド** （Route Handler）からのみ参照する

```
CALIL_APP_KEY=your_calil_app_key
```

未設定の場合、`/libraries` ページは設定方法を案内するエラー表示になる。

## エンドポイント

すべて HTTPS のみ（`https://api.calil.jp/...`）。

### 1. 図書館データベース `/library`

指定条件で図書館一覧を取得する。本リポジトリでは「現在地から近い図書館を探す」用途で
`geocode` パラメータを利用している。

主なパラメータ:

| キー | 必須 | 例 | 備考 |
| --- | --- | --- | --- |
| `appkey` | ✅ | - | アプリケーションキー |
| `geocode` | △ | `139.7454,35.6586` | `経度,緯度` の順。`pref` / `systemid` のいずれかと排他で必須 |
| `pref` | △ | `東京都` | 都道府県 |
| `city` | - | `渋谷区` | `pref` とセット |
| `systemid` | △ | `Tokyo_Setagaya` | 図書館システムID |
| `limit` | - | `10` | 取得件数 |
| `format` | - | `json` | デフォルトは `xml` |
| `callback` | - | `no` | JSONとして受け取る場合は空白を指定 |

レスポンス（`format=json` のとき）:

```jsonc
[
  {
    "systemid": "Tokyo_NDL",
    "systemname": "国立国会図書館",
    "libkey": "東京本館",
    "libid": "104106",
    "short": "東京本館",
    "formal": "国立国会図書館 東京本館",
    "url_pc": "http://www.ndl.go.jp/",
    "address": "東京都千代田区永田町1-10-1",
    "pref": "東京都",
    "city": "千代田区",
    "post": "100-8924",
    "tel": "03-3581-2331",
    "geocode": "139.744202,35.6783682",
    "category": "LARGE",   // SMALL/MEDIUM/LARGE/UNIV/SPECIAL/BM
    "image": "",
    "distance": 1.234       // geocode指定時のみ。単位はkm
  }
]
```

### 2. 蔵書検索 `/check`

ISBN とシステムIDで蔵書状況を問い合わせる。
本リポジトリでは現在 **未使用**（将来 `/libraries/[systemid]/books` 等で利用予定）。

- 初回呼び出しで `continue: 1` が返ったら、`session` を引き渡しながら
  **2秒以上の間隔** でポーリングする
- 1IPあたり 1000書籍リクエスト/時の制限あり
- 同時問い合わせは 100書籍リクエストまで

## 利用制限

- `/library`: 1000リクエスト/時 (アプリケーションキー × IP)
- `/check`: 1000書籍リクエスト/時 (アプリケーションキー × IP)
- ポーリング自体は書籍リクエストを消費しない

## カーリルへのリンク義務

蔵書ステータス（「貸出可」など）や図書館名を表示する際は、
カーリルのページへのリンクを併記すること。

- 本: `https://calil.jp/book/{ISBN10}`
- 図書館: `https://calil.jp/library/{libid}/{図書館の正式名称}`
- 図書館 (libkey + systemid): `https://calil.jp/library/search?s={systemid}&k={libkey}`

## カテゴリ凡例

| code | 意味 |
| --- | --- |
| `SMALL` | 図書室・公民館 |
| `MEDIUM` | 図書館（地域） |
| `LARGE` | 図書館（広域） |
| `UNIV` | 大学 |
| `SPECIAL` | 専門 |
| `BM` | 移動・BM |
