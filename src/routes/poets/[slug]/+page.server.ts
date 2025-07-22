// +page.ts
import { error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function load({ params }) {
  const slug = params.slug;

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
