import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useLazyLoading<T extends HTMLElement = HTMLDivElement>(
    options: UseLazyLoadingOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '50px',
        triggerOnce = true
    } = options;

    const [isIntersecting, setIsIntersecting] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const elementRef = useRef<T>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry!.isIntersecting;
                setIsIntersecting(isVisible);

                if (isVisible && !hasBeenVisible) {
                    setHasBeenVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, rootMargin, triggerOnce, hasBeenVisible]);

    return {
        elementRef,
        isIntersecting,
        hasBeenVisible,
        shouldLoad: triggerOnce ? hasBeenVisible : isIntersecting,
    };
}

interface UseProgressiveLazyLoadingOptions extends UseLazyLoadingOptions {
    immediate?: number; // Número de itens para carregar imediatamente
    batchSize?: number; // Número de itens para carregar por vez
}

export function useProgressiveLazyLoading<T extends HTMLElement = HTMLDivElement>(
    totalItems: number,
    options: UseProgressiveLazyLoadingOptions = {}
) {
    const {
        immediate = 3,
        batchSize = 3,
        threshold = 0.1,
        rootMargin = '100px'
    } = options;

    const [visibleCount, setVisibleCount] = useState(immediate);
    const sentinelRef = useRef<T>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || visibleCount >= totalItems) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry!.isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + batchSize, totalItems));
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(sentinel);

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [visibleCount, totalItems, batchSize, threshold, rootMargin]);

    return {
        visibleCount,
        sentinelRef,
        hasMore: visibleCount < totalItems,
    };
}

export function useImageLazyLoading(src: string, placeholder?: string) {
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const { elementRef, shouldLoad } = useLazyLoading<HTMLImageElement>();

    useEffect(() => {
        if (!shouldLoad || !src) return;

        const img = new Image();
        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
        };
        img.onerror = () => {
            setIsError(true);
        };
        img.src = src;
    }, [src, shouldLoad]);

    return {
        elementRef,
        imageSrc,
        isLoaded,
        isError,
        shouldLoad,
    };
}
