import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { employeeSchema } from '../../schema';

export const load: PageServerLoad = async ({ locals, params, request }) => {
	const { supabase } = locals;
	const empId = params.id;
	const referrerUrl = request.headers.get('Referer');

	const { data: employee, error: err } = await supabase
		.from('employee')
		.select()
		.eq('id', empId)
		.single();
	const { data: divisions, error: err2 } = await supabase.from('division').select('id,name');
	const { data: positions, error: err3 } = await supabase.from('position').select('id,name');

	const employeeSchema = z.object({
		name: z.string().default(employee.name),
		age: z.number().default(employee.age),
		division: z.number().positive('Input correct division.').default(employee.division_id),
		position: z.number().positive('Input correct position.').default(employee.position_id),
		base_salary: z.number().positive('Input correct number').default(employee.base_salary)
	});

	const form = await superValidate(zod(employeeSchema));

	if (err) {
		return fail(400, { err, form });
	}
	if (err2) {
		return fail(400, { err2, form });
	}
	if (err3) {
		return fail(400, { err3, form });
	}

	return { employee, divisions, positions, form, referrerUrl };
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(employeeSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { supabase } = event.locals;
		const empId = event.params.id;

		const qualifiedData = {
			name: form.data.name,
			age: form.data.age,
			division_id: form.data.division,
			position_id: form.data.position,
			base_salary: form.data.base_salary
		};
		const { error: err } = await supabase.from('employee').update(qualifiedData).eq('id', empId);
		if (err && err instanceof AuthApiError) {
			console.log('something wrong...', err);
			return fail(400, { form });
		}
		//update form data with the latest data
		form.data = {
			name: qualifiedData.name,
			age: qualifiedData.age,
			division: qualifiedData.division_id,
			position: qualifiedData.position_id,
			base_salary: qualifiedData.base_salary
		};
		console.log(form.data);
		return { success: true, form };
	}
};
