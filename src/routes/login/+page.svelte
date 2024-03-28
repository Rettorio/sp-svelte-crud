<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import LoginForm from './login-form.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<div class="mx-auto mt-14 max-w-xl">
	<Card.Root class="mx-auto w-[350px]">
		<Card.Header>
			<Card.Title>Sign In</Card.Title>
			<Card.Description>You need to sign in 🔐 to continue.</Card.Description>
		</Card.Header>
		<Card.Content>
			<LoginForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
