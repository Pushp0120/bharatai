'use client';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) return setError('Email aur password dono bharo!');
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🇮🇳</span>
          <h1 className="text-2xl font-bold text-orange-600 mt-2">BharatAI</h1>
          <p className="text-gray-500 text-sm mt-1">India ka apna Content Generator</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              isLogin ? 'bg-white shadow text-orange-600' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              !isLogin ? 'bg-white shadow text-orange-600' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? '⏳ Please wait...' : isLogin ? '🚀 Login' : '✨ Create Account'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? "Account nahi hai? " : "Already account hai? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 font-semibold"
          >
            {isLogin ? 'Sign Up karo' : 'Login karo'}
          </button>
        </p>
      </div>
    </main>
  );
}