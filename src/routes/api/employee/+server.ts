import { AuthApiError } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals, setHeaders }) => {
	const supabase = locals.supabase;
	const page = url.searchParams.get('page');
	const totalRow = 25;
	// const fromrow = !page ? 1 : (parseInt(page) - 1) * totalRow + 1;
	// const torow = !page ? totalRow : parseInt(page) * totalRow;
	// const fromrow = 230;
	// const torow = 400;
	const fromrow = 300;
	const torow = 400;
	const { data: employee, error: err } = await supabase
		.rpc('employee_pagination', { fromrow, torow })
		.select()
		.order('id', { ascending: false });

	if (err) {
		console.log(err);
		error(500, err.details);
	}

	// setHeaders({
	// 	'Cache-Control': 'max-age: 3600'
	// });

	return json(employee);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { supabase } = locals;
	const data = await request.json();
	const { error: err } = await supabase.from('employee').insert(data);
	if (err && err instanceof AuthApiError) {
		error(500, 'Something went wrong');
	}

	return json({ message: 'Employee created Succesfuly' }, { status: 201 });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { supabase } = locals;
	const data = await request.json();
	await supabase.rpc('delete_emp_arr', { arr: data.ids });
	return json({ message: 'success delete employees' }, { status: 202 });
};
