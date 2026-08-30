import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Asteroid } from "../models/asteroid.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AsteroidService {
  private apiUrl = '${environment.apiUrl}/Asteroids';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asteroid[]> {
     return this.http.get<Asteroid[]>(this.apiUrl);
   }
  // 🔹 GET Asteroid by ID (Asteroid Details page)
    getById(id: number): Observable<Asteroid> {
      return this.http.get<Asteroid>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Asteroid (Admin / Demo)
    create(Asteroid: Asteroid): Observable<Asteroid> {
      return this.http.post<Asteroid>(this.apiUrl, Asteroid);
    }
  
    // 🔹 UPDATE Asteroid
    update(id: number, Asteroid: Asteroid): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Asteroid);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
