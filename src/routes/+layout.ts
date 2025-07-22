import { createClient } from '@supabase/supabase-js';


import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';


const isBrowser = typeof window !== 'undefined';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth');

  // تهيئة عميل supabase حسب جهة التنفيذ (Client أو Server)
  const supabase = isBrowser
    ? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
      })
    : createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        // لا تضف خاصية cookies هنا إلا لو تعرف بالضبط كيف تتعامل معها بالسيرفر
      });

  // احصل على الجلسة والمستخدم
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { session, supabase, user };
};

