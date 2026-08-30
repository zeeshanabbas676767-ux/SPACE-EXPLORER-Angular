import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Galaxy } from "../models/galaxy.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class GalaxyService {
  private apiUrl = `${environment.apiUrl}/Galaxies`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Galaxy[]> {
     return this.http.get<Galaxy[]>(this.apiUrl);
   }
  // 🔹 GET Galaxy by ID (Galaxy Details page)
    getById(id: number): Observable<Galaxy> {
      return this.http.get<Galaxy>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Galaxy (Admin / Demo)
    create(Galaxy: Galaxy): Observable<Galaxy> {
      return this.http.post<Galaxy>(this.apiUrl, Galaxy);
    }
  
    // 🔹 UPDATE Galaxy
    update(id: number, Galaxy: Galaxy): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Galaxy);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
