'use client';

import Image from 'next/image';

export default function DebugUnsplashPage() {
  // URLs de test - images qui existent vraiment
  const workingUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"; // burger
  const anotherUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"; // nourriture
  const originalUrl = "https://images.unsplash.com/photo-1605635669924-7e18d69b1fe8?w=400";
  
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Debug Image Unsplash</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl text-green-600">✅ Test avec URL qui marche (burger)</h2>
        <div className="border p-4 rounded bg-green-50">
          <p className="mb-4 text-sm">{workingUrl}</p>
          <Image
            src={workingUrl}
            alt="Burger Unsplash"
            width={400}
            height={300}
            className="rounded border"
            onLoad={() => console.log('✅ Working URL loaded')}
            onError={(e) => console.error('❌ Working URL failed:', e)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl text-blue-600">🍽️ Test avec URL food</h2>
        <div className="border p-4 rounded bg-blue-50">
          <p className="mb-4 text-sm">{anotherUrl}</p>
          <Image
            src={anotherUrl}
            alt="Food Unsplash"
            width={400}
            height={300}
            className="rounded border"
            unoptimized={true}
            onLoad={() => console.log('✅ Food URL loaded')}
            onError={(e) => console.error('❌ Food URL failed:', e)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl text-red-600">❌ URL originale problématique</h2>
        <div className="border p-4 rounded bg-red-50">
          <p className="mb-4 text-sm">{originalUrl}</p>
          <Image
            src={originalUrl}
            alt="Olives (broken)"
            width={400}
            height={300}
            className="rounded border"
            onLoad={() => console.log('✅ Original loaded')}
            onError={(e) => console.error('❌ Original failed - 404 confirmed:', e)}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold">🔧 Solution pour la DB :</h3>
        <p>Remplacer les URLs Unsplash obsolètes par des nouvelles ou par des uploads Supabase.</p>
      </div>
    </div>
  );
}
