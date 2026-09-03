import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Users } from "../../../shared/models/users.model";
import { AuthService } from "../../../shared/services/auth.service";
import { Role } from "../../../shared/models/role.model";
import { RoleService } from "../../../shared/services/Role.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html'
})
export class AdminUsersComponent implements OnInit {
user: Users[]=[]
error: string | null = null;
 loading = false;
 role: Role[] = [];
  users = {
    id: 0,
    fullName: '',
    email: '',
    roleId: 0,
    role: { id: 0, name: '' }
  }

  constructor(private auth: AuthService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadRole();
       this.role = [
    { id: 3, name: 'Admin' },
    { id: 4, name: 'Customer' },
  ];
  } 

  loadRole(): void{
    this.roleService.getAll().subscribe({
       next: (data) => {
        this.role = data;
         this.loading = false;
      },
      error: (err) => {
         const errorMessage = err?.error?.message || err?.message || 'Failed to load roles. Please check if the API is running.';
        this.error = `Error loading roles: ${errorMessage}`;
        this.loading = false;
        console.error('Error calling API:', err);
      }
    })
  }
  
  loadUser(): void {
       this.loading = true;
    this.error = null;

   this.auth.getAll().subscribe({
      next: (data) => {
        this.user = data;
         this.user = data;
         this.loading = false;
      },
      error: (err) => {
         const errorMessage = err?.error?.message || err?.message || 'Failed to load Users. Please check if the API is running.';
        this.error = `Error loading users: ${errorMessage}`;
        this.loading = false;
        console.error('Error calling API:', err);
      }
    }); 
}
     delete(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.auth.delete(id).subscribe({
      next: () => {
        this.user = this.user.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

}
