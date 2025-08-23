"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLazyLoading } from '../hooks/useLazyLoading';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchOnHover?: boolean;
  prefetchOnVisible?: boolean;
  target?: string;
  rel?: string;
}

export function PrefetchLink({
  href,
  children,
  className,
  prefetchOnHover = true,
  prefetchOnVisible = false,
  target,
  rel,
}: PrefetchLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { elementRef, shouldLoad } = useLazyLoading<HTMLAnchorElement>({
    threshold: 0.5,
    rootMargin: '100px',
  });

  // Combinar refs
  useEffect(() => {
    if (linkRef.current && elementRef.current !== linkRef.current) {
      (elementRef as React.MutableRefObject<HTMLAnchorElement | null>).current = linkRef.current;
    }
  }, [elementRef]);

  // Prefetch quando visível
  useEffect(() => {
    if (prefetchOnVisible && shouldLoad && href.startsWith('/')) {
      // Para rotas internas, usar o prefetch do Next.js
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [prefetchOnVisible, shouldLoad, href]);

  // Prefetch para links externos
  const handleMouseEnter = () => {
    if (prefetchOnHover && !href.startsWith('/')) {
      // Para links externos, fazer DNS prefetch
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = new URL(href).origin;
      
      if (!document.head.querySelector(`link[href="${new URL(href).origin}"]`)) {
        document.head.appendChild(link);
      }
    }
  };

  // Se for um link interno, usar Next.js Link
  if (href.startsWith('/')) {
    return (
      <Link
        href={href}
        className={className}
        prefetch={prefetchOnHover || prefetchOnVisible}
        ref={linkRef}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </Link>
    );
  }

  // Para links externos, usar tag a normal
  return (
    <a
      ref={linkRef}
      href={href}
      className={className}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </a>
  );
}

// Hook para prefetch programático
export function usePrefetch() {
  const prefetchUrl = (url: string) => {
    if (url.startsWith('/')) {
      // Link interno - prefetch da página
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      
      if (!document.head.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
        document.head.appendChild(link);
      }
    } else {
      // Link externo - DNS prefetch
      try {
        const origin = new URL(url).origin;
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = origin;
        
        if (!document.head.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`)) {
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn('Invalid URL for prefetch:', url);
      }
    }
  };

  const prefetchImage = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.as = 'image';
    
    if (!document.head.querySelector(`link[rel="prefetch"][href="${src}"]`)) {
      document.head.appendChild(link);
    }
  };

  return { prefetchUrl, prefetchImage };
}
