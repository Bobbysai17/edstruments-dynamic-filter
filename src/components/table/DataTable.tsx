import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import type { Employee } from '../../types/employee';
import type { TableColumn } from '../../config/tableColumns';
import { getNestedValue } from '../../utils/nestedValue';
import type { SortDirection, SortState } from '../../utils/sortAndExport';

interface DataTableProps {
  columns: TableColumn<Employee>[];
  data: Employee[];
  totalCount: number;
  sort: SortState | null;
  onSortChange: (key: string) => void;
}

function getCellValue(row: Employee, column: TableColumn<Employee>): string | number {
  if (column.accessor) {
    const value = column.accessor(row);
    return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  }

  const value = getNestedValue(row, column.key);
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value == null) return '—';
  return value as string | number;
}

export function DataTable({
  columns,
  data,
  totalCount,
  sort,
  onSortChange,
}: DataTableProps) {
  const filteredCount = data.length;

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" component="h2">
          Employee Directory
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredCount} of {totalCount} records
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small" aria-label="Employee data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                const direction: SortDirection = isSorted ? sort.direction : 'asc';

                return (
                  <TableCell
                    key={column.key}
                    align={column.align ?? 'left'}
                    sx={{ width: column.width, fontWeight: 600, bgcolor: 'background.paper' }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? direction : 'asc'}
                        onClick={() => onSortChange(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No results match the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.key}`} align={column.align ?? 'left'}>
                      {getCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
