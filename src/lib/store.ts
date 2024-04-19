import { useWritable } from '$lib/use-shared-store';
import { getContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const setForm = <T>(form: T) => useWritable('createForm', form);
export const getForm = () => getContext<Writable<any>>('createForm');

export const dataUpdate = () => useWritable('empDataUpdate', false);
export const dialogOpen = () => useWritable('dialogOpen', false);
// export const closeDialogAfterSubmit = () => useWritable('closeDialogAfterSubmit', true);

export const setEmployee = (data: Employee[]) => useWritable('employee_data', data);
export const getEMployee = () => getContext<Writable<Employee[]>>('employee_data');

export const setDivision = (data: Division[]) => useWritable('division_data', data);
export const getDivision = () => getContext<Writable<Division[]>>('division_data');

export const setPosition = (data: Position[]) => useWritable('Position_data', data);
export const getPosition = () => getContext<Writable<Position[]>>('Position_data');

export const disableResetForm = () => useWritable('resetFormdisable', true);
