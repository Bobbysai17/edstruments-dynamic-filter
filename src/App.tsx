import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Snackbar,
  Alert,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { Download, FileJson } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DynamicFilterBuilder } from './components/filters/DynamicFilterBuilder';
import { DataTable } from './components/table/DataTable';
import { employeeFilterConfig } from './config/filterConfig';
import { employeeTableColumns } from './config/tableColumns';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useEmployees } from './hooks/useEmployees';
import { useFilteredEmployees } from './hooks/useFilteredEmployees';
import { useFilterState } from './hooks/useFilterState';
import { appTheme } from './theme/theme';
import { exportToCsv, exportToJson, type SortState } from './utils/sortAndExport';
import { isConditionComplete } from './utils/validation';

function App() {
  const { employees, loading, error, refetch } = useEmployees();
  const {
    draftConditions,
    validationErrors,
    addCondition,
    removeCondition,
    clearAllConditions,
    updateCondition,
    applyFilters,
  } = useFilterState(employeeFilterConfig);

  const debouncedConditions = useDebouncedValue(draftConditions, 350);
  const [sort, setSort] = useState<SortState | null>({ key: 'name', direction: 'asc' });
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const activeConditions = useMemo(
    () =>
      debouncedConditions.filter((condition) =>
        isConditionComplete(condition, employeeFilterConfig),
      ),
    [debouncedConditions],
  );

  const filteredEmployees = useFilteredEmployees(
    employees,
    activeConditions,
    employeeFilterConfig,
    sort,
  );

  const handleSortChange = (key: string) => {
    setSort((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleApply = () => {
    const success = applyFilters();
    if (!success) {
      setSnackbar('Please fix validation errors before applying filters.');
      return;
    }
    setSnackbar('Filters applied successfully.');
  };

  const exportColumns = employeeTableColumns.map((column) => ({
    key: column.key,
    label: column.label,
  }));

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppBar position="static" elevation={0} color="default">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Edstruments Dynamic Filter System
          </Typography>
          <Button
            size="small"
            startIcon={<FileJson size={16} />}
            onClick={() => exportToJson(filteredEmployees, 'employees-filtered.json')}
            disabled={filteredEmployees.length === 0}
          >
            Export JSON
          </Button>
          <Button
            size="small"
            startIcon={<Download size={16} />}
            onClick={() =>
              exportToCsv(filteredEmployees, exportColumns, 'employees-filtered.csv')
            }
            disabled={filteredEmployees.length === 0}
            sx={{ ml: 1 }}
          >
            Export CSV
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <DynamicFilterBuilder
          config={employeeFilterConfig}
          conditions={draftConditions}
          validationErrors={validationErrors}
          onAddCondition={addCondition}
          onRemoveCondition={removeCondition}
          onClearAll={clearAllConditions}
          onUpdateCondition={updateCondition}
          onApply={handleApply}
        />

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress aria-label="Loading employees" />
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={refetch}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : (
            <DataTable
              columns={employeeTableColumns}
              data={filteredEmployees}
              totalCount={employees.length}
              sort={sort}
              onSortChange={handleSortChange}
            />
          )}
        </Box>
      </Container>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar(null)} sx={{ width: '100%' }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
