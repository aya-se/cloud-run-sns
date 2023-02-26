# Cloud Run SNS

Cloud RunでデプロイするシンプルなSNSアプリケーション

# ハンズオンの概要

Google Cloudを活用したシンプルなWebアプリケーションを開発し、サービスとしてデプロイ・公開するまでの手順をハンズオン形式で体験することができます。

# 主な内容

このハンズオンでは、主に以下の内容に取り組みます。

- Dockerコンテナを用いた開発環境の構築やコンテナ間通信のための設定
- NextAuth・Google OAuth2を用いた、Googleアカウント認証のための設定や実装
- **Firestore**のデータベース作成や情報を取得・編集するためのバックエンドAPIの実装
- 作成したバックエンドのAPIをフロントエンドから呼び出すための設定や実装
- JWT（JSON Web Token）を検証することによる、安全性の高い認証付きAPIの実装
- **Cloud Run**を利用した、マイクロサービスとしてのWebアプリケーションのデプロイ
- バックエンドサービスのCloud Runに認証を追加することによる、安全性の向上

一方で、以下の内容はあまり重視しません。サンプルコードで多くの部分を実装してあります。

- Next.jsを用いた基本的なフロントエンドの実装
- CSSを用いたUIデザインの作成
- FastAPIを用いた基本的なバックエンドの実装

# 大まかな手順

- GitHub・Dockerを用いた環境構築
- Webアプリケーションの開発（フロントエンド+バックエンド）
- フロントエンドとバックエンドを、マイクロサービスとしてそれぞれCloud Runにデプロイ

# 事前に必要なもの

- Web開発に十分なスペックのPC（Mac・Linux・WSLを推奨）
- GitHubアカウント
- **Docker Desktop**（Docker）
- **Google Cloudプロジェクト**
    - ハンズオンは基本的に無料枠の範囲内で実行可能
    - 発展編の一部は、わずかに従量課金が発生する可能性あり
- Visual Studio Codeなどのエディタ
- 基礎的なWeb開発についての知識

# 技術スタック

