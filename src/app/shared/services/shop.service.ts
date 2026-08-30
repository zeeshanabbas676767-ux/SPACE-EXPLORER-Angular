import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Shop } from '../models/shop.model';
import { Observable } from 'rxjs';
import { CreateProduct } from '../models/create-products.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShopService {
 
  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) {}

// 🔹 GET all products (Shop page)
  // getAll(sortBy?: string): Observable<Shop[]> {
  //   return this.http.get<Shop[]>(this.apiUrl +`?sortBy=${sortBy}`);
  // }
//   getAll(sortBy?: string, category?: string , 
//     minPrice?: number, maxPrice?: number,
//      pageNumber: number = 1, pageSize: number = 10) {

//   let params = new HttpParams();

//   if (sortBy)
//     params = params.set('sortBy', sortBy);
//   if (category) 
//     params = params.set('category', category);
//   if (minPrice != null) 
//     params = params.set('minPrice', minPrice);
//   if (maxPrice != null) 
//     params = params.set('maxPrice', maxPrice);
//   if (pageNumber)    
//     params = params.set('pageNumber', pageNumber);
//   if (pageSize)
//     params = params.set('pageSize', pageSize);
//   return this.http.get<any>(this.apiUrl, { params });
// }
// shop.service.ts
getAll(
  sortBy: string = '', 
  category: string = '', 
  minPrice?: number, 
  maxPrice?: number, 
  pageNumber: number = 1, 
  pageSize: number = 8
): Observable<any> {
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

  if (sortBy) params = params.set('sortBy', sortBy);
  if (category) params = params.set('category', category);
  if (minPrice != null) params = params.set('minPrice', minPrice.toString());
  if (maxPrice != null) params = params.set('maxPrice', maxPrice.toString());

  return this.http.get<any>(this.apiUrl, { params });
}
//   getAll(sortBy?: string, minPrice?: number, maxPrice?: number) {

//   let params = new HttpParams();

//   if (sortBy)
//     params = params.set('sortBy', sortBy);

//   if (minPrice != null)
//     params = params.set('minPrice', minPrice);

//   if (maxPrice != null)
//     params = params.set('maxPrice', maxPrice);

//   return this.http.get<Shop[]>(this.apiUrl, { params });
// }
  // 🔹 GET product by ID (Product Details page)
  getById(id: number): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/${id}`);
  }

  // 🔹 CREATE product (Admin / Demo)
  create(product: FormData): Observable<Shop> {
    return this.http.post<Shop>(this.apiUrl, product);
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
