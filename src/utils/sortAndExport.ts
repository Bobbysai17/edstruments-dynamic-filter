import type { Employee } from '../types/employee';
import { getNestedValue } from './nestedValue';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
}

export function sortEmployees(
  employees: Employee[],
  sort: SortState | null,
): Employee[] {
  if (!sort) return employees;

  const sorted = [...employees];
  sorted.sort((a, b) => {
    const aValue = getNestedValue(a, sort.key);
    const bValue = getNestedValue(b, sort.key);
    const result = compareValues(aValue, bValue);
    return sort.direction === 'asc' ? result : -result;
  });

  return sorted;
}

export function exportToJson<T>(data: T[], filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

export function exportToCsv<T extends object>(
  data: T[],
  columns: { key: string; label: string }[],
  filename: string,
): void {
  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = getNestedValue(row, col.key);
        const text =
          value == null
            ? ''
            : Array.isArray(value)
              ? value.join('; ')
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value);
        return `"${text.replace(/"/g, '""')}"`;
      })
      .join(','),
  );

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
