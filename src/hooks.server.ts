import { createSupabaseServerClient } from '$lib/supabase';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

export const handle: Handle = async ({ event, resolve }) => {
	const getSession = async (): Promise<Session | null> => {
		const { data: getUserData, error: err } = await event.locals.supabase.auth.getUser();
		let {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (getUserData.user == null || err) {
			session = null;
		}
		return session;
	};

	event.locals.supabase = createSupabaseServerClient(event);
	event.locals.session = await getSession();
	const user = (await event.locals.supabase.auth.getUser()).data.user;
	if (user) {
		event.locals.user = { id: user.id, email: user.email, role: user.role, phone: user.phone };
	} else {
		event.locals.user = null;
	}
	const { url } = event;
	//define protectedRoute
	const protectedRoute =
		url.pathname.startsWith('/division') ||
		url.pathname.startsWith('/position') ||
		url.pathname.startsWith('/employee');
	//if client visit protectedRoute and user is null redirect to login
	if (protectedRoute && !user) {
		return redirect(302, '/login');
	}
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name == 'content-page'
	});
	return response;
};
