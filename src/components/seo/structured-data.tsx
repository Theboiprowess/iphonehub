"use client";

import { useEffect } from "react";

export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "iPhone Hub Zimbabwe",
      "description": "Shop quality boxed, pre-owned and second-hand iPhones from iPhone Hub Zimbabwe. Based in Masvingo and serving customers across Zimbabwe with transparent pricing and trusted service.",
      "url": "https://iphonehubzimbabwe.co.zw",
      "telephone": "+263773227172",
      "telephone2": "+263784502347",
      "email": "info@iphonehubmasvingo.co.zw",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Masvingo",
        "addressRegion": "Masvingo",
        "addressCountry": "ZW"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-20.0630",
        "longitude": "30.8305"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "10:00",
          "closes": "14:00"
        }
      ],
      "priceRange": "$$",
      "image": "https://iphonehubzimbabwe.co.zw/logo icon.jpeg",
      "sameAs": [
        "https://www.facebook.com/iphonehubzimbabwe",
        "https://www.instagram.com/iphonehubzimbabwe"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
