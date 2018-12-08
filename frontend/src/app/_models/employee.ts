export class Employee {
  id: Number;
  fullname: string;
  position: string;
  employment_date: Date;
  salary: Number;
  superior: Number;
  is_general_chief: Boolean;
  image: string;
  subordinates: Employee[];
}


export class EmployeeList {
  count: Number;
  next: string;
  previous: string;
  results: Employee[];
}
