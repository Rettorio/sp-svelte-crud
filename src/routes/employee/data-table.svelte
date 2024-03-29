<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';

	export let data;

	type employee = {
		id: number;
		name: string;
		age: number;
		division: string;
		position_name: string;
		salary: number;
	};

	const table = createTable(readable(data));
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Employee_Name'
		}),
		table.column({
			accessor: 'age',
			header: 'Age'
		}),
		table.column({
			accessor: 'division',
			header: 'Division'
		}),
		table.column({
			accessor: 'position_name',
			header: 'Position'
		}),
		table.column({
			accessor: 'salary',
			header: 'Salary/Year',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('en-Us', {
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}).format(value);
				return formatted;
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
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
										<div class="font-medium">
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
