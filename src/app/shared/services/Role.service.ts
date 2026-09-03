import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Role } from "../models/role.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class RoleService {
  private apiUrl = `${environment.apiUrl}/Role`;

  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Role[]> {
     return this.http.get<Role[]>(this.apiUrl);
   }
  // 🔹 GET Role by ID (Role Details page)
    getById(id: number): Observable<Role> {
      return this.http.get<Role>(`${this.apiUrl}/${id}`);
    }
  
    // 🔹 CREATE Role (Admin / Demo)
    create(Role: Role): Observable<Role> {
      return this.http.post<Role>(this.apiUrl, Role);
    }
  
    // 🔹 UPDATE Role
    update(id: number, Role: Role): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, Role);
    }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
