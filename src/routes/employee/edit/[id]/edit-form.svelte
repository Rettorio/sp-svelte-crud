<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { z } from 'zod';
	import * as Select from '$lib/components/ui/select';
	import { CircleDollarSign, Receipt, Wallet } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';

	export let employee, division, position, fromUrl;

	const employeeSchema = z.object({
		name: z.string().default(employee.name),
		age: z.number().positive('Input correct age.').default(employee.age),
		division: z.number().positive('Input correct division.').default(employee.division_id),
		position: z.number().positive('Input correct position.').default(employee.position_id),
		base_salary: z.number().positive('Input correct number').default(employee.base_salary)
	});

	type EmployeeSchema = typeof employeeSchema;

	export let data: SuperValidated<Infer<EmployeeSchema>> | any;

	const form = superForm(data, {
		validators: zodClient(employeeSchema)
	});

	const { form: formData, enhance } = form;

	const currentDivision = division.find((e) => e.id == employee.division_id);
	const currentPosition = position.find((e) => e.id == employee.position_id);
	$: selectedDivision = $formData.division
		? {
				label: currentDivision.name,
				value: currentDivision.id
			}
		: undefined;

	$: selectedPosition = $formData.position
		? {
				label: currentPosition.name,
				value: $formData.position
			}
		: undefined;

	const getPrevUrl = fromUrl && fromUrl !== $page.url ? fromUrl : '/employee';
</script>

<form method="POST" action="?/update" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="age">
		<Form.Control let:attrs>
			<Form.Label>Age</Form.Label>
			<Input
				type="number"
				{...attrs}
				on:input={(e) => ($formData.age = parseInt(e.target.value))}
				bind:value={$formData.age}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="base_salary">
		<Form.Control let:attrs>
			<Form.Label>Base salary</Form.Label>
			<div class="flex w-full items-center space-x-2">
				<Receipt class="h-6 w-6" />
				<Input
					type="number"
					{...attrs}
					on:input={(e) => ($formData.base_salary = parseInt(e.target.value))}
					bind:value={$formData.base_salary}
				/>
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="division">
		<Form.Control let:attrs>
			<Form.Label>Division</Form.Label>
			<Select.Root selected={selectedDivision}>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select a division" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each division as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input {...attrs} name="division" />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="position">
		<Form.Control let:attrs>
			<Form.Label>Position</Form.Label>
			<Select.Root preventScroll={true} selected={selectedPosition}>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select a position" />
				</Select.Trigger>
				<Select.Content class="overflow-y-auto" fitViewport={true} avoidCollisions={true}>
					<Select.Group>
						{#each position as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input {...attrs} name="position" />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-8 flex justify-end space-x-3">
		<Button variant="secondary" href={getPrevUrl}>Back</Button>
		<Form.Button type="submit">Save</Form.Button>
	</div>
</form>
