<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { dialogOpen, getDivision, getEMployee, getPosition } from '$lib/store';
	import type { TableViewModel } from 'svelte-headless-table';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import type { Writable } from 'svelte/store';
	import CreateEmpDialog from './create-emp-dialog.svelte';
	import DataTableFacetedFilter from './data-table-faceted-filter.svelte';
	import { Trash2, UserPlus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidate } from '$app/navigation';

	export let selectedDataIds, tableModel: TableViewModel<Employee>;
	const data = getEMployee();
	const divisions = getDivision();
	const positions = getPosition();

	const counts = $data.reduce<{
		division: { [index: string]: number };
	}>(
		(acc, { division }) => {
			acc.division[division] = (acc.division[division] || 0) + 1;
			return acc;
		},
		{
			division: {}
		}
	);

	const { pluginStates } = tableModel;
	const {
		filterValue
	}: {
		filterValue: Writable<string>;
	} = pluginStates.filter;

	const {
		filterValues
	}: {
		filterValues: Writable<{
			division: string[];
		}>;
	} = pluginStates.colFilter;

	let disableRedbtn: boolean;
	$: disableRedbtn = Object.keys($selectedDataIds).length == 0;
	const deleteSelected = async () => {
		const ids = Object.keys($selectedDataIds).map((order) => {
			return $data[parseInt(order)].id;
		});
		const response = fetch('/api/employee', {
			method: 'DELETE',
			body: JSON.stringify({ ids: ids })
		});
		toast.promise(response, {
			loading: 'Deleting employee...',
			success: () => {
				invalidate('employee:data');
				return 'Employee have been deleted.';
			},
			error: 'Failed to delete selected employe.'
		});
		$selectedDataIds = {};
	};

	const useDialog = dialogOpen();

	$: showReset = Object.values({ ...$filterValues, $filterValue }).some((v) => v.length > 0);
</script>

<div class="mb-3 flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			class="h-8 w-[150px] lg:w-[250px]"
			placeholder="Search employee"
			type="search"
			bind:value={$filterValue}
		/>

		<DataTableFacetedFilter
			bind:filterValues={$filterValues.division}
			title="Division"
			options={$divisions}
			counts={counts.division}
		/>
		{#if showReset}
			<Button
				on:click={() => {
					$filterValue = '';
					$filterValues.division = [];
				}}
				variant="ghost"
				class="h-8 px-2 lg:px-3"
			>
				Reset
				<Cross2 class="ml-2 h-4 w-4" />
			</Button>
		{/if}
	</div>
	<div class="flex items-center">
		<Button
			on:click={deleteSelected}
			size="sm"
			class="mr-2"
			disabled={disableRedbtn}
			variant="outline"><Trash2 size="16" class="mr-1" />Delete</Button
		>
		<Button on:click={() => ($useDialog = true)} size="sm" variant="default"
			><UserPlus size="16" class="mr-1" />Create</Button
		>
		<CreateEmpDialog divisions={$divisions} positions={$positions} />
	</div>
</div>
