'use client';

import { usePerformance } from '@/hooks/use-performance';

export const PerformanceMonitor = () => {
  usePerformance(); // This will handle all performance monitoring

  // This component doesn't render anything visible
  // It just initializes performance monitoring
  return null;
};
