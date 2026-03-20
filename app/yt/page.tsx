'use client';
import { useRouter } from 'next/navigation';

const demoOutput = `🎬 YouTube Short Script (Hinglish):

Hook: "Bhai, tera Short viral kyun nahi ho raha? Yeh 3 mistakes mat karo!"

Value: 
1. Pehle 3 second mein hook nahi diya
2. CTA end mein nahi hai
3. Trending topic nahi use kiya

Script:
"Aaj main tumhe bataunga ek secret jo top creators use karte hain..."

CTA: "Aisa script chahiye? Link in bio! 👇"

#YouTubeShorts #Viral #ContentCreator`;

export default function YTLandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Nav */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-xl font-bold text-orange-600">BharatAI</h1>
        </div>
        <button
          onClick={() => router.push('/auth')}
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold"
        >
          Free mein Try Karo
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 py-14 text-center">
        <div className="inline-block bg-orange-100 text-orange-600 text-sm font-bold px-4 py-1 rounded-full mb-4">
          🔥 Indian Creators ke liye
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
          Viral YouTube Shorts Script<br />
          <span className="text-orange-500">10 seconds mein banao</span> 🚀
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Hindi, English, Hinglish mein — Instagram, YouTube, Twitter ke liye.<br />
          Aaj se content banana shuru karo — bilkul free!
        </p>
        <button
          onClick={() => router.push('/auth')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl text-xl transition shadow-lg"
        >
          Free mein Try Karo — No Credit Card
        </button>
        <p className="text-gray-400 text-sm mt-3">25 free generations — koi card nahi chahiye</p>
      </div>

      {/* Demo Output */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span className="text-sm text-gray-400 ml-2">BharatAI — Live Output</span>
          </div>
          <pre className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{demoOutput}</pre>
          <button
            onClick={() => router.push('/auth')}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
          >
            Apna Script Banao — Free hai!
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: '10 Second mein', desc: 'Instant script ready' },
            { icon: '🗣️', title: '3 Languages', desc: 'Hindi, English, Hinglish' },
            { icon: '📱', title: '3 Platforms', desc: 'YouTube, Instagram, Twitter' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow p-5 text-center">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-sm">{f.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="bg-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-extrabold mb-2">Ready ho? 🔥</h3>
          <p className="mb-6 text-orange-100">Abhi sign up karo — 25 free scripts milenge</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-white text-orange-500 font-extrabold px-10 py-4 rounded-2xl text-lg transition hover:bg-orange-50 shadow-lg"
          >
            Abhi Shuru Karo — Free hai!
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm pb-8">
        Made with love for Indian creators 🇮🇳
      </div>
    </main>
  );
}