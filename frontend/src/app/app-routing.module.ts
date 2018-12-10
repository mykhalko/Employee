import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { TreeComponent } from './tree/tree.component';
import {EmployeeDetailComponent} from './employee-detail/employee-detail.component';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { AuthGuard } from './_gurads';

const routes: Routes = [
  { path: '', component: TreeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'detail/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard]},
  { path: 'add', component: EmployeeCreationComponent, canActivate: [AuthGuard]},
  { path: 'list', component: EmployeeComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
