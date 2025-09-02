'use client';

import Image from 'next/image';

export default function TestImagesPage() {
  const unsplashUrls = [
    'https://images.unsplash.com/photo-1558642891-b77887b1ef67?w=400',
    'https://images.unsplash.com/photo-1474979266404-7e18d69b1fe8?w=400',
    'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400',
    'https://images.unsplash.com/photo-1605635669924-7e18d69b1fe8?w=400',
    'https://images.unsplash.com/photo-1571115018088-24c8a48dfe37?w=400',
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Images Unsplash</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <h2 className="col-span-2 text-xl font-semibold">Avec Next.js Image (optimized)</h2>
        {unsplashUrls.map((url, index) => (
          <div key={index} className="border p-4 rounded">
            <p className="text-sm mb-2">Image {index + 1}</p>
            <Image
              src={url}
              alt={`Test image ${index + 1}`}
              width={400}
              height={300}
              className="rounded"
              onError={() => console.error(`❌ Failed to load: ${url}`)}
              onLoad={() => console.log(`✅ Loaded: ${url}`)}
            />
            <p className="text-xs mt-2 break-all">{url}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <h2 className="col-span-2 text-xl font-semibold">Avec img native (non-optimized)</h2>
        {unsplashUrls.map((url, index) => (
          <div key={index} className="border p-4 rounded">
            <p className="text-sm mb-2">Image {index + 1} (native)</p>
            <img
              src={url}
              alt={`Test image ${index + 1}`}
              width={400}
              height={300}
              className="rounded"
              onError={() => console.error(`❌ Native failed: ${url}`)}
              onLoad={() => console.log(`✅ Native loaded: ${url}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
