import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(6, 'The password must consist of at least six combinations of letters and numbers.')
});

export type FormSchema = typeof formSchema;
