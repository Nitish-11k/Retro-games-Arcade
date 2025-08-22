'use client';

import { Suspense, lazy, ComponentType, ReactNode } from 'react';

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
}

export const LazyLoad = ({ component, fallback, props }: LazyLoadProps) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-muted h-8 w-full rounded" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Predefined lazy components for common use cases
export const LazyImage = lazy(() => import('next/image').then(mod => ({ default: mod.default })));
export const LazyChartContainer = lazy(() => import('./chart').then(mod => ({ default: mod.ChartContainer })));
export const LazyCarousel = lazy(() => import('./carousel').then(mod => ({ default: mod.Carousel })));

// Utility function to preload components
export const preloadComponent = (component: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(component);
  return LazyComponent;
};
