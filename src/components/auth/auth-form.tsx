
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  displayName: z.string().optional(),
});

interface AuthFormProps {
  mode: 'login' | 'signup';
  onAuthSuccess: () => void;
}

export function AuthForm({ mode, onAuthSuccess }: AuthFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        if (values.displayName) {
          await updateProfile(userCredential.user, { displayName: values.displayName });
        }
        await sendEmailVerification(userCredential.user);
        toast({ title: 'Account created!', description: "We've sent a verification link to your email. Please check your inbox!" });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Logged in successfully!', description: "Let's play!" });
      }
      onAuthSuccess();
    } catch (error: any) {
      console.error('Authentication Error:', error);
      
      let errorTitle = 'Authentication Failed';
      let errorDescription = error.message;
      
      if (error.code === 'auth/email-already-in-use') {
        errorTitle = 'Email Already Registered';
        errorDescription = 'This email is already in use. Please try logging in instead.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        errorTitle = 'Invalid Credentials';
        errorDescription = 'Email or password is incorrect. Please check your credentials and try again.';
      } else if (error.code === 'auth/wrong-password') {
        errorTitle = 'Incorrect Password';
        errorDescription = 'The password you entered is incorrect. Please try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorTitle = 'Account Disabled';
        errorDescription = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        errorTitle = 'Too Many Attempts';
        errorDescription = 'Too many failed attempts. Please wait a moment and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = 'Network Error';
        errorDescription = 'Please check your internet connection and try again.';
      } else if (error.code === 'auth/weak-password') {
        errorTitle = 'Weak Password';
        errorDescription = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email';
        errorDescription = 'Please enter a valid email address.';
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Welcome!', description: 'Signed in with Google.' });
      onAuthSuccess();
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      
      let errorTitle = 'Google Sign-in Failed';
      let errorDescription = error.message;
      
      if (error.code === 'auth/unauthorized-domain') {
        errorTitle = 'Domain Not Authorized';
        errorDescription = 'This domain is not authorized for Google Sign-in. Please contact the administrator or use email/password login.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorTitle = 'Sign-in Cancelled';
        errorDescription = 'Google sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorTitle = 'Popup Blocked';
        errorDescription = 'Please allow popups for this site and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = 'Network Error';
        errorDescription = 'Please check your internet connection and try again.';
      }
      
      toast({ 
        title: errorTitle, 
        description: errorDescription, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    const email = form.getValues('email');
    if (!email) {
      toast({ title: 'Enter your email first', description: 'Please provide your email to reset your password.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Reset email sent', description: 'Check your inbox for a password reset link.' });
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      
      let errorTitle = 'Reset Failed';
      let errorDescription = error.message;
      
      if (error.code === 'auth/user-not-found') {
        errorTitle = 'Email Not Found';
        errorDescription = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email';
        errorDescription = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorTitle = 'Too Many Requests';
        errorDescription = 'Too many reset attempts. Please wait a moment and try again.';
      }
      
      toast({ 
        title: errorTitle, 
        description: errorDescription, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name (3 Chars)</FormLabel>
                <FormControl>
                  <Input placeholder="PXL" {...field} maxLength={3} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="player@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Working...' : mode === 'login' ? 'Log In' : 'Sign Up'}
        </Button>
        {mode === 'login' && (
          <Button type="button" variant="link" className="w-full" onClick={handleResetPassword} disabled={loading}>
            Forgot password?
          </Button>
        )}
        <div className="py-2">
          <Separator />
        </div>
        <Button type="button" variant="secondary" disabled={loading} className="w-full" onClick={handleGoogleSignIn}>
          Continue with Google
        </Button>
      </form>
    </Form>
  );
}
