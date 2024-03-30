import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { employeeSchema, type EmployeeSchema } from '../../schema';
import type { z } from 'zod';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params, request }) => {
	const { supabase } = locals;
	const empId = params.id;
	const referrerUrl = request.headers.get('Referer');

	const { data: employee, error: err } = await supabase
		.from('employee')
		.select()
		.eq('id', empId)
		.single();

	const empEntity: z.infer<EmployeeSchema> = employee;
	const form = await superValidate(empEntity, zod(employeeSchema));
	if (err && err instanceof AuthApiError) {
		return fail(400, { form });
	}
	// const divisions = async () => {
	// 	return await supabase.from('division').select('id,name');
	// };
	// const positions = async () => {
	// 	return await supabase.from('position').select('id,name');
	// };
	const { data: divisions, error: errDiv } = await supabase.from('division').select();
	const { data: positions, error: errPos } = await supabase.from('position').select();

	if ((errDiv && errDiv instanceof AuthApiError) || (errPos && errPos instanceof AuthApiError)) {
		throw error(500, { message: 'Something went wrong' });
	}

	return {
		divisions,
		positions,
		form,
		referrerUrl
	};
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(employeeSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { supabase } = event.locals;
		const empId = event.params.id;
		const { error: err } = await supabase.from('employee').update(form.data).eq('id', empId);
		console.log('form updated', form.data);
		if (err && err instanceof AuthApiError) {
			console.log('something wrong...', err);
			return fail(400, { form });
		}
		return message(form, 'Employee data has been updated.');
	}
};
