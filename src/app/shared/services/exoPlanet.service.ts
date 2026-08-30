import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ExoPlanet } from "../models/exoPlanet.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ExoPlanetService {
  private apiUrl = `${environment.apiUrl}/ExoPlanets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExoPlanet[]> {
     return this.http.get<ExoPlanet[]>(this.apiUrl);
   }
  // 🔹 GET ExoPlanet by ID (ExoPlanet Details page)
    getById(id: number): Observable<ExoPlanet> {
      return this.http.get<ExoPlanet>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE ExoPlanet (Admin / Demo)
    create(ExoPlanet: ExoPlanet): Observable<ExoPlanet> {
      return this.http.post<ExoPlanet>(this.apiUrl, ExoPlanet);
    }
  
    // 🔹 UPDATE ExoPlanet
    update(id: number, ExoPlanet: ExoPlanet): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, ExoPlanet);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