- フロントエンド：Next.js + TypeScript + Sass
    - [NextAuth](https://next-auth.js.org/)：Next.jsでOAuth認証を行うパッケージ
- バックエンド：FastAPI（Python）
- Google Cloud
    - [Cloud Run](https://cloud.google.com/run?hl=ja)：マイクロサービスのデプロイ
        - Cloud Build：GitHubへのpushをトリガーとする自動ビルド・デプロイ
    - [Firestore](https://cloud.google.com/firestore?hl=ja)：データベース（NoSQL）
    - [Google OAuth2](https://developers.google.com/identity/protocols/oauth2?hl=ja)：Googleアカウント認証
    - [API Gateway](https://cloud.google.com/api-gateway?hl=ja)：JWTを用いた認証付きAPIの実装・APIのロギングなど（発展編）
    - [Cloud Storage](https://cloud.google.com/storage?hl=ja)：画像・動画などメディアファイルのアップロード・保存（発展編）
    - （Container Registry：Dockerイメージをアップロードするデプロイ方法の場合のみ）
- Docker：開発環境の構築・Cloud Runへのデプロイ
- GitHub：フロントエンド・バックエンドは１つのリポジトリに統合

# サンプルコード

GitHubリポジトリとして、以下のURLで公開しています。

[https://github.com/aya-se/cloud-run-sns](https://github.com/aya-se/cloud-run-sns)

また、いくつかのブランチがあり、それぞれ以下のようになっています。

- `main`：全てのアプリケーション側の実装を完了した状態のソースコード
- `lab`：ハンズオン中に必要な部分を修正することを前提とした、未完成状態のソースコード

ハンズオンでは、リポジトリを自分のGitHubアカウントにForkし、`lab`ブランチに切り替えてから開発を進めることをおすすめします。

# 手順

## GitHub・Dockerによる開発環境構築

### サンプルソースコードの取得

- GitHubのリポジトリを**Forkしてから**Cloneします。

```bash
git clone git@github.com:${GitHubのユーザー名}/cloud-run-sns.git
cd cloud-run-sns
```

### Dockerによる環境開発構築

このハンズオンでは、開発環境を全てDockerコンテナを通して構築します。`frontend`コンテナと`backend`コンテナの2つを同時に起動し、コンテナ間で通信することによってアプリケーションを動かします。

- Docker Desktopをまだ起動していない場合は起動します。
- `/frontend`ディレクトリに`.env.local`ファイルを作成し、環境変数`API_URL`を追加します。通信時のホスト名は`localhost`ではなく、**コンテナ名**になることに注意してください。

```
API_URL=http://backend:8080
```

- `/backend`ディレクトリに空の`.env.local`ファイルを作成します。中身は後で加筆します。
- `frontend`コンテナに必要なパッケージを導入します。
    - Sass・NextAuth・ESlint・Prettier・Google Auth Library

```bash
docker-compose run --rm app sh
npm install
```

- `frontend`と`backend`の2つのコンテナを同時に立ち上げます。

```bash
docker-compose build
docker-compose up
```

- ブラウザでフロントエンド・バックエンドのURLを開きます。
    - フロントエンド：`http://localhost:3000`
    - バックエンド：`http://0.0.0.0:8080/docs`
        - `/docs`はFastAPI標準の機能により、自動生成されたSwaggerを表示
- フロントエンドは初期状態で次のような画面になっているはずです。サインインボタンを押すことはできますが、まだ必要な環境変数を指定していないため、エラーになってしまいます。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled.png)

- バックエンドはFastAPIの標準機能で自動生成されるSwaggerが表示されます。「Try it out」ボタンでAPIを試すこともできますが、まだ正常に実行することができません。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%201.png)

<aside>
💡 **補足：Dockerfile・docker-compose.ymlの詳しい記述内容**

- **フロントエンド**
    - `Dockerfile`：Cloud Runへのデプロイ・ローカル開発環境の構築に使用
        - `npm install`と本番環境起動時のコマンド（`npm run start`）を含む
    - `docker-compose.yml`：ローカル開発環境の構築に使用
        - `WATCHPACK_POLLING`：ホットリロードのための環境変数
        - `command`：Next.jsの開発環境起動時のコマンド（`npm run dev`）
- **バックエンド**
    - `Dockerfile`：Cloud Runへのデプロイ・ローカル開発環境の構築に使用
        - `requirement.txt`に含まれるパッケージをインストール
        - `--reload`：ホットリロードのためのオプション
    - `docker-compose.yml`：ローカル開発環境の構築に使用
        - `env_file`：ローカル開発で必要な環境変数を読み込むファイルの指定
</aside>

<aside>
💡 **補足：2つのコンテナはどのように通信しているのか？**

今回、`frontend`コンテナと`backend`コンテナは、同一の`docker-compose.yml`の中で作成しており、どちらもデフォルトで、共通のブリッジネットワークである`cloud-run-sns_default`に属しています。このため、特別な設定をせずに、コンテナ間での通信が実現しています。一方で、異なる`docker-compose.yml`で２つのコンテナを立ち上げた場合などは、別途、外部ネットワークの作成と接続が必要です。

`docker`コマンドにより、Networkの一覧や情報を取得することができます。

```bash
docker network ls

NETWORK ID     NAME                    DRIVER    SCOPE
444e54a69485   bridge                  bridge    local
eda870ddfa5a   cloud-run-sns_default   bridge    local
d85ecb5fa5f9   host                    host      local
15a98508ee7a   none                    null      local
```

```bash
docker inspect cloud-run-sns_default

[
	{
		"Containers": {
	    "xxx": {
	      "Name": "frontend",
				...
      },
      "xxx": {
	      "Name": "backend",
				...
      },
  }
]
```

</aside>

### 参考文献

- [DockerでFastAPIの環境を作ってGETするまで](https://zenn.dev/satonopan/articles/c4e6d55a64da0c)
- [他のDockerコンテナからコンテナ内のMySQLに接続する](https://qiita.com/YuitoSato/items/4a4b46f5670b45739a37)
- [Dockerでコンテナ間通信を行う方法](https://zenn.dev/tns_00/articles/docker-communicate-with-containers)
- [Docker Composeで別のファイルのコンテナにアクセスする方法](https://www.orzs.tech/how-to-access-a-container-of-another-file-with-docker-compose/)

## フロントエンドの開発（Next.js・OAuth認証）

### ディレクトリ構成

`/frontend`ディレクトリはNext.jsの標準的な構成になっています。

- `/src/components`：UIの部品（コンポーネント）
- `/src/pages`：ページなど
- `/src/styles`：Sassによるページ・コンポーネントのスタイリング
- `/src/types`：TypeScriptによる型定義
- `.env.local`：Next.jsのローカル開発環境でのみ用いる環境変数
- `next.config.js`：Next.jsのさまざまな設定を記述

```
frontend
├── public
├── src
│   ├── components
│   ├── pages
│   ├── styles
│   └── types
├── .env.local
├── Dockerfile
└── next.config.js
```

- `next.config.js`にホスト名`lh3.googleusercontent.com`を追加します。これは、Next.jsでGoogleアカウントのアイコンを表示させるために必要となる設定です。

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
```

### NextAuth・Google OAuth2によるGoogleアカウント認証

NextAuthはNext.jsでOAuth認証を行う上で便利なパッケージです。今回は、このNextAuthを利用して、Google OAuth2によるGoogleアカウント認証を実装します。

- まずはGoogle Cloudコンソール上で作業します。
- 「APIとサービス>OAuth同意画面」からアプリケーションを作成します。
    - User Type：外部

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%202.png)

- 「作成」をクリックして、次の設定に進みます。
    - アプリ名：`Cloud Run SNS`など（任意の名前でOK）
    - ユーザー サポートメール：自分のGoogleアカウントのアドレス
    - アプリのロゴ：`/frontend/public/google-cloud.png`など（任意）
    - デベロッパーの連絡先情報：自分のGoogleアカウントのアドレスなど

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%203.png)

- 「保存して次へ」をクリックして次の設定に進みます。スコープの設定は特に行わず、もう一度「保存して次へ」をクリックして次の設定に進みます。
    - 「ADD USERS」をクリックしてテストユーザーを追加します。今後のアプリケーション検証のために、複数のGoogleアカウントを登録するとより良いでしょう。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%204.png)

- 「保存して次へ」をクリックすると、OAuth同意画面の作成が完了し、登録したアプリの情報を閲覧・編集できるようになります。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%205.png)

- 「APIとサービス>認証情報」から「認証情報を作成」で**OAuthクライアントID**を発行します。
    - アプリケーションの種類：ウェブアプリケーション
    - 名前：`Cloud Run SNS OAuth`など（任意の名前でOK）
    - 「**承認済みのリダイレクトURI**」に、 `http://localhost:3000/api/auth/callback/google`を追加
        - ここに登録したURIからしか、Googleアカウントの認証画面にアクセスすることができない

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%206.png)

- 「作成」をクリックすると、「**クライアントID**」と「**クライアントシークレット**」が発行されるので、記録しておきます。
- ローカルの開発フォルダに戻って作業します。
- `.env.local`に環境変数を追加し、以下のようにします。
    - `API_URL`：バックエンドのURL（`http://backend:8080`）
    - `GOOGLE_CLIENT_ID`：OAuthのクライアントID
    - `GOOGLE_CLIENT_SECRET`：OAuthのクライアントシークレット
    - `NEXTAUTH_URL`：フロントエンドのURLを指定（`http://localhost:3000/`）
    - `NEXTAUTH_SECRET`：JWTを暗号化しトークンをハッシュするために使用する鍵
        - OpenSSLコマンドでランダムな鍵を生成する

```bash
openssl rand -base64 32
```

```
API_URL=http://backend:8080
GOOGLE_CLIENT_ID=${OAuthクライアントID}
GOOGLE_CLIENT_SECRET=${OAuthクライアントシークレット}
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=${ランダム生成した鍵}
```

- ここまで設定すると、フロントエンドの「サインイン」ボタンをクリックして、Googleアカウントでサインインできるようになるはずです。実際にGoogle純正のログイン画面が表示され、サインインが完了して次のような画面になれば成功です！🎉🎉🎉
- 右上が「サインアウト」ボタンに変わっています。クリックするとサインアウトします。再び「サインイン」ボタンからサインインすることもできます。
- フォームと「投稿」ボタンが表示されるようになりましたが、まだ正常に投稿を作成することはできません。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%207.png)

- **NextAuth**によるGoogleアカウント認証の実装について、確認しておきます。NextAuth特有の実装は`/pages/api/[…nextauth].ts`にあり、以下のようになっています。基本的には、NextAuthの[公式ドキュメント](https://next-auth.js.org/)通りの実装になっています。
    - `process.env.xxx`は先ほど`.env.local`に追加した環境変数を参照しています。GoogleプロバイダーによるOAuth認証には`GOOGLE_CLIENT_ID`と`GOOGLE_CLIENT_SECRET`の２つの環境変数が必要です。
    - `callbacks`には**JWT**（JSON Web Token）をセッション情報に含めるような実装を追加しています。JWTの`id_token`を検証することでユーザ情報を取得できるようになっており、後ほどバックエンドAPIの実装で利用します。

```tsx
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.idToken = token.idToken;
      return session;
    },
  },
});
```

- これ以外には、全ページ共通の内容を記述する`/pages/_app.tsx`に`SessionProvider`を追加するほか、使用したい部分で`useSession`・`signIn`・`signOut`等をimportして呼び出すだけ（`/components/Header.tsx`など）となっており、非常に実装が簡単です。詳しくはソースコードやドキュメントを参照してください。

### 参考文献（NextAuth）

- [StreamlitでGoogle OAuth2.0を使った認証を行う](https://zenn.dev/yag_ays/articles/ac982910770010)
- [NextAuth.js](https://next-auth.js.org/)
- [NextAuth 使ってみた](https://zenn.dev/happy663/articles/30dc517646653c)
- [NextAuth.jsでログイン機能を実装してみた話](https://engineering.nifty.co.jp/blog/9817)
- [NextAuth.jsについて調べたので使い方まとめとく](https://zenn.dev/nrikiji/articles/d37393da5ae9bc)

<aside>
💡 **補足：Next.jsのAPI呼び出し方法について**

どちらの方法も一長一短ですが、今回のサンプルコードではサーバーサイドから呼び出す方法で統一しています。

- **クライアントサイド**から呼び出す場合
    - `NEXT_PUBLIC_API_URL`を環境変数に登録して、fetchで呼び出し
    - Cloud Runへのデプロイ時に、Dockerfileへの環境変数の追記が必要
    - FastAPI側で、CORSを回避するための実装が必要
    - APIのURLがブラウザの開発者ツールなどから直接閲覧できてしまう
- **サーバーサイド**から呼び出す場合
    - `API_URL`を環境変数に登録して、fetchで呼び出し
    - Dockerでのローカル開発環境構築時に共有Networkの登録が必要
    - `getServerSideProps`はこちらに相当
    - クライアント側からPOSTリクエストなどを呼びたい場合は、`/page/api`に転送用のAPIルートを用意し、その中から外部APIを呼び出すように実装することが考えられる（サーバーサイドからの呼び出しになる）
        - 二重にAPIを挟むような実装になるので、冗長感はあるが、サーバーサイドからの呼び出しに統一できる
</aside>

## バックエンドの開発（FastAPI・Firestore・API Gateway）

### ディレクトリ構成

`/backend`ディレクトリはFastAPIの標準的な構成になっています。

- `/api/routers`：APIのルートごとの処理
- `/api/schemas`：APIのリクエストやレスポンスにおける型クラスの定義
- `/api/main.py`：バックエンドサーバー起動時に実行するプログラム
- `.env.local`：ローカル開発環境でのみ用いる環境変数
- `requirements.txt`：必要なPythonモジュールの一覧

```
backend
├── api
│   ├── routers
│   ├── schemas
│   └── main.py
├── .env.local
├── .gitignore
├── (application_default_credential.json)
├── Dockerfile
└── requirements.txt
```

### API構成

- `GET:/posts`：投稿の一覧を取得する
- `POST:/posts`：新しいメッセージを投稿する
- `DELETE:/posts`：投稿を削除する

- 必要なパッケージが`requirements.txt`に追加されていることを確認します。不足していた場合は追記し、`backend`コンテナを再ビルド・再起動します。

```
fastapi
uvicorn
pydantic
google-cloud-firestore
google-auth
```

### Firestoreのデータベース作成と接続

アプリケーションの投稿（post）を保存するためのデータベースをGoogle Cloudの**Firestore**で作成し、バックエンドから接続できるようにします。FirestoreはGoogle Cloudが提供するデータベースのサービスの１つですが、NoSQL型のデータベースであり、無料枠が充実しています。（※SQL型のデータベースとして**Cloud SQL**などもありますが、やや高機能で課金が発生しやすくなっているため、今回は利用しません。）

- Google Cloudコンソールの「Firestore」を開き、**ネイティブモード**で`asia-northeast1`にデータベースを作成します。
    - 注：Filestore（ストレージ）ではなくFirestore（データベース）

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%208.png)

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%209.png)

- データベースの作成が完了すると、次のような画面になります。まだ何もデータを作成していないので、空の状態です。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2010.png)

- Firestoreにアクセス・編集するための**サービスアカウント**（GSA）を作成します。Google Cloudコンソールから「IAMと管理>サービスアカウント」を開き、「サービスアカウントを作成」をクリックします。
    - サービスアカウント名：`firestore-user`
    - サービスアカウントID：`firestore-user`
    - サービスアカウントの説明：`Service account for Firestore`など（任意）
    - 「ロールを追加」から「Datastore>Cloud Datastore ユーザー」を選択

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2011.png)

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2012.png)

- サービスアカウントの一覧に`firestore-user@${プロジェクト名}.iam.gserviceaccount.com`が追加されていることを確認し、クリックします。
- 「キー」タブに移動し、「鍵を追加」「新しい鍵を作成」の順にクリックします。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2013.png)

- キーのタイプを「JSON」とし、「作成」をクリックすると、ローカルマシンにJSONファイルがダウンロードされます。このファイルに認証情報が含まれています。
- ダウンロードしたJSONファイル名を`firestore-user.json`に変更し、`/backend`ディレクトリにコピーします。
- `/backend`ディレクトリの`.env.local`ファイルに、必要な環境変数を追加します。この２つは、認証情報が自動で読み込まれないローカル開発環境の構築にのみ必要です。

```
GOOGLE_APPLICATION_CREDENTIALS=firestore-user.json
GOOGLE_CLOUD_PROJECT=${Google CloudのプロジェクトID}
```

- `.gitignore`ファイルに、`.env.local`と`firestore-user.json`が追加されていることを確認します。この２つのファイルには外部に公開するべきではない情報が含まれているので、誤ってGitHubのリモートリポジトリにpushしてしまわないように注意してください。
- ここまでの時点で`GET:/posts`APIを動かすことが可能になりました。`/api/routers/post.py`を開き、以下の部分のコメントアウトを削除します。
    - `os.getenv`で環境変数を取得しています。先ほど`.env.local`に追加した`GOOGLE_CLOUD_PROJECT`にあるFirestoreを、`GOOGLE_APPLICATION_CREDENTIALS`（つまり`firestore-user.json`）にあるサービスアカウントの認証情報を使って取得します。
    - `firestore-user`というサービスアカウントには、「Cloud Datastore ユーザー」という**IAM**（権限）を付与していたため、Firestoreの情報を取得・編集することができます。IAMを付与していない場合は、権限不足でエラーになってしまいます。
    - Firestoreはコレクションの中にドキュメントを格納するという形式になっています。ここでは、`posts`というコレクションに１つ１つの投稿を格納するという想定です。デフォルトでは順序がバラバラになってしまうので、`timestamp`フィールドの降順に並び替えて、新しい順に取得するようにしています。

```python
db = firestore.Client(os.getenv("GOOGLE_CLOUD_PROJECT"))

@router.get("/posts", response_model=List[post_schema.Post])
async def get_root():
    # 投稿を取得
    docs = db.collection(u"posts").order_by(
        u"timestamp", direction=firestore.Query.DESCENDING).get()
    # 投稿データを整形
    posts = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        posts.append(data)
    return posts
```

- `google.auth.exceptions.DefaultCredentialsError`となるので、環境変数を読み込むために一度Dockerコンテナを停止し、再起動します。
- `/docs`の「Try it out」ボタンから`GET:/posts`APIを実行してみましょう。「Execute」ボタンをクリックして、以下のように、Statusが`200`で空の配列がレスポンスとして返ってくれば成功です！🎉🎉🎉

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2014.png)

- 続いて、フロントエンドからもAPIを呼び出してみましょう。`/pages/index.tsx`の`getServerSideProps()`のコメントアウトを編集し、以下のようにします。
    - ここでは、JavaScript標準の`fetch()`関数を用いてAPIを呼び出します。

```tsx
export async function getServerSideProps() {
  const API_URL = process.env.API_URL;
  /*
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(API_URL ?? "");
  const res = await client.request({ url: `${API_URL}/posts` });
  const data = (await res.data) as Array<Post>;
  */
  const res = await fetch(`${API_URL}/posts`);
  const data = (await res.json()) as Array<Post>;
  // const data = new Array<Post>();
  const props: Props = {
    data: data,
  };
  return {
    props: props,
  };
}
```

- ブラウザからフロントエンドをリロードしてみましょう。まだ投稿が何も無いので、表示上は何も変わりませんが、Dockerコンテナを起動しているターミナルを確認すると、リロードの度に`backend`コンテナで`GET:/postsAPI`が呼び出され、Status`200`でレスポンスが返ってきていることがわかります。これにより、フロントエンドからバックエンドのAPIを正常に呼び出せていることが確認できました！🎉🎉🎉

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2015.png)

ここまでの時点で`GET:/posts`APIを実装できました。続いて、投稿を作成・削除するAPI（`POST:/posts`・`DELETE:/posts`）についても実装していきます。

### JWTトークンによる認証付きAPIの実装

もし、`POST`や`DELETE`のAPIに適切な認証を付けなかった場合、非サインイン状態だとしても、何らかの方法でAPIを直接リクエストすることで、不正に投稿を作成・削除できてしまう可能性があります。そこで、バックエンドサーバー側で、Firestoreへのアクセス前にGoogleのプロバイダーから取得済みの**JWT**（JSON Web Token）を検証することで、APIを保護し、よりセキュアなシステムを目指します。

- JWTには`access_token`と`id_token`の2種類のトークンがありますが、JWT自体の検証には`id_token`を使用します。
    - `access_token`：リソースへのアクセスを認可するためのトークン
    - `id_token`：ユーザーが認証されたことを証明するトークン、デコードすることで認証されたユーザーの情報を取得することが可能
- `X-Id-Token: ${id_token}`の形でヘッダにJWTの`id_token`を追加し、JWTが有効なものであると検証できた場合のみ、その後の処理を実行します。
    - ただし、HTTP通信だとトークンを傍受される可能性があるため、**セキュリティ的にはHTTPS通信であることが前提**になります。
- `/backend`ディレクトリの`.env.local`ファイルに、以下の環境変数を追加します。

```
GOOGLE_CLIENT_ID=${OAuthクライアントID}
```

- `/api/routers/post.py`を開き、以下の部分のコメントアウトを削除します。
    - `POST:/posts`APIが呼び出された時の処理を実装しています。一見、投稿データを加工し、Firestoreにドキュメントを追加しているだけのように思えますが、`post_root()`の引数に`id_info = Depends(verify_token)`が含まれていることに注目してください。`verify_token()`という関数は`/api/routers/auth.py`に実装してありますが、実はこの部分でJWTトークンの認証を行っています。

```python
@router.post("/posts")
async def post_root(post_body: post_schema.PostCreate, id_info = Depends(verify_token)):
    # 投稿データ
    data = {
        u"timestamp": firestore.SERVER_TIMESTAMP,
        u"user_name": id_info["name"],
        u"user_email": id_info["email"],
        u"user_image": id_info["picture"],
        u"text": post_body.text
    }
    # 投稿を作成
    db.collection(u"posts").document().set(data)
    return {"message": "Post created successfully"}
```

- `/api/routers/auth.py`の`verify_token()`の実装を確認します。
    - まず、`verify_token()`には`x_id_token: str = Header(None)`という引数があります。ここでHTTPリクエストのHeaderに含まれる`X_Id_Token`フィールドを受け取ります。 `x_id_token`がない場合はその時点でエラーを返すようになっています。
    - `x_id_token`がある場合は、`google-auth`パッケージを用いてJWTの`id_token`を検証します。`x_id_token`が実際にGoogleプロバイダーが発行したJWTであると確認できた場合は、`id_info`を返します。`id_info`にはGoogleのアカウント情報が含まれており、名前・Email・アイコン画像などを取得できます。
    - 今回の`POST:/posts`APIでは、リクエストのbodyは`text`のみとし、ユーザー情報はヘッダーの`X_Id_Token`を検証して得られた`id_info`から取得するようにしています。これにより、ユーザー本人ではない何者かが、不正にその人になりすまして投稿できてしまうリスクや、不正なフィールド値の投稿を作成してしまうことによるエラーのリスクを下げることができます。
        - セキュリティ上は、`id_token`を盗まれないことが重要になります。HTTP通信だとヘッダから情報を盗まれてしまう可能性があるので、HTTPS通信にするべきでしょう。

```python
import os
from fastapi import HTTPException, Header
from google.oauth2 import id_token
from google.auth.transport import requests
  
def verify_token(x_id_token: str = Header(None)):
    if not x_id_token:
        raise HTTPException(status_code=401, detail="X-Id-Token header required")
    try:
        # IDトークンの検証
        id_info = id_token.verify_oauth2_token(x_id_token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        return id_info
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
```

- 動作検証として、以下のような`curl`コマンドでPOSTが行えないことを確認します。

```bash
curl "http://0.0.0.0:8080/posts" -X POST -d'{"text":"hoge"}' -H "content-type: application/json"
```

- `/docs`でも試してみましょう。「Try it out」ボタンを押して、`x-id-token`やbodyの`text`に適当な値を入力して、「Execute」ボタンをクリックしても、Statusが`401`となり、投稿が作成できないことが確認できます。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2016.png)

- 続いて、`/api/routers/post.py`を開き、以下の部分のコメントアウトを削除します。
    - `DELETE:/posts`APIが呼び出された時の処理を実装しています。基本的に`POST`と変わりませんが、こちらは投稿した本人であるかどうかの確認も追加しています。

```python
@router.delete("/posts")
async def delete_root(post_delete_body: post_schema.PostDelete, id_info = Depends(verify_token)):
    doc = db.collection(u"posts").document(post_delete_body.id).get()
    # 存在しない投稿を削除しようとした場合
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Post not found")
    doc_email = doc.to_dict()["user_email"]
    # 他人の投稿を削除しようとした場合
    if doc_email != id_info["email"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    # 投稿を削除
    db.collection(u"posts").document(post_delete_body.id).delete()
    return {"message": "Post deleted successfully"}
```

### APIの動作検証

ここまでの時点で、フロントエンド・バックエンドで最低限必要な設定が完了したため、アプリケーション全体を動かすことが可能です。

- ブラウザで`http://localhost:3000`にアクセスし、画面が表示されることを確認します。
    - Dockerの`backend`コンテナを開いているターミナルを確認します。`GET:/posts`リクエストが届いており、Status`200`で正常にレスポンスが返されていればOKです。

```bash
backend  | INFO:     xxx.xx.x.x:xxxxx - "GET /posts HTTP/1.1" 200 OK
```

- 右上の「サインイン」ボタンをクリックします。Google純正のアカウント認証が画面されるので、自分のGoogleアカウントでサインインします。
- ログインしたら元のページにリダイレクトされ、自分のアカウントの情報が取得できていることを確認します。
- 「新しい投稿を開始」のフォームに何か文字を入力し、「投稿」ボタンをクリックします。画面がリロードされ、投稿した自分のメッセージが表示されることを確認します。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2017.png)

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2018.png)

- Dockerの`backend`コンテナを開いているターミナルを確認します。`POST:/posts`リクエストおよび`GET:/posts`リクエストが届いており、status:200で正常にレスポンスが返されていればOKです。

```bash
backend  | INFO:     xxx.xx.x.x:xxxxx - "POST /posts HTTP/1.1" 200 OK
backend  | INFO:     xxx.xx.x.x:xxxxx - "GET /posts HTTP/1.1" 200 OK
```

- Google Cloudコンソールで「Firestore」を開き、データベースに実際にデータが追加されていることを確認します。`posts`というコレクションが新しく作成され、その中に投稿した内容が追加されていればOKです。なお、ドキュメントの名前はFirestore側でユニークな値として自動生成され、`GET:/posts`APIはこれを`id`として受け取ります。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2019.png)

- サインイン状態の場合、自分の投稿には「削除」ボタンが表示されています。右上の「サインアウト」ボタンをクリックしてサインアウトすると、「削除」ボタンが表示されなくなることを確認します。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2020.png)

