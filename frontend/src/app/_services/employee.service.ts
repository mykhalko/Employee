import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getEmployeeById(id: Number): Observable<Employee> {
    return this.http.get<Employee>(this.baseUrl + `/${id}`);
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

  getEmployees (page: Number = null, ordering: string = null, search_field: string = null,
                search_value: string = null): Observable<Employee[]> {
    let query = '';
    const queryParams = [];
    if (page) {
      queryParams.push(`page=${page}`);
    }
    if (ordering) {
      if (ordering.startsWith('-')) {
        queryParams.push('reverse');
        queryParams.push(`order_by=${ordering.slice(1)}`);
      } else {
        queryParams.push(`order_by=${ordering}`);
      }
    }
    if (search_field) {
      queryParams.push(`search_field=${search_field}`);
      queryParams.push(`value=${search_value}`);
    }
    if ( queryParams.length) {
      query = '?' + queryParams.reduce((acc, arg) => acc + '&' + arg);
    }
    return this.http.get<EmployeeList>(this.baseUrl + query).pipe(
        map(data => data.results)
    );
  }

  edit(id: number, data: any): Observable<any> {
    return this.http.patch<Employee>(this.baseUrl + `/${id}`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  branchDelete(id: number): Observable<any> {
    const args = 'type=branch_delete';
    return this.http.delete(this.baseUrl + `/${id}?` + args);
  }

  resubmissionDelete(id: number, subdue_to: number): Observable<any> {
    const args = `type=resubmission&subdue_to=${subdue_to}`;
    return this.http.delete(this.baseUrl + `/${id}?` + args);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + `/${id}`);
  }

  setUpForDebug () {
   this.baseUrl = 'http://localhost:8000' + this.baseUrl;
  }
}
