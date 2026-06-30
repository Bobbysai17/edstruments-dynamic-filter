import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Filter, Plus, RotateCcw } from 'lucide-react';
import type { FilterCondition, FilterFieldDefinition } from '../../types/filter';
import { FilterRow } from './FilterRow';

interface DynamicFilterBuilderProps {
  config: FilterFieldDefinition[];
  conditions: FilterCondition[];
  validationErrors: { conditionId: string; message: string }[];
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
  onClearAll: () => void;
  onUpdateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  onApply: () => void;
}

export function DynamicFilterBuilder({
  config,
  conditions,
  validationErrors,
  onAddCondition,
  onRemoveCondition,
  onClearAll,
  onUpdateCondition,
  onApply,
}: DynamicFilterBuilderProps) {
  const errorMap = new Map(validationErrors.map((error) => [error.conditionId, error.message]));

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
        <Filter size={20} aria-hidden />
        <Typography variant="h6" component="h2">
          Dynamic Filters
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add multiple conditions. Filters on the same field use OR logic; different fields use AND
        logic.
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {conditions.map((condition) => (
          <FilterRow
            key={condition.id}
            condition={condition}
            config={config}
            error={errorMap.get(condition.id)}
            onChange={(updates) => onUpdateCondition(condition.id, updates)}
            onRemove={() => onRemoveCondition(condition.id)}
          />
        ))}
      </Stack>

      {validationErrors.length > 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Complete all filter values before applying. {validationErrors.length} condition
          {validationErrors.length > 1 ? 's need' : ' needs'} attention.
        </Alert>
      ) : null}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={onAddCondition}
        >
          Add Filter
        </Button>
        <Button variant="contained" onClick={onApply}>
          Apply Filters
        </Button>
        <Button
          variant="text"
          color="inherit"
          startIcon={<RotateCcw size={16} />}
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </Box>
    </Paper>
  );
}
