<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import EditForm from './edit-form.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { employeeSchema, type EmployeeSchema } from '../../schema';
	import * as Alert from '$lib/components/ui/alert';
	import { FileCheck } from 'lucide-svelte';

	export let data;
	const formD: SuperValidated<Infer<EmployeeSchema>> | any = data.form;
	const { referrerUrl } = data;

	const form = superForm(formD, {
		validators: zodClient(employeeSchema),
		resetForm: false
	});
	const { message } = form;
	const division = data.divisions!;
	const position = data.positions!;
</script>

<div class="mx-auto mt-14 max-w-xl">
	{#if $message}
		<div class="mx-auto mb-4 w-[400px]">
			<Alert.Root>
				<FileCheck class="h-4 w-4" />
				<Alert.Title>Completed!</Alert.Title>
				<Alert.Description>{$message}</Alert.Description>
			</Alert.Root>
		</div>
	{/if}
	<Card.Root class="mx-auto w-[350px]">
		<Card.Header>
			<Card.Title>Employee Edit</Card.Title>
		</Card.Header>
		<Card.Content>
			<EditForm data={form} fromUrl={referrerUrl} {division} {position} />
		</Card.Content>
	</Card.Root>
</div>
