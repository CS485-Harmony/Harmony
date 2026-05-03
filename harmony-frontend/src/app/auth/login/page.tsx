'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserErrorMessage } from '@/lib/utils';
import { resetRequiredPassword } from '@/services/authService';

const PASSWORD_RESET_REQUIRED_MESSAGE = 'This account must reset its password before signing in.';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get('returnUrl') ?? '';

  function getSafeReturnUrl(): string {
    return rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
      ? rawReturnUrl.replace(/^\/c\//, '/channels/')
      : '/channels';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push(getSafeReturnUrl());
    } catch (err) {
      const message = getUserErrorMessage(err, 'Invalid credentials. Please try again.');
      if (message === PASSWORD_RESET_REQUIRED_MESSAGE) {
        setRequiresPasswordReset(true);
        setPassword('');
        setError(PASSWORD_RESET_REQUIRED_MESSAGE);
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetRequiredPassword(email, newPassword);
      await login(email, newPassword);
      router.push(getSafeReturnUrl());
    } catch (err) {
      setError(getUserErrorMessage(err, 'Password reset failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-discord-bg-primary'>
      <div className='w-full max-w-md rounded-lg bg-discord-bg-secondary p-8 shadow-lg'>
        <h1 className='mb-2 text-center text-2xl font-bold text-white'>
          {requiresPasswordReset ? 'Reset your password' : 'Welcome back!'}
        </h1>
        <p className='mb-6 text-center text-sm text-discord-text-muted'>
          {requiresPasswordReset
            ? 'Choose a new password to restore access to your account.'
            : "We're so excited to see you again!"}
        </p>

        <form
          onSubmit={requiresPasswordReset ? handleResetSubmit : handleSubmit}
          className='space-y-4'
        >
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

          {requiresPasswordReset ? (
            <>
              <div>
                <label
                  htmlFor='new-password'
                  className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
                >
                  New password
                </label>
                <input
                  id='new-password'
                  type='password'
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
                  placeholder='Enter a new password'
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor='confirm-new-password'
                  className='mb-2 block text-xs font-bold uppercase text-discord-text-muted'
                >
                  Confirm new password
                </label>
                <input
                  id='confirm-new-password'
                  type='password'
                  required
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  className='w-full rounded bg-discord-bg-tertiary p-2.5 text-white placeholder-discord-text-muted outline-none focus:ring-2 focus:ring-discord-accent'
                  placeholder='Confirm your new password'
                  disabled={isSubmitting}
                />
              </div>
            </>
          ) : (
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
          )}

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
            {isSubmitting
              ? requiresPasswordReset
                ? 'Resetting...'
                : 'Logging in...'
              : requiresPasswordReset
                ? 'Reset Password'
                : 'Log In'}
          </button>

          {requiresPasswordReset ? (
            <button
              type='button'
              className='text-sm text-discord-accent hover:underline'
              disabled={isSubmitting}
              onClick={() => {
                setRequiresPasswordReset(false);
                setNewPassword('');
                setConfirmNewPassword('');
                setError('');
              }}
            >
              Back to login
            </button>
          ) : (
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
          )}
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
