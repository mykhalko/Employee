import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services';

@Component({
  selector: 'app-employee-toolbar',
  templateUrl: './employee-toolbar.component.html',
  styleUrls: ['./employee-toolbar.component.css']
})
export class EmployeeToolbarComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
