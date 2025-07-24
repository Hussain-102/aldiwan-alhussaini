import { supabase } from '$lib/supabaseClient';
import { error as svelteKitError } from '@sveltejs/kit';

export const load = async () => {
    console.log('Fetching poets on the server...');

    const { data: poets, error } = await supabase
        .from('poet')
        .select('id, poet_name, slug')
        .order('id');

    if (error) {
        console.error('Server error fetching poets:', error.message);
        throw svelteKitError(500, 'Could not fetch the list of poets.');
    }

    return { poets: poets ?? [] };
};