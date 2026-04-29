'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserErrorMessage } from '@/lib/utils';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get('returnUrl') ?? '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const returnUrl =
        rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
          ? rawReturnUrl.replace(/^\/c\//, '/channels/')
          : null;
      router.push(returnUrl ?? '/channels');
    } catch (err) {
      setError(getUserErrorMessage(err, 'Invalid credentials. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-discord-bg-primary'>
      <div className='w-full max-w-md rounded-lg bg-discord-bg-secondary p-8 shadow-lg'>
        <h1 className='mb-2 text-center text-2xl font-bold text-white'>Welcome back!</h1>
        <p className='mb-6 text-center text-sm text-discord-text-muted'>
          We&apos;re so excited to see you again!
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
              placeholder='Enter your email'
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
              placeholder='Enter your password'
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className='text-sm text-red-400' role='alert'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded bg-discord-accent py-2.5 font-medium text-white transition-colors hover:bg-discord-accent/80 disabled:opacity-50'
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>

          <p className='text-sm text-discord-text-muted'>
            Need an account?{' '}
            <Link
              href={
                rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
                  ? `/auth/signup?returnUrl=${encodeURIComponent(rawReturnUrl)}`
                  : '/auth/signup'
              }
              className='text-discord-accent hover:underline'
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
