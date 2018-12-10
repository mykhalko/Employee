import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Employee } from '../_models';
import { EmployeeService } from '../_services';

@Component({
  selector: 'app-employee-creation',
  templateUrl: './employee-creation.component.html',
  styleUrls: ['./employee-creation.component.css']
})
export class EmployeeCreationComponent implements OnInit {

  employee: Employee = new Employee();
  error: string;

  constructor(
    private router: Router,
    private location: Location,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
  }

  create() {
    for (const key in this.employee) {
      if (!this.employee[key]) {
        this.error =  key + ' can\'t be empty';
        return;
      }
      if (this.employee.superior < 1) {
        this.error = 'superior id can\'t be negative';
      }
    }
    this.employeeService.create(this.employee).subscribe(
      res => this.router.navigate([`/detail/${res.id}`]),
      err => {
        console.log('err');
        let error_message = '';
              for (const key in err) {
                error_message += ' ' + key + ': ' +  err[key].reduce((acc, value) => acc + ' ' + value);
              }
              this.error = error_message;
        }
    );
  }

  goBack() {
    this.location.back();
  }

  clearError() {
    this.error = null;
  }
}
