"use client";

import { useEffect } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const { isReady, error } = useServiceWorker();

  useEffect(() => {
    if (isReady) {
      console.log('Service Worker is ready and active');
    }
    
    if (error) {
      console.warn('Service Worker error:', error);
    }
  }, [isReady, error]);

  // Este componente apenas registra o Service Worker
  // Não renderiza nada além dos children
  return <>{children}</>;
}
