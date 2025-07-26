import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pageSize = 200;

export async function load({ url }) {
  // Get page number from query params, default to 1
  const currentPage = Number(url.searchParams.get('page')) || 1;

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    // Fetch poems with range for pagination
    const { data: poems, error, count } = await supabase
      .from('poems')
      .select('id, title, slug, contents, counts, poet:poet_id (slug, poet_name)', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.error('Error loading poems:', error);
      return { poems: [], currentPage, totalPages: 0 };
    }

    // Calculate total pages based on total rows count
    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    return {
      poems: poems || [],
      currentPage,
      totalPages
    };
  } catch (e) {
    console.error('Exception loading poems:', e);
    return { poems: [], currentPage: 1, totalPages: 0 };
  }
}


