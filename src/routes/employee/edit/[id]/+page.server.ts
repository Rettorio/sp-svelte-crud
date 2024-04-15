import { AuthApiError } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { employeeSchema, type EmployeeSchema } from '../../schema';
import type { z } from 'zod';

export const load: PageServerLoad = async ({ locals, params, request, fetch }) => {
	const { supabase } = locals;
	const empId = params.id;
	const referrerUrl = request.headers.get('Referer');

	const { data: employee, error: err } = await supabase
		.from('employee')
		.select('*')
		.eq('id', empId)
		.single();

	const empEntity: z.infer<EmployeeSchema> = employee;
	const form = await superValidate(empEntity, zod(employeeSchema));
	if (err && err instanceof AuthApiError) {
		return fail(400, { form });
	}

	const divisions: Division[] = await (await fetch('/api/divisions')).json();
	const positions: Position[] = await (await fetch('/api/positions')).json();

	return {
		form,
		referrerUrl,
		divisions,
		positions
	};
};

export const actions: Actions = {
	update: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(employeeSchema));
		console.log(form.valid, formData);
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
