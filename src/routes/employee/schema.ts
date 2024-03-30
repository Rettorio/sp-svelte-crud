import { writable } from 'svelte/store';
import { z } from 'zod';

export const employeeSchema = z.object({
	name: z.string(),
	age: z.union([z.string(), z.number()]).default(0),
	division_id: z.number(),
	position_id: z.number().positive('Input correct position.'),
	base_salary: z.union([z.string(), z.number().positive('Input correct number')]).default(0)
});

export type EmployeeSchema = typeof employeeSchema;
