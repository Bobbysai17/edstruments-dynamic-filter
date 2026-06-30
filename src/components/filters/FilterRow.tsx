import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { OPERATORS_BY_FIELD_TYPE } from '../../config/filterConfig';
import type { FilterCondition, FilterFieldDefinition } from '../../types/filter';
import { FilterValueInput } from './FilterValueInput';

interface FilterRowProps {
  condition: FilterCondition;
  config: FilterFieldDefinition[];
  error?: string;
  onChange: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}

export function FilterRow({
  condition,
  config,
  error,
  onChange,
  onRemove,
}: FilterRowProps) {
  const field =
    config.find((item) => item.key === condition.fieldKey) ?? config[0];
  const operators = OPERATORS_BY_FIELD_TYPE[field.type];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1.6fr auto' },
        gap: 1.5,
        alignItems: 'start',
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel id={`field-${condition.id}`}>Field</InputLabel>
        <Select
          labelId={`field-${condition.id}`}
          value={condition.fieldKey}
          label="Field"
          onChange={(event) => onChange({ fieldKey: event.target.value })}
        >
          {config.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id={`operator-${condition.id}`}>Operator</InputLabel>
        <Select
          labelId={`operator-${condition.id}`}
          value={condition.operator}
          label="Operator"
          onChange={(event) =>
            onChange({ operator: event.target.value as FilterCondition['operator'] })
          }
        >
          {operators.map((operator) => (
            <MenuItem key={operator.value} value={operator.value}>
              {operator.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FilterValueInput
        field={field}
        operator={condition.operator}
        value={condition.value}
        error={error}
        onChange={(value) => onChange({ value: value as FilterCondition['value'] })}
      />

      <Tooltip title="Remove filter">
        <IconButton
          aria-label="Remove filter condition"
          color="error"
          onClick={onRemove}
          sx={{ mt: { xs: 0, md: 0.5 } }}
        >
          <Trash2 size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