- 右上の「サインイン」ボタンをクリックし、再度サインインします。
- 自分の投稿に表示されている「削除」ボタンをクリックします。画面がリロードされ、投稿した自分のメッセージが削除されたことを確認します。
- Dockerの`backend`コンテナを開いているターミナルを確認します。`DELETE:/posts`リクエストおよび`GET:/posts`リクエストが届いており、status:200で正常にレスポンスが返されていればOKです。

```bash
backend  | INFO:     xxx.xx.x.x:xxxxx - "DELETE /posts HTTP/1.1" 200 OK
backend  | INFO:     xxx.xx.x.x:xxxxx - "GET /posts HTTP/1.1" 200 OK
```

- Google Cloudコンソールで「Firestore」を開き、データベースから実際にデータが削除されていることを確認します。`posts`コレクションのドキュメントが削除されていればOKです。

ここまでの時点で、基本的なアプリケーションの開発が完了しました！次はいよいよ、Cloud Runを用いて、Google Cloud上にサービスをデプロイし、公開していきます。

### 参考文献（FastAPI・Firestore）

- [FastAPI入門](https://zenn.dev/sh0nk/books/537bb028709ab9)
- [FastAPI 利用方法 ②Advanced - User Guide](https://qiita.com/yoshi0518/items/38786780a0400caa0a10)
- [クイックスタート: サーバー クライアント ライブラリを使用して Firestore データベースを作成する](https://cloud.google.com/firestore/docs/create-database-server-client-library?hl=ja)
- [認証のスタートガイド](https://cloud.google.com/docs/authentication/getting-started?hl=ja)
- [【JWT】 入門](https://qiita.com/knaot0/items/8427918564400968bd2b)
- [Auth0 を使って ID Token と Access Token の違いをざっくり理解する](https://dev.classmethod.jp/articles/auth0-access-token-id-token-difference/)

## Cloud Runによるマイクロサービスのデプロイ

ローカル上でアプリケーションの機能を一通り実装することができたので、アプリケーションをGoogle Cloud上に**デプロイ**していきます。今回は、**Cloud Run**を用いてデプロイしますが、その中でも、Cloud Buildの機能を活用し、**GitHubリポジトリのpushをトリガーとしてビルド**する方法でデプロイします。指定したGitHubリポジトリが更新されると自動的に再ビルド・デプロイを行うことができるため、大変便利なデプロイ方法です。以下では、フロントエンド・バックエンドを**マイクロサービス**としてそれぞれ個別にデプロイします。

<aside>
⚠️ **注意：請求先アカウントの登録について**

Cloud Runでサービスを作成する際には、請求先アカウントの登録が必要になる場合があります。この場合は指示に従い、必要事項を登録して課金を有効にしてください。なお、本ハンズオンの基本編は、基本的に無料枠の範囲内で実行できるため、課金は発生しません。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2021.png)

</aside>

### フロントエンドサービスのデプロイ

- Google Cloudのコンソールで「Cloud Run」を開き、「サービスの作成」をクリックします。
    - 「ソース リポジトリから新しいリビジョンを継続的にデプロイする」を選択し、「Cloud Buildの設定」をクリック
        - Source repository：リポジトリプロバイダを「GitHub」とし、リポジトリを指定
        - Build Configuration：ブランチを指定し、Build TypeをDockerfile、ソースの場所は`/frontend/Dockerfile`を指定
    - サービス名：`cloud-run-sns-frontend`など（任意の名前でOK）
    - リージョン：`asia-northeast1（東京）`を推奨
    - CPUの割り当てと料金：リクエストの処理中にのみCPUを割り当てる
    - 自動スケーリング：最小数 0 / 最大数 1
    - 「すべて」を選択（インターネットからサービスに直接アクセスできるようにします）
    - 認証：「未認証の呼び出しを許可」

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2022.png)

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2023.png)

- 「作成」をクリックし、デプロイが完了すれば成功です！🎉🎉🎉
    - ただしこの時点では、必要な環境変数を設定していないので、まだアプリケーションは正常に動作しません。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2024.png)

- フロントエンドサービスのURLが表示されるので、コピーしておきます。

### バックエンドサービスのデプロイ

- Google Cloudのコンソールで「Cloud Run」を開き、「サービスの作成」をクリックします。
    - 「ソース リポジトリから新しいリビジョンを継続的にデプロイする」を選択し、「Cloud Buildの設定」をクリック
        - Source repository：リポジトリプロバイダを「GitHub」とし、リポジトリを指定
        - Build Configuration：ブランチを指定し、Build TypeをDockerfile、ソースの場所は`/backend/Dockerfile`を指定
    - サービス名：`cloud-run-sns-backend`など（任意の名前でOK）
    - リージョン：`asia-northeast1（東京）`を推奨
    - CPUの割り当てと料金：リクエストの処理中にのみCPUを割り当てる
    - 自動スケーリング：最小数 0 / 最大数 1
    - 「すべて」を選択（インターネットからサービスに直接アクセスできるようにします）
    - 認証：「未認証の呼び出しを許可」
- 「作成」をクリックし、デプロイが完了すれば成功です！🎉🎉🎉
    - ただしこの時点では、必要な環境変数を設定していないので、まだアプリケーションは正常に動作しません。
- バックエンドサービスのURLが表示されるので、コピーしておきます。
- ここまでの時点で、Google Cloudのコンソールで「Cloud Run」を開き、以下のように２つのサービスが登録されていることを確認してください。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2025.png)

### 環境変数の追加・リダイレクトURIの設定

`.env.local`に追加した環境変数は、あくまでもローカル環境での開発のためのものであり、Google Cloudにデプロイした際は、別途、環境変数の登録が必要です。また、OAuth同意画面におけるリダイレクトURIの設定も必要になります。

- Google Cloudのコンソールで「Cloud Run」を開き、**フロントエンドサービス**（`cloud-run-sns-frontend`）をクリックします。
- 「新しいリビジョンの編集とデプロイ」をクリックし、以下の環境変数を追加します。
    - `API_URL`：バックエンドサービスのURLを指定（注：末尾に`/`を含めない）
    - `GOOGLE_CLIENT_ID`：OAuthのクライアントID
    - `GOOGLE_CLIENT_SECRET`：OAuthのクライアントシークレット
    - `NEXTAUTH_URL`：フロントエンドサービスのURLを指定
    - `NEXTAUTH_SECRET`：JWTを暗号化しトークンをハッシュするために使用する鍵
        - OpenSSLコマンドでランダムな鍵を生成する
            - OpenSSLコマンドが使えない場合はインストールする

```bash
openssl rand -base64 32
```

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2026.png)

