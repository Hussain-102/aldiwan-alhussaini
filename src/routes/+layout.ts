// src/routes/+layout.ts

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, depends }) => {
  // This tells SvelteKit to re-run this load function when auth state changes
  depends('supabase:auth');

  // For the root layout, creating a new client here is the recommended pattern.
  // It ensures Supabase uses SvelteKit's fetch, which is crucial for auth.
  const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
    global: { fetch },
  });

  // Get the session information
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // You can return the whole session object, which includes the user.
  return { supabase, session };
};