import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const ssr = true;
export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;
	const page = url.searchParams.get('page');
	const totalRow = 25;
	// const fromrow = !page ? 1 : (parseInt(page) - 1) * totalRow + 1;
	// const torow = !page ? totalRow : parseInt(page) * totalRow;
	const fromrow = 1;
	const torow = 50;
	const { data: employee, error } = await supabase
		.rpc('employee_pagination', { fromrow, torow })
		.select();

	if (error) {
		console.log(error);
		return fail(500, { employee });
	}

	return { employee };
};
