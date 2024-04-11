<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Receipt } from 'lucide-svelte';
	import { intProxy, stringProxy } from 'sveltekit-superforms';
	import { getForm } from './store';

	export let divisions: Division[], positions: Position[], submitForm: boolean;

	// export let data: SuperForm<any, any>;
	const createForm = getForm();
	// const empUpdate = dataUpdate();
	// const useDialogOpen = dialogOpen();
	const { form: formData, enhance, message } = $createForm;
	const divLookup = (id: number | string) => {
		const result = divisions.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	const postLookup = (id: number | string) => {
		const result = positions.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	$: selectedDivision = $formData.division_id ? divLookup($formData.division_id) : undefined;

	$: selectedPosition = $formData.position_id ? postLookup($formData.position_id) : undefined;

	$: if (submitForm) {
		const myForm: HTMLFormElement = Array.from(document.forms)[0];
		const btn = document.getElementById('subBtn');
		myForm.requestSubmit(btn);
		submitForm = false;
	}
	const formName = stringProxy(formData, 'name', { empty: 'undefined' });
	const formAge = intProxy(formData, 'age', { empty: 'zero' });
	const formSalary = intProxy(formData, 'base_salary', { empty: 'zero' });
</script>

<form name="createEmp" method="POST" use:enhance>
	<Form.Field form={$createForm} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formName} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="age">
		<Form.Control let:attrs>
			<Form.Label>Age</Form.Label>
			<Input type="number" {...attrs} bind:value={$formAge} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="base_salary">
		<Form.Control let:attrs>
			<Form.Label>Base salary</Form.Label>
			<div class="flex w-full items-center space-x-2">
				<Receipt class="h-6 w-6" />
				<Input type="number" {...attrs} bind:value={$formSalary} />
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="division">
		<Form.Control let:attrs>
			<Form.Label>Division</Form.Label>
			<Select.Root
				selected={selectedDivision}
				onSelectedChange={(v) => ($formData.division_id = v?.value)}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select a division" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each divisions as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input {...attrs} name="division" />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="position">
		<Form.Control let:attrs>
			<Form.Label>Position</Form.Label>
			<Select.Root
				selected={selectedPosition}
				preventScroll={true}
				onSelectedChange={(v) => ($formData.position_id = v?.value)}
			>
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select a position" />
				</Select.Trigger>
				<Select.Content class="overflow-y-auto" fitViewport={true} avoidCollisions={true}>
					<Select.Group>
						{#each positions as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input {...attrs} name="position" />
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Button id="subBtn" variant="ghost" type="submit"></Button>
</form>
