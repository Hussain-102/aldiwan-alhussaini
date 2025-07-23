import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public'; // Import dynamic env
import type { LayoutLoad } from './$types';

const isBrowser = typeof window !== 'undefined';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  // Use dynamic env variables
  const supabase = isBrowser
    ? createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
      })
    : createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
      });
  // احصل على الجلسة والمستخدم
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { session, supabase, user };
};