- 「デプロイ」をクリックし、リビジョンが100%移行したことを確認します。
- Google Cloudのコンソールで「Cloud Run」を開き、**バックエンドサービス**（`cloud-run-sns-backend`）をクリックします。
- 「新しいリビジョンの編集とデプロイ」をクリックし、以下の環境変数を追加します。
    - `GOOGLE_CLIENT_ID`：OAuthのクライアントID
- 「デプロイ」をクリックし、リビジョンが100%移行したことを確認します。

<aside>
💡 **補足：バックエンドサービスへの一部の環境変数追加は不要**

- `GOOGLE_APPLICATION_CREDENTIALS`
    - Google Cloudにデプロイした場合は、自動で認証情報を取得するため不要
- `GOOGLE_CLOUD_PROJECT`
    - Google Cloud上では、初めからこの環境変数が登録されているため不要
</aside>

- Google Cloudのコンソールで「APIとサービス>認証情報」を開きます。
- 「OAuth2.0クライアントID」から登録したクライアントIDを開き、「**承認済みのリダイレクトURI**」に`[フロントエンドサービスのURL]/api/auth/callback/google`を追加します。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2027.png)

### デプロイしたサービスの動作確認

ここまでの時点で、マイクロサービスのデプロイと必要な設定が完了しました。フロントエンドサービスのURLにアクセスし、サービスが正しく動作していれば成功です！🎉🎉🎉

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2028.png)

