import { fail } from 'sveltekit-superforms';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { employee } = data;
	if (employee && 'position_name' in employee[0]) {
		return { employee };
	}
	const supabase = (await parent()).supabase;
	const fromrow = 1;
	const torow = 50;
	const { data: emp, error } = await supabase
		.rpc('employee_pagination', { fromrow, torow })
		.select();

	if (error) {
		console.log(error);
		return fail(500, { error });
	}

	data.employee = emp;
	return data;
};
