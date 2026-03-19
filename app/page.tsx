'use client';
import { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const FREE_LIMIT = 25;

export default function Home() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [language, setLanguage] = useState('hinglish');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await loadUsage(u.uid);
      } else {
        setUser(null);
        setIsPro(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUsage = async (uid: string) => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const pro = data.plan === 'pro';
      setIsPro(pro);
      setUsageCount(pro ? 0 : data.count || 0);
    } else {
      await setDoc(ref, { count: 0, plan: 'free' });
      setUsageCount(0);
      setIsPro(false);
    }
  };

  const generateContent = async () => {
    if (!user) return router.push('/auth');
    if (!topic) return alert('Topic enter karo!');
    if (!isPro && usageCount >= FREE_LIMIT) return router.push('/upgrade');

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

      if (!isPro) {
        const ref = doc(db, 'users', user.uid);
        await updateDoc(ref, { count: increment(1) });
        setUsageCount(prev => prev + 1);
      }

      await addDoc(collection(db, 'history'), {
        uid: user.uid,
        topic,
        platform,
        language,
        content: data.content,
        createdAt: Date.now(),
      });

    } catch (e) {
      alert('Error aaya! Try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-xl font-bold text-orange-600">BharatAI</h1>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isPro ? (
                <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">
                  Pro
                </span>
              ) : (
                <span className="text-sm text-gray-500 bg-orange-50 px-3 py-1 rounded-full">
                  {FREE_LIMIT - usageCount} free left
                </span>
              )}
              <button
                onClick={() => router.push('/history')}
                className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                History
              </button>
              {!isPro && (
                <button
                  onClick={() => router.push('/upgrade')}
                  className="text-sm bg-purple-500 text-white px-4 py-2 rounded-xl"
                >
                  Pro
                </button>
              )}
              <button
                onClick={() => signOut(auth)}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Content banao <span className="text-orange-500">seconds mein</span>
          </h2>
          <p className="text-gray-500 text-lg">Instagram, YouTube, Twitter ke liye — Hindi, English, Hinglish mein</p>
        </div>

        {user && !isPro && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">Free Plan Usage</span>
              <span className="text-orange-500 font-bold">{usageCount}/{FREE_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(usageCount / FREE_LIMIT) * 100}%` }}
              />
            </div>
            {usageCount >= FREE_LIMIT && (
              <p className="text-red-500 text-sm mt-2 font-semibold">
                Free limit khatam! Pro plan lo unlimited generations ke liye!
              </p>
            )}
          </div>
        )}

        {user && isPro && (
          <div className="bg-purple-50 rounded-2xl p-4 mb-6 text-center">
            <p className="text-purple-600 font-bold">Pro Plan Active — Unlimited Generations!</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Topic kya hai?</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Diwali sale, IPL 2026, New phone launch..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
            <div className="grid grid-cols-3 gap-3">
              {['instagram', 'youtube', 'twitter'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-xl font-semibold capitalize text-sm transition ${
                    platform === p ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {p === 'instagram' ? 'Instagram' : p === 'youtube' ? 'YouTube' : 'Twitter'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <div className="grid grid-cols-3 gap-3">
              {['hindi', 'english', 'hinglish'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-2 rounded-xl font-semibold capitalize text-sm transition ${
                    language === l ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  {l === 'hindi' ? 'Hindi' : l === 'english' ? 'English' : 'Hinglish'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => !isPro && usageCount >= FREE_LIMIT ? router.push('/upgrade') : generateContent()}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : !isPro && usageCount >= FREE_LIMIT ? 'Upgrade to Pro' : 'Generate Content'}
          </button>
        </div>

        {content && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">Generated Content</h3>
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-gray-600"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-8">Made with love ❤️for Indian creators</p>
      </div>
    </main>
  );
}