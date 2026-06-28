'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { LoadingState } from '@/components/ui/content-states';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setAuthenticated(false);
        setChecking(false);
        router.replace('/admin/login');
        return;
      }

      setAuthenticated(true);
      setChecking(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session) {
          setAuthenticated(false);
          setChecking(false);
          router.replace('/admin/login');
        } else {
          setAuthenticated(true);
          setChecking(false);
        }
      }
    );

    return () => {
      mounted = false;

      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  if (checking) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!authenticated) return null;

  return <>{children}</>;
}