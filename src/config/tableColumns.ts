import type { Employee } from '../types/employee';

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  /** Dot-notation accessor or custom render key */
  accessor?: (row: T) => string | number | boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export const employeeTableColumns: TableColumn<Employee>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '70px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'salary',
    label: 'Salary',
    sortable: true,
    align: 'right',
    accessor: (row) => formatCurrency(row.salary),
  },
  { key: 'joinDate', label: 'Join Date', sortable: true },
  {
    key: 'isActive',
    label: 'Active',
    sortable: true,
    accessor: (row) => (row.isActive ? 'Yes' : 'No'),
  },
  {
    key: 'skills',
    label: 'Skills',
    accessor: (row) => row.skills.join(', '),
  },
  {
    key: 'address.city',
    label: 'City',
    sortable: true,
    accessor: (row) => row.address.city,
  },
  {
    key: 'address.state',
    label: 'State',
    sortable: true,
    accessor: (row) => row.address.state,
  },
  {
    key: 'address.country',
    label: 'Country',
    sortable: true,
    accessor: (row) => row.address.country,
  },
  { key: 'projects', label: 'Projects', sortable: true, align: 'right' },
  { key: 'lastReview', label: 'Last Review', sortable: true },
  {
    key: 'performanceRating',
    label: 'Rating',
    sortable: true,
    align: 'right',
  },
];
