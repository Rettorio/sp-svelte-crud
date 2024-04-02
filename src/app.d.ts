// See https://kit.svelte.dev/docs/types#app

import type { Session, SupabaseClient } from '@supabase/supabase-js';

type User = {
	id: string;
	email: string | undefined;
	role: string | undefined;
	phone: string | undefined;
};

// for information about these interfaces
declare global {
	interface EmployeeForm {
		id: string;
		name: string;
		age: number;
		position_id: number;
		division_id: number;
		base_salary: number;
	}

	interface Employee {
		id: number;
		name: string;
		age: number;
		division: string;
		position_name: string;
		salary: string;
	}
	type Division = {
		id: string;
		name: string;
		salary_rate: number | null;
	};

	type Position = {
		id: string;
		name: string;
		salary: number | null;
	};
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			session: Session | null;
			user: User | null;
		}

		// interface PageData {
		// }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
