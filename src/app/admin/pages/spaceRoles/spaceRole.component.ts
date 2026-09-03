import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpaceRolesService } from "../../../shared/services/spaceRoles.service";
import { SpaceRoles } from "../../../shared/models/spaceRoles.model";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spaceRole.component.html'
})
export class AdminSpaceRolesComponent implements OnInit {
    roles: SpaceRoles[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: SpaceRoles={
  id: 0,
  name: ''
 }
 
  constructor(private SpaceRolesService: SpaceRolesService) {}

  ngOnInit(): void {
    this.loadSpaceRoles();
  }

  loadSpaceRoles(): void {
    this.loading = true;
    this.error = null;

    this.SpaceRolesService.getAll().subscribe({
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
    this.SpaceRolesService.create(this.formData).subscribe({
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
    startEdit(SpaceRoles: SpaceRoles): void {
      this.editingId = SpaceRoles.id || null;
      this.formData = { ...SpaceRoles };
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
  
      this.SpaceRolesService.update(this.editingId, this.formData).subscribe({
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
  
     deleteSpaceRoles(id: number): void {
    if (!confirm('Are you sure you want to delete this SpaceRoles?')) {
      return;
    }

    this.SpaceRolesService.delete(id).subscribe({
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
