export async function load({ fetch, depends }) {
	depends('employee:data');
	const response = {
		employee: await fetch('/api/employee'),
		divisions: await fetch('/api/divisions'),
		positions: await fetch('/api/positions')
	};
	const employees: Employee[] = await response.employee.json();
	const divisions: Division[] = await response.divisions.json();
	const positions: Position[] = await response.positions.json();
	return { employees, divisions, positions };
}
