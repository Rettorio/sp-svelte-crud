<script lang="ts">
	import { superForm, type Infer, type SuperValidated, defaults } from 'sveltekit-superforms';
	import DataTable from './data-table.svelte';
	import { employeeSchema, type EmployeeSchema } from './schema';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import {
		dialogOpen,
		disableResetForm,
		setDivision,
		setEmployee,
		setForm,
		setPosition
	} from '$lib/store';
	import { toast } from 'svelte-sonner';
	import { useStorage } from '$lib/use-shared-store';

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
	setDivision(data.divisions);
	setPosition(data.positions);
	const useResetBtn = disableResetForm();
	const useAutoMode = useStorage('AutoMode', true);
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
				toast.error('Please fix the errors in the form.');
				console.log(form.data, 'form is not valid');
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
						if ($useDialog && $useAutoMode) $useDialog = false;
						return 'New employee have been created.';
					},
					error: 'Failed to create new employee.'
				});
				$useResetBtn = false;
				console.log('succeed create emp');
				return;
			} catch (e) {
				toast.warning('Something went wrong', { description: 'Failed to add new employee.' });
			}
		}
	});
	setForm(form);
</script>

<div class="mx-auto max-w-3xl py-10">
	<DataTable />
</div>
