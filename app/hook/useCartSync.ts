// app/hooks/useCartSync.ts
import { useEffect } from 'react';
import { useUserAuth } from '../contexts/UserAuthContext';
import { useCart } from '../contexts/CartContext';

export const useCartSync = () => {
  const { user, token } = useUserAuth();
  const { syncGuestCartWithBackend, clearGuestCart, items } = useCart();

  // Sync cart when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (user && token && items.length > 0) {
        try {
          await syncGuestCartWithBackend();
          await clearGuestCart();
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    syncCart();
  }, [user, token, items.length, syncGuestCartWithBackend, clearGuestCart]);
};