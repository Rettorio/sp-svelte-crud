<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Receipt } from 'lucide-svelte';
	import { intProxy, stringProxy } from 'sveltekit-superforms';
	import { disableResetForm, getForm } from '$lib/store';

	export let divisions: Division[], positions: Position[];

	const createForm = getForm();
	const disableResetbtn = disableResetForm();
	const { form: formData, enhance } = $createForm;
	const divLookup = (id: number | string) => {
		const result = divisions.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	const postLookup = (id: number | string) => {
		const result = positions.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	$: selectedDivision = $formData.division_id
		? divLookup($formData.division_id)
		: { label: 'Select a division', value: '0' };

	$: selectedPosition = $formData.position_id
		? postLookup($formData.position_id)
		: { label: 'Select a position', value: '0' };

	$: {
		console.log(`disable prop is ${$disableResetbtn} in btn`);
	}

	const formName = stringProxy(formData, 'name', { empty: 'undefined' });
	const formAge = intProxy(formData, 'age', { empty: 'zero' });
	const formSalary = intProxy(formData, 'base_salary', { empty: 'zero' });

	const resetForm = () => {
		$formData = { name: '', age: 20, base_salary: 10000, division_id: 0, position_id: 0 };
		$formName = '';
		$formAge = 20;
		$formSalary = 10000;
		$disableResetbtn = true;
		console.log('reset form', $formData, $formName, $formAge, $formSalary);
	};
</script>

<form name="createEmp" method="POST" use:enhance>
	<Form.Field form={$createForm} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
			<!-- <Input {...attrs} bind:value={$formName} /> -->
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="age">
		<Form.Control let:attrs>
			<Form.Label>Age</Form.Label>
			<Input type="number" {...attrs} bind:value={$formData.age} />
			<!-- <Input type="number" {...attrs} bind:value={$formAge} /> -->
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="base_salary">
		<Form.Control let:attrs>
			<Form.Label>Base salary</Form.Label>
			<div class="flex w-full items-center space-x-2">
				<Receipt class="h-6 w-6" />
				<Input type="number" {...attrs} bind:value={$formData.base_salary} />
				<!-- <Input type="number" {...attrs} bind:value={$formSalary} /> -->
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="division_id">
		<Form.Control let:attrs>
			<Form.Label>Division</Form.Label>
			<Select.Root
				selected={selectedDivision}
				onSelectedChange={(v) => v && ($formData.division_id = v?.value)}
			>
				<Select.Input name={attrs.name} />
				<Select.Trigger {...attrs} class="w-full">
					<Select.Value placeholder="Select a division" />
				</Select.Trigger>
				<Select.Content>
					{#each divisions as div}
						<Select.Item value={div.id} label={div.name} />
					{/each}
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="position_id">
		<Form.Control let:attrs>
			<Form.Label>Position</Form.Label>
			<Select.Root
				selected={selectedPosition}
				preventScroll={true}
				onSelectedChange={(v) => v && ($formData.position_id = v?.value)}
			>
				<Select.Input name={attrs.name} />
				<Select.Trigger {...attrs} class="w-full">
					<Select.Value placeholder="Select a position" />
				</Select.Trigger>
				<Select.Content class="overflow-y-auto" fitViewport={true} avoidCollisions={true}>
					<Select.Group>
						{#each positions as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<!-- <Select.Input required {...attrs} name="position" /> -->
			</Select.Root>
			<!-- <input hidden bind:value={$formData.position_id_id} name={attrs.name} id={attrs.id} /> -->
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-4 flex w-full justify-end">
		<Button id="subBtn" class="hidden" variant="ghost" type="submit"></Button>
		<Button size="sm" disabled={$disableResetbtn} variant="ghost" on:click={resetForm}
			>reset form</Button
		>
	</div>
</form>
