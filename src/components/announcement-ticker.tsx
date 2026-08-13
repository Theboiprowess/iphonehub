"use client";

import { useState, useEffect } from "react";

type Announcement = {
  id: string;
  message: string;
  type: string;
  scrollingSpeed: number;
};

export function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    
    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      console.log('Fetching announcements...');
      const response = await fetch('/api/announcements');
      const data = await response.json();
      console.log('Announcements fetched:', data);
      setAnnouncements(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setLoading(false);
    }
  };

  // Use fallback messages if no announcements or loading
  const displayMessages = (announcements.length > 0 && !loading) 
    ? announcements 
    : [
        { id: '1', message: '📱 QUALITY iPHONES • BOXED • PRE-OWNED • SECOND-HAND', type: 'INFORMATIONAL', scrollingSpeed: 30 },
        { id: '2', message: '🇿🇼 SERVING CUSTOMERS ACROSS ZIMBABWE', type: 'INFORMATIONAL', scrollingSpeed: 30 },
        { id: '3', message: '🚚 DELIVERY AVAILABLE NATIONWIDE', type: 'DELIVERY', scrollingSpeed: 30 },
        { id: '4', message: '🔄 TRADE IN YOUR OLD iPHONE & UPGRADE', type: 'PROMOTIONAL', scrollingSpeed: 30 },
      ];

  // Duplicate announcements for seamless looping
  const displayAnnouncements = [...displayMessages, ...displayMessages];
  const scrollingSpeed = displayMessages[0]?.scrollingSpeed || 30;
  const animationDuration = scrollingSpeed * 2;

  console.log('Display messages:', displayMessages);
  console.log('Animation duration:', animationDuration);

  return (
    <div className="bg-[#0E161B] border-b border-[#CDB586]/20 relative overflow-hidden">
      <div className="py-3 px-4">
        <div 
          className="flex gap-12 whitespace-nowrap animate-scroll"
          style={{
            animationDuration: `${animationDuration}s`,
          }}
        >
          {displayAnnouncements.map((announcement, index) => (
            <span 
              key={`${announcement.id}-${index}`} 
              className="text-[#CDB586] text-sm font-medium flex items-center gap-3"
            >
              {announcement.message}
              <span className="text-[#CDB586]/40 text-lg">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
