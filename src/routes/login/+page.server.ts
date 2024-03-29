import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { supabase } = event.locals;
		const { data, error: err } = await supabase.auth.signInWithPassword(form.data);
		if (err && err instanceof AuthApiError) {
			console.log('Invalid credentials');

			return fail(400, { form });
		}

		console.log(form.data, 'Sign in successful');
		if (data) {
			return redirect(302, '/employee');
		}
		return {
			form
		};
	}
};
