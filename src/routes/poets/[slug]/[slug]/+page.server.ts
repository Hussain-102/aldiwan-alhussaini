import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

export async function load({ params, fetch }) { 
    const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        }); 

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
