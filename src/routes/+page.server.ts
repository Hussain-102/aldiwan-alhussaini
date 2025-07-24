import { supabase } from '$lib/supabaseClient';
import { error as svelteKitError } from '@sveltejs/kit';

const pageSize = 20;

export async function load({ url }) {
	const currentPage = Number(url.searchParams.get('page')) || 1;

	const from = (currentPage - 1) * pageSize;
	const to = from + pageSize - 1;

	const { data: poems, error, count } = await supabase
		.from('poems')
		.select('id, title, slug, contents, counts, poet:poet_id (slug, poet_name)', { count: 'exact' })
		.order('id')
		.range(from, to);

	if (error) {
		console.error('Server error fetching poems:', error.message);
		throw svelteKitError(500, 'Could not load poems.');
	}

	const totalPages = count ? Math.ceil(count / pageSize) : 1;

	return {
		poems: poems ?? [],
		currentPage,
		totalPages
	};
}