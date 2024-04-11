import { AuthApiError } from '@supabase/supabase-js';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, setHeaders }) => {
	const supabase = locals.supabase;
	const { data: divisions, error: err } = await supabase.from('division').select();

	if (err && err instanceof AuthApiError) {
		error(404, { message: err.details });
	}

	setHeaders({
		'Cache-Control': 'max-age=3600'
	});

	return json(divisions);
};
