// src/routes/poets/+page.server.ts
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public'; // Import from dynamic/public

export const load = async ({ fetch }) => {
    const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
    });

    // Your existing logic
    const { data: poets, error } = await supabase
        .from('poets')
        .select('*');

    if (error) {
        console.error('Error fetching poets:', error);
        return { poets: [] };
    }

    return { poets };
};