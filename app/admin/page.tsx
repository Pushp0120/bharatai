'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const ADMIN_UID = 'ma0emJDKvNecQNkuxwJzwPkTVHp2';

interface UserData {
  id: string;
  email?: string;
  plan: string;
  count: number;
}

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setAuthChecked(true);
      if (!u) {
        router.push('/auth');
        return;
      }
      if (u.uid !== ADMIN_UID) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      await fetchUsers();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const list: UserData[] = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as any),
    }));
    setUsers(list);
  };

  const togglePro = async (uid: string, currentPlan: string) => {
    const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
    await updateDoc(doc(db, 'users', uid), { plan: newPlan });
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, plan: newPlan } : u));
  };

  const filtered = users.filter(u =>
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const proCount = users.filter(u => u.plan === 'pro').length;
  const freeCount = users.filter(u => u.plan !== 'pro').length;

  if (!authChecked || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <p className="text-orange-500 text-xl">Loading...</p>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-xl font-bold text-orange-600">BharatAI Admin</h1>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl"
        >
          Back to App
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-orange-500">{users.length}</p>
            <p className="text-gray-500 mt-1">Total Users</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-purple-500">{proCount}</p>
            <p className="text-gray-500 mt-1">Pro Users</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-500">{freeCount}</p>
            <p className="text-gray-500 mt-1">Free Users</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Users</h3>
            <input
              type="text"
              placeholder="Search by UID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-3">UID</th>
                  <th className="pb-3">Generations</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-600">{u.id.slice(0, 16)}...</td>
                    <td className="py-3 text-gray-700">{u.count || 0}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        u.plan === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {u.plan === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => togglePro(u.id, u.plan)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          u.plan === 'pro'
                            ? 'bg-red-100 text-red-500 hover:bg-red-200'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        {u.plan === 'pro' ? 'Remove Pro' : 'Make Pro'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}