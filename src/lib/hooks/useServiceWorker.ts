import { useEffect, useState } from 'react';

interface ServiceWorkerStatus {
    isSupported: boolean;
    isRegistered: boolean;
    isReady: boolean;
    error: string | null;
}

export function useServiceWorker() {
    const [status, setStatus] = useState<ServiceWorkerStatus>({
        isSupported: false,
        isRegistered: false,
        isReady: false,
        error: null,
    });

    useEffect(() => {
        // Verificar se Service Worker é suportado
        if (!('serviceWorker' in navigator)) {
            setStatus(prev => ({ ...prev, error: 'Service Worker not supported' }));
            return;
        }

        setStatus(prev => ({ ...prev, isSupported: true }));

        // Registrar Service Worker
        const registerSW = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });

                console.log('Service Worker registered successfully:', registration);

                // Verificar se há uma atualização disponível
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('New service worker available');
                                // Você pode notificar o usuário sobre a atualização aqui
                            }
                        });
                    }
                });

                setStatus(prev => ({ ...prev, isRegistered: true }));

                // Verificar se o Service Worker está ativo
                if (registration.active) {
                    setStatus(prev => ({ ...prev, isReady: true }));
                }

                // Escutar mudanças no estado do Service Worker
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    setStatus(prev => ({ ...prev, isReady: true }));
                });

            } catch (error) {
                console.error('Service Worker registration failed:', error);
                setStatus(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Registration failed'
                }));
            }
        };

        registerSW();

        // Cleanup listeners no unmount
        return () => {
            // Remove listeners se necessário
        };
    }, []);

    // Função para enviar mensagens para o Service Worker
    const sendMessage = (message: any) => {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        }
    };

    // Função para prefetch de imagens via Service Worker
    const prefetchImages = (urls: string[]) => {
        sendMessage({
            type: 'PREFETCH_IMAGES',
            urls,
        });
    };

    // Função para limpar cache de imagens
    const cleanImageCache = () => {
        sendMessage({
            type: 'CLEAN_IMAGE_CACHE',
        });
    };

    return {
        ...status,
        sendMessage,
        prefetchImages,
        cleanImageCache,
    };
}

// Hook para gerenciar cache de imagens específicas
export function useImageCache() {
    const { prefetchImages, cleanImageCache, isReady } = useServiceWorker();

    const cacheImages = (imageUrls: string[]) => {
        if (isReady && imageUrls.length > 0) {
            prefetchImages(imageUrls);
        }
    };

    const clearCache = () => {
        if (isReady) {
            cleanImageCache();
        }
    };

    return {
        cacheImages,
        clearCache,
        isReady,
    };
}
