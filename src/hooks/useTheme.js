'use client';

import { useState, useEffect } from 'react';

/**
 * useTheme — Hook untuk mengelola tema dashboard.
 *
 * Menggantikan logika duplikat di Sidebar.js dan profile/page.js.
 *
 * Fitur:
 * - Membaca tema dari localStorage saat mount
 * - Menerapkan tema ke data-theme attribute di <html>
 * - Mendengarkan event 'themeChange' untuk sinkronisasi antar komponen
 * - Menyediakan fungsi handleThemeChange untuk mengubah tema
 *
 * @returns {{ activeTheme: string, handleThemeChange: Function }}
 *
 * Penggunaan:
 * const { activeTheme, handleThemeChange } = useTheme();
 */
export function useTheme() {
  const [activeTheme, setActiveTheme] = useState('clean');

  useEffect(() => {
    const syncTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'clean';
      setActiveTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    };

    syncTheme();
    window.addEventListener('themeChange', syncTheme);
    return () => window.removeEventListener('themeChange', syncTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('themeChange'));
  };

  return { activeTheme, handleThemeChange };
}
