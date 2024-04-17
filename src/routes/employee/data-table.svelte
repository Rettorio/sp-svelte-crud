<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import {
		addPagination,
		addTableFilter,
		addSortBy,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ArrowUpDown } from 'lucide-svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { Trash2, UserPlus } from 'lucide-svelte';
	import CreateEmpDialog from './create-emp-dialog.svelte';
	import { dialogOpen, getEMployee } from '$lib/store';
	import { toast } from 'svelte-sonner';
	import { invalidate } from '$app/navigation';

	export let divisions: Division[], positions: Position[];

	const getEmployees = getEMployee();
	const table = createTable(getEmployees, {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) =>
				value.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
		}),
		select: addSelectedRows()
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Employee_Name'
		}),
		table.column({
			accessor: 'age',
			header: 'Age',
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Division',
			accessor: 'division',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			header: 'Position',
			accessor: 'position_name',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'salary',
			header: 'Salary/Year',
			plugins: {
				filter: {
					exclude: true
				}
			},
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('en-Us', {
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}).format(parseInt(value));
				return formatted;
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value.toString() });
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
	const allowedHeader = ['name', 'division', 'salary'];

	// $: {
	// 	const arr = Object.keys($selectedDataIds).map((order) => {
	// 		return $getEmployees[parseInt(order)].id;
	// 	});
	// 	console.log(arr);
	// }

	let disableRedbtn: boolean;
	$: disableRedbtn = Object.keys($selectedDataIds).length == 0;
	const deleteSelected = async () => {
		const ids = Object.keys($selectedDataIds).map((order) => {
			return $getEmployees[parseInt(order)].id;
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
		// getEmployees.update((val) => val.filter((obj) => !ids.includes(obj.id)));
		$selectedDataIds = {};
	};

	const useDialog = dialogOpen();
</script>

<div>
	<div class="flex items-center justify-between py-4">
		<Input class="max-w-sm" placeholder="Search employee" type="text" bind:value={$filterValue} />
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
			<CreateEmpDialog {divisions} {positions} />
		</div>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if allowedHeader.findIndex((v) => v == cell.id) >= 0}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'salary'}
											<div class="text-center font-medium">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
