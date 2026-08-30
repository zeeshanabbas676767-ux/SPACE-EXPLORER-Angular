import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Users } from "../../../shared/models/users.model";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html'
})
export class AdminUsersComponent implements OnInit {
user: Users[]=[]
error: string | null = null;
 loading = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loadCategory();
  } 

  loadCategory(): void {
       this.loading = true;
    this.error = null;

   this.auth.getAll().subscribe({
      next: (data) => {
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