試しに、アプリケーションを書き換えて、GitHubにpushしてみましょう。pushをトリガーとして、マイクロサービスが自動で再ビルド・再デプロイされることが確認できます。

<aside>
💡 **補足：サービスが正しく動作しないときは**

何らかの設定ミス・実装ミスの可能性があります。Cloud Runのサービスの詳細から「ログ」タブに移動すると、エラーの原因を解明できるかもしれません。

![上図の例では、NextAuthのSECRETが無いというエラーログが残されている。環境変数`NEXTAUTH_SECRET`の登録にミスがあるとわかったので、修正することで問題を解決できる。](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2029.png)

上図の例では、NextAuthのSECRETが無いというエラーログが残されている。環境変数`NEXTAUTH_SECRET`の登録にミスがあるとわかったので、修正することで問題を解決できる。

</aside>

<aside>
💡 **補足：Container Registryを用いたデプロイ方法**

Container RegistryにsubmitしたDockerイメージを用いてCloud Runにデプロイする方法もあります。（[本家のGoogle Cloud Skill Boost](https://www.cloudskillsboost.google/quests/152)ではむしろこちらが紹介されています。）

- 以下、全てGoogle CloudのCloud Shell上で作業します。
- GitHubのリポジトリを**Forkしてから**Cloneします。

```bash
git clone git@github.com:${GitHubのユーザー名}/cloud-run-sns.git
cd cloud-run-sns
```

- Cloud Runにフロントエンド・バックエンドのマイクロサービスをデプロイします。

```bash
cd frontend
gcloud builds submit --tag [gcr.io/$GOOGLE_CLOUD_PROJECT/cloud-run-sns-](http://gcr.io/$GOOGLE_CLOUD_PROJECT/cloud-run-sns-backend)frontend
gcloud run deploy cloud-run-sns-frontend --image gcr.io/$GOOGLE_CLOUD_PROJECT/cloud-run-sns-frontend --platform managed --region asia-northeast1 --max-instances=1
```

```bash
cd ..
cd backend
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/cloud-run-sns-backend
gcloud run deploy cloud-run-sns-backend --image gcr.io/$GOOGLE_CLOUD_PROJECT/cloud-run-sns-backend --platform managed --region asia-northeast1 --max-instances=1
```

- GitHubのリポジトリのpushをトリガーとしてビルドする方法と同様、OAuthの「承認済みのリダイレクトURI」および、フロントエンドサービス・バックエンドサービスへの環境変数追加を行います。

以上の手順により、Container Registryを用いたCloud Runへのデプロイが完了します。しかし、この方法の場合、サービスのバージョンを更新する際に、**毎回手動でアップデート作業を行う必要**があります。今後は、GitHubのリポジトリのpushをトリガーとしてビルドするデプロイ方法が主流になるのではないかと考えられます。

</aside>

### バックエンドサービスのセキュリティ強化

マイクロサービスのデプロイに成功しましたが、セキュリティ面ではまだ問題があります。特に、**バックエンドサービスにURL直打ちで直接アクセスできてしまう**のは好ましくありません。そこで、バックエンドサービスを**認証付きのサービス**とし、フロントエンドサービスのみからアクセスできるよう、実装を修正します。

- Google Cloudのコンソールで「Cloud Run」を開きます。
- 「推奨事項」の列の「セキュリティ」をクリックすると、「この Cloud Run サービスのセキュリティを強化するには、最小限の権限を持つ専用のサービス アカウントを作成し、そのアカウントを使用して新しいリビジョンをデプロイしてください。」との記述があります。これに従って、「新しいサービスアカウントを作成」をクリックします。
    - サービスアカウント名：`cloud-run-sns-frontend`
    - サービスアカウントID：`cloud-run-sns-frontend`
    - 「ロールを追加」から「Cloud Run>Cloud Run 起動元」を選択
        - バックエンドサービスを呼び出すのに必要な権限
- 「作成」をクリックすると、サービスアカウントが`cloud-run-sns-frontend`となった状態のリビジョン設定画面が開くので、そのまま「デプロイ」をクリックします。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2030.png)

