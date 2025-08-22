'use client';

import { useEffect } from 'react';
import { initEmailJS } from '@/lib/emailjs';

export function EmailJSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize EmailJS when the component mounts
    initEmailJS();
  }, []);

  return <>{children}</>;
}


