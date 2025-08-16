
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from './auth-form';

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
        <AuthForm mode={mode} onAuthSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
