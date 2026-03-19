'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const upiId = '8866291373@axl';
  const amount = 99;
  const upiLink = `upi://pay?pa=${upiId}&pn=BharatAI&am=${amount}&cu=INR&tn=BharatAI Pro Upgrade`;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push('/auth');
      else setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handlePayClick = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.open(upiLink);
    } else {
      navigator.clipboard.writeText(upiId);
      alert('UPI ID copy ho gaya! GPay/PhonePe mein paste karo: ' + upiId);
    }
  };

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
          Back
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Pro Plan lo</h2>
          <p className="text-gray-500">Unlimited content generation ke liye</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-orange-500">Rs. 99</span>
            <span className="text-gray-400"> per month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              'Unlimited content generation',
              'All 3 platforms',
              'All 3 languages',
              'Content history',
              'Priority support',
            ].map((f) => (
              <li key={f} className="text-gray-700 font-medium">✅ {f}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-4">UPI se pay karo</h3>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
            alt="UPI QR Code"
            className="mx-auto rounded-xl mb-4"
          />
          <p className="text-gray-500 text-sm mb-2">UPI ID:</p>
          <p className="font-bold text-orange-600 text-lg mb-4">{upiId}</p>
          <button
            onClick={handlePayClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
          >
            GPay / PhonePe se Pay karo
          </button>
          <p className="text-gray-400 text-xs mt-4">
            Payment ke baad screenshot bhejo — access 24hrs mein milega
          </p>
        </div>
      </div>
    </main>
  );
}