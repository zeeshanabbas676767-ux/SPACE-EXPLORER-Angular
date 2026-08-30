import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "../../shared/models/category.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = '${environment.apiUrl}/Category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
     return this.http.get<Category[]>(this.apiUrl);
   }
  // 🔹 GET Category by ID (Category Details page)
    getById(id: number): Observable<Category> {
      return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Category (Admin / Demo)
    create(Category: Category): Observable<Category> {
      return this.http.post<Category>(this.apiUrl, Category);
    }
  
    // 🔹 UPDATE Category
    update(id: number, Category: Category): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Category);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
