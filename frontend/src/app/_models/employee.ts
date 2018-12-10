export class Employee {
  id: number;
  fullname: string;
  position: string;
  employment_date: Date;
  salary: number;
  superior: number;
  is_general_chief: boolean;
  image: string;
}


export class EmployeeList {
  count: number;
  next: string;
  previous: string;
  results: Employee[];
}
