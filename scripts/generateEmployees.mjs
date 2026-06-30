import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa',
  'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Patricia', 'Joseph',
  'Linda', 'Thomas', 'Elizabeth', 'Charles', 'Barbara', 'Daniel', 'Susan',
  'Matthew', 'Jessica', 'Anthony', 'Karen', 'Mark', 'Nancy', 'Donald', 'Betty',
  'Steven', 'Helen', 'Paul', 'Sandra', 'Andrew', 'Donna', 'Joshua', 'Carol',
  'Kenneth', 'Ruth', 'Kevin', 'Sharon', 'Brian', 'Michelle', 'George', 'Laura',
  'Edward', 'Amanda', 'Ronald', 'Melissa',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

const departments = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal',
];

const roles = {
  Engineering: ['Senior Developer', 'Junior Developer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
  Sales: ['Account Executive', 'Sales Manager', 'Business Development Rep', 'Sales Director'],
  HR: ['HR Manager', 'Recruiter', 'HR Coordinator', 'People Operations'],
  Finance: ['Financial Analyst', 'Accountant', 'Controller', 'CFO Assistant'],
  Operations: ['Operations Manager', 'Project Manager', 'Supply Chain Analyst'],
  Design: ['UI Designer', 'UX Researcher', 'Product Designer', 'Creative Director'],
  Legal: ['Legal Counsel', 'Compliance Officer', 'Paralegal'],
};

const skillsPool = [
  'React', 'TypeScript', 'Node.js', 'GraphQL', 'Python', 'Java', 'AWS', 'Docker',
  'Kubernetes', 'Vue', 'Angular', 'SQL', 'MongoDB', 'Figma', 'Excel', 'Power BI',
  'Salesforce', 'Tableau', 'Rust', 'Go',
];

const cities = [
  { city: 'San Francisco', state: 'CA', country: 'USA' },
  { city: 'New York', state: 'NY', country: 'USA' },
  { city: 'Austin', state: 'TX', country: 'USA' },
  { city: 'Seattle', state: 'WA', country: 'USA' },
  { city: 'Chicago', state: 'IL', country: 'USA' },
  { city: 'Boston', state: 'MA', country: 'USA' },
  { city: 'Denver', state: 'CO', country: 'USA' },
  { city: 'Atlanta', state: 'GA', country: 'USA' },
  { city: 'Portland', state: 'OR', country: 'USA' },
  { city: 'Miami', state: 'FL', country: 'USA' },
  { city: 'Toronto', state: 'ON', country: 'Canada' },
  { city: 'London', state: 'ENG', country: 'UK' },
  { city: 'Berlin', state: 'BE', country: 'Germany' },
  { city: 'Sydney', state: 'NSW', country: 'Australia' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

const employees = [];

for (let i = 1; i <= 55; i++) {
  const firstName = firstNames[(i - 1) % firstNames.length];
  const lastName = lastNames[Math.floor((i - 1) / 2) % lastNames.length];
  const name = `${firstName} ${lastName}${i > 50 ? ` ${i}` : ''}`;
  const department = pick(departments);
  const role = pick(roles[department]);
  const location = cities[i % cities.length];
  const joinDate = randomDate(new Date(2018, 0, 1), new Date(2024, 5, 1));
  const lastReview = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
  const salary = Math.round((65000 + Math.random() * 85000) / 1000) * 1000;
  const skillCount = 2 + (i % 4);

  employees.push({
    id: i,
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
    department,
    role,
    salary,
    joinDate,
    isActive: i % 7 !== 0,
    skills: pickN(skillsPool, skillCount),
    address: { ...location },
    projects: 1 + (i % 8),
    lastReview,
    performanceRating: Math.round((2.5 + Math.random() * 2.5) * 10) / 10,
  });
}

const outputPath = join(__dirname, '..', 'src', 'data', 'employees.json');
writeFileSync(outputPath, JSON.stringify(employees, null, 2));
console.log(`Generated ${employees.length} employees at ${outputPath}`);
