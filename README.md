# alexa-skill-1min-sunset

### はじめに

Alexaスキル「１分間サンセット」のリポジトリです

### スキルについて

詳細は以下をご覧ください

https://kun432.github.io/works/alexa-skill-1min-series/

### 必要なもの

- Amazon Echo Spot/Echo Show
  - ※画面付きデバイス専用です。
- Amazon開発者アカウント

Alexa-hostedスキルなので、AWSアカウントは不要です。

### 使い方

詳細は割愛。手順未検証ですので、不備あればissueまで。

#### 1. レポジトリをclone

```sh
$ git clone https://github.com/kun432/alexa-skill-1min-sunset
$ cd alexa-skill-1min-sunset
```

#### 2. Alexa Skills Kitの設定

- [Alexa Developer Portal](https://developer.amazon.com/alexa/console/ask)でスキル作成
  - スキル名に「１分間サンセット」 ※なんでもよいです
  - 「デフォルトの言語」は「日本語」
  - スキルモデルは「カスタム」
  - バックエンドのホスト先は「Alexaがホスト」を選択
- JSONエディター画面を開く
  - models.jsonをドラッグ＆ドロップ
  - モデルを保存・ビルド
- コードエディタ画面を開く
  - Skill Code/lambda/index.jsを開いて、レポジトリ内のindex.jsの内容をそのまま上書き
    - Save/Deloy
  - 「Media storage: S3」をクリックしてS３画面を開く
    - レポジトリ内のMediaディレクトリ配下の画像・動画ファイルをアップロード
- テストして確かめてください

### その他

- 動画は[pixabay](https://pixabay.com/)のロイヤリティフリー動画を利用しています。