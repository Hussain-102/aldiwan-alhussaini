// +page.ts
import { error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public'; 


export async function load({ params }) {
  const slug = params.slug;
   const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
    global: { fetch }, // Pass fetch for SSR to work correctly
  });
  // 1. Get the poet by slug
  const { data: poet, error: poetError } = await supabase
    .from('poet')
    .select('*')
    .eq('slug', slug)
    .single();

  if (poetError || !poet) {
    throw error(404, 'Poet not found');
  }

  // 2. Get poems that belong to this poet
  const { data: poems, error: poemsError } = await supabase
    .from('poems')
    .select('id, title, slug, counts')
    .eq('poet_id', poet.id);

  if (poemsError) {
    throw error(500, 'Failed to fetch poems');
  }

  return {
    poet,
    poems
  };
}
