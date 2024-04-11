<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import CreateForm from './create-form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { dialogOpen } from './store';

	const useDialogOpen = dialogOpen();
	// export let form: SuperForm<any, any>;
	export let divisions: any[], positions: any[];
	let submit = false;
</script>

<AlertDialog.Root bind:open={$useDialogOpen}>
	<AlertDialog.Trigger />
	<AlertDialog.Content class="sm:rounded-xl">
		<AlertDialog.Header>
			<AlertDialog.Title class="text-center">Create Employee</AlertDialog.Title>
		</AlertDialog.Header>
		<CreateForm {divisions} {positions} bind:submitForm={submit} />
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button
				on:click={() => {
					submit = true;
				}}>Save</Button
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
