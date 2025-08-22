'use client';

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export const usePerformance = () => {
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
      };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null;
    const lcp = paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime || null;
    const ttfb = navigation ? navigation.responseStart - navigation.requestStart : null;

    return {
      fcp,
      lcp,
      fid: null, // Will be set by observer
      cls: null, // Will be set by observer
      ttfb,
    };
  }, []);

  const observePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log('LCP:', lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS Observer
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance observation not supported:', error);
      }
    }
  }, []);

  const logPerformanceMetrics = useCallback(() => {
    const metrics = getPerformanceMetrics();
    console.log('Performance Metrics:', metrics);
    
    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', {
        event_category: 'performance',
        event_label: 'core_web_vitals',
        value: Math.round(metrics.lcp || 0),
        custom_parameters: {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          ttfb: metrics.ttfb,
        },
      });
    }
  }, [getPerformanceMetrics]);

  useEffect(() => {
    const cleanup = observePerformance();
    
    // Log metrics after page load
    const timer = setTimeout(logPerformanceMetrics, 1000);
    
    return () => {
      cleanup?.();
      clearTimeout(timer);
    };
  }, [observePerformance, logPerformanceMetrics]);

  return {
    getPerformanceMetrics,
    logPerformanceMetrics,
  };
};
