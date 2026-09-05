import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SpaceRolesItems } from '../models/SpaceRoleItems.model';
import { Observable } from 'rxjs';
import { CreateProduct } from '../models/create-products.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpaceRolesItemsService {
 
  private apiUrl = `${environment.apiUrl}/SpaceRoleItems`;

  constructor(private http: HttpClient) {}

getAll(): Observable<SpaceRolesItems[]> {
  return this.http.get<SpaceRolesItems[]>(this.apiUrl, { });
}

  // 🔹 GET product by ID (Product Details page)
  getById(id: number): Observable<SpaceRolesItems> {
    return this.http.get<SpaceRolesItems>(`${this.apiUrl}/${id}`);
  }

  // 🔹 CREATE product (Admin / Demo)
  create(product: FormData): Observable<SpaceRolesItems> {
    return this.http.post<SpaceRolesItems>(this.apiUrl, product);
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
