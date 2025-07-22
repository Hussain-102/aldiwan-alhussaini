import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const { data, error } = await supabase
    .from('poems')
      .select(`
        id,
        title,
        contents,
        counts,
        slug,
           poet:poet_id (
      poet_name,
      slug
    )
  `)    .eq('slug', params.slug)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return { poem: null };
  }

  return { poem: data };
};
