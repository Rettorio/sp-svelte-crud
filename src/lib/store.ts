import { useWritable } from '$lib/use-shared-store';
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const setForm = <T>(form: T) => useWritable('createForm', form);
export const getForm = () => getContext<Writable<any>>('createForm');

export const dataUpdate = () => useWritable('empDataUpdate', false);
export const dialogOpen = () => useWritable('dialogOpen', false);

export const setEmployee = (data: Employee[]) => useWritable('employee_data', data);
export const getEMployee = () => getContext<Writable<Employee[]>>('employee_data');

export const disableResetForm = () => useWritable('resetFormdisable', true);
