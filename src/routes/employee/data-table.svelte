<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addTableFilter, addSortBy } from 'svelte-headless-table/plugins';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ArrowUpDown } from 'lucide-svelte';

	export let data: Employee[];

	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) =>
				value.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			header: 'ID',
			accessor: (item) => item.id,
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const allowedHeader = ['name', 'division', 'salary'];
</script>

<div>
	<div class="flex items-center py-4">
		<Input class="max-w-sm" placeholder="Search employee" type="text" bind:value={$filterValue} />
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
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
						<Table.Row {...rowAttrs}>
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
