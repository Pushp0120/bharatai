'use client';
import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [language, setLanguage] = useState('hinglish');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!topic) return alert('Topic enter karo!');
    setLoading(true);
    setContent('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, language }),
      });
      const data = await res.json();
      setContent(data.content);
    } catch (e) {
      alert('Error aaya! Try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-xl font-bold text-orange-600">BharatAI</h1>
        </div>
        <span className="text-sm text-gray-500">AI Content Generator for Indians</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Content banao <span className="text-orange-500">seconds mein</span> 🚀
          </h2>
          <p className="text-gray-500 text-lg">Instagram, YouTube, Twitter ke liye — Hindi, English, Hinglish mein</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Topic kya hai? 📝</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Diwali sale, IPL 2026, New phone launch..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform 📱</label>
            <div className="grid grid-cols-3 gap-3">
              {['instagram', 'youtube', 'twitter'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-xl font-semibold capitalize text-sm transition ${
                    platform === p
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {p === 'instagram' ? '📸 Instagram' : p === 'youtube' ? '▶️ YouTube' : '🐦 Twitter'}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language 🗣️</label>
            <div className="grid grid-cols-3 gap-3">
              {['hindi', 'english', 'hinglish'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-2 rounded-xl font-semibold capitalize text-sm transition ${
                    language === l
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  {l === 'hindi' ? '🇮🇳 Hindi' : l === 'english' ? '🇬🇧 English' : '🤝 Hinglish'}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50"
          >
            {loading ? '⏳ Generating...' : '✨ Generate Content'}
          </button>
        </div>

        {/* Output */}
        {content && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">Generated Content 🎉</h3>
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-gray-600"
              >
                📋 Copy
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Made with ❤️ for Indian creators
        </p>
      </div>
    </main>
  );
}