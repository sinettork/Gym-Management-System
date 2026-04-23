import { useState } from 'react';
import { Dumbbell, Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('manager@titangym.local');
  const [password, setPassword] = useState('manager');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    onLogin({
      name: 'Manager',
      email,
    });
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background px-6 py-8">
      <div className="absolute right-[-120px] top-[-120px] h-96 w-96 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="absolute bottom-[-140px] left-[-120px] h-96 w-96 rounded-full bg-surface-container-high blur-3xl" />

      <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <div className="glass-card max-w-xl rounded-[2.25rem] p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Zap className="h-9 w-9" strokeWidth={2.5} />
            </div>
            <h1 className="mt-8 font-headline text-[48px] font-bold leading-tight tracking-[-0.04em] text-on-surface">
              Titan Gym
              <span className="block text-primary">Manager OS</span>
            </h1>
            <p className="mt-5 max-w-md text-lg font-medium leading-8 text-on-surface-variant">
              Control members, staff, classes, equipment, and financials from one focused workspace.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {['Members', 'Revenue', 'Classes'].map((item) => (
                <div key={item} className="rounded-3xl bg-surface p-4">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-bold text-on-surface">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card mx-auto w-full max-w-md rounded-[2.25rem] p-8 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container lg:hidden">
            <Zap className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <div className="mt-6 text-center lg:mt-0 lg:text-left">
            <p className="font-label text-label-sm font-bold uppercase text-on-surface-variant">Secure access</p>
            <h2 className="mt-2 font-headline text-[32px] font-bold leading-tight text-on-surface">Welcome back</h2>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <label>
              <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Email</span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="pl-12"
                  placeholder="manager@titangym.local"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Password</span>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className="pl-12 pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-on-surface"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-error-container px-4 py-3 text-sm font-bold text-error">
              {error}
            </div>
          )}

          <Button type="submit" className="mt-8 h-13 w-full">
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
