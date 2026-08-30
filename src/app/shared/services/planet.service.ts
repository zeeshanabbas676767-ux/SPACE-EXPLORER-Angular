import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Planet } from "../models/planet.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlanetService {
  private apiUrl = '${environment.apiUrl}/Planets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Planet[]> {
     return this.http.get<Planet[]>(this.apiUrl);
   }
  // 🔹 GET Planet by ID (Planet Details page)
    getById(id: number): Observable<Planet> {
      return this.http.get<Planet>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Planet (Admin / Demo)
    create(Planet: Planet): Observable<Planet> {
      return this.http.post<Planet>(this.apiUrl, Planet);
    }
  
    // 🔹 UPDATE Planet
    update(id: number, Planet: Planet): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Planet);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