<aside>
⚠️ **注意：「推奨事項」の列が表示されない場合**

- Google Cloudのコンソールで「IAM と管理>サービス アカウント」を開き、サービスアカウント（`cloud-run-sns-frontend`）を作成します。
- Google Cloudのコンソールで「Cloud Run」を開き、**フロントエンドサービス**（`cloud-run-sns-frontend`）をクリックします。
- 「新しいリビジョンの編集とデプロイ」をクリックし、「セキュリティ」タブに移動します。
- 「サービスアカウント」に`cloud-run-sns-frontend`を指定し、「デプロイ」をクリックします。
</aside>

- Google Cloudのコンソールで「Cloud Run」を開きます。
- 「推奨事項」の列の「セキュリティ」をクリックすると、「この Cloud Run サービスのセキュリティを強化するには、最小限の権限を持つ専用のサービス アカウントを作成し、そのアカウントを使用して新しいリビジョンをデプロイしてください。」との記述があります。これに従って、「新しいサービスアカウントを作成」をクリックします。
    - サービスアカウント名：`cloud-run-sns-backend`
    - サービスアカウントID：`cloud-run-sns-backend`
    - 「ロールを追加」から「Datastore>Cloud Datastore ユーザー」を選択
- 「作成」をクリックすると、サービスアカウントが`cloud-run-sns-backend`となった状態のリビジョン設定画面が開くので、そのまま「デプロイ」をクリックします。
- ここまでの時点で、Google Cloudのコンソールで「IAM と管理」を開き、以下のような状態になっていることを確認してください。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2031.png)

