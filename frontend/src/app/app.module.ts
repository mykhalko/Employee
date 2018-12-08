import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeComponent } from './employee/employee.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule,
MatCardModule, MatButtonModule, MatProgressSpinnerModule,
  MatTreeModule, MatIconModule, } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { TreeComponent } from './tree/tree.component';
import { LoginComponent } from './login/login.component';
import { EmployeeToolbarComponent } from './employee-toolbar/employee-toolbar.component';
import { JwtInterceptor } from './_interceptors';
import { ErrorInterceptor } from './_interceptors';
import { TreeNodeComponent } from './tree-node/tree-node.component';


@NgModule({
  declarations: [
    AppComponent,
    EmployeeDetailComponent,
    EmployeeComponent,
    TreeComponent,
    TreeNodeComponent,
    EmployeeToolbarComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
