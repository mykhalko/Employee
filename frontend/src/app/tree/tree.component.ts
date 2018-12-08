import { Component, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { EmployeeService } from '../_services';
import { Employee, EmployeeList } from '../_models';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  constructor () { }

  ngOnInit() { }
}
