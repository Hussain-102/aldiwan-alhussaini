import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function load() {
  console.log('PUBLIC_SUPABASE_URL:', PUBLIC_SUPABASE_URL);
  console.log('PUBLIC_SUPABASE_ANON_KEY:', PUBLIC_SUPABASE_ANON_KEY);
  return {
    url: PUBLIC_SUPABASE_URL,
    key: PUBLIC_SUPABASE_ANON_KEY
  };
}
