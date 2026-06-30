import type {
  AmountRangeValue,
  DateRangeValue,
  FilterCondition,
  FilterFieldDefinition,
  FilterValidationError,
  FilterValue,
} from '../types/filter';
import { getFieldDefinition } from '../config/filterConfig';

function isEmptyValue(value: FilterValue, fieldType: FilterFieldDefinition['type']): boolean {
  if (value == null) return true;

  switch (fieldType) {
    case 'text':
    case 'select':
      return String(value).trim() === '';
    case 'number':
      return value === '' || value === null || Number.isNaN(Number(value));
    case 'boolean':
      return false;
    case 'multiselect':
      return !Array.isArray(value) || value.length === 0;
    case 'date': {
      const range = value as DateRangeValue;
      if (range.start || range.end) return false;
      return typeof range === 'string' ? String(range).trim() === '' : true;
    }
    case 'amount': {
      const range = value as AmountRangeValue;
      return range.min == null && range.max == null;
    }
    default:
      return true;
  }
}

/**
 * Validates a single filter condition based on its field definition and operator.
 */
export function validateFilterCondition(
  condition: FilterCondition,
  config: FilterFieldDefinition[],
): FilterValidationError | null {
  const field = getFieldDefinition(condition.fieldKey, config);
  if (!field) {
    return { conditionId: condition.id, message: 'Invalid field selected.' };
  }

  if (isEmptyValue(condition.value, field.type)) {
    return { conditionId: condition.id, message: 'Filter value is required.' };
  }

  if (field.type === 'number') {
    const num = Number(condition.value);
    if (Number.isNaN(num)) {
      return { conditionId: condition.id, message: 'Enter a valid number.' };
    }
  }

  if (field.type === 'amount') {
    const range = condition.value as AmountRangeValue;
    if (range.min != null && range.max != null && range.min > range.max) {
      return {
        conditionId: condition.id,
        message: 'Minimum amount cannot exceed maximum amount.',
      };
    }
  }

  if (field.type === 'date') {
    if (condition.operator === 'between') {
      const range = condition.value as DateRangeValue;
      if (!range.start || !range.end) {
        return { conditionId: condition.id, message: 'Select both start and end dates.' };
      }
      if (new Date(range.start) > new Date(range.end)) {
        return {
          conditionId: condition.id,
          message: 'Start date cannot be after end date.',
        };
      }
    } else if (condition.operator === 'before' || condition.operator === 'after') {
      const dateValue = condition.value as DateRangeValue | string;
      const singleDate =
        typeof dateValue === 'string' ? dateValue : dateValue.start ?? dateValue.end;
      if (!singleDate) {
        return { conditionId: condition.id, message: 'Select a date.' };
      }
    }
  }

  return null;
}

export function validateAllConditions(
  conditions: FilterCondition[],
  config: FilterFieldDefinition[],
): FilterValidationError[] {
  return conditions
    .map((condition) => validateFilterCondition(condition, config))
    .filter((error): error is FilterValidationError => error !== null);
}

export function isConditionComplete(
  condition: FilterCondition,
  config: FilterFieldDefinition[],
): boolean {
  return validateFilterCondition(condition, config) === null;
}
