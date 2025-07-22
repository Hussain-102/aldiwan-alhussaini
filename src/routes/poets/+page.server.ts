import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { PageServerLoad } from './[slug]/$types';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const load: PageServerLoad = async () => {
  const { data: poets, error } = await supabase
    .from('poet')
    .select('id, poet_name, slug');

  if (error) {
    console.error('خطأ في تحميل الشعراء:', error.message);
    throw new Error('تعذّر تحميل قائمة الشعراء');
  }

  return { poets };
};