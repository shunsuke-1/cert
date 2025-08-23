import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // ご自身の Formspree フォームIDに置き換えてください
      const formId = "xyzprbwg";
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="お名前"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージ"
          className="border border-gray-300 p-2 rounded h-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={status === "sending"}
        >
          送信
        </button>
        {status === "success" && (
          <p className="text-green-600">
            お問い合わせを受け付けました。ありがとうございます！
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600">
            送信に失敗しました。時間を置いて再度お試しください。
          </p>
        )}
      </form>
    </div>
  );
};

export default Contact;
