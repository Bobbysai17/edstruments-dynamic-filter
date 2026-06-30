import type { Employee } from '../types/employee';
import type {
  AmountRangeValue,
  DateRangeValue,
  FilterCondition,
  FilterFieldDefinition,
} from '../types/filter';
import { getFieldDefinition } from '../config/filterConfig';
import { getNestedValue, normalizeText, parseDate } from './nestedValue';
import { isConditionComplete } from './validation';

function matchTextField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  const fieldText = normalizeText(rawValue);
  const searchText = normalizeText(filterValue);

  switch (operator) {
    case 'equals':
      return fieldText === searchText;
    case 'contains':
      return fieldText.includes(searchText);
    case 'startsWith':
      return fieldText.startsWith(searchText);
    case 'endsWith':
      return fieldText.endsWith(searchText);
    case 'notContains':
      return !fieldText.includes(searchText);
    default:
      return false;
  }
}

function matchNumberField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  const fieldNumber = Number(rawValue);
  const compareNumber = Number(filterValue);

  if (Number.isNaN(fieldNumber) || Number.isNaN(compareNumber)) {
    return false;
  }

  switch (operator) {
    case 'equals':
      return fieldNumber === compareNumber;
    case 'gt':
      return fieldNumber > compareNumber;
    case 'lt':
      return fieldNumber < compareNumber;
    case 'gte':
      return fieldNumber >= compareNumber;
    case 'lte':
      return fieldNumber <= compareNumber;
    default:
      return false;
  }
}

function matchDateField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  const fieldDate = parseDate(rawValue);
  if (!fieldDate) return false;

  if (operator === 'between') {
    const range = filterValue as DateRangeValue;
    const start = parseDate(range.start);
    const end = parseDate(range.end);
    if (!start || !end) return false;
    return fieldDate >= start && fieldDate <= end;
  }

  const singleDate =
    typeof filterValue === 'string'
      ? parseDate(filterValue)
      : parseDate((filterValue as DateRangeValue).start);

  if (!singleDate) return false;

  if (operator === 'before') {
    return fieldDate < singleDate;
  }
  if (operator === 'after') {
    return fieldDate > singleDate;
  }

  return false;
}

function matchAmountField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  if (operator !== 'between') return false;

  const fieldAmount = Number(rawValue);
  if (Number.isNaN(fieldAmount)) return false;

  const range = filterValue as AmountRangeValue;
  const minOk = range.min == null || fieldAmount >= range.min;
  const maxOk = range.max == null || fieldAmount <= range.max;
  return minOk && maxOk;
}

function matchSelectField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  const fieldValue = normalizeText(rawValue);
  const selected = normalizeText(filterValue);

  if (operator === 'is') return fieldValue === selected;
  if (operator === 'isNot') return fieldValue !== selected;
  return false;
}

function matchMultiSelectField(
  rawValue: unknown,
  operator: string,
  filterValue: unknown,
): boolean {
  if (!Array.isArray(rawValue) || !Array.isArray(filterValue)) {
    return false;
  }

  const fieldValues = rawValue.map((item) => normalizeText(item));
  const selectedValues = filterValue.map((item) => normalizeText(item));

  if (operator === 'in') {
    return selectedValues.some((value) => fieldValues.includes(value));
  }
  if (operator === 'notIn') {
    return selectedValues.every((value) => !fieldValues.includes(value));
  }
  return false;
}

function matchBooleanField(rawValue: unknown, operator: string, filterValue: unknown): boolean {
  if (operator !== 'is') return false;
  return Boolean(rawValue) === Boolean(filterValue);
}

/**
 * Evaluates a single filter condition against a record.
 */
export function evaluateCondition<T extends object>(
  record: T,
  condition: FilterCondition,
  config: FilterFieldDefinition[],
): boolean {
  const field = getFieldDefinition(condition.fieldKey, config);
  if (!field || !isConditionComplete(condition, config)) {
    return true;
  }

  const rawValue = getNestedValue(record, field.key);

  switch (field.type) {
    case 'text':
      return matchTextField(rawValue, condition.operator, condition.value);
    case 'number':
      return matchNumberField(rawValue, condition.operator, condition.value);
    case 'date':
      return matchDateField(rawValue, condition.operator, condition.value);
    case 'amount':
      return matchAmountField(rawValue, condition.operator, condition.value);
    case 'select':
      return matchSelectField(rawValue, condition.operator, condition.value);
    case 'multiselect':
      return matchMultiSelectField(rawValue, condition.operator, condition.value);
    case 'boolean':
      return matchBooleanField(rawValue, condition.operator, condition.value);
    default:
      return true;
  }
}

/**
 * Applies filter logic: AND between different fields, OR within the same field.
 */
export function applyFilters<T extends object>(
  data: T[],
  conditions: FilterCondition[],
  config: FilterFieldDefinition[],
): T[] {
  const activeConditions = conditions.filter((condition) =>
    isConditionComplete(condition, config),
  );

  if (activeConditions.length === 0) {
    return data;
  }

  const groupedByField = activeConditions.reduce<Record<string, FilterCondition[]>>(
    (groups, condition) => {
      if (!groups[condition.fieldKey]) {
        groups[condition.fieldKey] = [];
      }
      groups[condition.fieldKey].push(condition);
      return groups;
    },
    {},
  );

  return data.filter((record) =>
    Object.values(groupedByField).every((fieldConditions) =>
      fieldConditions.some((condition) => evaluateCondition(record, condition, config)),
    ),
  );
}

/** Memoization-friendly wrapper typed for employees. */
export function filterEmployees(
  employees: Employee[],
  conditions: FilterCondition[],
  config: FilterFieldDefinition[],
): Employee[] {
  return applyFilters(employees, conditions, config);
}
