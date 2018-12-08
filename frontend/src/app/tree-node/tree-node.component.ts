import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Employee } from '../_models';
import { EmployeeService } from '../_services';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent implements OnInit {

  @Input() superior: Employee;
  subordinates: Employee[];
  hasSubordinates: Boolean;
  expanded: Boolean = false;

  constructor( private employeeService: EmployeeService) { }

  ngOnInit() {
    if (!this.superior) {
      this.employeeService.getChief().subscribe(
        chief => {
          this.superior = chief;
          this.onClick();
        }
      );
    }
  }

  onClick() {
    if (this.hasSubordinates === undefined) {
      this.employeeService.getSubordinates(this.superior.id)
        .subscribe(employees => {
          this.subordinates = employees;
          this.hasSubordinates = Boolean(employees.length);
        });
    }
    this.expanded = !this.expanded;
  }
}
