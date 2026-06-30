import { useEffect, useState } from 'react';
import type { Employee } from '../types/employee';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/employees`);
      if (!response.ok) {
        throw new Error(`Failed to load employees (${response.status})`);
      }
      const data = (await response.json()) as Employee[];
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load employee data.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEmployees();
  }, []);

  return { employees, loading, error, refetch: fetchEmployees };
}
