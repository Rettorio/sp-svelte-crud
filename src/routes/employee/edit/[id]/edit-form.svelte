<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Receipt } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';

	export let division: Division[], position: Position[], fromUrl;

	export let data: any;
	const { form: formData, enhance } = data;

	const divLookup = (id: number | string) => {
		const result = division.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	const postLookup = (id: number | string) => {
		const result = position.find((e) => e.id == id.toString());
		return { label: result?.name, value: result?.id };
	};
	$: selectedDivision = $formData.division_id
		? divLookup($formData.division_id)
		: { label: 'Select a division', value: '0' };

	$: selectedPosition = $formData.position_id
		? postLookup($formData.position_id)
		: { label: 'Select a position', value: '0' };

	const currentUrl = $page.url.origin + $page.url.pathname;
	const getPrevUrl = fromUrl && fromUrl !== currentUrl ? fromUrl : '/employee';
</script>

<form method="POST" action="?/update" use:enhance>
	<Form.Field form={data} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={data} name="age">
		<Form.Control let:attrs>
			<Form.Label>Age</Form.Label>
			<Input type="number" {...attrs} bind:value={$formData.age} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={data} name="base_salary">
		<Form.Control let:attrs>
			<Form.Label>Base salary</Form.Label>
			<div class="flex w-full items-center space-x-2">
				<Receipt class="h-6 w-6" />
				<Input {...attrs} type="number" bind:value={$formData.base_salary} />
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={data} name="division_id">
		<Form.Control let:attrs>
			<Form.Label>Division</Form.Label>
			<Select.Root
				preventScroll={true}
				selected={selectedDivision}
				onSelectedChange={(v) => v && ($formData.position_id = v?.value)}
			>
				<Select.Input name={attrs.name} />
				<Select.Trigger {...attrs} class="w-full">
					<Select.Value placeholder="Select a division" />
				</Select.Trigger>
				<Select.Content>
					{#each division as div}
						<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={data} name="position_id">
		<Form.Control let:attrs>
			<Form.Label>Position</Form.Label>
			<Select.Root
				preventScroll={true}
				selected={selectedPosition}
				onSelectedChange={(v) => v && ($formData.position_id = v?.value)}
			>
				<Select.Input name={attrs.name} />
				<Select.Trigger {...attrs} class="w-full">
					<Select.Value placeholder="Select a position" />
				</Select.Trigger>
				<Select.Content class="overflow-y-auto" fitViewport={true} avoidCollisions={true}>
					<Select.Group>
						{#each position as div}
							<Select.Item value={div.id} label={div.name}>{div.name}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-8 flex justify-end space-x-3">
		<Button variant="secondary" href={getPrevUrl}>Back</Button>
		<Form.Button type="submit">Save</Form.Button>
	</div>
</form>
