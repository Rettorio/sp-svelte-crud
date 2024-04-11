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

	const currentDivision = division.find((e) => e.id == $formData?.division_id);
	const currentPosition = position.find((e) => e.id == $formData?.position_id);
	$: selectedDivision = $formData.division_id
		? {
				label: currentDivision?.name,
				value: currentDivision?.id
			}
		: undefined;

	$: selectedPosition = $formData.position_id
		? {
				label: currentPosition?.name,
				value: currentPosition?.id
			}
		: undefined;

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
				<Input {...attrs} bind:value={$formData.base_salary} />
			</div>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={data} name="division">
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
	<Form.Field form={data} name="position">
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
