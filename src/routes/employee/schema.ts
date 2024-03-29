import { z } from 'zod';

export const employeeSchema = z.object({
	name: z.string(),
	age: z.number().positive('Input correct age.'),
	division: z.number().positive('Input correct division.'),
	position: z.number().positive('Input correct position.'),
	base_salary: z.number().positive('Input correct number')
});

export type EmployeeSchema = typeof employeeSchema;
