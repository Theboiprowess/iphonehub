"use client";

import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Load appearance settings from API
    const loadAppearanceSettings = async () => {
      try {
        const response = await fetch('/admin/api/settings');
        if (response.ok) {
          const settings = await response.json();
          
          // Apply CSS variables for dynamic theming
          const root = document.documentElement;
          
          if (settings.primaryColor) {
            root.style.setProperty('--matte-black', settings.primaryColor);
            root.style.setProperty('--background', settings.primaryColor === '#0D161B' ? '#F7F5EF' : settings.primaryColor);
          }
          if (settings.secondaryColor) {
            root.style.setProperty('--champagne-gold', settings.secondaryColor);
            root.style.setProperty('--gold-accent', settings.secondaryColor);
          }
          
          console.log('Applied appearance settings:', settings);
        }
      } catch (error) {
        console.error('Failed to load appearance settings:', error);
      }
    };

    loadAppearanceSettings();
  }, []);

  return <>{children}</>;
}