- また、ここまでの時点で引き続きサービスが正常に動作することを確認してください。

---

それではここから、バックエンドサービスに**認証**を要求するように、変更していきます。

- Google Cloudのコンソールで「Cloud Run」を開き、**バックエンドサービス**（`cloud-run-sns-backend`）をクリックします。
- 「セキュリティ」タブに移動し、「認証」を「**認証が必要です**」に変更し、「保存」をクリックします。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2032.png)

- 認証を必要とした結果、**ブラウザからバックエンドサービスのURLにアクセスしても「Error: Forbidden」となり、内容を閲覧できなくなりました**。これにより、バックエンドサービスが外部アクセスから保護されたことがわかります。しかし、フロントエンドサービスからもバックエンドサービスからAPIを取得できなくなるため、「500 Internal Server Error.」と表示されるようになってしまいます。

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2033.png)

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2034.png)

- そこで、フロントエンドサービスからバックエンドサービスにアクセスできるよう、API呼び出しの実装を変更します。
- Google Cloudコンソールから「IAM と管理>サービスアカウント」を開き、フロントエンドサービスで使用しているサービスアカウント（`cloud-run-sns-frontend`）をクリックします。
- 「キー」タブに移動し、「鍵を追加」「新しい鍵を作成」の順にクリックします。
- キーのタイプを「JSON」とし、「作成」をクリックすると、ローカルマシンにJSONファイルがダウンロードされます。このファイルに認証情報が含まれています。
- ダウンロードしたJSONファイル名を`cloud-run-invoker.json`に変更し、`/frontend`ディレクトリにコピーします。
- `/frontend`ディレクトリの`.env.local`ファイルに、`GOOGLE_APPLICATION_CREDENTIALS`を追加します。これは、認証情報が自動で読み込まれないローカル開発環境の構築にのみ必要です。さらに、検証のために`API_URL`を（一時的にCloud RunにデプロイしたバックエンドサービスのURLに変更します。

