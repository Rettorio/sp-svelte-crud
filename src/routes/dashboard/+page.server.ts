import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../login/$types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const { data: employee, error } = await supabase.rpc('all_employee').select();

	if (error) {
		console.log(error);
		return fail(500);
	}

	return { employee };
};
