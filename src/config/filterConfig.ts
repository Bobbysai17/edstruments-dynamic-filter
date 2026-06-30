import type {
  FieldType,
  FilterFieldDefinition,
  FilterOperator,
  OperatorDefinition,
} from '../types/filter';

export const OPERATORS_BY_FIELD_TYPE: Record<FieldType, OperatorDefinition[]> = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'notContains', label: 'Does Not Contain' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'Greater Than or Equal' },
    { value: 'lte', label: 'Less Than or Equal' },
  ],
  date: [
    { value: 'between', label: 'Between' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
  ],
  amount: [{ value: 'between', label: 'Between' }],
  select: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is Not' },
  ],
  multiselect: [
    { value: 'in', label: 'In' },
    { value: 'notIn', label: 'Not In' },
  ],
  boolean: [{ value: 'is', label: 'Is' }],
};

export const DEFAULT_OPERATOR_BY_TYPE: Record<FieldType, FilterOperator> = {
  text: 'contains',
  number: 'equals',
  date: 'between',
  amount: 'between',
  select: 'is',
  multiselect: 'in',
  boolean: 'is',
};

const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Legal',
];

const countries = ['USA', 'Canada', 'UK', 'Germany', 'Australia'];

const skills = [
  'React',
  'TypeScript',
  'Node.js',
  'GraphQL',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'Vue',
  'Angular',
  'SQL',
  'MongoDB',
  'Figma',
  'Excel',
  'Power BI',
  'Salesforce',
  'Tableau',
  'Rust',
  'Go',
];

/** Configuration-driven filter definitions for the employee table. */
export const employeeFilterConfig: FilterFieldDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: departments.map((d) => ({ label: d, value: d })),
  },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'salary', label: 'Salary', type: 'amount' },
  { key: 'joinDate', label: 'Join Date', type: 'date' },
  { key: 'isActive', label: 'Active Status', type: 'boolean' },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: skills.map((s) => ({ label: s, value: s })),
  },
  { key: 'address.city', label: 'City', type: 'text' },
  {
    key: 'address.state',
    label: 'State',
    type: 'select',
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
      { label: 'Texas', value: 'TX' },
      { label: 'Washington', value: 'WA' },
      { label: 'Illinois', value: 'IL' },
      { label: 'Massachusetts', value: 'MA' },
      { label: 'Colorado', value: 'CO' },
      { label: 'Georgia', value: 'GA' },
      { label: 'Oregon', value: 'OR' },
      { label: 'Florida', value: 'FL' },
      { label: 'Ontario', value: 'ON' },
      { label: 'England', value: 'ENG' },
      { label: 'Berlin', value: 'BE' },
      { label: 'New South Wales', value: 'NSW' },
    ],
  },
  {
    key: 'address.country',
    label: 'Country',
    type: 'select',
    options: countries.map((c) => ({ label: c, value: c })),
  },
  { key: 'projects', label: 'Projects', type: 'number' },
  { key: 'lastReview', label: 'Last Review', type: 'date' },
  { key: 'performanceRating', label: 'Performance Rating', type: 'number' },
];

export function getFieldDefinition(
  fieldKey: string,
  config: FilterFieldDefinition[],
): FilterFieldDefinition | undefined {
  return config.find((field) => field.key === fieldKey);
}

export function getDefaultValueForField(field: FilterFieldDefinition) {
  switch (field.type) {
    case 'text':
    case 'select':
      return '';
    case 'number':
      return null;
    case 'date':
      return { start: null, end: null };
    case 'amount':
      return { min: null, max: null };
    case 'multiselect':
      return [];
    case 'boolean':
      return true;
    default:
      return null;
  }
}
