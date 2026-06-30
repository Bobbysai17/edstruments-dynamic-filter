# Edstruments Dynamic Filter System

A production-ready, configuration-driven dynamic filter component system built with **React 18**, **TypeScript**, **Vite**, **Material UI**, and **Lucide React**. The same filter architecture works across different table schemas by changing external configuration only.

## Features

- Dynamic filter builder with add/remove/clear/apply actions
- Multi-type filters: text, number, date, amount, select, multi-select, boolean
- Operators change automatically based on selected field type
- Client-side filtering with **AND between fields** and **OR within the same field**
- Nested object filtering via dot notation (e.g. `address.city`)
- Sortable data table with total/filtered record counts
- Mock API powered by `mock-json-api`
- Bonus: filter persistence (localStorage), CSV/JSON export, debounced updates, accessibility labels

## Tech Stack

- React 18 + TypeScript
- Vite
- Material UI + MUI X Date Pickers
- Lucide React icons
- mock-json-api

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
npm run generate:data   # optional: regenerate 55 employee records
npm run dev             # starts mock API (3001) + Vite (5173)
```

Open [http://localhost:5173](http://localhost:5173)

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run mock API + frontend together |
| `npm run server` | Run mock JSON API only |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run generate:data` | Regenerate sample employee JSON |

## Project Structure

```
src/
  components/
    filters/          # Dynamic filter UI
    table/            # Sortable data table
  config/             # Filter + table column configuration
  data/               # Local JSON dataset (55 employees)
  hooks/              # Data fetching + filter state
  types/              # TypeScript interfaces
  utils/              # Filtering, validation, export helpers
server/
  mock-server.cjs     # mock-json-api server
```

## Configuration-Driven Usage

Filters are defined externally and passed into the reusable builder:

```tsx
import { DynamicFilterBuilder } from './components/filters/DynamicFilterBuilder';
import { employeeFilterConfig } from './config/filterConfig';

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
```

To reuse the system for another table (e.g. transactions), create a new config:

```ts
export const transactionFilterConfig: FilterFieldDefinition[] = [
  { key: 'amount', label: 'Amount', type: 'amount' },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { label: 'Card', value: 'Card' },
      { label: 'Bank', value: 'Bank' },
      { label: 'UPI', value: 'UPI' },
    ],
  },
  { key: 'isRefunded', label: 'Refunded', type: 'boolean' },
];
```

No internal filter component changes are required.

## Filter Logic

- **Same field, multiple conditions** → OR logic
- **Different fields** → AND logic
- Text matching is case-insensitive
- Date/amount ranges support inclusive comparisons
- Multi-select supports `In` / `Not In` against array fields

## API

Mock endpoint (via Vite proxy):

```
GET /api/employees
```

## Deployment

Build and deploy to Vercel/Netlify:

```bash
npm run build
```

For full API functionality in production, deploy the mock server or replace `useEmployees` with your real API.

## Assumptions

- Employee demo dataset is stored locally in `src/data/employees.json`
- Filter persistence uses `localStorage` key `edstruments-filter-state`
- Debounced filter preview delay is 350ms

## Author Notes

This project intentionally separates UI, state, configuration, and filtering algorithms to keep the filter system reusable across multiple table schemas in enterprise applications.
