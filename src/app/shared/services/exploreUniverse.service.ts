import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exploreUniverse } from '../models/exploreUniverse.model';
import { Observable } from 'rxjs';
import { CreateUD } from '../models/create-UD.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class exploreUniverseService {
  
  private apiUrl = `${environment.apiUrl}/UniverseData`; 

  constructor(private http: HttpClient) {}

// 🔹 GET all products (Shop page)
  // getAll(sortBy?: string): Observable<Shop[]> {
  //   return this.http.get<Shop[]>(this.apiUrl +`?sortBy=${sortBy}`);
  // }
  getAll(sortBy?: string, category?: string , 
    minDistance?: number, maxDistance?: number,
     pageNumber: number = 1, pageSize: number = 10) {

  let params = new HttpParams();

  if (sortBy)
    params = params.set('sortBy', sortBy);
  if (category) 
    params = params.set('category', category);
  if (minDistance != null) 
    params = params.set('minDistance', minDistance);
  if (maxDistance != null) 
    params = params.set('maxDistance', maxDistance);
  if (pageNumber)    
    params = params.set('pageNumber', pageNumber);
  if (pageSize)
    params = params.set('pageSize', pageSize);
  return this.http.get<any>(this.apiUrl, { params });

}
//   getAll(sortBy?: string, minDistance?: number, maxDistance?: number) {

//   let params = new HttpParams();

//   if (sortBy)
//     params = params.set('sortBy', sortBy);

//   if (minDistance != null)
//     params = params.set('minDistance', minDistance);

//   if (maxDistance != null)
//     params = params.set('maxDistance', maxDistance);

//   return this.http.get<Shop[]>(this.apiUrl, { params });
// }
  // 🔹 GET product by ID (Product Details page)
  getById(id: number): Observable<exploreUniverse> {
    return this.http.get<exploreUniverse>(`${this.apiUrl}/${id}`);
  }

  // 🔹 CREATE product (Admin / Demo)
  create(product: FormData): Observable<exploreUniverse> {
    return this.http.post<exploreUniverse>(this.apiUrl, product);
  }

  // 🔹 UPDATE product
  update(id: number, product: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  // 🔹 DELETE product
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
