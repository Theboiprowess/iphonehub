"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    // Fade in logo after a short delay
    const logoTimeout = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    // Simulate loading progress over 4 seconds
    const duration = 4000; // 4 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, interval);

    // Start fade out after 4 seconds
    const fadeTimeout = setTimeout(() => {
      setFadingOut(true);
    }, duration);

    // Remove preloader after fade completes (1 second fade)
    const removeTimeout = setTimeout(() => {
      setLoading(false);
    }, duration + 1000);

    return () => {
      clearTimeout(logoTimeout);
      clearInterval(progressInterval);
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ease-out ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Logo with breathing animation and fade-in */}
      <div className="relative mb-24">
        <Image
          src="/logo icon.jpeg"
          alt="iPhone Hub Zimbabwe"
          width={120}
          height={120}
          className={`h-24 w-24 sm:h-32 sm:w-32 rounded-2xl object-contain animate-breathing transition-opacity duration-700 ease-out ${logoVisible ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-64 sm:w-80">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#CDB586] transition-all duration-100 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
