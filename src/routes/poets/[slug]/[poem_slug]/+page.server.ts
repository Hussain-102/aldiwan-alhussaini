import { supabase } from '$lib/supabaseClient'; 
import { error as svelteKitError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'



export async function load({ params, fetch }) { 


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
  `)    .eq('slug', params.poem_slug)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return { poem: null };
  }

  return { poem: data };
};
