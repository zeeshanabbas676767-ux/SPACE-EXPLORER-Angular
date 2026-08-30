import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Moon } from "../models/moon.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MoonService {
  private apiUrl = '${environment.apiUrl}/moons';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Moon[]> {
     return this.http.get<Moon[]>(this.apiUrl);
   }
  // 🔹 GET Moon by ID (Moon Details page)
    getById(id: number): Observable<Moon> {
      return this.http.get<Moon>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Moon (Admin / Demo)
    create(Moon: Moon): Observable<Moon> {
      return this.http.post<Moon>(this.apiUrl, Moon);
    }
  
    // 🔹 UPDATE Moon
    update(id: number, Moon: Moon): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Moon);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
