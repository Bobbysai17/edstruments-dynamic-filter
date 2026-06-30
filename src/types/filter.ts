export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'select'
  | 'multiselect'
  | 'boolean';

export type TextOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'notContains';

export type NumberOperator = 'equals' | 'gt' | 'lt' | 'gte' | 'lte';

export type DateOperator = 'between' | 'before' | 'after';

export type AmountOperator = 'between';

export type SelectOperator = 'is' | 'isNot';

export type MultiSelectOperator = 'in' | 'notIn';

export type BooleanOperator = 'is';

export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SelectOperator
  | MultiSelectOperator
  | BooleanOperator;

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterFieldDefinition {
  /** Dot-notation path into the record, e.g. address.city */
  key: string;
  label: string;
  type: FieldType;
  options?: FilterOption[];
}

export interface DateRangeValue {
  start: string | null;
  end: string | null;
}

export interface AmountRangeValue {
  min: number | null;
  max: number | null;
}

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | DateRangeValue
  | AmountRangeValue
  | null;

export interface FilterCondition {
  id: string;
  fieldKey: string;
  operator: FilterOperator;
  value: FilterValue;
}

export interface FilterValidationError {
  conditionId: string;
  message: string;
}

export interface OperatorDefinition {
  value: FilterOperator;
  label: string;
}
