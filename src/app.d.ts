// See https://kit.svelte.dev/docs/types#app

import type { Session, SupabaseClient } from '@supabase/supabase-js';

type User = {
	id: string;
	email: string | undefined;
	role: string | undefined;
	phone: string | undefined;
};

type Division = {
	id: string;
	name: string;
	salar_rate: number;
};

type Position = {
	id: string;
	name: string;
	salary: number;
};

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			session: Session | null;
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
