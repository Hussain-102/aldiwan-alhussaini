import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public'; // Use dynamic public env for server-side

const pageSize = 200;

export async function load({ url }) {
  const currentPage = Number(url.searchParams.get('page')) || 1;

  // Use the PUBLIC dynamic variables for the server-side client
  const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { data: poems, error, count } = await supabase
      .from('poems')
      .select('id, title, slug, contents, counts, poet:poet_id (slug, poet_name)', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.error('Error loading poems in +page.server.ts:', error);
      return { poems: [], currentPage, totalPages: 0 };
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    return {
      poems: poems || [],
      currentPage,
      totalPages
    };
  } catch (e) {
    console.error('Exception loading poems in +page.server.ts:', e);
    return { poems: [], currentPage: 1, totalPages: 0 };
  }
}