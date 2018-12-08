import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Employee, EmployeeList } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = '/api/employee';

  constructor(private http: HttpClient) {
    this.setUpForDebug();
  }

  getChief(): Observable<Employee> {
    const url = this.baseUrl + '?chief_only';
    return this.http.get<EmployeeList>(url).pipe(
      map(chiefs => chiefs.results[0])
    );
  }

  getSubordinates (superior_id: Number): Observable<Employee[]> {
    const url = this.baseUrl + `/${superior_id}?subordinates`;
    return this.http.get<Employee[]>(url);
  }

  hasSubordinates (superior_id: Number): Observable<Boolean> {
    const url = this.baseUrl + `/${superior_id}?subordinates`;
    return this.http.get<Employee[]>(url).pipe(
      map(data => Boolean(data.length))
    );
  }

  setUpForDebug () {
   this.baseUrl = 'http://localhost:8000' + this.baseUrl;
  }
}
