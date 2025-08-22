import React from "react";

const PrivacyPolicy = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>

    <h2 className="text-xl font-semibold mt-4 mb-2">1. 個人情報の取得</h2>
    <p>
      当サイトでは、会員登録時にユーザー名・メールアドレス・パスワードなどの個人情報を取得します。
      パスワードはハッシュ化された形式で保存されます。
      また、サービス向上のためアクセスログや利用状況などのデータを収集する場合があります。
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">2. 利用目的</h2>
    <p>
      取得した個人情報は以下の目的に利用します。
      <ul className="list-disc ml-6">
        <li>アカウント作成およびユーザー認証のため</li>
        <li>サービスの提供・維持・改善のため</li>
        <li>お問い合わせへの対応および重要なお知らせの通知のため</li>
        <li>
          統計・分析などによるサービス改善のため（個人を特定しない形で利用）
        </li>
      </ul>
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">3. 個人情報の管理</h2>
    <p>
      当サイトでは、SSLによる通信暗号化やJWTによる認証、パスワードのハッシュ化など適切な安全対策を講じ、個人情報への不正アクセス、紛失、破損、改ざん及び漏えいの防止に努めます。
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">4. 第三者提供</h2>
    <p>
      個人情報は、法令に基づく場合やユーザーの同意を得た場合を除き、第三者に提供することはありません。統計情報など個人を特定できないデータについては公表する場合があります。
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">5. Cookie等の利用</h2>
    <p>
      当サイトではログイン状態を維持するためにCookieを利用します。ブラウザ設定によりCookieを無効にすることもできますが、その場合一部機能がご利用いただけない可能性があります。
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">6. ユーザーの権利</h2>
    <p>
      ユーザーは、当サイトが保有する自己の個人情報について、開示・訂正・削除を求めることができます。具体的な手続きについては下記のお問い合わせ先までご連絡ください。
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">7. お問い合わせ先</h2>
    <p>
      プライバシーポリシーに関するお問い合わせは、管理者までメールでご連絡ください。（例：contact@example.com）
    </p>

    <h2 className="text-xl font-semibold mt-4 mb-2">
      8. プライバシーポリシーの変更
    </h2>
    <p>
      本ポリシーの内容は、法令の改正やサービス内容の変更などに応じて改訂する場合があります。重要な変更がある場合は当サイト上でお知らせします。
    </p>
  </div>
);

export default PrivacyPolicy;
