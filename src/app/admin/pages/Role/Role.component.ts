import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RoleService } from "../../../shared/services/Role.service";
import { Role } from "../../../shared/models/role.model";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Role.component.html'
})
export class AdminRoleComponent implements OnInit {
    roles: Role[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Role={
  id: 0,
  name: ''
 }
 
  constructor(private RoleService: RoleService) {}

  ngOnInit(): void {
    this.loadRole();
  }

  loadRole(): void {
    this.loading = true;
    this.error = null;

    this.RoleService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load roles. Please check if the API is running.';
        this.error = `Error loading roles: ${errorMessage}`;
        this.loading = false;
        console.error('Error calling API:', err);
      }
    });
  }



   // CREATE
    toggleCreateForm(): void {
      this.showCreateForm = !this.showCreateForm;
      if (!this.showCreateForm) {
        this.resetForm();
      }
    }
  
   createProduct(): void {
  if (
    !this.formData.name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.RoleService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.roles = [...this.roles, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create roles';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(Role: Role): void {
      this.editingId = Role.id || null;
      this.formData = { ...Role };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.RoleService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.roles.findIndex(p => p.id === this.editingId)
          
          // const index = this.products.findIndex(p => p.id === this.editingId);
          // if (index > -1) {
          //   const newProducts = [...this.products];
          //   newProducts[index] = updatedProduct;
          //   this.products = newProducts;
          // }
          this.resetForm();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Full error object:', err);
          console.error('Error status:', err?.status);
          console.error('Error statusText:', err?.statusText);
          console.error('Error body:', err?.error);
          console.error('Error message:', err?.message);
          
          // Try to extract meaningful error message
          let errorMessage = 'Failed to update roles';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating roles (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating roles:', err);
        }
      });
    }
  
     deleteRole(id: number): void {
    if (!confirm('Are you sure you want to delete this Role?')) {
      return;
    }

    this.RoleService.delete(id).subscribe({
      next: () => {
        this.roles = this.roles.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }
  
      // HELPERS
    resetForm(): void {
      this.formData = {
        id: 0,
        name: ''
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
