import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_OPERATOR_BY_TYPE,
  getDefaultValueForField,
  getFieldDefinition,
} from '../config/filterConfig';
import type { FilterCondition, FilterFieldDefinition } from '../types/filter';
import { validateAllConditions } from '../utils/validation';

const STORAGE_KEY = 'edstruments-filter-state';

function createConditionId(): string {
  return `filter-${crypto.randomUUID()}`;
}

function createEmptyCondition(config: FilterFieldDefinition[]): FilterCondition {
  const firstField = config[0];
  return {
    id: createConditionId(),
    fieldKey: firstField.key,
    operator: DEFAULT_OPERATOR_BY_TYPE[firstField.type],
    value: getDefaultValueForField(firstField),
  };
}

function loadPersistedConditions(config: FilterFieldDefinition[]): FilterCondition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createEmptyCondition(config)];

    const parsed = JSON.parse(raw) as FilterCondition[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createEmptyCondition(config)];
    }

    return parsed.map((condition) => ({
      ...condition,
      id: condition.id || createConditionId(),
    }));
  } catch {
    return [createEmptyCondition(config)];
  }
}

export function useFilterState(config: FilterFieldDefinition[]) {
  const [draftConditions, setDraftConditions] = useState<FilterCondition[]>(() =>
    loadPersistedConditions(config),
  );
  const [appliedConditions, setAppliedConditions] = useState<FilterCondition[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftConditions));
  }, [draftConditions]);

  const validationErrors = useMemo(
    () => validateAllConditions(draftConditions, config),
    [draftConditions, config],
  );

  const addCondition = useCallback(() => {
    setDraftConditions((prev) => [...prev, createEmptyCondition(config)]);
  }, [config]);

  const removeCondition = useCallback((id: string) => {
    setDraftConditions((prev) => {
      const next = prev.filter((condition) => condition.id !== id);
      return next.length > 0 ? next : [createEmptyCondition(config)];
    });
  }, [config]);

  const clearAllConditions = useCallback(() => {
    const empty = [createEmptyCondition(config)];
    setDraftConditions(empty);
    setAppliedConditions([]);
  }, [config]);

  const updateCondition = useCallback(
    (id: string, updates: Partial<FilterCondition>) => {
      setDraftConditions((prev) =>
        prev.map((condition) => {
          if (condition.id !== id) return condition;

          const next = { ...condition, ...updates };

          if (updates.fieldKey && updates.fieldKey !== condition.fieldKey) {
            const field = getFieldDefinition(updates.fieldKey, config);
            if (field) {
              next.operator = DEFAULT_OPERATOR_BY_TYPE[field.type];
              next.value = getDefaultValueForField(field);
            }
          }

          if (updates.operator && updates.operator !== condition.operator) {
            const field = getFieldDefinition(next.fieldKey, config);
            if (field?.type === 'date') {
              next.value =
                updates.operator === 'between'
                  ? { start: null, end: null }
                  : null;
            }
          }

          return next;
        }),
      );
    },
    [config],
  );

  const applyFilters = useCallback(() => {
    const errors = validateAllConditions(draftConditions, config);
    if (errors.length > 0) return false;

    setAppliedConditions(
      draftConditions.map((condition) => ({
        ...condition,
        value:
          typeof condition.value === 'object' && condition.value !== null
            ? structuredClone(condition.value)
            : condition.value,
      })),
    );
    return true;
  }, [draftConditions, config]);

  return {
    draftConditions,
    appliedConditions,
    validationErrors,
    addCondition,
    removeCondition,
    clearAllConditions,
    updateCondition,
    applyFilters,
  };
}
