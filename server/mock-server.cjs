const path = require('path');
const fs = require('fs');
const mock = require('mock-json-api');

const employeesPath = path.join(__dirname, '..', 'src', 'data', 'employees.json');
const employees = JSON.parse(fs.readFileSync(employeesPath, 'utf-8'));

const mockApi = mock({
  logging: true,
  cors: true,
  mockRoutes: [
    {
      name: 'getEmployees',
      mockRoute: '/api/employees',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: () => JSON.stringify(employees),
    },
    {
      name: 'getEmployeeById',
      mockRoute: '/api/employees/:id',
      method: 'GET',
      testScope: 'success',
      jsonTemplate: (req) => {
        const employee = employees.find((item) => String(item.id) === req.params.id);
        if (!employee) {
          return JSON.stringify({ message: 'Employee not found' });
        }
        return JSON.stringify(employee);
      },
    },
  ],
});

const app = mockApi.createServer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Mock JSON API running at http://localhost:${PORT}`);
  console.log(`Employees endpoint: http://localhost:${PORT}/api/employees`);
});
