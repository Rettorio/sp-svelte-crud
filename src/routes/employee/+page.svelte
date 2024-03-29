<script lang="ts">
	import type { PageData } from '../$types';
	import DataTable from './data-table.svelte';

	export let data: PageData;
</script>

<div class="mx-auto max-w-2xl py-10">
	<DataTable data={data.employee} />
</div>
