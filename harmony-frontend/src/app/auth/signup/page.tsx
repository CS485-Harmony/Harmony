'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserErrorMessage } from '@/lib/utils';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(email, username, displayName || username, password);
      const raw = searchParams.get('returnUrl') ?? '';
      const returnUrl =
        raw.startsWith('/') && !raw.startsWith('//') ? raw.replace(/^\/c\//, '/channels/') : null;
      router.push(returnUrl ?? '/channels');
    } catch (err) {
      setError(getUserErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-discord-bg-primary'>
      <div className='w-full max-w-md rounded-lg bg-discord-bg-secondary p-8 shadow-lg'>
        <h1 className='mb-2 text-center text-2xl font-bold text-white'>Create an account</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Email <span className='text-red-400'>*</span>
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
              htmlFor='username'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Username <span className='text-red-400'>*</span>
            </label>
            <input
              id='username'
              type='text'
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
              placeholder='Choose a username'
              disabled={isSubmitting}
            />
            <p className='mt-1 text-xs text-discord-text-muted'>
              3–32 characters. Letters, numbers, underscores, and hyphens only.
            </p>
          </div>

          <div>
            <label
              htmlFor='displayName'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Display Name
            </label>
            <input
              id='displayName'
              type='text'
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
              placeholder='How others see you'
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
            >
              Password <span className='text-red-400'>*</span>
            </label>
            <input
              id='password'
              type='password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
              placeholder='Create a password'
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
            {isSubmitting ? 'Creating account...' : 'Continue'}
          </button>

          <p className='text-sm text-discord-text-muted'>
            Already have an account?{' '}
            <Link href='/auth/login' className='text-discord-accent hover:underline'>
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
