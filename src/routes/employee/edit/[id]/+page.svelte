<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { PageServerData } from './$types';
	import EditForm from './edit-form.svelte';

	export let data: PageServerData;

	const { employee, divisions, positions, referrerUrl, form } = data;

	console.log(form?.data);
</script>

<div class="mx-auto mt-14 max-w-xl">
	<Card.Root class="mx-auto w-[350px]">
		<Card.Header>
			<Card.Title>Employee Edit</Card.Title>
			<!-- <Card.Description>You need to sign in 🔐 to continue.</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<EditForm
				data={form}
				fromUrl={referrerUrl}
				division={divisions}
				position={positions}
				{employee}
			/>
		</Card.Content>
	</Card.Root>
</div>
