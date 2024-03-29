import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../login/$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;
	const page = url.searchParams.get('page');
	const fromrow = !page ? 1 : (parseInt(page) - 1) * 50 + 1;
	const torow = !page ? 50 : parseInt(page) * 50;
	const { data: employee, error } = await supabase
		.rpc('employee_pagination', { fromrow, torow })
		.select();

	if (error) {
		console.log(error);
		return fail(500, { employee });
	}

	return { employee };
};