```
GOOGLE_APPLICATION_CREDENTIALS=cloud-run-invoker.json
API_URL=${バックエンドサービスのURL}
```

- `.gitignore`ファイルに、`cloud-run-invoker.json`が追加されていることを確認します。このファイルには外部に公開するべきではない情報が含まれているので、誤ってGitHubのリモートリポジトリにpushしてしまわないように注意してください。
- `/pages/index.tsx`の`getServerSideProps()`のコメントアウトを編集し、以下のようにします。
    - これまではJavaScript標準の`fetch()`関数でHTTPリクエストを行っていましたが、`google-auth-library`パッケージを用いたサービス間認証に実装を変更します。
    - 先ほど`.env.local`に追加した`GOOGLE_APPLICATION_CREDENTIALS`（つまり`cloud-run-invoker.json`）にあるサービスアカウントの認証情報を使って、バックエンドサービス（`API_URL`）の情報を取得します。この情報を用いて、バックエンドサービスにリクエストを要求しています。
    - `cloud-run-sns-frontend`というサービスアカウントには、「Cloud Run 起動元」という**IAM**（権限）を付与していたため、Cloud Runサービスを起動して、リクエストを要求することができます。IAMを付与していない場合は、権限不足でエラーになってしまいます。

```tsx
export async function getServerSideProps() {
  const API_URL = process.env.API_URL;
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(API_URL ?? "");
  const res = await client.request({ url: `${API_URL}/posts` });
  const data = (await res.data) as Array<Post>;
  /*
  const res = await fetch(`${API_URL}/posts`);
  const data = (await res.json()) as Array<Post>;
	*/
  // const data = new Array<Post>();
  const props: Props = {
    data: data,
  };
  return {
    props: props,
  };
}
```

- 同様に、`/pages/api/posts.ts`の実装を以下のように変更します。

```tsx
import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAuth } from "google-auth-library";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_URL = process.env.API_URL;
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(API_URL ?? "");
  delete req.headers.host;
  const response = await client
    .request({
      url: `${API_URL}/posts`,
      method: req.method as "GET" | "POST" | "DELETE",
      headers: req.headers,
      data: req.body,
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
  const data = await response;
  /*
  delete req.headers.host;
  const response = await fetch(`${API_URL}/posts`, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  */
  res.status(200).json(data);
}
```

- ここまでの時点で、フロントエンドの動作をローカルで確認します。投稿の取得・作成・削除が正常に動作していれば成功です！🎉🎉🎉
    - `API_URL`をGoogle Cloudにデプロイしたバックエンドサービスに変更しているのにも関わらず動作しています。バックエンドサービスは既に認証を必要とする設定であるため、ブラウザ等から直接アクセスすることはできません。このことから、フロントエンドサービスだけが、**認証を経由して**バックエンドサービスにアクセスできており、期待通りにセキュリティが向上したことが確認できます。
- ここまでのソースコードの変更を保存してGitHubにpushします。マイクロサービスが自動で再ビルドされたら、ブラウザでフロントエンドサービスを開きます。投稿の取得・作成・削除が正常に動作していれば成功です！🎉🎉🎉

<aside>
💡 **補足：サーバーレスVPCアクセスコネクタを利用する方法**

**サーバーレスVPCアクセスコネクタ**を使用して、2つのCloud Runサービスを共通の**VPCネットワーク**に接続し、バックエンドサービスの**Ingress**を内部にすることで、バックエンドサービスを保護する方法もありますが、課金が発生することや、サービス構成が複雑になることから、今回は認証で保護する方法を採用しました。

</aside>

<aside>
⚠️ **注意：Cloud Runサービスの削除**

- ハンズオンを終了する場合は、予期せぬ請求を防ぐため、デプロイしたサービスをすぐに**削除**することを推奨します。
- この際、**GitHubリポジトリのpushをトリガーとしてビルド**する方法でデプロイしたCloud Runのサービスは、**Cloud Buildトリガー**も削除しないと、GitHubリポジトリのpush時に再度サービスがビルドされ、デプロイされてしまうので注意してください！

![Untitled](Cloud%20Run%E3%81%AB%E3%82%88%E3%82%8B%E8%87%AA%E5%AE%B6%E8%A3%BDWeb%E3%82%A2%E3%83%95%E3%82%9A%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%AF%E3%82%99%208f7d962d999047e0a8f513d706f95933/Untitled%2035.png)

</aside>

### 参考文献

- [Cloud Run の料金](https://cloud.google.com/run/pricing?hl=ja)
- [Serverless Cloud Run Development](https://www.cloudskillsboost.google/quests/152)
- [Serverless Firebase Development](https://www.cloudskillsboost.google/quests/153)
- [Dockerfileを書かずにNext.jsアプリケーションをCloud Runにデプロイする](https://nextat.co.jp/staff/archives/294)
- [認証が必要な Cloud Run を別サービスから叩く方法](https://zenn.dev/matken/articles/invoke-auth-required-cloud-run)
- [サービス間認証](https://cloud.google.com/run/docs/authenticating/service-to-service?hl=ja)
- [VPC ネットワークへの接続](https://cloud.google.com/run/docs/configuring/connecting-vpc?hl=ja)
- [サーバーレス VPC アクセス](https://cloud.google.com/vpc/docs/serverless-vpc-access?hl=ja)



# 発展編：より高度なシステムの構築

（執筆中）

# さらなる発展

 今回のWebアプリケーションは必要最低限の機能のみを実装した、非常にシンプルなものです。より良いサービスとするために、以下のような機能の実装が考えられます。

- 「いいね」「フォロー」「プロフィール閲覧」など、よりSNSらしい機能
- **Cloud Storage**を用いて、画像・動画などのメディアをアップロード・投稿できるようにする
