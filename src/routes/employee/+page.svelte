<script lang="ts">
	import { superForm, type Infer, type SuperValidated, defaults } from 'sveltekit-superforms';
	import DataTable from './data-table.svelte';
	import { employeeSchema, type EmployeeSchema } from './schema';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { dialogOpen, getEMployee, setEmployee, setForm } from './store';
	import { invalidate } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	export let data;

	const formD: SuperValidated<
		Infer<EmployeeSchema>,
		{
			status: number;
			text: string;
		}
	> = defaults(zod(employeeSchema));
	//@ts-ignore
	const { divisions, positions } = data;
	const UseEmployee = setEmployee(data.employees);
	const useDialog = dialogOpen();
	$: if (data.employees.length !== $UseEmployee.length) {
		$UseEmployee = data.employees;
		console.log('employee data have been updated');
	}

	const form = superForm(formD, {
		SPA: true,
		resetForm: false,
		validators: zodClient(employeeSchema),
		async onUpdate({ form }) {
			console.log('onUpdate event fired');
			if (!form.valid) {
				console.log(form.data);
				return;
			}
			try {
				const response = fetch('/api/employee', {
					method: 'POST',
					body: JSON.stringify(form.data)
				});
				toast.promise(response, {
					loading: 'Creating employe...',
					success: () => {
						if ($useDialog) $useDialog = false;
						return "Employee's created.";
					},
					error: 'Failed to creating employee.'
				});
				console.log('succeed create emp');
				invalidate('employee:data');
				return;
			} catch (e) {
				toast.warning('Something went wrong', { description: 'Failed to add new employee.' });
			}
		}
	});
	setForm(form);
</script>

<div class="mx-auto max-w-3xl py-10">
	<!-- {#each data.employees as employee}
		<tr>
			<td>{employee.name}</td>
			<td>{employee.age}</td>
			<td>{employee.position_name}</td>
		</tr>
	{/each} -->
	<!-- <Button size="sm" on:click={refresh}>Refresh</Button> -->
	<DataTable {divisions} {positions} />
</div>
