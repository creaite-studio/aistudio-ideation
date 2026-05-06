# Japan Travel Guide（Indonesia向け）記事一覧

← `content/_index.md` に戻る

言語: Bahasa Indonesia
プラットフォーム: KaryaKarsa（週次シリアル）
形式: 週1エピソード（500〜1,000字 + 写真1〜3枚）
価格: Rp15,000〜30,000/月（≈$1〜2）

---

## 調査・企画部隊の設計

### 企画の自動化ソース

**① 旅行シーズンカレンダー**
```
3〜4月:  桜シーズン → 花見スポット・混雑回避ガイド
7〜8月:  夏祭り・花火 → お祭りガイド
9〜11月: 紅葉シーズン → 紅葉スポット
12月:   クリスマス・年末 → イルミネーション
1〜2月: 冬の温泉 → 温泉入門ガイド
```

**② インドネシア人旅行者のニーズ特化**
```
必ず含める情報:
  - ハラール対応レストラン・コンビニ食品
  - 近隣のモスク情報
  - ムスリムフレンドリーな宿泊施設
  - 日本語が通じない場合の対処法
  - インドネシアルピアの両替レート・場所
```

### 調査フロー
```
① Claude + WebSearch → 旅行スポット・最新情報
② Claude + WebSearch → ハラール対応情報
③ Google Maps → モスク・ハラール飲食店の場所確認
        ↓
インドネシア語で執筆（Claude API）
        ↓
KaryaKarsa にシリアル投稿
```

---

## 72候インドネシア語版について

```
英語版（Beehiiv）が完成したら Claude API が自動翻訳
→ KaryaKarsa に「Musim Mikro Jepang」として投稿
追加工数: ほぼゼロ
```

---

## 収益構造

```
KaryaKarsa シリアル購読:
  Rp25,000/月（≈$1.5）× 購読者数
  Phase 1（100人）: $150/月
  Phase 2（500人）: $750/月

バックナンバー単話購入:
  Rp5,000〜10,000/話（≈$0.3〜0.6）
  → 人気エピソードは長く売れ続ける
```

---

## シリーズ構成案

| シリーズ | 内容 | 優先度 |
|---------|------|------|
| **Tokyo Insider** | 現地日本人が案内する東京のリアル | 最高 |
| **Halal Japan** | ムスリム旅行者向け完全ガイド | 最高 |
| **Musim Mikro Jepang** | 72候インドネシア語版（自動翻訳） | 高 |
| **Kuliner Jepang** | 日本食の楽しみ方・コンビニ攻略 | 高 |
| **Belanja di Jepang** | 日本での買い物ガイド・ドンキ・家電 | 中 |
| **Onsen Pertama** | 温泉の入り方・マナー・おすすめ | 中 |

---

## 想定トピック候補（初期エピソード）

| ID | タイトル（インドネシア語） | シリーズ | 優先度 |
|----|----------------------|---------|------|
| it-001 | Cara Orang Jepang Menikmati Musim Sakura | Tokyo Insider | 最高 |
| it-002 | Panduan Makanan Halal di Tokyo: Dari Convenience Store Sampai Restoran | Halal Japan | 最高 |
| it-003 | Musim Mikro #19: Kaeru Hajimete Naku（Kodok Mulai Bernyanyi） | Musim Mikro | 高 |
| it-004 | Tempat Wisata Tokyo yang Tidak Ada di Google | Tokyo Insider | 高 |
| it-005 | Cara Belanja di Don Quijote: Panduan Lengkap untuk Turis Indonesia | Belanja | 中 |
| it-006 | Onsen Pertama Kali: Panduan Lengkap untuk Orang Asing | Onsen | 中 |

---

## 記事一覧

| ID | タイトル（ID） | シリーズ | ステータス | 公開日 | 閲覧数 | 収益 |
|----|-------------|---------|----------|--------|------|------|
| — | *(記事はまだありません)* | — | — | — | — | — |
