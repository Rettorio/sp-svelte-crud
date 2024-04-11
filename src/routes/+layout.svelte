<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.pcss';
	import { invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	export let data: LayoutData;
	$: ({ supabase } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});
		return () => subscription.unsubscribe();
	});
</script>

<ModeWatcher track={false} defaultMode={'light'} />
<Toaster />
<slot />
