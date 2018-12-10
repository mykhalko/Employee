import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Employee } from '../_models';
import { EmployeeService } from '../_services';


@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  employee: Employee;
  superior: Employee;
  bufferData: Employee = new Employee();
  error: string;
  editingEnabled = false;
  deletionDialog = false;
  deletionTypes: string[] = ['all subordinates deletion', 'resubmission'];
  deletionType = 'resubmission';
  resubmission_superior_id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getEmployee();
    this.route.params.subscribe(
      params => this.getEmployee());
  }

  getEmployee() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.employeeService.getEmployeeById(id).subscribe(
      employee => {
        this.employee = employee;
        this.superior = null;
        if (employee.superior) {
          this.employeeService.getEmployeeById(employee.superior)
            .subscribe( superior => {
              this.superior = superior;
            } );
        }
      },
      err => this.error = err.error
    );
  }

  goBack() {
    this.location.back();
  }

  enableEditing() {
    this.editingEnabled = true;
  }

  cancelChanges() {
    this.editingEnabled = false;
  }

  postChanges() {
    console.log('fullname: ' + this.bufferData.fullname);
    console.log('pos: ' + this.bufferData.position);
    console.log('salary: ' + this.bufferData.salary);
    console.log('date: ' + this.bufferData.employment_date);
    console.log('superior_id: ' + this.bufferData.superior);
    const dataForEdit = {};
    for (const field in this.bufferData) {
      const value = this.bufferData[field];
      if (value) {
        dataForEdit[field] = value;
      }
    }
    console.log('posting...');
    const editableFields = ['fullname', 'position', 'salary', 'employment_date', 'superior'];
    if (editableFields.some(dataForEdit.hasOwnProperty.bind(dataForEdit))) {
      this.employeeService.edit(this.employee.id, dataForEdit).subscribe(
        res => this.getEmployee(),
        err => {
          let error_message = '';
          for (const key in err) {
            error_message += ' ' + key + ': ' +  err[key].reduce((acc, value) => acc + ' ' + value);
          }
          this.error = error_message;
        }
      );
      this.editingEnabled = false;
    } else {
      this.error = 'no edited fields';
    }
  }

  openDeletionDialog() {
    this.deletionDialog = true;
  }

  closeDeletionDialog() {
    this.deletionDialog = false;
  }

  delete() {
    if (this.deletionType === 'all subordinates deletion') {
      this.employeeService.branchDelete(this.employee.id)
        .subscribe(
          res => this.router.navigate(['/list']),
          err => this.error = err.error);
    } else {
      if (this.deletionType === 'resubmission' && this.resubmission_superior_id) {
        this.employeeService.resubmissionDelete(this.employee.id, this.resubmission_superior_id)
          .subscribe(
            res => this.router.navigate(['/list']),
            err => this.error = err.error
          );
      }
    }
  }

  clearError() {
    this.error = null;
  }
}
