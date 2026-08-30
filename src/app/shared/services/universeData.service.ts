import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UniverseData } from '../models/universeData.models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UniverseDataService {

  private apiUrl = `${environment.apiUrl}/UniverseData`;
 
  constructor(private http: HttpClient) {}

  // 🔹 Get All (with pagination and sorting)
  getAll(pageNumber: number = 1, pageSize: number = 10, sortBy?: string): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  // 🔹 Get by ID (useful for pre-filling your Update form)
  getById(id: number): Observable<UniverseData> {
    return this.http.get<UniverseData>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Create (uses FormData for image upload)
  create(formData: FormData): Observable<UniverseData> {
    return this.http.post<UniverseData>(this.apiUrl, formData);
  }

  // 🔹 Update (uses FormData for image upload)
  update(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  // 🔹 Delete
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}