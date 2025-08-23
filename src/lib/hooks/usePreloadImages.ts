import { useEffect, useState } from 'react';

interface PreloadImageOptions {
    priority?: boolean;
    crossOrigin?: 'anonymous' | 'use-credentials';
}

interface PreloadStatus {
    loaded: boolean;
    error: boolean;
    progress: number;
}

export function usePreloadImages(urls: string[], options: PreloadImageOptions = {}) {
    const [status, setStatus] = useState<Record<string, PreloadStatus>>({});
    const [allLoaded, setAllLoaded] = useState(false);

    useEffect(() => {
        if (!urls.length) return;

        // Inicializar status para todas as URLs
        const initialStatus: Record<string, PreloadStatus> = {};
        urls.forEach(url => {
            initialStatus[url] = { loaded: false, error: false, progress: 0 };
        });
        setStatus(initialStatus);

        let loadedCount = 0;
        const totalImages = urls.length;

        const preloadImage = (url: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                // Configurar crossOrigin se especificado
                if (options.crossOrigin) {
                    img.crossOrigin = options.crossOrigin;
                }

                img.onload = () => {
                    loadedCount++;
                    setStatus(prev => ({
                        ...prev,
                        [url]: { loaded: true, error: false, progress: 100 }
                    }));

                    if (loadedCount === totalImages) {
                        setAllLoaded(true);
                    }
                    resolve();
                };

                img.onerror = () => {
                    setStatus(prev => ({
                        ...prev,
                        [url]: { loaded: false, error: true, progress: 0 }
                    }));
                    reject(new Error(`Failed to load image: ${url}`));
                };

                // Iniciar carregamento
                img.src = url;
            });
        };

        // Carregar imagens com prioridade primeiro
        const priorityUrls = options.priority ? urls.slice(0, 3) : [];
        const remainingUrls = options.priority ? urls.slice(3) : urls;

        // Carregar imagens prioritárias primeiro
        Promise.all(priorityUrls.map(preloadImage))
            .then(() => {
                // Depois carregar o restante em paralelo (mas limitado)
                const batchSize = 3;
                const batches: string[][] = [];

                for (let i = 0; i < remainingUrls.length; i += batchSize) {
                    batches.push(remainingUrls.slice(i, i + batchSize));
                }

                // Executa lotes sequencialmente com async/await
                return (async () => {
                    for (const batch of batches) {
                        await Promise.all(batch.map(preloadImage));
                    }
                })();
            })
            .catch(error => {
                console.warn('Some images failed to preload:', error);
            });

    }, [urls, options.priority, options.crossOrigin]);

    return {
        status,
        allLoaded,
        loadedCount: Object.values(status).filter(s => s.loaded).length,
        totalCount: urls.length,
        progress: Object.values(status).reduce((acc, s) => acc + s.progress, 0) / urls.length || 0
    };
}

export function usePreloadProjectImages(projects: Array<{ imageUrl: string; link?: string }>) {
    const apiKey = process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY;

    // Gerar URLs de imagens (screenshots ou imagens locais)
    const imageUrls = projects.map(project => {
        if (project.link && apiKey) {
            return `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodeURIComponent(project.link)}&viewport_width=1280&viewport_height=720&format=jpeg&image_quality=80&block_ads=true&block_cookie_banners=true&full_page=false&delay=5&timeout=60&response_type=by_format`;
        }
        return project.imageUrl;
    }).filter(Boolean);

    return usePreloadImages(imageUrls, { priority: true, crossOrigin: 'anonymous' });
}
