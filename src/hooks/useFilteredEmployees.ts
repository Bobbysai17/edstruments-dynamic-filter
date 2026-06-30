import { useMemo } from 'react';
import type { Employee } from '../types/employee';
import type { FilterCondition, FilterFieldDefinition } from '../types/filter';
import { filterEmployees } from '../utils/filterEngine';
import { sortEmployees, type SortState } from '../utils/sortAndExport';

export function useFilteredEmployees(
  employees: Employee[],
  conditions: FilterCondition[],
  config: FilterFieldDefinition[],
  sort: SortState | null,
) {
  return useMemo(() => {
    const filtered = filterEmployees(employees, conditions, config);
    return sortEmployees(filtered, sort);
  }, [employees, conditions, config, sort]);
}
