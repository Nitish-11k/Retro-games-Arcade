
'use client';

import React, { lazy, Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

// Lazy load AuthForm to improve modal performance
const AuthForm = lazy(() => import('./auth-form').then(mod => ({ default: mod.AuthForm })));

interface AuthModalProps {
  children: React.ReactNode;
  mode: 'login' | 'signup';
}

export function AuthModal({ children, mode }: AuthModalProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            {mode === 'login' ? 'Player Login' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Log in to save your high scores.'
              : 'Sign up to join the leaderboards!'}
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <AuthForm mode={mode} onAuthSuccess={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
