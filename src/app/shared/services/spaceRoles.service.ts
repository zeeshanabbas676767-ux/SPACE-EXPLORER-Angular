import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SpaceRoles } from "../../shared/models/spaceRoles.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class SpaceRolesService {
  private apiUrl = `${environment.apiUrl}/spaceRoles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SpaceRoles[]> {
     return this.http.get<SpaceRoles[]>(this.apiUrl);
   }
  // 🔹 GET spaceRoles by ID (spaceRoles Details page)
    getById(id: number): Observable<SpaceRoles> {
      return this.http.get<SpaceRoles>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE spaceRoles (Admin / Demo)
    create(spaceRoles: SpaceRoles): Observable<SpaceRoles> {
      return this.http.post<SpaceRoles>(this.apiUrl, spaceRoles);
    }
  
    // 🔹 UPDATE spaceRoles
    update(id: number, spaceRoles: SpaceRoles): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, spaceRoles);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
