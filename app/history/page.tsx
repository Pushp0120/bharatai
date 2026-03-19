'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  id: string;
  topic: string;
  platform: string;
  language: string;
  content: string;
  createdAt: number;
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchHistory(u.uid);
      } else {
        router.push('/auth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    const q = query(
      collection(db, 'history'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as HistoryItem));
    setHistory(items);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <p className="text-orange-500 text-xl">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-xl font-bold text-orange-600">BharatAI</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Content History 📜</h2>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400 text-lg">Abhi koi history nahi hai!</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold"
            >
              Content Banao ✨
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{item.topic}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full capitalize">
                        {item.platform}
                      </span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full capitalize">
                        {item.language}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.content)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-gray-600"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">
                  {item.content}
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  {new Date(item.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}