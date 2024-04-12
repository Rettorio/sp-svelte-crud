import { z } from 'zod';

export const employeeSchema = z.object({
	name: z.string(),
	age: z
		.union([
			z.string(),
			z.number().min(20, 'Minimum employee age is 20').max(65, 'Hit maximum employee age')
		])
		.default(0),
	division_id: z
		.number({ required_error: "Please select employee's division." })
		.min(2, "Please select employee's division.")
		.default(0),
	position_id: z
		.number({ required_error: "Please select employee's position." })
		.min(1, "Please select employee's position.")
		.default(0),
	base_salary: z
		.union([
			z.string(),
			z.number().positive('Input correct number').max(99000, 'please input rational salary')
		])
		.default(0)
});
// export const employeeSchema = z.object({
// 	name: z.string(),
// 	age: z.string(),
// 	division_id: z.number(),
// 	position_id: z.number().positive('Input correct position.'),
// 	base_salary: z.string()
// });

export type EmployeeSchema = typeof employeeSchema;
