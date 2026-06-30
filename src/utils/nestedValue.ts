/**
 * Reads nested values from an object using dot notation (e.g. address.city).
 */
export function getNestedValue(record: unknown, path: string): unknown {
  if (!path) return record;

  return path.split('.').reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, record);
}

export function normalizeText(value: unknown): string {
  if (value == null) return '';
  return String(value).trim().toLowerCase();
}

export function parseDate(value: unknown): Date | null {
  if (value == null || value === '') return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatCellValue(value: unknown): string {
  if (value == null) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
