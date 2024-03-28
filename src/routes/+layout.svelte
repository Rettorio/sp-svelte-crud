<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.pcss';
	import { invalidate, invalidateAll } from '$app/navigation';

	export let data: LayoutData;
	$: ({ supabase } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
			invalidateAll();
		});
		return () => subscription.unsubscribe();
	});
</script>

<slot />
