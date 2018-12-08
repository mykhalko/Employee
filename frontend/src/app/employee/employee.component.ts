import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

import { EmployeeService } from '../_services';
import { Employee } from '../_models';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[];
  ordering: string[] = ['fullname', 'position', 'salary', 'employment date'];
  pickedOrder: string = null;
  reverse: Boolean = false;
  searchBy: string[] = ['fullname', 'position', 'salary', 'employment_date'];
  pickedSearchField: string = null;
  searchValue: string = null;
  itemsLoaded: number;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeService
      .getEmployees()
      .subscribe(employees => {
        this.employees = employees;
        this.itemsLoaded = employees.length;
      });
  }

  refresh() {
    this.itemsLoaded = 0;
    this.employees = [];
    this.loadMore();
  }

  loadMore() {
    const searchField = this.pickedSearchField;
    const searchValue = this.searchValue ? this.searchValue : '';
    let ordering = null;
    const page = (this.itemsLoaded / 50) + 1;
    if (this.pickedOrder) {
      ordering = this.pickedOrder;
      if (this.reverse) {
        ordering = '-' + ordering;
      }
    }
    this.employeeService.getEmployees(page, ordering, searchField, searchValue).subscribe( data => {
        this.employees = this.employees.concat(data);
        this.itemsLoaded = this.employees.length;
      }
    );
  }
}
