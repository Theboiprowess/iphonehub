"use client";

import { useEffect, useState } from "react";

interface SmokeBlob {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  blur: number;
}

export function GoldSmokeBackground() {
  const [blobs, setBlobs] = useState<SmokeBlob[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate smoke blobs with controlled randomness
    const generateBlobs = (): SmokeBlob[] => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const blobCount = isMobile ? 6 : 10;
      const newBlobs: SmokeBlob[] = [];

      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          size: 300 + Math.random() * 400, // 300-700px
          top: Math.random() * 100, // 0-100%
          left: Math.random() * 100, // 0-100%
          duration: 35 + Math.random() * 55, // 35-90 seconds
          delay: Math.random() * -20, // -20 to 0 seconds
          scale: 1 + Math.random() * 0.3, // 1.0-1.3
          opacity: isMobile ? 0.3 + Math.random() * 0.2 : 0.4 + Math.random() * 0.3, // Subtle but visible
          blur: isMobile ? 60 + Math.random() * 40 : 80 + Math.random() * 60, // Soft blur for smoke effect
        });
      }

      return newBlobs;
    };

    setBlobs(generateBlobs());

    // Cleanup on unmount
    return () => {
      setBlobs([]);
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  console.log("GoldSmokeBackground rendering with", blobs.length, "blobs");

  return (
    <>
      {/* Main smoke background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1, // Further behind content
          overflow: 'hidden',
        }}
      >
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className="absolute rounded-full"
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              top: `${blob.top}%`,
              left: `${blob.left}%`,
              opacity: blob.opacity,
              filter: `blur(${blob.blur}px)`,
              background: `radial-gradient(circle at center, 
                rgba(202, 164, 90, ${blob.opacity * 1.5}) 0%, 
                rgba(216, 184, 115, ${blob.opacity}) 30%, 
                rgba(224, 196, 134, ${blob.opacity * 0.8}) 60%, 
                transparent 100%)`,
              transform: 'translate3d(0, 0, 0)',
              animation: `smoke-move ${blob.duration}s ease-in-out ${blob.delay}s infinite`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </>
  );
}
