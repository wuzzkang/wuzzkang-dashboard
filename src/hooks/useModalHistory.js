'use client';

import { useEffect, useRef } from 'react';

/**
 * useModalHistory — Hook untuk mensinkronisasi state modal dengan browser history.
 *
 * Menggantikan pola berulang (push/pop state) di page.js, topup/page.js, payments/history/page.js.
 *
 * Cara kerja:
 * - Saat `isOpen` menjadi true → pushState dengan modalId ke browser history
 * - Saat `isOpen` menjadi false (dari kondisi true) → history.back()
 * - Saat user menekan tombol back browser → memanggil onClose
 *
 * @param {boolean}  isOpen   - Apakah modal sedang terbuka
 * @param {string}   modalId  - ID unik modal (digunakan sebagai history state key)
 * @param {Function} onClose  - Callback yang dipanggil saat user menekan back button
 *
 * Penggunaan:
 * useModalHistory(shareModalOpen, 'share-modal', () => setShareModalOpen(false));
 */
export function useModalHistory(isOpen, modalId, onClose) {
  const prevOpenRef = useRef(false);

  // Push state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (!window.history.state || window.history.state.modalId !== modalId) {
        window.history.pushState({ modalId }, '');
      }
    }
  }, [isOpen, modalId]);

  // history.back() saat modal ditutup secara programmatik
  useEffect(() => {
    if (!isOpen && prevOpenRef.current) {
      if (typeof window !== 'undefined' && window.history.state?.modalId === modalId) {
        window.history.back();
      }
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, modalId]);

  // Dengarkan popstate (tombol back browser)
  useEffect(() => {
    const handlePopState = () => {
      const currentModalId = window.history.state?.modalId;
      if (!currentModalId && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('popstate', handlePopState);
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);
}
