<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Receipt } from 'lucide-svelte';
	import { disableResetForm, getForm } from '$lib/store';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { browser } from '$app/environment';
	import { useStorage } from '$lib/use-shared-store';

	export let divisions: Division[], positions: Position[];

	const createForm = getForm();
	const disableResetbtn = disableResetForm();
	const useAutoMode = useStorage('AutoMode', true);
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

	const resetForm = () => {
		$formData = { name: '', age: 20, base_salary: 10000, division_id: 0, position_id: 0 };
		$disableResetbtn = true;
		console.log('reset form', $formData);
	};
</script>

<form name="createEmp" method="POST" use:enhance>
	<Form.Field form={$createForm} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="age">
		<Form.Control let:attrs>
			<Form.Label>Age</Form.Label>
			<Input type="number" {...attrs} bind:value={$formData.age} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={$createForm} name="base_salary">
		<Form.Control let:attrs>
			<Form.Label>Base salary</Form.Label>
			<div class="flex w-full items-center space-x-2">
				<Receipt class="h-6 w-6" />
				<Input type="number" {...attrs} bind:value={$formData.base_salary} />
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
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-4 flex w-full justify-between">
		<div class="flex items-center space-x-2">
			<Switch bind:checked={$useAutoMode} id="autoMode" />
			<Label for="autoMode">AutoClose form</Label>
		</div>
		<Button id="subBtn" class="hidden" variant="ghost" type="submit"></Button>
		<Button size="sm" disabled={$disableResetbtn} variant="ghost" on:click={resetForm}
			>reset form</Button
		>
	</div>
</form>
