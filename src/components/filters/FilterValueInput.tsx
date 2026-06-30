import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type {
  AmountRangeValue,
  DateRangeValue,
  FilterFieldDefinition,
  FilterOperator,
} from '../../types/filter';

interface FilterValueInputProps {
  field: FilterFieldDefinition;
  operator: FilterOperator;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

function toDayjs(value: string | null | undefined): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

export function FilterValueInput({
  field,
  operator,
  value,
  error,
  onChange,
}: FilterValueInputProps) {
  switch (field.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          size="small"
          label="Value"
          value={(value as string) ?? ''}
          onChange={(event) => onChange(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          slotProps={{
            htmlInput: { 'aria-label': `${field.label} filter value` },
          }}
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Value"
          value={value ?? ''}
          onChange={(event) =>
            onChange(event.target.value === '' ? null : Number(event.target.value))
          }
          error={Boolean(error)}
          helperText={error}
          slotProps={{
            htmlInput: { 'aria-label': `${field.label} filter value` },
          }}
        />
      );

    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {operator === 'between' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <DatePicker
                label="Start date"
                value={toDayjs((value as DateRangeValue)?.start)}
                onChange={(date) =>
                  onChange({
                    ...(value as DateRangeValue),
                    start: date ? date.format('YYYY-MM-DD') : null,
                  })
                }
                slotProps={{
                  textField: {
                    size: 'small',
                    error: Boolean(error),
                  },
                }}
              />
              <DatePicker
                label="End date"
                value={toDayjs((value as DateRangeValue)?.end)}
                onChange={(date) =>
                  onChange({
                    ...(value as DateRangeValue),
                    end: date ? date.format('YYYY-MM-DD') : null,
                  })
                }
                slotProps={{
                  textField: {
                    size: 'small',
                    error: Boolean(error),
                  },
                }}
              />
            </Box>
          ) : (
            <DatePicker
              label={operator === 'before' ? 'Before date' : 'After date'}
              value={toDayjs(
                typeof value === 'string'
                  ? value
                  : ((value as DateRangeValue)?.start ?? null),
              )}
              onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: Boolean(error),
                  helperText: error,
                },
              }}
            />
          )}
        </LocalizationProvider>
      );

    case 'amount': {
      const range = (value as AmountRangeValue) ?? { min: null, max: null };
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <TextField
            size="small"
            type="number"
            label="Min amount"
            value={range.min ?? ''}
            onChange={(event) =>
              onChange({
                ...range,
                min: event.target.value === '' ? null : Number(event.target.value),
              })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>$</Typography>
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': `${field.label} minimum amount` },
            }}
            error={Boolean(error)}
          />
          <TextField
            size="small"
            type="number"
            label="Max amount"
            value={range.max ?? ''}
            onChange={(event) =>
              onChange({
                ...range,
                max: event.target.value === '' ? null : Number(event.target.value),
              })
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>$</Typography>
                  </InputAdornment>
                ),
              },
              htmlInput: { 'aria-label': `${field.label} maximum amount` },
            }}
            error={Boolean(error)}
            helperText={error}
          />
        </Box>
      );
    }

    case 'select':
      return (
        <FormControl fullWidth size="small" error={Boolean(error)}>
          <InputLabel id={`${field.key}-select-label`}>Value</InputLabel>
          <Select
            labelId={`${field.key}-select-label`}
            value={(value as string) ?? ''}
            label="Value"
            onChange={(event) => onChange(event.target.value)}
            aria-label={`${field.label} filter value`}
          >
            {(field.options ?? []).map((option) => (
              <MenuItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error ? (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          ) : null}
        </FormControl>
      );

    case 'multiselect':
      return (
        <FormControl fullWidth size="small" error={Boolean(error)}>
          <InputLabel id={`${field.key}-multi-label`}>Values</InputLabel>
          <Select
            multiple
            labelId={`${field.key}-multi-label`}
            value={(value as string[]) ?? []}
            onChange={(event) => {
              const selected =
                typeof event.target.value === 'string'
                  ? event.target.value.split(',')
                  : event.target.value;
              onChange(selected);
            }}
            input={<OutlinedInput label="Values" />}
            renderValue={(selected) => selected.join(', ')}
            aria-label={`${field.label} filter values`}
          >
            {(field.options ?? []).map((option) => (
              <MenuItem key={String(option.value)} value={String(option.value)}>
                <Checkbox checked={((value as string[]) ?? []).includes(String(option.value))} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
          {error ? (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          ) : null}
        </FormControl>
      );

    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={(event) => onChange(event.target.checked)}
              slotProps={{ input: { 'aria-label': `${field.label} boolean filter` } }}
            />
          }
          label={Boolean(value) ? 'True' : 'False'}
        />
      );

    default:
      return null;
  }
}
